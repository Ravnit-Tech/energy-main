/**
 * Frontend helpers for calling the AI API routes.
 *
 * All functions return `null` on failure — the dashboard must check for null
 * and fall back to a manual-review state rather than crashing.
 *
 * 50/50 split reminder:
 *   AUTO-EXECUTE   → supply routing, notifications, report insights,
 *                    anomaly detection, overview briefing
 *   ADMIN EXECUTES → truck review, user risk assessment
 *
 * All routes now fetch data from DB server-side — callers pass IDs, not bodies.
 */
import type {
  TruckReviewResult,
  SupplyRoutingResult,
  UserRiskResult,
  NotificationResult,
  ReportInsightsResult,
  AnomalyDetectionResult,
  OverviewBriefingResult,
  FulfillmentChainResult,
  FulfillmentStage,
} from "./ai-types";

// ─── Error type ──────────────────────────────────────────────────────────────

export interface AICallError {
  endpoint: string;
  message: string;
  status?: number;
}

// ─── Shared fetch helper ─────────────────────────────────────────────────────

async function callAI<T>(
  endpoint: string,
  body: Record<string, unknown>
): Promise<T> {
  const res = await fetch(`/api/ai/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    const err: AICallError = {
      endpoint,
      message: (data as { error?: string }).error ?? `AI call failed`,
      status: res.status,
    };
    throw err;
  }

  return data as T;
}

/**
 * Wraps any AI call with a null fallback.
 * Logs the error to console so it's visible in server/browser logs,
 * but never throws — the caller always gets T | null.
 */
async function safeCallAI<T>(
  endpoint: string,
  body: Record<string, unknown>,
  onError?: (err: AICallError) => void
): Promise<T | null> {
  try {
    return await callAI<T>(endpoint, body);
  } catch (err) {
    const aiErr = err as AICallError;
    console.error(`[ai-client] ${endpoint} failed:`, aiErr.message, aiErr.status ?? "");
    onError?.(aiErr);
    return null;
  }
}

// ─── ADMIN EXECUTES ──────────────────────────────────────────────────────────

/**
 * Score a truck registration submission.
 * Fetches the truck from DB by ID, runs AI review, saves result back.
 * Returns recommendation + reasons. Admin clicks approve/reject.
 * Returns null if AI is unavailable — show manual review UI.
 */
export async function reviewTruck(
  truckId: string,
  onError?: (err: AICallError) => void
): Promise<TruckReviewResult | null> {
  return safeCallAI<TruckReviewResult>("truck-review", { truckId }, onError);
}

/**
 * Assess a user's risk profile.
 * Fetches user + last 90 days of transactions from DB by userId.
 * Returns risk level + flags. Admin decides whether to suspend.
 * Returns null if AI is unavailable — show manual review UI.
 */
export async function assessUserRisk(
  userId: string,
  onError?: (err: AICallError) => void
): Promise<UserRiskResult | null> {
  return safeCallAI<UserRiskResult>("user-risk", { userId }, onError);
}

// ─── AUTO-EXECUTE ────────────────────────────────────────────────────────────

/**
 * Auto-assign a supply request to the optimal depot.
 * Fetches the request + all depots from DB by requestId, saves AI result back.
 * Returns null if AI is unavailable — leave depot unassigned for admin to set manually.
 */
export async function routeSupplyRequest(
  requestId: string,
  onError?: (err: AICallError) => void
): Promise<SupplyRoutingResult | null> {
  return safeCallAI<SupplyRoutingResult>("supply-routing", { requestId }, onError);
}

/**
 * Generate a contextual push notification for an admin action.
 * Saves the generated notification to the DB Notification collection.
 * Returns null if AI is unavailable — fall back to a generic static message.
 *
 * @param action         - e.g. "truck_approved", "account_suspended", "supply_assigned"
 * @param recipientEmail - the user to receive the notification
 * @param recipientRole  - e.g. "truck_owner", "customer", "bulk_dealer"
 * @param context        - any relevant details (name, amount, depot, etc.)
 * @param reference      - optional: linked record ID for deep-linking
 */
export async function generateNotification(
  action: string,
  recipientEmail: string,
  recipientRole: string,
  context: Record<string, unknown>,
  reference?: string,
  onError?: (err: AICallError) => void
): Promise<NotificationResult | null> {
  return safeCallAI<NotificationResult>(
    "notifications",
    { action, recipientEmail, recipientRole, context, reference },
    onError
  );
}

/**
 * Generate executive report insights from live DB metrics.
 * Fetches platform metrics server-side — no data needed from caller.
 * Returns null if AI is unavailable — render raw charts only.
 */
export async function generateReportInsights(
  onError?: (err: AICallError) => void
): Promise<ReportInsightsResult | null> {
  return safeCallAI<ReportInsightsResult>("report-insights", {}, onError);
}

/**
 * Scan recent transactions for anomalies.
 * Fetches transactions from DB server-side.
 * Returns null if AI is unavailable — show all transactions unflagged.
 *
 * @param limit  - max transactions to scan (default 200, max 500)
 * @param status - optional status filter (e.g. "Completed")
 */
export async function detectAnomalies(
  limit?: number,
  status?: string,
  onError?: (err: AICallError) => void
): Promise<AnomalyDetectionResult | null> {
  return safeCallAI<AnomalyDetectionResult>(
    "anomaly-detection",
    { limit, status },
    onError
  );
}

/**
 * Generate the daily admin overview briefing.
 * Fetches full platform snapshot from DB server-side — no data needed from caller.
 * Returns null if AI is unavailable — render Overview without the briefing card.
 */
export async function generateOverviewBriefing(
  onError?: (err: AICallError) => void
): Promise<OverviewBriefingResult | null> {
  return safeCallAI<OverviewBriefingResult>("overview-briefing", {}, onError);
}

// ─── MULTI-STEP CHAIN ────────────────────────────────────────────────────────

/**
 * Advance a supply request through its fulfilment lifecycle.
 * Fetches all required data from DB by requestId — no bodies needed.
 * Saves notifications and routing results to DB at each stage.
 *
 * Stage flow:
 *   "new"        → route to depot → notify customer (sequential)
 *   "processing" → notify customer + notify truck owner (parallel)
 *   "in_transit" → notify customer (truck on the way)
 *   "delivered"  → notify customer + refresh report insights (parallel)
 *
 * @param stage           - which lifecycle stage is being triggered
 * @param requestId       - the supply request MongoDB _id
 * @param truckOwnerEmail - optional for "processing" (skips truck notification if absent)
 */
export async function advanceSupplyFulfillment(
  stage: FulfillmentStage,
  requestId: string,
  truckOwnerEmail?: string,
  onError?: (err: AICallError) => void
): Promise<FulfillmentChainResult | null> {
  return safeCallAI<FulfillmentChainResult>(
    "supply-fulfillment",
    { stage, requestId, truckOwnerEmail },
    onError
  );
}

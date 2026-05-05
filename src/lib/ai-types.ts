import { z } from "zod";

// ─── Truck Review (ADMIN EXECUTES) ──────────────────────────────────────────
// LLM scores the submission and provides a ready-to-use note.
// Admin sees the recommendation and clicks approve/reject.

export const TruckReviewSchema = z.object({
  recommendation: z.enum(["approve", "reject"]),
  score: z.number().int().min(0).max(100),
  summary: z.string(),
  strengths: z.array(z.string()),
  concerns: z.array(z.string()),
  reviewNote: z.string(), // Pre-written note for the admin to send
});

/**
 * Computed server-side from score — never asked of the LLM directly.
 * decisive_approve  : score ≥ 75  → show green banner, one-click approve
 * decisive_reject   : score ≤ 40  → show red banner, one-click reject
 * needs_manual_review: score 41–74 → warn admin to read everything carefully
 */
export type TruckReviewConfidence =
  | "decisive_approve"
  | "decisive_reject"
  | "needs_manual_review";

export type TruckReviewResult = z.infer<typeof TruckReviewSchema> & {
  confidenceGate: TruckReviewConfidence;
};

// ─── Supply Routing (AUTO-EXECUTE) ──────────────────────────────────────────
// LLM assigns the best depot and may escalate priority.
// Result is applied immediately without admin confirmation.

export const SupplyRoutingSchema = z.object({
  assignedDepot: z.string(),
  adjustedPriority: z.enum(["normal", "urgent", "emergency"]),
  reasoning: z.string(),
  estimatedDeliveryDays: z.number().int().min(1).max(30),
  alternateDepots: z.array(z.string()),
  actionTaken: z.literal("auto_assigned"),
});
export type SupplyRoutingResult = z.infer<typeof SupplyRoutingSchema>;

// ─── User Risk Assessment (ADMIN EXECUTES) ───────────────────────────────────
// LLM flags suspicious accounts with reasons.
// Admin reviews and decides whether to suspend.

export const UserRiskSchema = z.object({
  riskScore: z.number().int().min(0).max(100),
  riskLevel: z.enum(["low", "medium", "high", "critical"]),
  flags: z.array(z.string()),
  recommendation: z.enum(["none", "monitor", "warn", "suspend"]),
  explanation: z.string(),
});

/**
 * Computed server-side from riskLevel — never asked of the LLM directly.
 * decisive        : riskLevel "critical" → show red banner, one-click suspend
 * review_recommended: riskLevel "high"  → amber banner, admin must read flags
 * monitor         : riskLevel "low"/"medium" → no banner, soft indicator only
 */
export type UserRiskConfidence =
  | "decisive"
  | "review_recommended"
  | "monitor";

export type UserRiskResult = z.infer<typeof UserRiskSchema> & {
  confidenceGate: UserRiskConfidence;
};

// ─── Notification Generator (AUTO-EXECUTE) ──────────────────────────────────
// LLM writes contextual push notification copy.
// Fired automatically on relevant admin actions.

export const NotificationSchema = z.object({
  title: z.string(),
  message: z.string(),
  actionRequired: z.string().optional(),
});
export type NotificationResult = z.infer<typeof NotificationSchema>;

// ─── Report Insights (AUTO-EXECUTE) ─────────────────────────────────────────
// LLM generates an executive summary from platform metrics.
// Rendered in the Reports section automatically.

export const ReportInsightsSchema = z.object({
  executiveSummary: z.string(),
  topInsights: z.array(z.string()),
  recommendations: z.array(z.string()),
  alerts: z.array(z.string()),
  forecastNote: z.string(),
});
export type ReportInsightsResult = z.infer<typeof ReportInsightsSchema>;

// ─── Anomaly Detection (AUTO-EXECUTE) ────────────────────────────────────────
// LLM scans transactions and flags anomalies.
// Flagged items are highlighted in the Transactions section.

export const AnomalySchema = z.object({
  transactionId: z.string(),
  type: z.string(),
  severity: z.enum(["low", "medium", "high"]),
  description: z.string(),
  suggestedAction: z.string(),
});

export const AnomalyDetectionSchema = z.object({
  anomalies: z.array(AnomalySchema),
  summary: z.string(),
  totalFlagged: z.number().int(),
});
export type AnomalyDetectionResult = z.infer<typeof AnomalyDetectionSchema>;

// ─── Overview Briefing (AUTO-EXECUTE) ────────────────────────────────────────
// LLM generates a daily admin briefing with prioritised actions.
// Shown at the top of the Overview section.

export const PriorityActionSchema = z.object({
  title: z.string(),
  urgency: z.enum(["low", "medium", "high"]),
  description: z.string(),
  suggestedAction: z.string(),
});

export const OverviewBriefingSchema = z.object({
  greeting: z.string(),
  todaySummary: z.string(),
  priorityActions: z.array(PriorityActionSchema),
  watchItems: z.array(z.string()),
});
export type OverviewBriefingResult = z.infer<typeof OverviewBriefingSchema>;

// ─── Supply Fulfilment Chain (AUTO-EXECUTE, multi-step) ──────────────────────
// Orchestrates routing + notifications across the full lifecycle of a request.
// One API call per stage transition; each stage runs the right sub-steps in parallel.
//
// Stage flow:
//   new        → route to depot + notify customer "request received & assigned"
//   processing → notify customer "being prepared" + notify truck owner "new job"
//   in_transit → notify customer "truck on the way, ETA X days"
//   delivered  → notify customer "delivered" + regenerate report insights

export type FulfillmentStage = "new" | "processing" | "in_transit" | "delivered";

export interface FulfillmentStageNew {
  stage: "new";
  routing: SupplyRoutingResult;
  customerNotification: NotificationResult;
}

export interface FulfillmentStageProcessing {
  stage: "processing";
  customerNotification: NotificationResult;
  truckOwnerNotification: NotificationResult | null; // null if no truck owner data provided
}

export interface FulfillmentStageInTransit {
  stage: "in_transit";
  customerNotification: NotificationResult;
}

export interface FulfillmentStageDelivered {
  stage: "delivered";
  customerNotification: NotificationResult;
  insights: ReportInsightsResult | null; // null if no metrics snapshot provided
}

export type FulfillmentChainResult =
  | FulfillmentStageNew
  | FulfillmentStageProcessing
  | FulfillmentStageInTransit
  | FulfillmentStageDelivered;

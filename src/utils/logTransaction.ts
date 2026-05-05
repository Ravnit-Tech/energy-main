// ─── Platform Transaction Logger ─────────────────────────────────────────────
// Central audit log for all financial/operational actions across the platform.
// Writes to localStorage["platform_transactions"] — read by admin Transactions section.

export type TransactionType =
  | "Supply Request"
  | "Truck Rental"
  | "Union Dues"
  | "Purchase Order"
  | "Supply Fulfillment";

export interface PlatformTransaction {
  id: string;
  timestamp: string;       // ISO datetime
  date: string;            // YYYY-MM-DD
  type: TransactionType;
  user: string;            // display name
  userRole: "Customer" | "Bulk Dealer";
  product?: string;
  quantity?: string;
  totalAmount: string;     // formatted ₦ string
  status: "Completed" | "Pending" | "Failed";
  paymentMethod?: string;
  depot?: string;
  reference: string;       // original ID (SUP-REQ-xxx, PO-xxx, TRK-xxx etc.)
}

export function logTransaction(txn: Omit<PlatformTransaction, "id" | "timestamp" | "date">) {
  try {
    const now = new Date();
    const entry: PlatformTransaction = {
      id: `TXN-${now.getFullYear()}-${String(Date.now()).slice(-6)}`,
      timestamp: now.toISOString(),
      date: now.toISOString().split("T")[0],
      ...txn,
    };
    const existing: PlatformTransaction[] = JSON.parse(
      localStorage.getItem("platform_transactions") || "[]"
    );
    localStorage.setItem(
      "platform_transactions",
      JSON.stringify([entry, ...existing])
    );
  } catch { /**/ }
}

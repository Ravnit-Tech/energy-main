import { Transaction } from "@/lib/models/Transaction";
import { documentHandler } from "@/lib/crud";

export default documentHandler(Transaction, {
  // Transactions are append-only — only AI flag fields and status may be updated
  immutableFields: ["_id", "__v", "txnId", "timestamp", "type", "user", "totalAmount", "reference"],
});

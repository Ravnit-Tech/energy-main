import { PurchaseOrder } from "@/lib/models/PurchaseOrder";
import { documentHandler } from "@/lib/crud";

export default documentHandler(PurchaseOrder, {
  immutableFields: ["_id", "__v", "orderId", "createdAt"],
});

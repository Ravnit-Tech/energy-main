import { PurchaseOrder } from "@/lib/models/PurchaseOrder";
import { collectionHandler } from "@/lib/crud";

export default collectionHandler(PurchaseOrder, {
  filterFields: ["status", "depot", "dealer"],
  defaultSort: { createdAt: -1 },
});

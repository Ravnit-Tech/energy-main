import { SupplyRequest } from "@/lib/models/SupplyRequest";
import { collectionHandler } from "@/lib/crud";

export default collectionHandler(SupplyRequest, {
  filterFields: ["status", "product", "priority", "requestedBy", "depot"],
  defaultSort: { createdAt: -1 },
});

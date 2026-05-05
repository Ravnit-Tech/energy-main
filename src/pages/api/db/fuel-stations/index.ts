import { FuelStation } from "@/lib/models/FuelStation";
import { collectionHandler } from "@/lib/crud";

export default collectionHandler(FuelStation, {
  filterFields: ["ownerEmail", "state", "status"],
  defaultSort: { createdAt: -1 },
});

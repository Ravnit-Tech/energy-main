import { FuelStation } from "@/lib/models/FuelStation";
import { documentHandler } from "@/lib/crud";

export default documentHandler(FuelStation, {
  immutableFields: ["_id", "__v", "ownerEmail", "createdAt"],
});

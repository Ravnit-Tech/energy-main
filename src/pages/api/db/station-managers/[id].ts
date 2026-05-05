import { StationManager } from "@/lib/models/StationManager";
import { documentHandler } from "@/lib/crud";

export default documentHandler(StationManager, {
  immutableFields: ["_id", "__v", "email", "passwordHash", "createdAt"],
});

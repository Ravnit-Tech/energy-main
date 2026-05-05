import { DailySales } from "@/lib/models/DailySales";
import { documentHandler } from "@/lib/crud";

export default documentHandler(DailySales, {
  immutableFields: ["_id", "__v", "stationId", "recordedBy", "saleDate", "createdAt"],
});

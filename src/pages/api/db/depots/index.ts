import { Depot } from "@/lib/models/Depot";
import { collectionHandler } from "@/lib/crud";

export default collectionHandler(Depot, {
  filterFields: ["state"],
  defaultSort: { name: 1 },
  pageSize: 20, // only 10 depots — small cap
});

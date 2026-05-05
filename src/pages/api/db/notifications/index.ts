import { Notification } from "@/lib/models/Notification";
import { collectionHandler } from "@/lib/crud";

export default collectionHandler(Notification, {
  filterFields: ["recipientEmail", "recipientRole", "read", "action"],
  defaultSort: { createdAt: -1 },
  pageSize: 50,
});

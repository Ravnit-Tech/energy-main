// AI feedback records are append-only — only GET is allowed on a single document
import { AIFeedback } from "@/lib/models/AIFeedback";
import { documentHandler } from "@/lib/crud";

export default documentHandler(AIFeedback, {
  immutableFields: ["_id", "__v", "route", "recordId", "aiRecommendation", "adminDecision", "adminOverrode", "createdAt"],
});

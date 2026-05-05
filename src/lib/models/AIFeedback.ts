import { Schema, model, models, type InferSchemaType } from "mongoose";

// Stores every admin decision on an AI recommendation.
// Used to build few-shot examples once enough data is collected (~50+ entries).
// See limitations doc: limitation #7 — no feedback loop.

const AIFeedbackSchema = new Schema(
  {
    route:             { type: String, required: true }, // "truck-review" | "user-risk" | etc.
    recordId:          { type: String, required: true }, // ID of the reviewed record
    aiRecommendation:  { type: String, required: true }, // what Claude recommended
    adminDecision:     { type: String, required: true }, // what admin actually did
    adminOverrode:     { type: Boolean, required: true }, // true if admin disagreed with AI
    reasonNote:        { type: String },                  // optional admin note explaining override
    aiScore:           { type: Number },                  // score at time of decision (if applicable)
    aiConfidenceGate:  { type: String },                  // gate value at time of decision
    adminEmail:        { type: String },                  // which admin made the decision
  },
  { timestamps: { createdAt: "createdAt", updatedAt: false } }
);

export type AIFeedbackDoc = InferSchemaType<typeof AIFeedbackSchema>;
export const AIFeedback = models.AIFeedback ?? model("AIFeedback", AIFeedbackSchema);

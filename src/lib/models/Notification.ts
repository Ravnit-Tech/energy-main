import { Schema, model, models, type InferSchemaType } from "mongoose";

// Unified notification table — replaces the 3 separate localStorage keys:
//   customer_notifications, bulk_dealer_notifications, truck_owner_notifications
// Filter by recipientEmail or recipientRole on the frontend.

const NotificationSchema = new Schema(
  {
    recipientEmail: { type: String, required: true },
    recipientRole:  {
      type: String,
      enum: ["customer", "bulk_dealer", "truck_owner", "admin"],
      required: true,
    },
    title:          { type: String, required: true },
    message:        { type: String, required: true },
    actionRequired: { type: String },   // optional CTA text from AI
    action:         { type: String },   // the triggering action (e.g. "truck_approved")
    read:           { type: Boolean, default: false },
    reference:      { type: String },   // linked record ID if applicable
  },
  { timestamps: { createdAt: "createdAt", updatedAt: false } }
);

// Index for fast per-user queries
NotificationSchema.index({ recipientEmail: 1, createdAt: -1 });

export type NotificationDoc = InferSchemaType<typeof NotificationSchema>;
export const Notification = models.Notification ?? model("Notification", NotificationSchema);

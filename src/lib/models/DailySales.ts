import { Schema, model, models, type InferSchemaType } from "mongoose";

const SaleEntrySchema = new Schema(
  {
    product:          { type: String, enum: ["PMS", "AGO", "ATK"], required: true },
    openingStockLtrs: { type: Number, required: true, min: 0 },
    closingStockLtrs: { type: Number, required: true, min: 0 },
    litresSold:       { type: Number, required: true, min: 0 }, // opening − closing
    pricePerLitre:    { type: Number, required: true, min: 0 }, // ₦ on that day
    revenue:          { type: Number, required: true, min: 0 }, // litresSold × price
    pumpNumber:       { type: String },
  },
  { _id: false }
);

const DailySalesSchema = new Schema(
  {
    stationId:    { type: Schema.Types.ObjectId, required: true }, // FK → fuel_stations._id
    stationName:  { type: String, required: true },                // denormalised
    recordedBy:   { type: String, required: true },                // FK → users.email
    saleDate:     { type: Date, required: true },                  // midnight-normalised day

    sales:        [SaleEntrySchema],

    totalRevenue: { type: Number, default: 0 },                   // ₦ sum across products
    notes:        { type: String },
    isVerified:   { type: Boolean, default: false },               // manager sign-off
  },
  { timestamps: true }
);

// One record per station per day
DailySalesSchema.index({ stationId: 1, saleDate: 1 }, { unique: true });
DailySalesSchema.index({ recordedBy: 1, saleDate: -1 });
DailySalesSchema.index({ saleDate: -1 });

export type DailySalesDoc = InferSchemaType<typeof DailySalesSchema>;
export const DailySales = models.DailySales ?? model("DailySales", DailySalesSchema);

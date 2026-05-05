import { Schema, model, models, type InferSchemaType } from "mongoose";

const TankSchema = new Schema(
  {
    product:        { type: String, enum: ["PMS", "AGO", "ATK"], required: true },
    capacityLitres: { type: Number, required: true, min: 1 },
    currentLitres:  { type: Number, required: true, min: 0, default: 0 },
    reorderLevel:   { type: Number, default: 0 }, // alert threshold in litres
    lastRestocked:  { type: Date },
  },
  { _id: false }
);

const FuelStationSchema = new Schema(
  {
    ownerEmail:   { type: String, required: true },         // FK → users.email
    stationName:  { type: String, required: true, trim: true },
    state:        { type: String, required: true, trim: true },
    lga:          { type: String, trim: true },
    address:      { type: String, trim: true },
    rcNumber:     { type: String, trim: true },             // CAC registration
    dprLicenseNo: { type: String, trim: true },             // DPR license

    tanks: [TankSchema],

    staffCount:   { type: Number, default: 0 },
    managerName:  { type: String, trim: true },
    managerPhone: { type: String, trim: true },

    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active",
    },
  },
  { timestamps: true }
);

FuelStationSchema.index({ ownerEmail: 1 });
FuelStationSchema.index({ state: 1 });
FuelStationSchema.index({ ownerEmail: 1, stationName: 1 }, { unique: true });

export type FuelStationDoc = InferSchemaType<typeof FuelStationSchema>;
export const FuelStation = models.FuelStation ?? model("FuelStation", FuelStationSchema);

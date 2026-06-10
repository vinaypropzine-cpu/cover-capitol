import mongoose, { Schema, model, models } from 'mongoose';

const DeviceBrandSchema = new Schema({
  brand: { type: String, required: true },
  models: [{ type: String }],
}, { timestamps: true });

// Ensures Next.js reloads the schema immediately upon saving
if (models.DeviceBrand) {
  delete models.DeviceBrand;
}

const DeviceBrand = model('DeviceBrand', DeviceBrandSchema);
export default DeviceBrand;
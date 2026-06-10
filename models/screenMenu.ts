import mongoose, { Schema, model, models } from 'mongoose';

const ScreenMenuSchema = new Schema({
  title: { type: String, required: true }, // e.g., "Shop By Device", "Shop By Type"
  items: [{ type: String }],               // e.g., ["Mobile", "Tablet", "Smartwatch"]
}, { timestamps: true });

// Ensures Next.js reloads the schema immediately upon saving
if (models.ScreenMenu) {
  delete models.ScreenMenu;
}

const ScreenMenu = model('ScreenMenu', ScreenMenuSchema);
export default ScreenMenu;
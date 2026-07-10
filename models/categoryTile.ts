import mongoose, { Schema, model, models } from 'mongoose';

const CategoryTileSchema = new Schema({
  // Display name shown on the homepage block (e.g., "Tempered Glass")
  name: { type: String, required: true },

  // URL slug the block links to (e.g., "tempered-glass" -> /category/tempered-glass)
  slug: { type: String, required: true },

  // The UploadThing URL the admin sets for this block
  imageUrl: { type: String, required: true },

  // Keeps the 4 blocks in a fixed display order
  order: { type: Number, default: 0 },
}, { timestamps: true });

// Ensures Next.js reloads the schema immediately upon saving
if (models.CategoryTile) {
  delete models.CategoryTile;
}

const CategoryTile = model('CategoryTile', CategoryTileSchema);
export default CategoryTile;

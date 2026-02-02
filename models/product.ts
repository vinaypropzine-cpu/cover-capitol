import mongoose, { Schema, model, models } from 'mongoose';

// 1. Define the schema strictly with the 'id' field
const ProductSchema = new Schema({
  id: { type: Number, required: true }, // 👈 Explicitly required
  name: { type: String, required: true },
  price: { type: Number, required: true },
  images: [String],
  category: String,
  brand: String,
  tag: String,
  model: String,
  description: String,
}, { timestamps: true });

// 2. THE FIX: Force delete the old model if it exists to refresh the schema in Atlas
if (models.Product) {
  delete models.Product;
}

const Product = model('Product', ProductSchema);
export default Product;
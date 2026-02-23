import mongoose, { Schema, model, models } from 'mongoose';

const ProductSchema = new Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  
  // This remains the 'base' or 'starting' price for the product grid
  price: { type: Number, required: true }, 
  
  images: [String],
  category: String,
  brand: String,
  tag: String,
  model: String,
  description: String,

  // --- NEW WORKFLOW FIELDS ---
  
  // Stores: "Mobile", "Tablet", or "Smartwatch"
  deviceType: { type: String }, 
  
  // Stores: "Normal", "UV", or "Edge to Edge Membrane"
  subCategory: { type: String }, 

  // UPDATED: Now stores an array of objects containing the finish name AND its specific price
  // This allows Matte to be ₹649 while Privacy is ₹899
  types: [{
    name: { type: String },
    price: { type: Number }
  }],

  // --- END NEW FIELDS ---

  details: { type: Map, of: String },
  packageContents: [String]
}, { timestamps: true });

// Ensures Next.js reloads the schema immediately upon saving
if (models.Product) {
  delete models.Product;
}

const Product = model('Product', ProductSchema);
export default Product;
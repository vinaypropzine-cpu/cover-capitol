import mongoose from "mongoose";
import { PRODUCT_LIST } from "../app/data.ts"; // 👈 This pulls in all 16 products

// Blueprint (Schema) - Added missing fields from your data.ts
const Product = mongoose.models.Product || mongoose.model("Product", new mongoose.Schema({
  id: Number,
  name: String,
  price: Number,
  images: [String],
  tag: String,
  category: String,
  brand: String,
  model: String,
  types: [String],
  description: String,
  details: Object,
  packageContents: [String]
}));

const MONGODB_URI = "mongodb+srv://vinay_sample:Cover491625@covercapital-prod.2whvuga.mongodb.net/covercapital?retryWrites=true&w=majority";

async function pushAllData() {
  try {
    console.log("📡 Connecting to MongoDB Atlas...");
    await mongoose.connect(MONGODB_URI, { family: 4 });

    console.log("🧹 Clearing old test data...");
    await Product.deleteMany({});

    console.log("🚀 Pushing all 16 products...");
    await Product.insertMany(PRODUCT_LIST);

    console.log(`✅ SUCCESS! ${PRODUCT_LIST.length} products are now live.`);
    process.exit(0);
  } catch (err) {
    console.error("❌ PUSH FAILED:", err);
    process.exit(1);
  }
}

pushAllData();

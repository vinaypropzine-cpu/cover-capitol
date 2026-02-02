"use server";

import { connectDB } from "@/lib/db";
import Product from "@/models/product";
import { revalidatePath } from "next/cache";

/**
 * READ: Fetches all products for the inventory table.
 */
export async function getProducts() {
  await connectDB();
  // Fetch all products from your 'covercapital' database
  const products = await Product.find({}).sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(products));
}

/**
 * CREATE: Saves a new product including the Uploadthing image URL.
 */
export async function addProduct(productData: any) {
  try {
    await connectDB();
    
    // Log for debugging to ensure 'id' is a number and 'images' is an array
    console.log("Saving Product to Vault:", productData); 

    const newProduct = await Product.create(productData);
    
    // Refresh the admin and home page to show the new item instantly
    revalidatePath("/admin");
    revalidatePath("/");
    
    return { success: true };
  } catch (error) {
    console.error("Vault Save Error:", error);
    return { success: false };
  }
}

/**
 * DELETE: Removes a product from Atlas by its numeric ID.
 */
export async function deleteProduct(productId: string | number) {
  try {
    await connectDB();
    
    // We convert to Number to match the 'id' field in your migrated data
    await Product.findOneAndDelete({ id: Number(productId) });
    
    revalidatePath("/admin");
    revalidatePath("/");
    
    return { success: true };
  } catch (error) {
    console.error("Vault Deletion Error:", error);
    return { success: false };
  }
}
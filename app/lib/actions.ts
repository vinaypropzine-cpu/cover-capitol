"use server";

import { connectDB } from "@/lib/db";
import Product from "@/models/product";
import { revalidatePath } from "next/cache";
import HeroBanner from "@/models/hero"; // <-- ADD THIS LINE
import Announcement from "@/models/announcement";
import DeviceBrand from "@/models/deviceBrand";


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

// ==========================================
// HERO BANNER ACTIONS
// ==========================================

/**
 * READ: Fetches all active banners for the frontend slider
 */
export async function getBanners() {
  await connectDB();
  const banners = await HeroBanner.find({ isActive: true }).sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(banners));
}

/**
 * CREATE: Saves a new UploadThing banner URL directly to the database
 */
export async function addBanner(imageUrl: string) {
  try {
    await connectDB();
    await HeroBanner.create({ imageUrl, isActive: true });
    
    // Refresh the home page and admin panel to show the new slide instantly
    revalidatePath("/admin");
    revalidatePath("/");
    
    return { success: true };
  } catch (error) {
    console.error("Banner Save Error:", error);
    return { success: false };
  }
}

/**
 * DELETE: Removes a banner from the database
 */
export async function deleteBanner(bannerId: string) {
  try {
    await connectDB();
    await HeroBanner.findByIdAndDelete(bannerId);
    
    revalidatePath("/admin");
    revalidatePath("/");
    
    return { success: true };
  } catch (error) {
    console.error("Banner Deletion Error:", error);
    return { success: false };
  }
}

// ==========================================
// ANNOUNCEMENT BAR ACTIONS
// ==========================================

/**
 * READ: Fetches the current announcement bar settings.
 * If none exists, it creates a default one automatically.
 */
export async function getAnnouncement() {
  await connectDB();
  let announcement = await Announcement.findOne().lean();
  
  if (!announcement) {
    const defaultDoc = await Announcement.create({ 
      text: "FREE EXPRESS DELIVERY ON ALL ORDERS ABOVE ₹499", 
      isActive: true 
    });
    return JSON.parse(JSON.stringify(defaultDoc));
  }
  
  return JSON.parse(JSON.stringify(announcement));
}

/**
 * UPDATE: Changes the announcement text and visibility status.
 */
export async function updateAnnouncement(text: string, isActive: boolean) {
  try {
    await connectDB();
    let announcement = await Announcement.findOne();
    
    if (announcement) {
      announcement.text = text;
      announcement.isActive = isActive;
      await announcement.save();
    } else {
      await Announcement.create({ text, isActive });
    }
    
    // Refresh the frontend to instantly show the new text
    revalidatePath("/");
    revalidatePath("/admin");
    
    return { success: true };
  } catch (error) {
    console.error("Announcement Update Error:", error);
    return { success: false };
  }
}

// ==========================================
// DEVICE MENU ACTIONS
// ==========================================

/**
 * READ: Fetches all device brands. Injects default data if the database is completely empty.
 */
export async function getDeviceBrands() {
  await connectDB();
  let brands = await DeviceBrand.find().lean();
  
  if (brands.length === 0) {
    const defaultBrands = [
      { brand: 'Apple', models: ['iPhone 15 Pro', 'iPhone 14', 'iPhone 13', 'iPhone 16'] },
      { brand: 'Samsung', models: ['Galaxy S24', 'S23 Ultra', 'Z Fold'] },
      { brand: 'Google', models: ['Pixel 8 Pro', 'Pixel 7a', 'Pixel 6'] },
    ];
    await DeviceBrand.insertMany(defaultBrands);
    brands = await DeviceBrand.find().lean();
  }
  
  return JSON.parse(JSON.stringify(brands));
}

/**
 * CREATE: Adds a completely new brand (e.g., "Nothing" or "OnePlus").
 */
export async function addDeviceBrand(brandName: string) {
  try {
    await connectDB();
    await DeviceBrand.create({ brand: brandName, models: [] });
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Add Brand Error:", error);
    return { success: false };
  }
}

/**
 * UPDATE: Adds a new phone model to an existing brand.
 */
export async function addModelToBrand(brandId: string, newModel: string) {
  try {
    await connectDB();
    await DeviceBrand.findByIdAndUpdate(brandId, { $push: { models: newModel } });
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Add Model Error:", error);
    return { success: false };
  }
}

/**
 * DELETE: Removes a specific phone model from a brand.
 */
export async function removeModelFromBrand(brandId: string, modelToRemove: string) {
  try {
    await connectDB();
    await DeviceBrand.findByIdAndUpdate(brandId, { $pull: { models: modelToRemove } });
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Remove Model Error:", error);
    return { success: false };
  }
}

/**
 * DELETE: Completely deletes a brand and all its models.
 */
export async function deleteDeviceBrand(brandId: string) {
  try {
    await connectDB();
    await DeviceBrand.findByIdAndDelete(brandId);
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Delete Brand Error:", error);
    return { success: false };
  }
}
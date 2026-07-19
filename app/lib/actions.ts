"use server";

import { connectDB } from "@/lib/db";
import Product from "@/models/product";
import { revalidatePath } from "next/cache";
import HeroBanner from "@/models/hero"; // <-- ADD THIS LINE
import Announcement from "@/models/announcement";
import CategoryTile from "@/models/categoryTile";
import PromoBanner from "@/models/promoBanner";
import DeviceBrand from "@/models/deviceBrand";
import ScreenMenu from "@/models/screenMenu";

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
 * CREATE: Saves a new hero slide. Desktop artwork is required; the
 * portrait mobile artwork is optional (phones fall back to desktop).
 */
export async function addBanner(imageUrl: string, mobileImageUrl: string = "") {
  try {
    await connectDB();
    await HeroBanner.create({ imageUrl, mobileImageUrl, isActive: true });
    
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
 * UPDATE: Sets or replaces the mobile artwork of an existing hero slide.
 */
export async function updateBannerMobileImage(bannerId: string, mobileImageUrl: string) {
  try {
    await connectDB();
    await HeroBanner.findByIdAndUpdate(bannerId, { mobileImageUrl });

    revalidatePath("/admin");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Banner Mobile Image Update Error:", error);
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
// PROMO / OFFER BANNER ACTIONS (Homepage slideshow)
// ==========================================

/**
 * READ: Fetches all active offer banners for the homepage slideshow.
 */
export async function getPromoBanners() {
  await connectDB();
  const banners = await PromoBanner.find({ isActive: true }).sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(banners));
}

/**
 * CREATE: Saves a new offer banner with its click-through link.
 */
export async function addPromoBanner(imageUrl: string, linkUrl: string) {
  try {
    await connectDB();
    await PromoBanner.create({ imageUrl, linkUrl, isActive: true });

    revalidatePath("/admin");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Promo Banner Save Error:", error);
    return { success: false };
  }
}

/**
 * DELETE: Removes an offer banner.
 */
export async function deletePromoBanner(bannerId: string) {
  try {
    await connectDB();
    await PromoBanner.findByIdAndDelete(bannerId);

    revalidatePath("/admin");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Promo Banner Deletion Error:", error);
    return { success: false };
  }
}

// ==========================================
// CATEGORY TILE ACTIONS (Shop Your Preference)
// ==========================================

/**
 * READ: Fetches the 4 homepage "Shop Your Preference" blocks.
 * Injects the default blocks if the database is empty.
 */
export async function getCategoryTiles() {
  await connectDB();
  let tiles = await CategoryTile.find().sort({ order: 1 }).lean();

  if (tiles.length === 0) {
    const defaultTiles = [
      { name: 'Tempered Glass', slug: 'tempered-glass', imageUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=400', order: 1 },
      { name: 'Camera Guard', slug: 'camera-guard', imageUrl: 'https://images.unsplash.com/photo-1601593094911-30983cf4eadc?q=80&w=400', order: 2 },
      { name: 'Back ScreenGuard', slug: 'back-screenguard', imageUrl: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=400', order: 3 },
      { name: 'Combo', slug: 'combo', imageUrl: 'https://images.unsplash.com/photo-1603313011101-31c726a55d4c?q=80&w=400', order: 4 },
    ];
    await CategoryTile.insertMany(defaultTiles);
    tiles = await CategoryTile.find().sort({ order: 1 }).lean();
  }

  return JSON.parse(JSON.stringify(tiles));
}

/**
 * UPDATE: Swaps the image of a specific preference block.
 */
export async function updateCategoryTileImage(tileId: string, imageUrl: string) {
  try {
    await connectDB();
    await CategoryTile.findByIdAndUpdate(tileId, { imageUrl });

    revalidatePath("/");
    revalidatePath("/admin");

    return { success: true };
  } catch (error) {
    console.error("Category Tile Update Error:", error);
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

// ==========================================
// SCREEN PROTECTION MENU ACTIONS
// ==========================================

/**
 * READ: Fetches the Screen Protection menu columns. 
 * Injects the default 3-column layout if the database is empty.
 */
export async function getScreenMenus() {
  await connectDB();
  let menus = await ScreenMenu.find().lean();
  
  if (menus.length === 0) {
    const defaultMenus = [
      { title: 'Shop By Device', items: ['Mobile', 'Tablet', 'Smartwatch'] },
      { title: 'Shop By Type', items: ['Normal', 'UV Glass', 'Edge to Edge'] },
      { title: 'Shop By Category', items: ['Clear', 'Matte Finish', 'Privacy Shield'] },
    ];
    await ScreenMenu.insertMany(defaultMenus);
    menus = await ScreenMenu.find().lean();
  }
  
  return JSON.parse(JSON.stringify(menus));
}

/**
 * UPDATE: Adds a new list item (e.g., "Laptops") to a specific menu column.
 */
export async function addScreenMenuItem(menuId: string, newItem: string) {
  try {
    await connectDB();
    await ScreenMenu.findByIdAndUpdate(menuId, { $push: { items: newItem } });
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Add Menu Item Error:", error);
    return { success: false };
  }
}

/**
 * DELETE: Removes a specific list item from a menu column.
 */
export async function removeScreenMenuItem(menuId: string, itemToRemove: string) {
  try {
    await connectDB();
    await ScreenMenu.findByIdAndUpdate(menuId, { $pull: { items: itemToRemove } });
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Remove Menu Item Error:", error);
    return { success: false };
  }
}
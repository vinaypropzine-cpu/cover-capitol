import mongoose, { Schema, model, models } from 'mongoose';

const PromoBannerSchema = new Schema({
  // The UploadThing URL of the banner artwork
  imageUrl: { type: String, required: true },

  // Where the user lands when they click the banner (e.g. /deals or /category/combo)
  linkUrl: { type: String, default: '' },

  // Toggle to hide a banner without deleting it
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Ensures Next.js reloads the schema immediately upon saving
if (models.PromoBanner) {
  delete models.PromoBanner;
}

const PromoBanner = model('PromoBanner', PromoBannerSchema);
export default PromoBanner;

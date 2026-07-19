import mongoose, { Schema, model, models } from 'mongoose';

const HeroBannerSchema = new Schema({
  // The UploadThing URL we get back (desktop / wide artwork)
  imageUrl: { type: String, required: true },

  // Optional portrait artwork shown on phones; falls back to imageUrl if absent
  mobileImageUrl: { type: String, default: '' },
  
  // A toggle in case you want to hide a banner temporarily without deleting it
  isActive: { type: Boolean, default: true }, 
}, { timestamps: true });

// Ensures Next.js reloads the schema immediately upon saving
if (models.HeroBanner) {
  delete models.HeroBanner;
}

const HeroBanner = model('HeroBanner', HeroBannerSchema);
export default HeroBanner;
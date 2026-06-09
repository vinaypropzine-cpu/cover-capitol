import mongoose, { Schema, model, models } from 'mongoose';

const AnnouncementSchema = new Schema({
  text: { type: String, required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Ensures Next.js reloads the schema immediately upon saving during development
if (models.Announcement) {
  delete models.Announcement;
}

const Announcement = model('Announcement', AnnouncementSchema);
export default Announcement;
import mongoose from 'mongoose';

export const fileSchema = new mongoose.Schema(
  {
    publicId: { type: String, required: true },
    url: { type: String, required: true },
    resourceType: { type: String, required: true, default: 'image' },
    format: { type: String, required: true },
    bytes: { type: Number, required: true },
    width: { type: Number },
    height: { type: Number },
    accessType: {
      type: String,
      required: true,
      default: 'public',
      enum: ['public', 'authenticated'],
    },
  },
  { _id: false }
);

export default fileSchema;

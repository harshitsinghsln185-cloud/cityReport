import mongoose from 'mongoose';
import { fileSchema } from './schemas/fileSchema.js';

const pointSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
      validate: {
        validator: function (coords) {
          return (
            Array.isArray(coords) &&
            coords.length === 2 &&
            coords[0] >= -180 &&
            coords[0] <= 180 && // longitude
            coords[1] >= -90 &&
            coords[1] <= 90 // latitude
          );
        },
        message: 'Invalid GeoJSON coordinates: must be [longitude, latitude]',
      },
    },
  },
  { _id: false }
);

const resolverProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
      index: true,
    },
    rejectionReason: {
      type: String,
      default: null,
      trim: true,
    },
    idProof: {
      type: fileSchema,
      required: true,
    },
    skills: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
      },
    ],
    serviceLocation: {
      type: pointSchema,
      required: true,
      index: '2dsphere',
    },
    serviceAddress: {
      type: String,
      required: true,
      trim: true,
    },
    serviceRadiusKm: {
      type: Number,
      required: true,
      default: 10,
      min: [1, 'Coverage radius must be at least 1 km'],
      max: [50, 'Coverage radius cannot exceed 50 km'],
    },
    isAvailable: {
      type: Boolean,
      required: true,
      default: true,
      index: true,
    },
    totalEarningsPaise: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
      validate: {
        validator: Number.isInteger,
        message: 'totalEarningsPaise must be a whole integer',
      },
    },
    pendingPayoutPaise: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
      validate: {
        validator: Number.isInteger,
        message: 'pendingPayoutPaise must be a whole integer',
      },
    },
    completedTasksCount: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
      validate: {
        validator: Number.isInteger,
        message: 'completedTasksCount must be a whole integer',
      },
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret.__v;
        return ret;
      },
    },
  }
);

resolverProfileSchema.index({ status: 1, isAvailable: 1 });

export const ResolverProfile = mongoose.model('ResolverProfile', resolverProfileSchema);
export default ResolverProfile;

import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      trim: true,
      minlength: [2, 'Category name must be at least 2 characters'],
      maxlength: [100, 'Category name cannot exceed 100 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: [5, 'Description must be at least 5 characters'],
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    baseFeePaise: {
      type: Number,
      required: [true, 'Base fee in paise is required'],
      min: [0, 'Base fee cannot be negative'],
      validate: {
        validator: Number.isInteger,
        message: 'Base fee in paise must be a whole integer',
      },
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
      index: true,
    },
    icon: {
      type: String,
      default: 'alert-circle',
      trim: true,
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

export const Category = mongoose.model('Category', categorySchema);
export default Category;

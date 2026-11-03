import mongoose from 'mongoose';

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Subcategory name is required'],
      trim: true,
      minlength: [2, 'Subcategory name must be at least 2 characters'],
      maxlength: [120, 'Subcategory name cannot exceed 120 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Subcategory slug is required'],
      lowercase: true,
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    defaultPriority: {
      type: String,
      enum: ['Critical', 'High', 'Medium', 'Low'],
      default: 'Medium',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    imageKey: {
      type: String,
      trim: true,
      default: null,
    },
  },
  { _id: false }
);

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
    order: {
      type: Number,
      default: 0,
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
    freeRadiusKm: {
      type: Number,
      default: 3,
      min: [0, 'Free radius cannot be negative'],
    },
    estimatedResolutionHours: {
      type: Number,
      default: 48,
      min: [1, 'Resolution SLA must be at least 1 hour'],
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
    subCategories: {
      type: [subCategorySchema],
      default: [],
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

categorySchema.pre('validate', function (next) {
  if (Array.isArray(this.subCategories) && this.subCategories.length > 0) {
    const slugs = new Set();
    for (const sub of this.subCategories) {
      if (slugs.has(sub.slug)) {
        return next(new Error(`Duplicate subcategory slug '${sub.slug}' in category '${this.name}'`));
      }
      slugs.add(sub.slug);
    }
  }
  next();
});

export const Category = mongoose.model('Category', categorySchema);
export default Category;

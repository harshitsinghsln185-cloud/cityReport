import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema(
  {
    issue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Issue',
      required: true,
      unique: true,
      index: true,
    },
    resolver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ResolverProfile',
      required: true,
      index: true,
    },
    citizen: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      validate: {
        validator: Number.isInteger,
        message: 'Rating must be an integer between 1 and 5',
      },
    },
    comments: {
      type: String,
      default: '',
      trim: true,
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
  }
);

feedbackSchema.index({ resolver: 1, rating: -1 });
feedbackSchema.index({ createdAt: -1 });

export const Feedback = mongoose.model('Feedback', feedbackSchema);
export default Feedback;

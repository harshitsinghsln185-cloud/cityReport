import mongoose from 'mongoose';

const issueTimelineSchema = new mongoose.Schema(
  {
    issue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Issue',
      required: true,
      index: true,
    },
    fromStatus: {
      type: String,
      required: true,
      trim: true,
    },
    toStatus: {
      type: String,
      required: true,
      trim: true,
    },
    action: {
      type: String,
      required: true,
      trim: true,
    },
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    actorRole: {
      type: String,
      required: true,
      enum: ['User', 'Resolver', 'Admin', 'system'],
      default: 'system',
    },
    remarks: {
      type: String,
      default: null,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

issueTimelineSchema.index({ issue: 1, createdAt: 1 });

export const IssueTimeline = mongoose.model('IssueTimeline', issueTimelineSchema);
export default IssueTimeline;

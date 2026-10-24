import { User } from '../models/User.js';
import { ResolverProfile } from '../models/ResolverProfile.js';
import { Category } from '../models/Category.js';
import { validateImageBuffer } from '../utils/fileValidation.js';
import cloudinaryService from './cloudinaryService.js';
import emailService from './emailService.js';
import notificationService from './notificationService.js';
import emailQueue from './emailQueue.js';
import resolverRegisteredTemplate from '../templates/email/resolverRegistered.js';
import adminNewResolverTemplate from '../templates/email/adminNewResolver.js';
import resolverApprovedTemplate from '../templates/email/resolverApproved.js';
import resolverRejectedTemplate from '../templates/email/resolverRejected.js';
import { AppError } from '../utils/AppError.js';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

export const registerResolver = async ({
  userId,
  skills,
  coordinates, // [lng, lat]
  serviceAddress,
  serviceRadiusKm = 10,
  idProofBuffer,
  photoBuffer = null,
}) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  const existingProfile = await ResolverProfile.findOne({ user: userId });
  if (existingProfile) {
    throw new AppError('Resolver profile already registered for this user', 409);
  }

  // 1. Validate ID Proof buffer
  if (!idProofBuffer) {
    throw new AppError('Government ID proof image is required', 400);
  }
  const idValidation = validateImageBuffer(idProofBuffer);
  if (!idValidation.isValid) {
    throw new AppError(
      'Invalid government ID proof image. Binary signature mismatch (must be JPEG, PNG, or WebP).',
      400
    );
  }

  // 2. Upload ID Proof with access_type: "authenticated"
  const idFolder = `crowd-report/${env.NODE_ENV}/id-proofs/${userId}`;
  const idProofAsset = await cloudinaryService.uploadStream(idProofBuffer, {
    folder: idFolder,
    format: idValidation.format,
    access_type: 'authenticated',
  });

  // 3. Process optional photo
  if (photoBuffer) {
    const photoValidation = validateImageBuffer(photoBuffer);
    if (photoValidation.isValid) {
      const photoFolder = `crowd-report/${env.NODE_ENV}/profiles/${userId}`;
      const photoAsset = await cloudinaryService.uploadStream(photoBuffer, {
        folder: photoFolder,
        format: photoValidation.format,
        access_type: 'public',
      });
      user.photo = photoAsset;
      await user.save();
    }
  }

  // 4. Create ResolverProfile
  const profile = await ResolverProfile.create({
    user: userId,
    status: 'Pending',
    skills,
    serviceLocation: {
      type: 'Point',
      coordinates, // [lng, lat]
    },
    serviceAddress,
    serviceRadiusKm,
    idProof: idProofAsset,
    isAvailable: true,
  });

  // 5. Dispatch in-app notification & confirmation email to contractor
  notificationService
    .notify({
      recipientId: user._id,
      title: 'Resolver Application Received',
      message: 'Your certified resolver application has been received and is pending municipal review.',
      type: 'VERIFICATION',
      link: '/resolver/pending',
      emailOptions: {
        to: user.email,
        template: 'resolverRegistered',
        subject: 'Resolver Application Received - Crowd Report',
        html: resolverRegisteredTemplate({
          name: user.name,
          portalUrl: `${env.CLIENT_URL}/resolver/pending`,
        }),
      },
    })
    .catch((err) => logger.warn(`Resolver registration notification skipped: ${err.message}`));

  // 6. Enqueue notification email to Administrator
  emailQueue
    .enqueueEmail({
      to: env.ADMIN_EMAIL,
      template: 'adminNewResolver',
      subject: 'Action Required: New Resolver Verification Pending',
      html: adminNewResolverTemplate({
        resolverName: user.name,
        email: user.email,
        phone: user.phone,
        reviewUrl: `${env.CLIENT_URL}/admin/resolvers`,
      }),
    })
    .catch((err) => logger.warn(`Admin new resolver email enqueue skipped: ${err.message}`));

  return profile;
};

export const getResolverByUserId = async (userId) => {
  const profile = await ResolverProfile.findOne({ user: userId })
    .populate('user', 'name email phone photo address')
    .populate('skills', 'name slug baseFeePaise icon');

  if (!profile) {
    throw new AppError('Resolver profile not found', 404);
  }

  return profile;
};

export const updateSettings = async (userId, updates) => {
  const profile = await ResolverProfile.findOne({ user: userId });
  if (!profile) {
    throw new AppError('Resolver profile not found', 404);
  }

  if (updates.serviceRadiusKm !== undefined) {
    profile.serviceRadiusKm = updates.serviceRadiusKm;
  }
  if (updates.isAvailable !== undefined) {
    profile.isAvailable = Boolean(updates.isAvailable);
  }
  if (updates.skills && Array.isArray(updates.skills)) {
    profile.skills = updates.skills;
  }

  await profile.save();
  await profile.populate([
    { path: 'user', select: 'name email phone photo address' },
    { path: 'skills', select: 'name slug baseFeePaise icon' },
  ]);

  return profile;
};

export const listResolvers = async ({ status, page = 1, limit = 10, search }) => {
  const query = {};
  if (status) {
    query.status = status;
  }

  const skip = (Math.max(1, page) - 1) * limit;

  const [resolvers, total] = await Promise.all([
    ResolverProfile.find(query)
      .populate('user', 'name email phone photo address')
      .populate('skills', 'name slug baseFeePaise icon')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    ResolverProfile.countDocuments(query),
  ]);

  return {
    resolvers,
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
};

export const approveResolver = async (profileId) => {
  const profile = await ResolverProfile.findOneAndUpdate(
    { _id: profileId, status: 'Pending' },
    { status: 'Approved', rejectionReason: null },
    { new: true }
  ).populate('user', 'name email phone');

  if (!profile) {
    throw new AppError(
      'Resolver application not found or cannot be approved (must be in Pending status).',
      400
    );
  }

  // Dispatch approval notification and email
  if (profile.user?._id) {
    notificationService
      .notify({
        recipientId: profile.user._id,
        title: 'Resolver Account Approved',
        message: 'Congratulations! Your resolver application has been approved by municipal administration.',
        type: 'VERIFICATION',
        link: '/resolver',
        emailOptions: {
          to: profile.user.email,
          template: 'resolverApproved',
          subject: 'Account Approved - Welcome to Crowd Report Resolver Network',
          html: resolverApprovedTemplate({
            name: profile.user.name,
            dashboardUrl: `${env.CLIENT_URL}/resolver`,
          }),
        },
      })
      .catch((err) => logger.warn(`Resolver approval notification skipped: ${err.message}`));
  }

  return profile;
};

export const rejectResolver = async (profileId, reason) => {
  const profile = await ResolverProfile.findOneAndUpdate(
    { _id: profileId, status: 'Pending' },
    { status: 'Rejected', rejectionReason: reason },
    { new: true }
  ).populate('user', 'name email phone');

  if (!profile) {
    throw new AppError(
      'Resolver application not found or cannot be rejected (must be in Pending status).',
      400
    );
  }

  // Dispatch rejection notification and email with mandatory reason
  if (profile.user?._id) {
    notificationService
      .notify({
        recipientId: profile.user._id,
        title: 'Resolver Application Update',
        message: `Your resolver application was rejected. Reason: ${reason}`,
        type: 'VERIFICATION',
        link: '/resolver/pending',
        emailOptions: {
          to: profile.user.email,
          template: 'resolverRejected',
          subject: 'Update on Your Resolver Application - Crowd Report',
          html: resolverRejectedTemplate({
            name: profile.user.name,
            reason,
            appealsUrl: `${env.CLIENT_URL}/resolver/pending`,
          }),
        },
      })
      .catch((err) => logger.warn(`Resolver rejection notification skipped: ${err.message}`));
  }

  return profile;
};

export default {
  registerResolver,
  getResolverByUserId,
  updateSettings,
  listResolvers,
  approveResolver,
  rejectResolver,
};

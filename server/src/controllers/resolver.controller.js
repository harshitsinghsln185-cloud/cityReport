import { User } from '../models/User.js';
import resolverService from '../services/resolverService.js';
import { AppError } from '../utils/AppError.js';
import { registerResolverSchema, updateResolverSettingsSchema } from '../validators/resolver.validator.js';

export const register = async (req, res, next) => {
  try {
    const idProofFile = req.files?.['idProof']?.[0];
    const photoFile = req.files?.['photo']?.[0];

    if (!idProofFile) {
      throw new AppError('Government ID proof image is required.', 400);
    }

    // Validate request body
    const validated = registerResolverSchema.parse(req.body);

    const existingUser = await User.findOne({ email: validated.email });
    if (existingUser) {
      throw new AppError('Email is already registered.', 409);
    }

    // 1. Create User account with role 'Resolver'
    const user = await User.create({
      name: validated.name,
      email: validated.email,
      phone: validated.phone,
      password: validated.password,
      address: validated.address,
      role: 'Resolver',
      isEmailVerified: true,
    });

    // 2. Onboard ResolverProfile
    const profile = await resolverService.registerResolver({
      userId: user._id,
      skills: validated.skills,
      coordinates: [validated.lng, validated.lat],
      serviceAddress: validated.serviceAddress,
      serviceRadiusKm: validated.serviceRadiusKm,
      idProofBuffer: idProofFile.buffer,
      photoBuffer: photoFile?.buffer || null,
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted for review',
      data: {
        userId: user._id,
        profileId: profile._id,
        status: profile.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const profile = await resolverService.getResolverByUserId(req.user._id);
    res.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (req, res, next) => {
  try {
    const validated = updateResolverSettingsSchema.parse(req.body);
    const profile = await resolverService.updateSettings(req.user._id, validated);

    res.json({
      success: true,
      message: 'Resolver settings updated successfully',
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  register,
  getMe,
  updateSettings,
};

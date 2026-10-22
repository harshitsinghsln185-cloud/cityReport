import { User } from '../models/User.js';
import { validateImageBuffer } from '../utils/fileValidation.js';
import cloudinaryService from '../services/cloudinaryService.js';
import { AppError } from '../utils/AppError.js';
import { env } from '../config/env.js';

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, address } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address) {
      user.address = {
        street: address.street,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
      };
    }

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const uploadPhoto = async (req, res, next) => {
  try {
    if (!req.file || !req.file.buffer) {
      throw new AppError('Please select an image file to upload.', 400);
    }

    // Binary magic byte validation to prevent MIME spoofing
    const validation = validateImageBuffer(req.file.buffer);
    if (!validation.isValid) {
      throw new AppError(
        'Invalid or corrupted image file. Binary signature did not match JPEG, PNG, or WebP.',
        400
      );
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Eliminate orphan assets: destroy existing photo if present
    if (user.photo && user.photo.publicId) {
      await cloudinaryService.destroyAsset(user.photo.publicId);
    }

    // Target folder hierarchy: crowd-report/<env>/profiles/<userId>
    const folder = `crowd-report/${env.NODE_ENV}/profiles/${user._id}`;
    const uploadedAsset = await cloudinaryService.uploadStream(req.file.buffer, {
      folder,
      format: validation.format,
      access_type: 'public',
    });

    user.photo = uploadedAsset;
    await user.save();

    res.json({
      success: true,
      message: 'Profile photo updated successfully',
      data: {
        photo: user.photo,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deletePhoto = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (user.photo && user.photo.publicId) {
      await cloudinaryService.destroyAsset(user.photo.publicId);
      user.photo = null;
      await user.save();
    }

    res.json({
      success: true,
      message: 'Profile photo removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getProfile,
  updateProfile,
  uploadPhoto,
  deletePhoto,
};

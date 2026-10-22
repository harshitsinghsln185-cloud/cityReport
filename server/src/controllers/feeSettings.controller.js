import { FeeSettings } from '../models/FeeSettings.js';

export const getFeeSettings = async (req, res, next) => {
  try {
    const settings = await FeeSettings.getSettings();
    await settings.populate('updatedBy', 'name email');

    res.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};

export const updateFeeSettings = async (req, res, next) => {
  try {
    const {
      freeKm,
      perKmRatePaise,
      minFeePaise,
      maxFeePaise,
      commissionPercent,
      multipliers,
    } = req.body;

    const settings = await FeeSettings.getSettings();

    settings.freeKm = freeKm;
    settings.perKmRatePaise = perKmRatePaise;
    settings.minFeePaise = minFeePaise;
    settings.maxFeePaise = maxFeePaise;
    settings.commissionPercent = commissionPercent;
    settings.multipliers = multipliers;
    settings.updatedBy = req.user._id;

    await settings.save();
    await settings.populate('updatedBy', 'name email');

    res.json({
      success: true,
      message: 'Global fee parameters updated successfully',
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getFeeSettings,
  updateFeeSettings,
};

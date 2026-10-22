import { ResolverProfile } from '../models/ResolverProfile.js';
import resolverService from '../services/resolverService.js';
import cloudinaryService from '../services/cloudinaryService.js';
import { rejectResolverSchema } from '../validators/resolver.validator.js';
import { AppError } from '../utils/AppError.js';

export const listResolvers = async (req, res, next) => {
  try {
    const { status, page, limit, search } = req.query;
    const result = await resolverService.listResolvers({
      status,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 10,
      search,
    });

    res.json({
      success: true,
      data: result.resolvers,
      meta: result.meta,
    });
  } catch (error) {
    next(error);
  }
};

export const getResolverById = async (req, res, next) => {
  try {
    const profile = await ResolverProfile.findById(req.params.id)
      .populate('user', 'name email phone photo address')
      .populate('skills', 'name slug baseFeePaise icon');

    if (!profile) {
      throw new AppError('Resolver profile not found', 404);
    }

    // Generate authenticated, time-limited signed URL for administrative ID verification
    const idProofSignedUrl = cloudinaryService.generateSignedUrl(profile.idProof.publicId, 10);

    res.json({
      success: true,
      data: {
        ...profile.toObject(),
        idProofSignedUrl,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const approveResolver = async (req, res, next) => {
  try {
    const profile = await resolverService.approveResolver(req.params.id);

    res.json({
      success: true,
      message: 'Resolver application approved successfully.',
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

export const rejectResolver = async (req, res, next) => {
  try {
    const validated = rejectResolverSchema.parse(req.body);
    const profile = await resolverService.rejectResolver(req.params.id, validated.reason);

    res.json({
      success: true,
      message: 'Resolver application rejected.',
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  listResolvers,
  getResolverById,
  approveResolver,
  rejectResolver,
};

import mongoose from 'mongoose';
import { ResolverProfile } from '../models/ResolverProfile.js';

/**
 * Calculates the great-circle distance between two [lng, lat] coordinates in kilometers.
 *
 * @param {[number, number]} coordsA - [lng, lat]
 * @param {[number, number]} coordsB - [lng, lat]
 * @returns {number} Distance in kilometers
 */
export const calculateHaversineDistance = (coordsA, coordsB) => {
  if (!coordsA || !coordsB) return 0;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const [lng1, lat1] = coordsA;
  const [lng2, lat2] = coordsB;

  const R = 6371; // Earth's mean radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Discovers the nearest certified, available resolver whose coverage radius encloses the issue.
 * Uses 2dsphere index via MongoDB $geoNear aggregation.
 *
 * @param {Object} params
 * @param {string | import('mongoose').Types.ObjectId} params.categoryId
 * @param {[number, number]} params.coordinates - [lng, lat]
 * @returns {Promise<{ resolver: Object, distanceKm: number } | null>}
 */
export const findNearestEligibleResolver = async ({ categoryId, coordinates }) => {
  if (!coordinates || coordinates.length !== 2) {
    return null;
  }

  const [lng, lat] = coordinates;
  const catObjectId =
    typeof categoryId === 'string'
      ? new mongoose.Types.ObjectId(categoryId)
      : categoryId;

  try {
    const candidates = await ResolverProfile.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [lng, lat],
          },
          distanceField: 'distanceMeters',
          spherical: true,
          query: {
            status: 'Approved',
            isAvailable: true,
            skills: catObjectId,
          },
        },
      },
    ]);

    for (const candidate of candidates) {
      const distanceKm = candidate.distanceMeters / 1000;
      // Filter by the resolver's custom max coverage radius
      if (distanceKm <= candidate.serviceRadiusKm) {
        return {
          resolver: candidate,
          distanceKm: parseFloat(distanceKm.toFixed(2)),
        };
      }
    }

    return null;
  } catch (error) {
    // If $geoNear fails or collection has no documents, return null
    return null;
  }
};

export default {
  calculateHaversineDistance,
  findNearestEligibleResolver,
};

import { z } from 'zod';
import { AppError } from '../utils/AppError.js';

/**
 * Gemini Tool Declaration for updating draft civic issue attributes.
 */
export const updateDraftToolDeclaration = {
  functionDeclarations: [
    {
      name: 'update_draft',
      description:
        'Update civic issue draft fields based on user conversational input. Call this whenever the user specifies or updates the issue title, description, category, priority, location coordinates, address, or contact phone.',
      parameters: {
        type: 'OBJECT',
        properties: {
          title: {
            type: 'STRING',
            description: 'Concise summary of the civic issue (5-120 chars).',
          },
          description: {
            type: 'STRING',
            description: 'Detailed explanation of the problem, location cues, or hazard signs (10-2000 chars).',
          },
          category: {
            type: 'STRING',
            description: 'The civic category name or keyword (e.g., Pothole, Streetlight, Garbage, Water Leak).',
          },
          priority: {
            type: 'STRING',
            enum: ['Low', 'Medium', 'High', 'Critical'],
            description: 'Citizen suggested urgency level.',
          },
          coordinates: {
            type: 'ARRAY',
            description: 'GeoJSON coordinates as [longitude, latitude].',
            items: { type: 'NUMBER' },
          },
          address: {
            type: 'OBJECT',
            description: 'Address information for the issue site.',
            properties: {
              street: { type: 'STRING' },
              city: { type: 'STRING' },
              pincode: { type: 'STRING' },
            },
          },
          contactNumber: {
            type: 'STRING',
            description: 'Citizen contact phone number.',
          },
        },
      },
    },
  ],
};

const ALLOWED_PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];

/**
 * Validates and sanitizes tool calls dispatched by the AI model.
 * Strictly strips or throws on any prompt injection attempts to set fees, status, or assignment.
 *
 * @param {string} toolName
 * @param {Object} args
 * @returns {Object} Validated and safe draft patch
 */
export const validateToolCall = (toolName, args = {}) => {
  if (toolName !== 'update_draft') {
    throw new AppError(`Unknown tool invocation: ${toolName}`, 400);
  }

  // Explicitly deny setting unpermitted parameters (fee tampering / privilege escalation defense)
  const forbiddenFields = [
    'fee',
    'status',
    'assignedResolver',
    'isManualQuote',
    'cost',
    'amount',
    'advancePaise',
    'balancePaise',
    'payout',
    'discount',
  ];

  for (const field of forbiddenFields) {
    if (args[field] !== undefined) {
      delete args[field];
    }
  }

  const sanitizedPatch = {};

  if (typeof args.title === 'string' && args.title.trim().length > 0) {
    sanitizedPatch.title = args.title.trim().substring(0, 120);
  }

  if (typeof args.description === 'string' && args.description.trim().length > 0) {
    sanitizedPatch.description = args.description.trim().substring(0, 2000);
  }

  if (typeof args.category === 'string' && args.category.trim().length > 0) {
    sanitizedPatch.category = args.category.trim();
  }

  if (typeof args.priority === 'string') {
    const formattedPriority =
      args.priority.charAt(0).toUpperCase() + args.priority.slice(1).toLowerCase();
    if (ALLOWED_PRIORITIES.includes(formattedPriority)) {
      sanitizedPatch.suggestedPriority = formattedPriority;
    }
  }

  if (Array.isArray(args.coordinates) && args.coordinates.length === 2) {
    const [lng, lat] = args.coordinates.map(Number);
    if (!isNaN(lng) && !isNaN(lat) && lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90) {
      sanitizedPatch.coordinates = [lng, lat];
    }
  }

  if (args.address && typeof args.address === 'object') {
    sanitizedPatch.address = {
      street: typeof args.address.street === 'string' ? args.address.street.trim() : '',
      city: typeof args.address.city === 'string' ? args.address.city.trim() : '',
      pincode: typeof args.address.pincode === 'string' ? args.address.pincode.trim() : '',
    };
  }

  if (typeof args.contactNumber === 'string' && args.contactNumber.trim().length > 0) {
    sanitizedPatch.contactNumber = args.contactNumber.trim();
  }

  return sanitizedPatch;
};

export default {
  updateDraftToolDeclaration,
  validateToolCall,
};

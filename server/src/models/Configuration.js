import mongoose from 'mongoose';
import { PART_TYPES } from './Part.js';

const { Schema, model } = mongoose;

/**
 * Selected part sub-schema — embedded in Configuration.
 * @typedef {Object} SelectedPart
 * @property {string} partType - One of PART_TYPES enum values
 * @property {ObjectId} partId - Reference to Part document
 * @property {string} color - Hex color applied to this part
 * @property {string} finish - Surface finish (matte, gloss, satin, carbon, chrome)
 */
const selectedPartSchema = new Schema(
  {
    partType: {
      type: String,
      required: [true, 'Part type is required'],
      enum: PART_TYPES,
    },
    partId: {
      type: Schema.Types.ObjectId,
      ref: 'Part',
      required: [true, 'Part ID is required'],
    },
    color: {
      type: String,
      default: '#FFFFFF',
    },
    finish: {
      type: String,
      enum: ['matte', 'gloss', 'satin', 'carbon', 'chrome'],
      default: 'gloss',
    },
  },
  { _id: false }
);

/**
 * Configuration schema for BuildMyRide.
 * Represents a completed/saved user build.
 * @typedef {Object} Configuration
 * @property {ObjectId} userId - Reference to the User who created this build
 * @property {ObjectId} carModelId - Reference to the base CarModel
 * @property {string} buildName - User-given name for this build
 * @property {Array<SelectedPart>} selectedParts - Array of part selections with colors/finishes
 * @property {string} bodyColor - Hex color for the car body
 * @property {string} screenshotUrl - Cloudinary URL for the build preview screenshot
 * @property {boolean} isPublic - Whether this build is visible in the gallery
 */
const configurationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    carModelId: {
      type: Schema.Types.ObjectId,
      ref: 'CarModel',
      required: [true, 'Car model ID is required'],
    },
    buildName: {
      type: String,
      required: [true, 'Build name is required'],
      trim: true,
      maxlength: [100, 'Build name cannot exceed 100 characters'],
    },
    selectedParts: [selectedPartSchema],
    bodyColor: {
      type: String,
      default: '#FFFFFF',
    },
    screenshotUrl: {
      type: String,
      default: null,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Indexes
configurationSchema.index({ userId: 1, createdAt: -1 });
configurationSchema.index({ carModelId: 1 });
configurationSchema.index({ isPublic: 1, createdAt: -1 });

export default model('Configuration', configurationSchema);

import mongoose from 'mongoose';
import { PART_TYPES } from './Part.js';

const { Schema, model } = mongoose;

/**
 * Draft selected part sub-schema — embedded in Draft.
 * Same shape as Configuration's selectedParts but in a temporary document.
 */
const draftPartSchema = new Schema(
  {
    partType: {
      type: String,
      enum: PART_TYPES,
    },
    partId: {
      type: Schema.Types.ObjectId,
      ref: 'Part',
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
 * Draft schema for BuildMyRide.
 * Auto-saved in-progress builds. TTL index auto-deletes after 7 days.
 * @typedef {Object} Draft
 * @property {ObjectId} userId - Reference to the User who owns this draft
 * @property {ObjectId} carModelId - Reference to the base CarModel
 * @property {string} buildName - Working name for the build
 * @property {Array} selectedParts - Current part selections (may be incomplete)
 * @property {string} bodyColor - Current body color
 * @property {Date} expiresAt - TTL expiration date (7 days from last save)
 */
const draftSchema = new Schema(
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
      trim: true,
      default: 'Untitled Build',
      maxlength: [100, 'Build name cannot exceed 100 characters'],
    },
    selectedParts: [draftPartSchema],
    bodyColor: {
      type: String,
      default: '#FFFFFF',
    },
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  },
  { timestamps: true }
);

// Indexes
draftSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
draftSchema.index({ userId: 1, updatedAt: -1 });

export default model('Draft', draftSchema);

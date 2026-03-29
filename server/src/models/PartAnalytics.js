import mongoose from 'mongoose';
import { PART_TYPES } from './Part.js';

const { Schema, model } = mongoose;

/**
 * Co-occurring part sub-schema — tracks which parts are commonly used together.
 * @typedef {Object} CoOccurrence
 * @property {ObjectId} partId - Reference to the co-occurring Part
 * @property {number} count - Number of times these two parts appeared in the same build
 */
const coOccurrenceSchema = new Schema(
  {
    partId: {
      type: Schema.Types.ObjectId,
      ref: 'Part',
      required: true,
    },
    count: {
      type: Number,
      default: 1,
    },
  },
  { _id: false }
);

/**
 * PartAnalytics schema for BuildMyRide.
 * Tracks part usage patterns for the recommendation engine.
 * Each document represents analytics for a single part.
 * @typedef {Object} PartAnalytics
 * @property {ObjectId} partId - Reference to the Part being tracked
 * @property {string} partType - Denormalized from Part for efficient filtering
 * @property {number} usageCount - Total times this part has been selected in configurations
 * @property {Array<CoOccurrence>} coOccurrences - Parts commonly used alongside this one
 * @property {Object} colorDistribution - Map of hex colors to usage counts
 * @property {Object} finishDistribution - Map of finishes to usage counts
 */
const partAnalyticsSchema = new Schema(
  {
    partId: {
      type: Schema.Types.ObjectId,
      ref: 'Part',
      required: [true, 'Part ID is required'],
      unique: true,
    },
    partType: {
      type: String,
      required: [true, 'Part type is required'],
      enum: PART_TYPES,
    },
    usageCount: {
      type: Number,
      default: 0,
    },
    coOccurrences: [coOccurrenceSchema],
    colorDistribution: {
      type: Map,
      of: Number,
      default: new Map(),
    },
    finishDistribution: {
      type: Map,
      of: Number,
      default: new Map(),
    },
  },
  { timestamps: true }
);

// Indexes
partAnalyticsSchema.index({ partId: 1 }, { unique: true });
partAnalyticsSchema.index({ partType: 1, usageCount: -1 });

export default model('PartAnalytics', partAnalyticsSchema);

import mongoose from 'mongoose';

const { Schema, model } = mongoose;

/**
 * Modification sub-schema — a single change applied to a segment.
 * @typedef {Object} Modification
 * @property {string} segmentLabel - Part label from SAM (e.g., "body", "windows", "wheels")
 * @property {string} modificationType - Type of change (color, wrap, tint)
 * @property {string} value - Hex color, wrap pattern URL, or tint opacity
 */
const modificationSchema = new Schema(
  {
    segmentLabel: {
      type: String,
      required: [true, 'Segment label is required'],
      trim: true,
    },
    modificationType: {
      type: String,
      required: [true, 'Modification type is required'],
      enum: ['color', 'wrap', 'tint'],
    },
    value: {
      type: String,
      required: [true, 'Modification value is required'],
    },
  },
  { _id: false }
);

/**
 * ImageSession schema for BuildMyRide.
 * Represents an AI modifier session where a user uploads a car photo,
 * SAM segments it, and the user applies modifications to individual segments.
 * @typedef {Object} ImageSession
 * @property {ObjectId} userId - Reference to the User who owns this session
 * @property {string} originalImageUrl - Cloudinary URL of the uploaded car photo
 * @property {string} modifiedImageUrl - Cloudinary URL of the final modified image
 * @property {Object} segmentationData - Raw SAM output (masks, labels, confidence scores)
 * @property {Array<Modification>} modifications - User-applied modifications per segment
 * @property {string} status - Processing status (uploading, segmenting, editing, completed, failed)
 * @property {string} replicateJobId - Replicate API prediction ID for tracking SAM processing
 */
const imageSessionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    originalImageUrl: {
      type: String,
      required: [true, 'Original image URL is required'],
    },
    modifiedImageUrl: {
      type: String,
      default: null,
    },
    segmentationData: {
      type: Schema.Types.Mixed,
      default: null,
    },
    modifications: [modificationSchema],
    status: {
      type: String,
      enum: ['uploading', 'segmenting', 'editing', 'completed', 'failed'],
      default: 'uploading',
    },
    replicateJobId: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

// Indexes
imageSessionSchema.index({ userId: 1, createdAt: -1 });
imageSessionSchema.index({ status: 1 });

export default model('ImageSession', imageSessionSchema);

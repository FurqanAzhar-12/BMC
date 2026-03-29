import mongoose from 'mongoose';

const { Schema, model } = mongoose;

/**
 * Part types enum — single source of truth for the entire codebase.
 * @type {string[]}
 */
export const PART_TYPES = [
  'headlights',
  'bumper_front',
  'bumper_rear',
  'bonnet',
  'fenders',
  'doors',
  'roof',
  'spoiler',
  'side_mirrors',
  'rims',
  'tires',
  'seats',
  'dashboard',
  'body',
];

/**
 * Part schema for BuildMyRide.
 * Represents a single swappable car part in the catalog.
 * @typedef {Object} Part
 * @property {string} name - Display name (e.g., "Carbon Fiber Spoiler")
 * @property {string} partType - One of PART_TYPES enum values
 * @property {string} meshName - Name of the mesh in the .glb file for part swapping
 * @property {string} thumbnailUrl - Cloudinary URL for part preview
 * @property {string} modelUrl - Path to .glb file if the part is a separate model
 * @property {Object} defaultMaterial - Default material properties (color, metalness, roughness)
 * @property {Array<string>} availableFinishes - Finish options (matte, gloss, satin, carbon, chrome)
 * @property {number} popularity - Usage count for recommendations, incremented on selection
 * @property {boolean} isActive - Whether the part is available for selection
 */
const partSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Part name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    partType: {
      type: String,
      required: [true, 'Part type is required'],
      enum: PART_TYPES,
    },
    meshName: {
      type: String,
      required: [true, 'Mesh name is required'],
      trim: true,
    },
    thumbnailUrl: {
      type: String,
      default: null,
    },
    modelUrl: {
      type: String,
      default: null,
    },
    defaultMaterial: {
      color: { type: String, default: '#FFFFFF' },
      metalness: { type: Number, default: 0.5, min: 0, max: 1 },
      roughness: { type: Number, default: 0.5, min: 0, max: 1 },
    },
    availableFinishes: {
      type: [String],
      enum: ['matte', 'gloss', 'satin', 'carbon', 'chrome'],
      default: ['gloss'],
    },
    popularity: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Indexes
partSchema.index({ partType: 1, isActive: 1 });
partSchema.index({ partType: 1, popularity: -1 });
partSchema.index({ meshName: 1 });

export default model('Part', partSchema);

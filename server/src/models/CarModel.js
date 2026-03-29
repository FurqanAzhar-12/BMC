import mongoose from 'mongoose';

const { Schema, model } = mongoose;

/**
 * CarModel schema for BuildMyRide.
 * Represents a base chassis/car that users can customize.
 * @typedef {Object} CarModel
 * @property {string} name - Display name (e.g., "Sedan Sport 2024")
 * @property {string} slug - URL-friendly unique identifier
 * @property {string} brand - Manufacturer brand name
 * @property {string} category - Vehicle category (sedan, suv, coupe, truck, hatchback)
 * @property {string} description - Short description of the model
 * @property {string} modelUrl - Path to .glb 3D model file in public/models/
 * @property {string} thumbnailUrl - Cloudinary URL for preview image
 * @property {Array<ObjectId>} compatibleParts - References to Part documents
 * @property {Object} defaultConfig - Default part selections for initial load
 * @property {boolean} isActive - Whether the model is available for selection
 */
const carModelSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Car model name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    brand: {
      type: String,
      required: [true, 'Brand is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['sedan', 'suv', 'coupe', 'truck', 'hatchback'],
    },
    description: {
      type: String,
      default: '',
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    modelUrl: {
      type: String,
      required: [true, 'Model URL is required'],
    },
    thumbnailUrl: {
      type: String,
      default: null,
    },
    compatibleParts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Part',
      },
    ],
    defaultConfig: {
      type: Map,
      of: Schema.Types.ObjectId,
      default: new Map(),
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Indexes
carModelSchema.index({ slug: 1 }, { unique: true });
carModelSchema.index({ category: 1, isActive: 1 });
carModelSchema.index({ brand: 1 });

export default model('CarModel', carModelSchema);

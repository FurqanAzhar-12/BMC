import mongoose from 'mongoose';

const { Schema, model } = mongoose;

/**
 * Gallery schema for BuildMyRide.
 * Represents a publicly shared build in the community gallery.
 * Can originate from either a 3D configuration or an AI image modification session.
 * @typedef {Object} Gallery
 * @property {ObjectId} userId - Reference to the User who shared this build
 * @property {string} title - Display title for the gallery post
 * @property {string} description - Optional description of the build
 * @property {string} sourceType - Origin of the build (configurator or modifier)
 * @property {ObjectId} sourceId - Reference to Configuration or ImageSession document
 * @property {string} imageUrl - Cloudinary URL for the gallery preview image
 * @property {Array<string>} tags - Searchable tags (e.g., "sedan", "carbon", "neon")
 * @property {Array<ObjectId>} likes - User IDs who liked this post
 * @property {number} likeCount - Denormalized like count for sorting
 * @property {boolean} isFeatured - Admin-curated featured builds
 */
const gallerySchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    sourceType: {
      type: String,
      required: [true, 'Source type is required'],
      enum: ['configurator', 'modifier'],
    },
    sourceId: {
      type: Schema.Types.ObjectId,
      required: [true, 'Source ID is required'],
      refPath: 'sourceType',
    },
    imageUrl: {
      type: String,
      required: [true, 'Image URL is required'],
    },
    tags: {
      type: [String],
      default: [],
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    likeCount: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Indexes
gallerySchema.index({ createdAt: -1 });
gallerySchema.index({ likeCount: -1, createdAt: -1 });
gallerySchema.index({ userId: 1, createdAt: -1 });
gallerySchema.index({ tags: 1 });
gallerySchema.index({ isFeatured: 1, createdAt: -1 });
gallerySchema.index({ sourceType: 1, sourceId: 1 });

export default model('Gallery', gallerySchema);

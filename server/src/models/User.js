import mongoose from 'mongoose';

const { Schema, model } = mongoose;

/**
 * User schema for BuildMyRide.
 * @typedef {Object} User
 * @property {string} email - Unique email address (lowercase, trimmed)
 * @property {string} passwordHash - bcryptjs hashed password (salt: 12)
 * @property {string} displayName - Public display name (max 50 chars)
 * @property {string} avatarUrl - Cloudinary URL for profile picture
 * @property {string} role - 'user' or 'admin'
 * @property {number} totalBuilds - Count of saved configurations
 * @property {Date} lastLoginAt - Last successful login timestamp
 * @property {string} refreshToken - JWT refresh token (excluded from queries by default)
 */
const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email format'],
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required'],
      select: false,
    },
    displayName: {
      type: String,
      required: [true, 'Display name is required'],
      trim: true,
      maxlength: [50, 'Display name cannot exceed 50 characters'],
    },
    avatarUrl: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    totalBuilds: {
      type: Number,
      default: 0,
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
    refreshToken: {
      type: String,
      select: false,
    },
  },
  { timestamps: true }
);

// Indexes
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1 });

export default model('User', userSchema);

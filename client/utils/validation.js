import { z } from 'zod';

/** Reusable email field */
export const emailField = z.string().email('Invalid email address');

/** Reusable password field (min 8 chars) */
export const passwordField = z.string().min(8, 'Password must be at least 8 characters');

/** MongoDB ObjectId string pattern */
export const objectIdField = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid ID format');

import AppError from '../utils/AppError.js';

/**
 * Zod validation middleware factory.
 * Validates req.body against a Zod schema.
 * @param {import('zod').ZodSchema} schema - Zod schema to validate against
 * @returns {Function} Express middleware
 */
const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const errorMessage = result.error.errors
      .map((err) => `${err.path.join('.')}: ${err.message}`)
      .join(', ');
    return next(new AppError(errorMessage, 400));
  }

  req.body = result.data;
  next();
};

export default validate;

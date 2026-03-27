# New API Endpoint Skill

Scaffold a complete Express API endpoint following BuildMyRide's controller-service-model pattern.

## Usage
When invoked with a resource name and HTTP methods, create all required files.

## Steps

1. **Create or update the route** (`server/src/routes/{resource}Routes.js`):
```js
import { Router } from 'express';
import { isAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { create{Resource}Schema, update{Resource}Schema } from '../validation/{resource}Validation.js';
import {
  getAll,
  getById,
  create,
  update,
  remove,
} from '../controllers/{resource}Controller.js';

const router = Router();

router.get('/', isAuth, getAll);
router.get('/:id', isAuth, getById);
router.post('/', isAuth, validate(create{Resource}Schema), create);
router.put('/:id', isAuth, validate(update{Resource}Schema), update);
router.delete('/:id', isAuth, remove);

export default router;
```

2. **Create Zod validation** (`server/src/validation/{resource}Validation.js`):
```js
import { z } from 'zod';

export const create{Resource}Schema = z.object({
  // Define required fields
});

export const update{Resource}Schema = z.object({
  // Define updatable fields (all optional)
});
```

3. **Create the validation middleware** (if not exists, `server/src/middleware/validate.js`):
```js
/**
 * Validates request body against a Zod schema.
 * @param {import('zod').ZodSchema} schema
 * @returns {import('express').RequestHandler}
 */
export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: result.error.flatten().fieldErrors,
    });
  }
  req.body = result.data;
  next();
};
```

4. **Create the controller** (`server/src/controllers/{resource}Controller.js`):
```js
import { catchAsync } from '../utils/catchAsync.js';
import * as {resource}Service from '../services/{resource}Service.js';

/** @param {import('express').Request} req @param {import('express').Response} res */
export const getAll = catchAsync(async (req, res) => {
  const items = await {resource}Service.getAll(req.query);
  res.json({ success: true, data: items });
});

/** @param {import('express').Request} req @param {import('express').Response} res */
export const getById = catchAsync(async (req, res) => {
  const item = await {resource}Service.getById(req.params.id);
  res.json({ success: true, data: item });
});

/** @param {import('express').Request} req @param {import('express').Response} res */
export const create = catchAsync(async (req, res) => {
  const item = await {resource}Service.create(req.body, req.user._id);
  res.status(201).json({ success: true, data: item });
});

/** @param {import('express').Request} req @param {import('express').Response} res */
export const update = catchAsync(async (req, res) => {
  const item = await {resource}Service.update(req.params.id, req.body, req.user._id);
  res.json({ success: true, data: item });
});

/** @param {import('express').Request} req @param {import('express').Response} res */
export const remove = catchAsync(async (req, res) => {
  await {resource}Service.remove(req.params.id, req.user._id);
  res.json({ success: true, data: null });
});
```

5. **Create the service** (`server/src/services/{resource}Service.js`):
```js
import {Resource} from '../models/{Resource}.js';
import { AppError } from '../utils/AppError.js';

/**
 * Get all {resource} items with optional filtering.
 * @param {Object} query - Query parameters for filtering
 * @returns {Promise<Array>}
 */
export const getAll = async (query = {}) => {
  return {Resource}.find().lean();
};

/**
 * Get a single {resource} by ID.
 * @param {string} id
 * @returns {Promise<Object>}
 */
export const getById = async (id) => {
  const item = await {Resource}.findById(id).lean();
  if (!item) throw new AppError('{Resource} not found', 404);
  return item;
};

/**
 * Create a new {resource}.
 * @param {Object} data - Validated request body
 * @param {string} userId - Authenticated user ID
 * @returns {Promise<Object>}
 */
export const create = async (data, userId) => {
  return {Resource}.create({ ...data, createdBy: userId });
};

/**
 * Update a {resource} by ID.
 * @param {string} id
 * @param {Object} data - Validated update fields
 * @param {string} userId - Authenticated user ID
 * @returns {Promise<Object>}
 */
export const update = async (id, data, userId) => {
  const item = await {Resource}.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!item) throw new AppError('{Resource} not found', 404);
  return item;
};

/**
 * Delete a {resource} by ID.
 * @param {string} id
 * @param {string} userId - Authenticated user ID
 * @returns {Promise<void>}
 */
export const remove = async (id, userId) => {
  const item = await {Resource}.findByIdAndDelete(id);
  if (!item) throw new AppError('{Resource} not found', 404);
};
```

6. **Register the route** in `server/src/routes/index.js`:
```js
import {resource}Routes from './{resource}Routes.js';
router.use('/{resource}', {resource}Routes);
```

## Checklist After Scaffolding
- [ ] Fill in Zod schemas with actual fields
- [ ] Add authorization checks in service (e.g., owner-only updates)
- [ ] Add pagination to getAll if needed
- [ ] Test with MongoDB MCP by running sample queries

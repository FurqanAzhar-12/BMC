import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '../.env') });

const PART_TYPES = [
  'headlights', 'bumper_front', 'bumper_rear', 'bonnet',
  'fenders', 'doors', 'roof', 'spoiler', 'side_mirrors',
  'rims', 'tires', 'seats', 'dashboard', 'body',
];

/**
 * Collection definitions with JSON Schema validation rules.
 * MongoDB enforces these at the database level, independent of Mongoose.
 */
const collections = [
  {
    name: 'users',
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        required: ['email', 'passwordHash', 'displayName'],
        properties: {
          email: { bsonType: 'string', description: 'Must be a string and is required' },
          passwordHash: { bsonType: 'string', description: 'Must be a string and is required' },
          displayName: { bsonType: 'string', maxLength: 50 },
          avatarUrl: { bsonType: ['string', 'null'] },
          role: { bsonType: 'string', enum: ['user', 'admin'] },
          totalBuilds: { bsonType: 'int', minimum: 0 },
          lastLoginAt: { bsonType: ['date', 'null'] },
          refreshToken: { bsonType: ['string', 'null'] },
        },
      },
    },
    indexes: [
      { fields: { email: 1 }, options: { unique: true } },
      { fields: { role: 1 } },
    ],
  },
  {
    name: 'carmodels',
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        required: ['name', 'slug', 'brand', 'category', 'modelUrl'],
        properties: {
          name: { bsonType: 'string', maxLength: 100 },
          slug: { bsonType: 'string' },
          brand: { bsonType: 'string' },
          category: { bsonType: 'string', enum: ['sedan', 'suv', 'coupe', 'truck', 'hatchback'] },
          description: { bsonType: 'string', maxLength: 500 },
          modelUrl: { bsonType: 'string' },
          thumbnailUrl: { bsonType: ['string', 'null'] },
          compatibleParts: { bsonType: 'array', items: { bsonType: 'objectId' } },
          isActive: { bsonType: 'bool' },
        },
      },
    },
    indexes: [
      { fields: { slug: 1 }, options: { unique: true } },
      { fields: { category: 1, isActive: 1 } },
      { fields: { brand: 1 } },
    ],
  },
  {
    name: 'parts',
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        required: ['name', 'partType', 'meshName'],
        properties: {
          name: { bsonType: 'string', maxLength: 100 },
          partType: { bsonType: 'string', enum: PART_TYPES },
          meshName: { bsonType: 'string' },
          thumbnailUrl: { bsonType: ['string', 'null'] },
          modelUrl: { bsonType: ['string', 'null'] },
          defaultMaterial: {
            bsonType: 'object',
            properties: {
              color: { bsonType: 'string' },
              metalness: { bsonType: 'double', minimum: 0, maximum: 1 },
              roughness: { bsonType: 'double', minimum: 0, maximum: 1 },
            },
          },
          availableFinishes: {
            bsonType: 'array',
            items: { bsonType: 'string', enum: ['matte', 'gloss', 'satin', 'carbon', 'chrome'] },
          },
          popularity: { bsonType: 'int', minimum: 0 },
          isActive: { bsonType: 'bool' },
        },
      },
    },
    indexes: [
      { fields: { partType: 1, isActive: 1 } },
      { fields: { partType: 1, popularity: -1 } },
      { fields: { meshName: 1 } },
    ],
  },
  {
    name: 'configurations',
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        required: ['userId', 'carModelId', 'buildName'],
        properties: {
          userId: { bsonType: 'objectId' },
          carModelId: { bsonType: 'objectId' },
          buildName: { bsonType: 'string', maxLength: 100 },
          selectedParts: {
            bsonType: 'array',
            items: {
              bsonType: 'object',
              required: ['partType', 'partId'],
              properties: {
                partType: { bsonType: 'string', enum: PART_TYPES },
                partId: { bsonType: 'objectId' },
                color: { bsonType: 'string' },
                finish: { bsonType: 'string', enum: ['matte', 'gloss', 'satin', 'carbon', 'chrome'] },
              },
            },
          },
          bodyColor: { bsonType: 'string' },
          screenshotUrl: { bsonType: ['string', 'null'] },
          isPublic: { bsonType: 'bool' },
        },
      },
    },
    indexes: [
      { fields: { userId: 1, createdAt: -1 } },
      { fields: { carModelId: 1 } },
      { fields: { isPublic: 1, createdAt: -1 } },
    ],
  },
  {
    name: 'drafts',
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        required: ['userId', 'carModelId', 'expiresAt'],
        properties: {
          userId: { bsonType: 'objectId' },
          carModelId: { bsonType: 'objectId' },
          buildName: { bsonType: 'string', maxLength: 100 },
          selectedParts: {
            bsonType: 'array',
            items: {
              bsonType: 'object',
              properties: {
                partType: { bsonType: 'string', enum: PART_TYPES },
                partId: { bsonType: 'objectId' },
                color: { bsonType: 'string' },
                finish: { bsonType: 'string', enum: ['matte', 'gloss', 'satin', 'carbon', 'chrome'] },
              },
            },
          },
          bodyColor: { bsonType: 'string' },
          expiresAt: { bsonType: 'date' },
        },
      },
    },
    indexes: [
      { fields: { expiresAt: 1 }, options: { expireAfterSeconds: 0 } },
      { fields: { userId: 1, updatedAt: -1 } },
    ],
  },
  {
    name: 'imagesessions',
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        required: ['userId', 'originalImageUrl'],
        properties: {
          userId: { bsonType: 'objectId' },
          originalImageUrl: { bsonType: 'string' },
          modifiedImageUrl: { bsonType: ['string', 'null'] },
          segmentationData: {},
          modifications: {
            bsonType: 'array',
            items: {
              bsonType: 'object',
              required: ['segmentLabel', 'modificationType', 'value'],
              properties: {
                segmentLabel: { bsonType: 'string' },
                modificationType: { bsonType: 'string', enum: ['color', 'wrap', 'tint'] },
                value: { bsonType: 'string' },
              },
            },
          },
          status: {
            bsonType: 'string',
            enum: ['uploading', 'segmenting', 'editing', 'completed', 'failed'],
          },
          replicateJobId: { bsonType: ['string', 'null'] },
        },
      },
    },
    indexes: [
      { fields: { userId: 1, createdAt: -1 } },
      { fields: { status: 1 } },
    ],
  },
  {
    name: 'gallery',
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        required: ['userId', 'title', 'sourceType', 'sourceId', 'imageUrl'],
        properties: {
          userId: { bsonType: 'objectId' },
          title: { bsonType: 'string', maxLength: 120 },
          description: { bsonType: 'string', maxLength: 500 },
          sourceType: { bsonType: 'string', enum: ['configurator', 'modifier'] },
          sourceId: { bsonType: 'objectId' },
          imageUrl: { bsonType: 'string' },
          tags: { bsonType: 'array', items: { bsonType: 'string' } },
          likes: { bsonType: 'array', items: { bsonType: 'objectId' } },
          likeCount: { bsonType: 'int', minimum: 0 },
          isFeatured: { bsonType: 'bool' },
        },
      },
    },
    indexes: [
      { fields: { createdAt: -1 } },
      { fields: { likeCount: -1, createdAt: -1 } },
      { fields: { userId: 1, createdAt: -1 } },
      { fields: { tags: 1 } },
      { fields: { isFeatured: 1, createdAt: -1 } },
      { fields: { sourceType: 1, sourceId: 1 } },
    ],
  },
  {
    name: 'partanalytics',
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        required: ['partId', 'partType'],
        properties: {
          partId: { bsonType: 'objectId' },
          partType: { bsonType: 'string', enum: PART_TYPES },
          usageCount: { bsonType: 'int', minimum: 0 },
          coOccurrences: {
            bsonType: 'array',
            items: {
              bsonType: 'object',
              required: ['partId', 'count'],
              properties: {
                partId: { bsonType: 'objectId' },
                count: { bsonType: 'int', minimum: 0 },
              },
            },
          },
        },
      },
    },
    indexes: [
      { fields: { partId: 1 }, options: { unique: true } },
      { fields: { partType: 1, usageCount: -1 } },
    ],
  },
];

/**
 * Creates all collections with JSON schema validation and indexes.
 * Run: node server/scripts/setup-db.js
 */
const setupDatabase = async () => {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`Connected to database: ${mongoose.connection.db.databaseName}\n`);

    const db = mongoose.connection.db;
    const existingCollections = (await db.listCollections().toArray()).map((c) => c.name);

    for (const collection of collections) {
      const { name, validator, indexes } = collection;

      if (existingCollections.includes(name)) {
        console.log(`  [SKIP] ${name} — already exists`);
        await db.command({ collMod: name, validator, validationLevel: 'moderate' });
        console.log(`  [UPDATE] ${name} — validation rules updated`);
      } else {
        await db.createCollection(name, { validator, validationLevel: 'moderate' });
        console.log(`  [CREATE] ${name}`);
      }

      for (const idx of indexes) {
        await db.collection(name).createIndex(idx.fields, idx.options || {});
      }
      console.log(`  [INDEX] ${name} — ${indexes.length} index(es) ensured`);
    }

    console.log('\n--- Setup Summary ---');
    console.log(`Database: ${mongoose.connection.db.databaseName}`);
    console.log(`Collections: ${collections.length}`);
    console.log(`Total indexes: ${collections.reduce((sum, c) => sum + c.indexes.length, 0)}`);
    console.log('Setup complete!\n');
  } catch (error) {
    console.error('Setup failed:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
};

setupDatabase();

# New Feature Module Skill

Scaffold a complete feature module following BuildMyRide's architecture.

## Usage
When invoked with a feature name, create the full directory structure and boilerplate files.

## Steps

1. **Create the feature directory structure:**
```
client/features/{featureName}/
├── components/
│   └── {FeatureName}Page.jsx    # Main page component
├── api/
│   └── {featureName}Api.js      # API functions
├── hooks/
│   └── use{FeatureName}.js      # Primary hook
└── schemas/
    └── {featureName}Schema.js   # Zod validation schemas
```

2. **Create the Page component** (`components/{FeatureName}Page.jsx`):
```jsx
'use client';

import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

/**
 * {FeatureName} page component.
 * @returns {JSX.Element}
 */
export default function {FeatureName}Page() {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <Box sx={{ p: 4 }}>
        <Typography variant="h2">{FeatureName}</Typography>
      </Box>
    </motion.div>
  );
}
```

3. **Create the API client** (`api/{featureName}Api.js`):
```js
import api from '@/hooks/useApi';

/**
 * Fetch all {featureName} items.
 * @returns {Promise<Array>}
 */
export const fetchAll = async () => {
  const { data } = await api.get('/{featureName}');
  return data.data;
};

/**
 * Fetch a single {featureName} item by ID.
 * @param {string} id
 * @returns {Promise<Object>}
 */
export const fetchById = async (id) => {
  const { data } = await api.get(`/{featureName}/${id}`);
  return data.data;
};
```

4. **Create the primary hook** (`hooks/use{FeatureName}.js`):
```jsx
import { useState, useEffect } from 'react';
import { fetchAll } from '../api/{featureName}Api';

/**
 * Hook for managing {featureName} state and data fetching.
 * @returns {{ items: Array, loading: boolean, error: string|null }}
 */
export default function use{FeatureName}() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchAll();
        setItems(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return { items, loading, error };
}
```

5. **Create the Zod schema** (`schemas/{featureName}Schema.js`):
```js
import { z } from 'zod';

export const {featureName}Schema = z.object({
  // Define form fields here
});
```

6. **Create the thin page route** (`app/{featureName}/page.jsx`):
```jsx
import {FeatureName}Page from '@/features/{featureName}/components/{FeatureName}Page';

export const metadata = { title: '{FeatureName} | BuildMyRide' };

export default function Page() {
  return <{FeatureName}Page />;
}
```

## After Scaffolding
- Fill in the Zod schema with actual fields
- Add more components inside `components/` as needed
- Add more hooks and API functions as the feature grows
- Never add logic to the `app/` page file

# New Component Skill

Scaffold an MUI + Framer Motion component following BuildMyRide's conventions.

## Usage
When invoked with a component name and target feature, create a properly structured component file.

## Component Template

### Interactive Component (with animation)
Create at `client/features/{feature}/components/{ComponentName}.jsx`:

```jsx
'use client';

import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const variants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

/**
 * {ComponentName} component.
 * @param {Object} props
 * @returns {JSX.Element}
 */
export default function {ComponentName}(props) {
  return (
    <motion.div variants={variants} initial="initial" animate="animate">
      <Box
        sx={{
          bgcolor: 'background.paper',
          border: 1,
          borderColor: 'surface.border',
          borderRadius: 3,
          p: 3,
          transition: 'border-color 0.3s ease',
          '&:hover': {
            borderColor: 'surface.borderHover',
          },
        }}
      >
        <Typography variant="h6">{ComponentName}</Typography>
      </Box>
    </motion.div>
  );
}
```

### Shared UI Component
Create at `client/components/ui/{ComponentName}.jsx`:

```jsx
'use client';

import { Box } from '@mui/material';
import { motion } from 'framer-motion';

/**
 * Reusable {ComponentName} component.
 * @param {Object} props
 * @param {import('react').ReactNode} props.children
 * @returns {JSX.Element}
 */
export default function {ComponentName}({ children, sx = {}, ...props }) {
  return (
    <Box
      component={motion.div}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      sx={{
        bgcolor: 'background.paper',
        border: 1,
        borderColor: 'surface.border',
        borderRadius: 3,
        overflow: 'hidden',
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
}
```

## Rules
- ALL colors from theme tokens — never hardcode hex values
- `motion.div` or `Box component={motion.div}` for animated MUI components
- JSDoc on the export
- File extension: `.jsx`
- Framer Motion durations: 0.2s - 0.6s
- Keep under 200 lines — extract sub-components if larger
- If shared across features → `client/components/ui/`
- If feature-specific → `client/features/{feature}/components/`

'use client';

import { Box, Typography, Button, Stack } from '@mui/material';

export default function GlobalError({ error, reset }) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
      }}
    >
      <Stack spacing={3} alignItems="center" textAlign="center">
        <Typography variant="h3" sx={{ color: 'error.main' }}>
          Something went wrong
        </Typography>
        <Typography variant="body2">
          {error?.message || 'An unexpected error occurred.'}
        </Typography>
        <Button variant="outlined" onClick={() => reset()}>
          Try Again
        </Button>
      </Stack>
    </Box>
  );
}

import { Box, CircularProgress, Typography, Stack } from '@mui/material';

export default function Loading() {
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
      <Stack spacing={2} alignItems="center">
        <CircularProgress sx={{ color: 'secondary.main' }} />
        <Typography variant="body2">Loading...</Typography>
      </Stack>
    </Box>
  );
}

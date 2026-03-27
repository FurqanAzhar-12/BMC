import { Box, Typography, Button, Stack, Container } from '@mui/material';
import Link from 'next/link';

export const metadata = { title: 'BuildMyRide | Customize Your Dream Car' };

export default function HomePage() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #000000 0%, #0A0A0A 50%, #111111 100%)',
      }}
    >
      <Container maxWidth="md">
        <Stack spacing={4} alignItems="center" textAlign="center">
          <Typography variant="h1" sx={{ fontSize: { xs: '2.5rem', md: '4rem' } }}>
            Build My Ride
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 600 }}>
            Customize your dream car in 3D or transform real car photos with AI-powered modifications.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Button
              component={Link}
              href="/configurator"
              variant="contained"
              size="large"
            >
              3D Configurator
            </Button>
            <Button
              component={Link}
              href="/modifier"
              variant="outlined"
              size="large"
            >
              AI Modifier
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}

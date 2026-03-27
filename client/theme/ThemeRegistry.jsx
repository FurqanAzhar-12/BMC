'use client';

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import theme from './theme';

/**
 * MUI ThemeRegistry for Next.js App Router SSR.
 * Wraps the app with Emotion cache + MUI theme + CssBaseline.
 * @param {{ children: React.ReactNode }} props
 * @returns {React.ReactElement}
 */
export default function ThemeRegistry({ children }) {
  return (
    <AppRouterCacheProvider options={{ key: 'mui' }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#FFFFFF',
      contrastText: '#000000',
    },
    secondary: {
      main: '#A0C4FF',
    },
    background: {
      default: '#000000',
      paper: '#0A0A0A',
    },
    surface: {
      main: '#111111',
      border: '#1A1A1A',
      borderHover: '#333333',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#999999',
      disabled: '#444444',
    },
    error: { main: '#FF6B6B' },
    success: { main: '#6BFF8E' },
  },
  typography: {
    fontFamily: '"Inter", "Outfit", system-ui, sans-serif',
    h1: { fontWeight: 300, letterSpacing: '0.15em', textTransform: 'uppercase' },
    h2: { fontWeight: 300, letterSpacing: '0.15em', textTransform: 'uppercase' },
    h3: { fontWeight: 300, letterSpacing: '0.1em', textTransform: 'uppercase' },
    h4: { fontWeight: 400, letterSpacing: '0.05em' },
    body1: { fontWeight: 400, lineHeight: 1.7 },
    body2: { fontWeight: 400, lineHeight: 1.6, color: '#999999' },
    button: { fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase' },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8, padding: '12px 24px', transition: 'all 0.3s ease' },
        outlined: {
          borderColor: '#333333',
          color: '#FFFFFF',
          '&:hover': { borderColor: '#666666', backgroundColor: 'rgba(255,255,255,0.05)' },
        },
        contained: {
          backgroundColor: '#FFFFFF',
          color: '#000000',
          '&:hover': { backgroundColor: '#E0E0E0', transform: 'scale(1.02)' },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#0A0A0A',
          border: '1px solid #1A1A1A',
          borderRadius: 12,
          transition: 'border-color 0.3s ease',
          '&:hover': { borderColor: '#333333' },
        },
      },
    },
    MuiTextField: {
      defaultProps: { variant: 'standard' },
      styleOverrides: {
        root: {
          '& .MuiInput-underline:before': { borderBottomColor: '#333333' },
          '& .MuiInput-underline:hover:before': { borderBottomColor: '#666666' },
          '& .MuiInput-underline:after': { borderBottomColor: '#A0C4FF' },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
  },
});

export default theme;

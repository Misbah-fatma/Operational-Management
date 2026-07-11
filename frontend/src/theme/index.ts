import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1e5eff',
      light: '#5b8cff',
      dark: '#0d3cb8',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#3b82f6',
      light: '#60a5fa',
      dark: '#2563eb',
    },
    background: {
      default: '#f0f4f8',
      paper: '#ffffff',
    },
    text: {
      primary: '#0f172a',
      secondary: '#64748b',
    },
    divider: 'rgba(30, 94, 255, 0.08)',
    success: { main: '#1e5eff' },
    warning: { main: '#3b82f6' },
    error: { main: '#dc2626' },
    info: { main: '#2563eb' },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700, color: '#0f172a' },
    h5: { fontWeight: 600, color: '#0f172a' },
    h6: { fontWeight: 600, color: '#0f172a' },
  },
  shape: { borderRadius: 12 },
  transitions: {
    duration: { shorter: 200, short: 250, standard: 300 },
    easing: { easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)' },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#f0f4f8',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 10,
          boxShadow: 'none',
          '&:hover': { boxShadow: 'none' },
        },
        contained: {
          background: 'linear-gradient(135deg, #1e5eff 0%, #2563eb 100%)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          border: '1px solid rgba(30, 94, 255, 0.08)',
          boxShadow: '0 1px 3px rgba(30, 94, 255, 0.06)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: '0 1px 3px rgba(30, 94, 255, 0.06)',
          border: '1px solid rgba(30, 94, 255, 0.08)',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#f8fafc',
          '& .MuiTableCell-head': {
            fontWeight: 600,
            color: '#334155',
            borderBottom: '1px solid rgba(30, 94, 255, 0.1)',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid rgba(30, 94, 255, 0.06)',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          margin: '2px 8px',
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          '&.Mui-selected': {
            backgroundColor: 'rgba(30, 94, 255, 0.12)',
            color: '#1e5eff',
            '& .MuiListItemIcon-root': { color: '#1e5eff' },
            '&:hover': { backgroundColor: 'rgba(30, 94, 255, 0.16)' },
          },
          '&:hover': { backgroundColor: 'rgba(30, 94, 255, 0.06)' },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            '&.Mui-focused fieldset': {
              borderColor: '#1e5eff',
            },
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 14,
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '2px 8px',
          transition: 'background-color 0.2s ease',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'background-color 0.2s ease, transform 0.2s ease',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #0d3cb8 0%, #1e5eff 100%)',
          boxShadow: '0 2px 12px rgba(30, 94, 255, 0.2)',
        },
      },
    },
  },
});

export default theme;

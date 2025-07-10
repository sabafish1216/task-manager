import React from 'react';
import { Container, CssBaseline, ThemeProvider, createTheme, Box, Typography, AppBar, Toolbar } from '@mui/material';
import { Provider } from 'react-redux';
import { store } from './store';
import AddTask from './components/AddTask';
import TaskList from './components/TaskList';
import AddCategory from './components/AddCategory';
import TaskStats from './components/TaskStats';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f1f5f9',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 50,
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: '0 2px 8px 0 rgba(25,118,210,0.08)',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 4px 16px 0 rgba(25,118,210,0.15)',
            transform: 'translateY(-1px)',
          },
        },
        contained: {
          background: 'linear-gradient(90deg, #1976d2 60%, #1565c0 100%)',
          '&:hover': {
            background: 'linear-gradient(90deg, #1565c0 60%, #1976d2 100%)',
          },
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
            background: 'rgba(25, 118, 210, 0.08)',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 50,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'scale(1.05)',
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          borderRadius: 50,
          '&:hover': {
            backgroundColor: 'rgba(25, 118, 210, 0.08)',
            borderRadius: 50,
          },
        },
      },
    },
  },
});

const APP_VERSION = 'v1.0.0';

const App: React.FC = () => {

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        }}>
          <AppBar position="static" elevation={0} sx={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
          }}>
            <Toolbar sx={{ justifyContent: 'space-between', px: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="h5" color="#2d3748" fontWeight={800} sx={{ letterSpacing: 1 }}>
                  Task Manager
                </Typography>
                <Typography variant="caption" color="#64748b" fontWeight={600} sx={{ mt: 0.5 }}>
                  {APP_VERSION}
                </Typography>
              </Box>
            </Toolbar>
          </AppBar>
          <Container maxWidth="lg" sx={{ py: 6 }}>
            <TaskStats />
            <Box sx={{ display: 'flex', gap: 4, mb: 4 }}>
              <Box sx={{ flex: 1 }}>
                <AddTask />
              </Box>
              <Box sx={{ flex: 1 }}>
                <AddCategory />
              </Box>
            </Box>
            <TaskList />
          </Container>
          <Box component="footer" sx={{
            textAlign: 'center',
            py: 4,
            mt: 'auto',
          }}>
            <Typography variant="body2" color="#64748b" fontWeight={500}>
              © 2024 Ryuto Kobayashi
            </Typography>
          </Box>
        </Box>
      </ThemeProvider>
    </Provider>
  );
};

export default App; 
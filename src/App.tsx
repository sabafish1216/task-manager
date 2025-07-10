import React from 'react';
import { Container, CssBaseline, ThemeProvider, createTheme, Box, AppBar, Toolbar } from '@mui/material';
import { Provider } from 'react-redux';
import { store } from './store';
import AddTask from './components/AddTask';
import TaskList from './components/TaskList';
import AddCategory from './components/AddCategory';
import TaskStats from './components/TaskStats';
import CustomTypography from './custom_props/CustomTypography';

/**
 * アプリケーションのテーマ設定
 * Material-UIのテーマをカスタマイズ
 */
const theme = createTheme({
  palette: {
    primary: {
      main: '#2563eb', // より鮮やかなブルー
    },
    secondary: {
      main: '#a21caf', // パープル系
    },
    background: {
      default: '#f3f4f6', // さらに淡いグレー
      paper: '#fff',
    },
    success: {
      main: '#22c55e',
    },
    warning: {
      main: '#f59e42',
    },
    error: {
      main: '#ef4444',
    },
    info: {
      main: '#0ea5e9',
    },
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h5: {
      fontWeight: 900,
      letterSpacing: 1.2,
    },
    body1: {
      fontWeight: 600,
      fontSize: '1.08rem',
    },
    caption: {
      fontWeight: 500,
      color: '#64748b',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 32, // さらに丸く
          boxShadow: '0 8px 32px 0 rgba(60,72,88,0.13)',
          border: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 32, // さらに丸く
          boxShadow: '0 4px 24px 0 rgba(60,72,88,0.10)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          textTransform: 'none',
          fontWeight: 700,
          fontSize: '1.08rem',
          letterSpacing: 0.5,
          boxShadow: '0 2px 12px 0 rgba(37,99,235,0.10)',
          transition: 'all 0.2s cubic-bezier(.4,2,.3,1)',
          padding: '10px 28px',
          minHeight: 44,
          '&:hover': {
            boxShadow: '0 6px 24px 0 rgba(37,99,235,0.18)',
            transform: 'translateY(-2px) scale(1.03)',
          },
        },
        contained: {
          background: 'linear-gradient(90deg, #2563eb 60%, #1e40af 100%)',
          color: '#fff',
          '&:hover': {
            background: 'linear-gradient(90deg, #1e40af 60%, #2563eb 100%)',
          },
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
            background: 'rgba(37,99,235,0.08)',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          transition: 'all 0.2s cubic-bezier(.4,2,.3,1)',
          '&:hover': {
            transform: 'scale(1.10)',
            background: 'rgba(37,99,235,0.08)',
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          '&:hover': {
            backgroundColor: 'rgba(37,99,235,0.08)',
            borderRadius: 12,
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          background: '#f1f5f9',
        },
      },
    },
  },
});

/** アプリケーションのバージョン */
const APP_VERSION = 'v1.1.0';

/**
 * メインアプリケーションコンポーネント
 * Reduxストアとテーマプロバイダーを設定し、アプリケーション全体のレイアウトを管理
 */
const App: React.FC = () => {

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #f3f4f6 0%, #e0e7ef 100%)',
          px: { xs: 0, sm: 2, md: 4 },
          py: { xs: 0, sm: 2, md: 4 },
        }}>
          {/* ヘッダー */}
          <AppBar position="static" elevation={0} sx={{
            background: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(16px)',
            borderBottom: '1.5px solid rgba(37,99,235,0.08)',
            boxShadow: '0 2px 16px 0 rgba(37,99,235,0.04)',
            py: 2,
          }}>
            <Toolbar sx={{ justifyContent: 'space-between', px: 5, minHeight: 80 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <CustomTypography variant="h5" size="large" sx={{ color: '#1e293b', fontWeight: 900, letterSpacing: 1.2 }}>
                  Task Manager
                </CustomTypography>
                <CustomTypography variant="caption" color="muted" sx={{ fontWeight: 600, mt: 0.5 }}>
                  {APP_VERSION}
                </CustomTypography>
              </Box>
            </Toolbar>
          </AppBar>
          
          {/* メインコンテンツ */}
          <Container maxWidth="lg" sx={{ py: 10 }}>
            <TaskStats />
            <Box sx={{ display: 'flex', gap: 8, mb: 8 }}>
              <Box sx={{ flex: 1 }}>
                <AddTask />
              </Box>
              <Box sx={{ flex: 1 }}>
                <AddCategory />
              </Box>
            </Box>
            <TaskList />
          </Container>
          
          {/* フッター */}
          <Box component="footer" sx={{
            textAlign: 'center',
            py: 7,
            mt: 'auto',
            background: 'rgba(255,255,255,0.95)',
            borderTop: '1.5px solid #e0e7ef',
            fontWeight: 600,
            color: '#64748b',
            letterSpacing: 0.5,
            fontSize: '1.08rem',
            borderRadius: '32px', // 角丸追加
          }}>
            <CustomTypography variant="body2" color="muted" sx={{ fontWeight: 600 }}>
              © 2025 Ryuto Kobayashi
            </CustomTypography>
          </Box>
        </Box>
      </ThemeProvider>
    </Provider>
  );
};

export default App; 
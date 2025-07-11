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
    mode: 'dark',
    primary: {
      main: '#00e6d8', // エメラルド
      contrastText: '#181c24',
    },
    secondary: {
      main: '#a259f7', // パープル
      contrastText: '#fff',
    },
    background: {
      default: '#181c24', // ダーク
      paper: '#23283a',   // カード等
    },
    success: {
      main: '#00e676',
    },
    warning: {
      main: '#ffb300',
    },
    error: {
      main: '#ff5370',
    },
    info: {
      main: '#40c4ff',
    },
    text: {
      primary: '#e3e8ee',
      secondary: '#a3aed6',
    },
  },
  typography: {
    fontFamily: 'Montserrat, "Roboto", "Helvetica", "Arial", sans-serif',
    h5: {
      fontWeight: 900,
      letterSpacing: 2,
      color: '#00e6d8',
      textShadow: '0 2px 16px #00e6d888',
    },
    body1: {
      fontWeight: 600,
      fontSize: '1.08rem',
    },
    caption: {
      fontWeight: 500,
      color: '#a3aed6',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 28,
          boxShadow: '0 8px 32px 0 #00e6d822, 0 1.5px 8px 0 #a259f722',
          border: '1.5px solid #23283a',
          background: 'linear-gradient(135deg, #23283a 80%, #2d3757 100%)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 28,
          boxShadow: '0 4px 24px 0 #a259f722',
          background: '#23283a',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          textTransform: 'none',
          fontWeight: 700,
          fontSize: '1.08rem',
          letterSpacing: 1,
          boxShadow: '0 2px 12px 0 #00e6d822',
          transition: 'all 0.2s cubic-bezier(.4,2,.3,1)',
          padding: '10px 28px',
          minHeight: 44,
        },
        contained: {
          background: 'linear-gradient(90deg, #00e6d8 60%, #a259f7 100%)',
          color: '#181c24',
          '&:hover': {
            background: 'linear-gradient(90deg, #a259f7 60%, #00e6d8 100%)',
            color: '#fff',
          },
        },
        outlined: {
          borderWidth: 2,
          borderColor: '#00e6d8',
          color: '#00e6d8',
          '&:hover': {
            borderWidth: 2,
            background: 'rgba(0,230,216,0.08)',
            color: '#a259f7',
            borderColor: '#a259f7',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(90deg, #23283a 60%, #181c24 100%)',
          boxShadow: '0 2px 16px 0 #00e6d822',
          borderBottom: '1.5px solid #23283a',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          transition: 'all 0.2s cubic-bezier(.4,2,.3,1)',
          color: '#a3aed6',
          '&:hover': {
            transform: 'scale(1.10)',
            background: 'rgba(0,230,216,0.10)',
            color: '#00e6d8',
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          color: '#a259f7',
          '&.Mui-checked': {
            color: '#00e6d8',
          },
          '&:hover': {
            backgroundColor: 'rgba(162,89,247,0.08)',
            borderRadius: 12,
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          background: '#23283a',
          color: '#e3e8ee',
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
          background: 'linear-gradient(135deg, #181c24 0%, #23283a 100%)',
          px: { xs: 0, sm: 2, md: 4 },
          py: { xs: 0, sm: 2, md: 4 },
        }}>
          {/* ヘッダー */}
          <AppBar position="static" elevation={0} sx={{
            background: 'linear-gradient(90deg, #23283a 60%, #181c24 100%)',
            backdropFilter: 'blur(16px)',
            borderBottom: '1.5px solid #23283a',
            boxShadow: '0 2px 16px 0 #00e6d822',
            py: 2,
          }}>
            <Toolbar sx={{ justifyContent: 'space-between', px: 5, minHeight: 80 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <CustomTypography variant="h5" size="large" sx={{ color: '#00e6d8', fontWeight: 900, letterSpacing: 2, textShadow: '0 2px 16px #00e6d888' }}>
                  Task Manager
                </CustomTypography>
                <CustomTypography variant="caption" color="muted" sx={{ fontWeight: 600, mt: 0.5, color: '#a259f7' }}>
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
            background: 'linear-gradient(90deg, #23283a 60%, #181c24 100%)',
            borderTop: '1.5px solid #23283a',
            fontWeight: 600,
            color: '#a3aed6',
            letterSpacing: 0.5,
            fontSize: '1.08rem',
            borderRadius: '32px',
            boxShadow: '0 2px 16px 0 #00e6d822',
          }}>
            <CustomTypography variant="body2" color="muted" sx={{ fontWeight: 600, color: '#a3aed6' }}>
              © 2025 Ryuto Kobayashi
            </CustomTypography>
          </Box>
        </Box>
      </ThemeProvider>
    </Provider>
  );
};

export default App; 
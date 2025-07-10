/**
 * 共通スタイル定数
 */

// フォントサイズ
export const FONT_SIZES = {
  small: '0.85rem',
  medium: '1rem',
  large: '1.2rem',
} as const;

// ラベルフォントサイズ
export const LABEL_FONT_SIZES = {
  small: '0.75rem',
  medium: '0.85rem',
} as const;

// 色
export const COLORS = {
  primary: '#1976d2',
  primaryHover: '#1565c0',
  secondary: '#dc004e',
  secondaryHover: '#c51162',
  error: '#d32f2f',
  errorHover: '#c62828',
  warning: '#ed6c02',
  warningHover: '#e65100',
  info: '#0288d1',
  infoHover: '#0277bd',
  success: '#2e7d32',
  successHover: '#1b5e20',
  text: '#374151',
  textMuted: '#9ca3af',
  background: '#f8fafc',
  backgroundWhite: '#fff',
  border: '#cbd5e1',
  borderHover: '#94a3b8',
} as const;

// 角丸
export const BORDER_RADIUS = {
  small: 1,
  medium: 2,
  large: 3,
} as const;

// 余白
export const SPACING = {
  xs: 0.5,
  sm: 1,
  md: 2,
  lg: 3,
  xl: 4,
} as const;

// 共通スタイル
export const COMMON_STYLES = {
  // テキストフィールド
  textField: {
    background: COLORS.background,
    borderRadius: BORDER_RADIUS.medium,
  },
  
  // フォームコントロール
  formControl: {
    background: COLORS.backgroundWhite,
    borderRadius: BORDER_RADIUS.medium,
  },
  
  // ダイアログ
  dialog: {
    title: {
      fontSize: FONT_SIZES.large,
      fontWeight: 700,
    },
    content: {
      fontSize: FONT_SIZES.medium,
    },
    actions: {
      fontSize: FONT_SIZES.medium,
    },
  },
  
  // ボタン
  button: {
    borderRadius: BORDER_RADIUS.medium,
    fontWeight: 600,
    textTransform: 'none' as const,
    transition: 'all 0.2s ease-in-out',
  },
} as const; 
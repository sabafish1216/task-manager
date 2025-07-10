import React from 'react';
import { Typography, TypographyProps } from '@mui/material';

interface CustomTypographyProps extends TypographyProps {
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'text' | 'muted' | 'error' | 'success';
}

/**
 * カスタマイズされたタイポグラフィコンポーネント
 * @param size - テキストサイズ（small, medium, large）
 * @param color - テキスト色（primary, secondary, text, muted, error, success）
 * @param sx - 追加のスタイル
 * @param otherProps - その他のTypographyProps
 * @returns カスタマイズされたTypographyコンポーネント
 */
const CustomTypography: React.FC<CustomTypographyProps> = ({
  size = 'medium',
  color = 'text',
  sx,
  ...otherProps
}) => {
  // サイズに応じたフォントサイズ
  const getFontSize = () => {
    switch (size) {
      case 'small':
        return '0.85rem';
      case 'large':
        return '1.2rem';
      default: // medium
        return '1rem';
    }
  };

  // 色に応じたスタイル
  const getColorStyle = () => {
    switch (color) {
      case 'primary':
        return { color: '#1976d2' };
      case 'secondary':
        return { color: '#dc004e' };
      case 'muted':
        return { color: '#9ca3af' };
      case 'error':
        return { color: '#d32f2f' };
      case 'success':
        return { color: '#2e7d32' };
      default: // text
        return { color: '#374151' };
    }
  };

  return (
    <Typography
      sx={{
        fontSize: getFontSize(),
        fontWeight: 500,
        ...getColorStyle(),
        ...sx,
      }}
      {...otherProps}
    />
  );
};

export default CustomTypography; 
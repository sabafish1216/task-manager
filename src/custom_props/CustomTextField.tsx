import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';

interface CustomTextFieldProps extends Omit<TextFieldProps, 'size'> {
  size?: 'small' | 'medium';
}

/**
 * カスタマイズされたテキストフィールドコンポーネント
 * @param size - フィールドサイズ（small, medium）
 * @param sx - 追加のスタイル
 * @param InputProps - 入力フィールドのプロパティ
 * @param InputLabelProps - ラベルのプロパティ
 * @param otherProps - その他のTextFieldProps
 * @returns カスタマイズされたTextFieldコンポーネント
 */
const CustomTextField: React.FC<CustomTextFieldProps> = ({
  size = 'medium',
  sx,
  InputProps,
  InputLabelProps,
  ...otherProps
}) => {
  // サイズに応じたフォントサイズ
  const getFontSize = () => {
    switch (size) {
      case 'small':
        return '0.85rem';
      default: // medium
        return '1rem';
    }
  };

  const labelFontSize = size === 'small' ? '0.75rem' : '0.85rem';

  return (
    <TextField
      size={size}
      variant="outlined"
      sx={{
        background: '#f8fafc',
        borderRadius: 2,
        fontSize: getFontSize(),
        ...sx,
      }}
      InputProps={{
        style: { fontSize: getFontSize() },
        ...InputProps,
      }}
      InputLabelProps={{
        style: { fontSize: labelFontSize },
        ...InputLabelProps,
      }}
      {...otherProps}
    />
  );
};

export default CustomTextField; 
import React from 'react';
import { FormControl, FormControlProps } from '@mui/material';

interface CustomFormControlProps extends FormControlProps {
  size?: 'small' | 'medium';
}

/**
 * カスタマイズされたフォームコントロールコンポーネント
 * @param size - コントロールサイズ（small, medium）
 * @param sx - 追加のスタイル
 * @param otherProps - その他のFormControlProps
 * @returns カスタマイズされたFormControlコンポーネント
 */
const CustomFormControl: React.FC<CustomFormControlProps> = ({
  size = 'medium',
  sx,
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

  return (
    <FormControl
      size={size}
      fullWidth
      sx={{
        background: '#fff',
        borderRadius: 2,
        fontSize: getFontSize(),
        ...sx,
      }}
      {...otherProps}
    />
  );
};

export default CustomFormControl; 
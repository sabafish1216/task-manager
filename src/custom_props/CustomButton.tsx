import React from 'react';
import { Button, ButtonProps } from '@mui/material';

interface CustomButtonProps extends Omit<ButtonProps, 'variant'> {
  variant?: 'contained' | 'outlined' | 'text';
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  size?: 'small' | 'medium' | 'large';
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  variant = 'outlined',
  color = 'primary',
  size = 'medium',
  startIcon,
  endIcon,
  disabled = false,
  onClick,
  children,
  sx,
  ...otherProps
}) => {
  // サイズに応じたスタイル
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          px: 2,
          py: 0.8,
          fontSize: '0.85rem',
          minWidth: 80,
        };
      case 'large':
        return {
          px: 4,
          py: 1.5,
          fontSize: '1.2rem',
          minWidth: 140,
        };
      default: // medium
        return {
          px: 3,
          py: 1.2,
          fontSize: '1rem',
          minWidth: 120,
        };
    }
  };

  // カラーに応じたスタイル
  const getColorStyles = () => {
    const baseColor = color === 'primary' ? '#1976d2' : 
                     color === 'secondary' ? '#dc004e' :
                     color === 'error' ? '#d32f2f' :
                     color === 'warning' ? '#ed6c02' :
                     color === 'info' ? '#0288d1' :
                     color === 'success' ? '#2e7d32' : '#1976d2';

    const hoverColor = color === 'primary' ? '#1565c0' : 
                      color === 'secondary' ? '#c51162' :
                      color === 'error' ? '#c62828' :
                      color === 'warning' ? '#e65100' :
                      color === 'info' ? '#0277bd' :
                      color === 'success' ? '#1b5e20' : '#1565c0';

    if (variant === 'contained') {
      return {
        background: disabled 
          ? '#e5e7eb' 
          : `linear-gradient(90deg, ${baseColor} 60%, ${hoverColor} 100%)`,
        color: disabled ? '#9ca3af' : '#fff',
        border: 'none',
        '&:hover': {
          background: disabled 
            ? '#e5e7eb' 
            : `linear-gradient(90deg, ${hoverColor} 60%, ${baseColor} 100%)`,
        },
        '&:disabled': {
          background: '#e5e7eb',
          color: '#9ca3af',
          transform: 'none',
        },
      };
    } else if (variant === 'outlined') {
      return {
        background: 'none',
        borderColor: disabled ? '#cbd5e1' : baseColor,
        color: disabled ? '#9ca3af' : baseColor,
        '&:hover': {
          background: disabled ? 'none' : '#f1f5f9',
          borderColor: disabled ? '#cbd5e1' : hoverColor,
        },
        '&:disabled': {
          borderColor: '#cbd5e1',
          color: '#9ca3af',
        },
      };
    } else { // text
      return {
        background: 'none',
        color: disabled ? '#9ca3af' : baseColor,
        '&:hover': {
          background: disabled ? 'none' : '#f1f5f9',
        },
        '&:disabled': {
          color: '#9ca3af',
        },
      };
    }
  };

  return (
    <Button
      variant={variant}
      color={color}
      size={size}
      startIcon={startIcon}
      endIcon={endIcon}
      disabled={disabled}
      onClick={onClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        borderRadius: 2,
        fontWeight: 600,
        textTransform: 'none',
        boxShadow: variant === 'contained' ? '0 2px 8px 0 rgba(0,0,0,0.1)' : 'none',
        transition: 'all 0.2s ease-in-out',
        ...getSizeStyles(),
        ...getColorStyles(),
        ...sx,
      }}
      {...otherProps}
    >
      {children}
    </Button>
  );
};

export default CustomButton; 
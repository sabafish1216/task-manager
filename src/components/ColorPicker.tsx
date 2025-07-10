import React, { useState } from 'react';
import { Box, Button, Popover, Typography } from '@mui/material';
import { ChromePicker, ColorResult } from 'react-color';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  label?: string;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange, label = '色を選択' }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleColorChange = (colorResult: ColorResult) => {
    onChange(colorResult.hex);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'color-picker-popover' : undefined;

  return (
    <Box>
      <Button
        variant="contained"
        onClick={handleClick}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          minWidth: 120,
          background: 'linear-gradient(90deg, #1976d2 60%, #1565c0 100%)',
          '&:hover': {
            background: 'linear-gradient(90deg, #1565c0 60%, #1976d2 100%)',
          },
        }}
      >
        <Box
          sx={{
            width: 20,
            height: 20,
            backgroundColor: color,
            borderRadius: '50%',
            border: '2px solid',
            borderColor: '#fff',
            boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1)',
          }}
        />
        <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600 }}>{label}</Typography>
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Box sx={{ p: 1 }}>
          <ChromePicker
            color={color}
            onChange={handleColorChange}
            disableAlpha={true}
          />
        </Box>
      </Popover>
    </Box>
  );
};

export default ColorPicker; 
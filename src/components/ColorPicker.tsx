import React, { useState } from 'react';
import { Box, Popover } from '@mui/material';
import { ChromePicker, ColorResult } from 'react-color';
import CustomButton from '../custom_props/CustomButton';
import CustomTypography from '../custom_props/CustomTypography';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  label?: string;
}

/**
 * カラーピッカーコンポーネント
 * 色選択ボタンとポップオーバーでカラーピッカーを表示
 * @param color - 現在選択されている色
 * @param onChange - 色変更時のコールバック関数
 * @param label - ボタンに表示するラベル
 */
const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange, label = '色を選択' }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  /**
   * カラーピッカーを開く処理
   * @param event - クリックイベント
   */
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  /**
   * カラーピッカーを閉じる処理
   */
  const handleClose = () => {
    setAnchorEl(null);
  };

  /**
   * 色変更処理
   * @param colorResult - 選択された色の情報
   */
  const handleColorChange = (colorResult: ColorResult) => {
    onChange(colorResult.hex);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'color-picker-popover' : undefined;

  return (
    <Box>
      <CustomButton
        variant="outlined"
        color="primary"
        size="medium"
        onClick={handleClick}
        sx={{
          minWidth: 120,
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
        <CustomTypography variant="body2" sx={{ color: 'inherit', fontWeight: 600 }}>
          {label}
        </CustomTypography>
      </CustomButton>
      
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
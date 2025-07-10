import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
} from '@mui/material';
import CustomButton from '../custom_props/CustomButton';
import CustomTypography from '../custom_props/CustomTypography';
import { COMMON_STYLES } from '../custom_props/styles';

interface ColorWarningDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  newColor: string;
  similarColors: string[];
}

/**
 * 色警告ダイアログコンポーネント
 * 類似色が選択された際の確認ダイアログ
 * @param open - ダイアログの表示状態
 * @param onClose - キャンセル時のコールバック関数
 * @param onConfirm - 確認時のコールバック関数
 * @param newColor - 新しく選択された色
 * @param similarColors - 類似している既存の色の配列
 */
const ColorWarningDialog: React.FC<ColorWarningDialogProps> = ({
  open,
  onClose,
  onConfirm,
  newColor,
  similarColors,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={COMMON_STYLES.dialog.title}>
        類似色の警告
      </DialogTitle>
      
      <DialogContent sx={{ p: 4, ...COMMON_STYLES.dialog.content }}>
        <CustomTypography variant="body1" sx={{ mb: 2 }}>
          すでに追加されているカテゴリと類似した色が選択されています。よろしいですか？
        </CustomTypography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <CustomTypography variant="body2">選択した色:</CustomTypography>
          <Box
            sx={{
              width: 24,
              height: 24,
              backgroundColor: newColor,
              borderRadius: '50%',
              border: '1px solid',
              borderColor: 'divider',
            }}
          />
        </Box>
        
        {similarColors.length > 0 && (
          <Box>
            <CustomTypography variant="body2" sx={{ mb: 1 }}>
              類似している既存の色:
            </CustomTypography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {similarColors.map((color, index) => (
                <Box
                  key={index}
                  sx={{
                    width: 20,
                    height: 20,
                    backgroundColor: color,
                    borderRadius: '50%',
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                />
              ))}
            </Box>
          </Box>
        )}
      </DialogContent>
      
      <DialogActions sx={{ px: 4, py: 2, ...COMMON_STYLES.dialog.actions }}>
        <CustomButton 
          onClick={onClose}
          variant="outlined"
          color="primary"
          size="medium"
        >
          キャンセル
        </CustomButton>
        <CustomButton 
          onClick={onConfirm} 
          variant="contained"
          color="primary"
          size="medium"
        >
          続行
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
};

export default ColorWarningDialog; 
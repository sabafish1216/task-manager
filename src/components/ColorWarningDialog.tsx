import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from '@mui/material';

interface ColorWarningDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  newColor: string;
  similarColors: string[];
}

const ColorWarningDialog: React.FC<ColorWarningDialogProps> = ({
  open,
  onClose,
  onConfirm,
  newColor,
  similarColors,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>類似色の警告</DialogTitle>
      <DialogContent>
        <Typography variant="body1" sx={{ mb: 2 }}>
          すでに追加されているカテゴリと類似した色が選択されています。よろしいですか？
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Typography variant="body2">選択した色:</Typography>
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
            <Typography variant="body2" sx={{ mb: 1 }}>
              類似している既存の色:
            </Typography>
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
      <DialogActions>
        <Button 
          onClick={onClose}
          variant="outlined"
          sx={{
            px: 3,
            py: 1.2,
            fontWeight: 600,
            color: '#64748b',
            borderColor: '#cbd5e1',
            '&:hover': {
              background: '#f1f5f9',
              borderColor: '#94a3b8',
            },
          }}
        >
          キャンセル
        </Button>
        <Button 
          onClick={onConfirm} 
          variant="contained"
          sx={{
            px: 4,
            py: 1.2,
            fontWeight: 700,
            background: 'linear-gradient(90deg, #1976d2 60%, #1565c0 100%)',
            '&:hover': {
              background: 'linear-gradient(90deg, #1565c0 60%, #1976d2 100%)',
            },
          }}
        >
          続行
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ColorWarningDialog; 
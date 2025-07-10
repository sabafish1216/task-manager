import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { addCategory } from '../store/categorySlice';
import ColorPicker from './ColorPicker';
import ColorWarningDialog from './ColorWarningDialog';
import { findSimilarColors, getRandomColor } from '../utils/colorUtils';


const AddCategory: React.FC = () => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.categories.categories);
  const [name, setName] = useState('');
  const [color, setColor] = useState(getRandomColor());
  const [open, setOpen] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [pendingColor, setPendingColor] = useState(getRandomColor());

  const handleColorChange = (newColor: string) => {
    setColor(newColor);
  };

  const handleWarningConfirm = () => {
    console.log('handleWarningConfirm called', { name: name.trim(), color: pendingColor });
    dispatch(addCategory({
      name: name.trim(),
      color: pendingColor,
    }));
    console.log('Category added from warning, resetting form');
    setName('');
    setColor(getRandomColor());
    setShowWarning(false);
  };

  const handleWarningCancel = () => {
    setShowWarning(false);
    // 警告をキャンセルした場合は何もしない（フォームは開いたまま）
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('handleSubmit called', { name: name.trim(), color });
    console.log('Form submitted, preventing default');
    console.log('Current state:', { name, color, categories: categories.length });
    if (name.trim()) {
      console.log('Name is valid, proceeding with category addition');
      const existingColors = categories.map(cat => cat.color);
      const similarColors = findSimilarColors(color, existingColors);
      
      console.log('Submit check:', { color, existingColors, similarColors });
      
      if (similarColors.length > 0) {
        console.log('Similar colors found, showing warning');
        setPendingColor(color);
        setShowWarning(true);
      } else {
        console.log('Dispatching addCategory', { name: name.trim(), color });
        dispatch(addCategory({
          name: name.trim(),
          color,
        }));
        console.log('Category added, resetting form');
        setName('');
        setColor(getRandomColor());
      }
    } else {
      console.log('Name is empty, not proceeding');
    }
  };

  const handleCancel = () => {
    setName('');
    setColor(getRandomColor());
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpen(true)}
        sx={{
          px: 4,
          py: 1.5,
          fontWeight: 700,
          fontSize: '1rem',
          mb: 2,
        }}
      >
        ＋分類追加
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>新しい分類を追加</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
            <TextField
              label="分類名"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              fullWidth
              variant="outlined"
              sx={{ background: '#f8fafc', borderRadius: 2 }}
            />
            <ColorPicker
              color={color}
              onChange={handleColorChange}
              label="色を選択"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpen(false)}
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
            onClick={handleSubmit}
            variant="contained"
            disabled={!name.trim()}
            sx={{
              px: 4,
              py: 1.2,
              fontWeight: 700,
              fontSize: '1rem',
              background: name.trim() 
                ? 'linear-gradient(90deg, #1976d2 60%, #1565c0 100%)'
                : '#e5e7eb',
              color: name.trim() ? '#fff' : '#9ca3af',
              '&:hover': {
                background: name.trim()
                  ? 'linear-gradient(90deg, #1565c0 60%, #1976d2 100%)'
                  : '#e5e7eb',
              },
              '&:disabled': {
                background: '#e5e7eb',
                color: '#9ca3af',
                transform: 'none',
              },
            }}
          >
            分類を追加
          </Button>
        </DialogActions>
      </Dialog>
      <ColorWarningDialog
        open={showWarning}
        onClose={handleWarningCancel}
        onConfirm={handleWarningConfirm}
        newColor={pendingColor}
        similarColors={findSimilarColors(pendingColor, categories.map(cat => cat.color))}
      />
    </>
  );
};

export default AddCategory; 
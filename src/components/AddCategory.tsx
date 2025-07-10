import React, { useState } from 'react';
import {
  Box,
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
import CategoryIcon from '@mui/icons-material/Category';
import CustomButton from '../custom_props/CustomButton';
import CustomTextField from '../custom_props/CustomTextField';
import { COMMON_STYLES } from '../custom_props/styles';
import { Add, Cancel } from '@mui/icons-material';

/**
 * カテゴリ追加コンポーネント
 * 新しいカテゴリを作成・管理する
 */
const AddCategory: React.FC = () => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.categories.categories);
  
  // フォーム状態
  const [name, setName] = useState('');
  const [color, setColor] = useState(getRandomColor());
  const [open, setOpen] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [pendingColor, setPendingColor] = useState(getRandomColor());

  /**
   * 色変更処理
   * @param newColor - 新しい色
   */
  const handleColorChange = (newColor: string) => {
    setColor(newColor);
  };

  /**
   * 警告ダイアログ確認処理
   */
  const handleWarningConfirm = () => {
    console.log('handleWarningConfirm called', { name: name.trim(), color: pendingColor });
    dispatch(addCategory({
      name: name.trim(),
      color: pendingColor,
    }));
    console.log('Category added from warning, resetting form');
    resetForm();
  };

  /**
   * 警告ダイアログキャンセル処理
   */
  const handleWarningCancel = () => {
    setShowWarning(false);
    // 警告をキャンセルした場合は何もしない（フォームは開いたまま）
  };

  /**
   * フォーム送信処理
   * @param e - フォームイベント
   */
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
        resetForm();
      }
    } else {
      console.log('Name is empty, not proceeding');
    }
  };

  /**
   * フォーム状態をリセット
   */
  const resetForm = () => {
    setName('');
    setColor(getRandomColor());
    setOpen(false);
    setShowWarning(false);
  };

  return (
    <>
      <CustomButton
        variant="contained"
        color="secondary"
        size="large"
        startIcon={<CategoryIcon />}
        onClick={() => setOpen(true)}
        sx={{ mb: 2 }}
      >
        カテゴリ追加
      </CustomButton>
      
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={COMMON_STYLES.dialog.title}>
          新しいカテゴリを追加
        </DialogTitle>
        
        <DialogContent sx={{ p: 4, ...COMMON_STYLES.dialog.content }}>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 4, mt: 2 }}>
            {/* カテゴリ名入力 */}
            <CustomTextField
              label="カテゴリ名"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              fullWidth
            />
            {/* 色選択 */}
            <ColorPicker
              color={color}
              onChange={handleColorChange}
              label="色を選択"
            />
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ px: 4, py: 2, ...COMMON_STYLES.dialog.actions }}>
          <CustomButton 
            onClick={() => setOpen(false)}
            variant="outlined"
            color="primary"
            size="medium"
            startIcon={<Cancel />}
          >
            キャンセル
          </CustomButton>
          <CustomButton 
            onClick={handleSubmit} 
            variant="contained" 
            disabled={!name.trim()}
            startIcon={<Add />}
            color="primary"
            size="medium"
          >
            追加
          </CustomButton>
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
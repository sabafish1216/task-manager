import React, { useState } from 'react';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Save, Cancel } from '@mui/icons-material';
import { Category } from '../types/category';
import CustomButton from '../custom_props/CustomButton';
import CustomTextField from '../custom_props/CustomTextField';
import ColorPicker from './ColorPicker';
import { COMMON_STYLES } from '../custom_props/styles';

interface CategoryEditDialogProps {
  category: Category;
  open: boolean;
  onClose: () => void;
  onSave: (updatedCategory: Category) => void;
}

/**
 * カテゴリ編集ダイアログコンポーネント
 * カテゴリの名前と色を編集する
 * @param category - 編集するカテゴリ
 * @param open - ダイアログの表示状態
 * @param onClose - ダイアログを閉じるコールバック
 * @param onSave - 保存時のコールバック
 */
const CategoryEditDialog: React.FC<CategoryEditDialogProps> = ({ 
  category, 
  open, 
  onClose, 
  onSave 
}) => {
  const [editName, setEditName] = useState(category.name);
  const [editColor, setEditColor] = useState(category.color);

  /**
   * 保存処理
   */
  const handleSave = () => {
    if (editName.trim()) {
      onSave({
        ...category,
        name: editName.trim(),
        color: editColor,
      });
      onClose();
    }
  };

  /**
   * キャンセル処理
   */
  const handleCancel = () => {
    setEditName(category.name);
    setEditColor(category.color);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="sm" fullWidth>
      <DialogTitle sx={COMMON_STYLES.dialog.title}>
        カテゴリを編集
      </DialogTitle>
      
      <DialogContent sx={{ p: 4, ...COMMON_STYLES.dialog.content }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, mt: 2 }}>
          {/* カテゴリ名入力 */}
          <CustomTextField
            label="カテゴリ名"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            fullWidth
            required
          />
          
          {/* 色選択 */}
          <ColorPicker
            color={editColor}
            onChange={setEditColor}
          />
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ px: 4, py: 2, ...COMMON_STYLES.dialog.actions }}>
        <CustomButton 
          onClick={handleCancel} 
          startIcon={<Cancel />}
          variant="outlined"
          color="primary"
          size="medium"
        >
          キャンセル
        </CustomButton>
        <CustomButton 
          onClick={handleSave} 
          variant="contained" 
          disabled={!editName.trim()} 
          startIcon={<Save />}
          color="primary"
          size="medium"
        >
          保存
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
};

export default CategoryEditDialog; 
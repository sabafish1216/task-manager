import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { updateCategory, deleteCategory } from '../store/categorySlice';
import { deleteTask } from '../store/taskSlice';
import { Category } from '../types/category';
import ColorPicker from './ColorPicker';
import ColorWarningDialog from './ColorWarningDialog';
import { findSimilarColors } from '../utils/colorUtils';
import CustomButton from '../custom_props/CustomButton';
import CustomTextField from '../custom_props/CustomTextField';
import CustomTypography from '../custom_props/CustomTypography';
import { COMMON_STYLES } from '../custom_props/styles';

/**
 * カテゴリ管理コンポーネント
 * カテゴリの一覧表示、編集、削除を行う
 */
const CategoryManager: React.FC = () => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.categories.categories);
  const tasks = useAppSelector((state) => state.tasks.tasks);
  
  // 編集状態
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('');
  const [showWarning, setShowWarning] = useState(false);
  const [pendingColor, setPendingColor] = useState('');

  /**
   * カテゴリ編集開始処理
   * @param category - 編集するカテゴリ
   */
  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setEditName(category.name);
    setEditColor(category.color);
  };

  /**
   * 色変更処理
   * @param newColor - 新しい色
   */
  const handleColorChange = (newColor: string) => {
    setEditColor(newColor);
  };

  /**
   * 警告ダイアログ確認処理
   */
  const handleWarningConfirm = () => {
    if (editingCategory && editName.trim()) {
      dispatch(updateCategory({
        id: editingCategory.id,
        updates: {
          name: editName.trim(),
          color: pendingColor,
        },
      }));
      resetEditForm();
    }
    setShowWarning(false);
  };

  /**
   * 警告ダイアログキャンセル処理
   */
  const handleWarningCancel = () => {
    setShowWarning(false);
    // 警告をキャンセルした場合は何もしない（編集ダイアログは開いたまま）
  };

  /**
   * カテゴリ保存処理
   */
  const handleSave = () => {
    if (editingCategory && editName.trim()) {
      const existingColors = categories
        .filter(cat => cat.id !== editingCategory.id)
        .map(cat => cat.color);
      const similarColors = findSimilarColors(editColor, existingColors);
      
      console.log('Save check:', { editColor, existingColors, similarColors });
      
      if (similarColors.length > 0) {
        setPendingColor(editColor);
        setShowWarning(true);
      } else {
        dispatch(updateCategory({
          id: editingCategory.id,
          updates: {
            name: editName.trim(),
            color: editColor,
          },
        }));
        resetEditForm();
      }
    }
  };

  /**
   * 編集フォーム状態をリセット
   */
  const resetEditForm = () => {
    setEditingCategory(null);
    setEditName('');
    setEditColor('');
  };

  /**
   * 編集キャンセル処理
   */
  const handleCancel = () => {
    resetEditForm();
  };

  /**
   * カテゴリ削除処理
   * @param categoryId - 削除するカテゴリのID
   */
  const handleDelete = (categoryId: string) => {
    if (window.confirm('このカテゴリを削除しますか？関連するタスクも削除されます。')) {
      // 関連するタスクを削除
      tasks.forEach(task => {
        if (task.categoryId === categoryId) {
          dispatch(deleteTask(task.id));
        }
      });
      // カテゴリを削除
      dispatch(deleteCategory(categoryId));
    }
  };

  return (
    <>
      <CustomTypography variant="h6" size="large" sx={{ mb: 2 }}>
        カテゴリ管理
      </CustomTypography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {categories.map((category) => {
          const categoryTasks = tasks.filter(task => task.categoryId === category.id);
          const total = categoryTasks.length;
          const completed = categoryTasks.filter(task => task.completed).length;
          return (
            <Card key={category.id} sx={{
              width: '100%',
              borderRadius: 3,
              background: '#f8fafc',
              boxShadow: '0 4px 16px 0 rgba(60,72,88,0.10)',
              mb: 1,
              border: 'none',
              transition: 'box-shadow 0.2s',
              '&:hover': {
                boxShadow: '0 8px 32px 0 rgba(60,72,88,0.18)',
              },
            }}>
              <CardContent sx={{ py: 3, px: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        width: 18,
                        height: 18,
                        backgroundColor: category.color,
                        borderRadius: '50%',
                        boxShadow: '0 1px 4px 0 rgba(60,72,88,0.10)',
                      }}
                    />
                    <Box>
                      <CustomTypography variant="h6" size="large" sx={{ fontWeight: 700, color: '#2d3748', letterSpacing: 0.5 }}>
                        {category.name}
                      </CustomTypography>
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 0.5 }}>
                        <CustomTypography variant="caption" color="muted" sx={{ fontWeight: 500 }}>
                          割当:{total}
                        </CustomTypography>
                        <CustomTypography variant="caption" color="success" sx={{ fontWeight: 500 }}>
                          完了:{completed}
                        </CustomTypography>
                      </Box>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      size="small"
                      onClick={() => handleEdit(category)}
                      sx={{
                        p: 0.5,
                        borderRadius: 2,
                        transition: 'background 0.2s',
                        '&:hover': {
                          background: 'rgba(25, 118, 210, 0.08)',
                          color: '#1976d2',
                        },
                      }}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(category.id)}
                      sx={{
                        p: 0.5,
                        borderRadius: 2,
                        transition: 'background 0.2s',
                        '&:hover': {
                          background: 'rgba(244, 67, 54, 0.08)',
                          color: '#d32f2f',
                        },
                      }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          );
        })}
      </Box>
      
      {/* カテゴリ編集ダイアログ */}
      <Dialog open={!!editingCategory} onClose={handleCancel} maxWidth="sm" fullWidth>
        <DialogTitle sx={COMMON_STYLES.dialog.title}>
          カテゴリを編集
        </DialogTitle>
        
        <DialogContent sx={{ p: 4, ...COMMON_STYLES.dialog.content }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <CustomTextField
              label="カテゴリ名"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              fullWidth
              required
            />
            <ColorPicker
              color={editColor}
              onChange={handleColorChange}
              label="色を選択"
            />
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ px: 4, py: 2, ...COMMON_STYLES.dialog.actions }}>
          <CustomButton 
            onClick={handleCancel}
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
            color="primary"
            size="medium"
          >
            保存
          </CustomButton>
        </DialogActions>
      </Dialog>
      
      <ColorWarningDialog
        open={showWarning}
        onClose={handleWarningCancel}
        onConfirm={handleWarningConfirm}
        newColor={pendingColor}
        similarColors={findSimilarColors(
          pendingColor, 
          categories
            .filter(cat => cat.id !== editingCategory?.id)
            .map(cat => cat.color)
        )}
      />
    </>
  );
};

export default CategoryManager; 
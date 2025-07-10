import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { updateCategory, deleteCategory } from '../store/categorySlice';
import { deleteTask } from '../store/taskSlice';
import { Category } from '../types/category';
import ColorPicker from './ColorPicker';
import ColorWarningDialog from './ColorWarningDialog';
import { findSimilarColors } from '../utils/colorUtils';

const CategoryManager: React.FC = () => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.categories.categories);
  const tasks = useAppSelector((state) => state.tasks.tasks);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('');
  const [showWarning, setShowWarning] = useState(false);
  const [pendingColor, setPendingColor] = useState('');

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setEditName(category.name);
    setEditColor(category.color);
  };

  const handleColorChange = (newColor: string) => {
    setEditColor(newColor);
  };

  const handleWarningConfirm = () => {
    if (editingCategory && editName.trim()) {
      dispatch(updateCategory({
        id: editingCategory.id,
        updates: {
          name: editName.trim(),
          color: pendingColor,
        },
      }));
      setEditingCategory(null);
      setEditName('');
      setEditColor('');
    }
    setShowWarning(false);
  };

  const handleWarningCancel = () => {
    setShowWarning(false);
    // 警告をキャンセルした場合は何もしない（編集ダイアログは開いたまま）
  };

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
        setEditingCategory(null);
        setEditName('');
        setEditColor('');
      }
    }
  };

  const handleCancel = () => {
    setEditingCategory(null);
    setEditName('');
    setEditColor('');
  };

  const handleDelete = (categoryId: string) => {
    if (window.confirm('この分類を削除しますか？関連するタスクも削除されます。')) {
      // 関連するタスクを削除
      tasks.forEach(task => {
        if (task.categoryId === categoryId) {
          dispatch(deleteTask(task.id));
        }
      });
      // 分類を削除
      dispatch(deleteCategory(categoryId));
    }
  };

  return (
    <>
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        分類管理
      </Typography>
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
                      <Typography variant="h6" fontWeight={700} color="#2d3748" sx={{ letterSpacing: 0.5 }}>
                        {category.name}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 0.5 }}>
                        <Typography variant="caption" color="text.secondary" fontWeight={500}>
                          割当:{total}
                        </Typography>
                        <Typography variant="caption" color="success.main" fontWeight={500}>
                          完了:{completed}
                        </Typography>
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
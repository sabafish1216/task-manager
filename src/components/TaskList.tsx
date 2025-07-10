import React, { useState, useMemo, useCallback } from 'react';
import { Box, Typography, Paper, Divider, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import TaskItem from './TaskItem';
import { Priority } from '../types/task';
import { updateCategory, deleteCategory } from '../store/categorySlice';
import { deleteTask } from '../store/taskSlice';
import { Edit, Delete } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import ColorPicker from './ColorPicker';
import ColorWarningDialog from './ColorWarningDialog';
import { findSimilarColors } from '../utils/colorUtils';
import { Category } from '../types/category';

const TaskList: React.FC = () => {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector((state) => state.tasks.tasks);
  const categories = useAppSelector((state) => state.categories.categories);
 
  // デバッグ用：categoriesの状態をログ出力
  // console.log('TaskList render - categories:', categories);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('');
  const [showWarning, setShowWarning] = useState(false);
  const [pendingColor, setPendingColor] = useState('');

  // 優先度の順序を定義（数値が大きいほど優先度が高い）
  const priorityOrder: Record<Priority, number> = useMemo(() => ({
    urgent: 4,
    high: 3,
    medium: 2,
    low: 1,
  }), []);

  // タスクをソートする関数（useCallbackでメモ化）
  const sortTasks = useCallback((taskList: typeof tasks) => {
    return [...taskList].sort((a, b) => {
      // 1. 優先度でソート（降順）
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;

      // 2. 作成日でソート（降順）
      const dateDiff = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (dateDiff !== 0) return dateDiff;

      // 3. タスク名でソート（昇順）
      return a.title.localeCompare(b.title);
    });
  }, [priorityOrder]);

  // 分類ごとのタスクリストをuseMemoでメモ化
  const categoryTaskMap = useMemo(() => {
    const map: Record<string, ReturnType<typeof sortTasks>> = {};
    categories.forEach(category => {
      map[category.id] = sortTasks(tasks.filter(task => task.categoryId === category.id));
    });
    return map;
  }, [categories, tasks, sortTasks]);

  // 分類なしタスクもメモ化
  const noCategoryTasks = useMemo(() => sortTasks(tasks.filter(task => !task.categoryId)), [tasks, sortTasks]);
  const noCategoryIncomplete = useMemo(() => noCategoryTasks.filter(task => !task.completed), [noCategoryTasks]);
  const noCategoryCompleted = useMemo(() => noCategoryTasks.filter(task => task.completed), [noCategoryTasks]);

  // 分類編集・削除ハンドラもuseCallbackでメモ化
  const handleEdit = useCallback((category: Category) => {
    setEditingCategory(category);
    setEditName(category.name);
    setEditColor(category.color);
  }, []);

  const handleColorChange = useCallback((newColor: string) => {
    setEditColor(newColor);
  }, []);

  const handleWarningConfirm = useCallback(() => {
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
  }, [dispatch, editingCategory, editName, pendingColor]);

  const handleWarningCancel = useCallback(() => {
    setShowWarning(false);
  }, []);

  const handleSave = useCallback(() => {
    if (editingCategory && editName.trim()) {
      const existingColors = categories
        .filter(cat => cat.id !== editingCategory.id)
        .map(cat => cat.color);
      const similarColors = findSimilarColors(editColor, existingColors);
      
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
  }, [dispatch, editingCategory, editName, editColor, categories]);

  const handleCancel = useCallback(() => {
    setEditingCategory(null);
    setEditName('');
    setEditColor('');
  }, []);

  const handleDelete = useCallback((categoryId: string) => {
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
  }, [dispatch, tasks]);

  return (
    <Box sx={{ display: 'flex', gap: 6, overflowX: 'auto', pb: 1 }}>
      {categories.map((category) => {
        const categoryTasks = categoryTaskMap[category.id];
        const total = categoryTasks?.length ?? 0;
        const completed = categoryTasks?.filter(task => task.completed).length ?? 0;
        const incompleteTasks = categoryTasks?.filter(task => !task.completed) ?? [];
        const completedTasks = categoryTasks?.filter(task => task.completed) ?? [];
        return (
          <Box key={category.id} sx={{
            width: 510,
            minWidth: 510,
            maxWidth: 510,
            flex: '0 0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 18, height: 18, backgroundColor: category.color, borderRadius: '50%', boxShadow: '0 1px 4px 0 rgba(60,72,88,0.10)' }} />
                <Box>
                  <Typography variant="h6" fontWeight={700} color="#2d3748">{category.name}</Typography>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 0.5 }}>
                    <Typography variant="body2" color="text.secondary" fontWeight={500}>
                      割当:{categoryTaskMap[category.id]?.length ?? 0}
                    </Typography>
                    <Typography variant="body2" color="success.main" fontWeight={500}>
                      完了:{categoryTaskMap[category.id]?.filter(task => task.completed).length ?? 0}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <IconButton
                  size="small"
                  onClick={() => handleEdit(category)}
                  sx={{
                    p: 0.5,
                    borderRadius: 50,
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
                    borderRadius: 50,
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
            {/* 未完了タスク */}
            <Box sx={{ mb: (categoryTaskMap[category.id]?.filter(task => task.completed).length ?? 0) > 0 ? 2 : 0, width: '100%' }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600, mb: 1 }}>
                未完了
              </Typography>
              {categoryTaskMap[category.id]?.filter(task => !task.completed).length > 0 ? (
                categoryTaskMap[category.id].filter(task => !task.completed).map((task) => (
                  <TaskItem key={task.id} task={task} />
                ))
              ) : (
                <Typography variant="body2" color="#b0b8c1" sx={{ pl: 2, fontStyle: 'italic' }}>
                  タスクがありません
                </Typography>
              )}
            </Box>
            {/* 完了タスク */}
            <Box sx={{ width: '100%' }}>
              <Typography variant="subtitle2" color="success.main" sx={{ fontWeight: 600, mb: 1 }}>
                完了
              </Typography>
              {categoryTaskMap[category.id]?.filter(task => task.completed).length > 0 ? (
                categoryTaskMap[category.id].filter(task => task.completed).map((task) => (
                  <TaskItem key={task.id} task={task} />
                ))
              ) : (
                <Typography variant="body2" color="#b0b8c1" sx={{ pl: 2, fontStyle: 'italic' }}>
                  完了タスクはありません
                </Typography>
              )}
            </Box>
          </Box>
        );
      })}
      {/* 分類なしタスク */}
      {noCategoryTasks.length > 0 && (
        <Box sx={{ width: 510, minWidth: 510, maxWidth: 510, flex: '0 0 auto' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Box sx={{ width: 16, height: 16, backgroundColor: 'grey.400', borderRadius: '50%' }} />
            <Typography variant="h6" fontWeight={600}>分類なし</Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', ml: 'auto' }}>
              <Typography variant="body2" color="text.secondary">
                割当:{noCategoryTasks.length}
              </Typography>
              <Typography variant="body2" color="success.main">
                完了:{noCategoryCompleted.length}
              </Typography>
            </Box>
          </Box>
          {/* 分類なし未完了タスク */}
          {noCategoryIncomplete.length > 0 && (
            <Box sx={{ mb: noCategoryCompleted.length > 0 ? 2 : 0, width: '100%' }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600, mb: 1 }}>
                未完了
              </Typography>
              {noCategoryIncomplete.map((task) => (
                <TaskItem key={task.id} task={task} />
              ))}
            </Box>
          )}
          {/* 分類なし完了タスク */}
          {noCategoryCompleted.length > 0 && (
            <Box sx={{ width: '100%' }}>
              <Typography variant="subtitle2" color="success.main" sx={{ fontWeight: 600, mb: 1 }}>
                完了
              </Typography>
              {noCategoryCompleted.map((task) => (
                <TaskItem key={task.id} task={task} />
              ))}
            </Box>
          )}
        </Box>
      )}
      {/* 分類編集ダイアログ */}
      <Dialog open={!!editingCategory} onClose={handleCancel} maxWidth="sm" fullWidth>
        <DialogTitle>分類を編集</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="分類名"
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
        <DialogActions>
          <Button 
            onClick={handleCancel}
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
            onClick={handleSave} 
            variant="contained" 
            disabled={!editName.trim()}
            sx={{
              px: 4,
              py: 1.2,
              fontWeight: 700,
              background: editName.trim() 
                ? 'linear-gradient(90deg, #1976d2 60%, #1565c0 100%)'
                : '#e5e7eb',
              color: editName.trim() ? '#fff' : '#9ca3af',
              '&:hover': {
                background: editName.trim()
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
            保存
          </Button>
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
    </Box>
  );
};

export default TaskList; 
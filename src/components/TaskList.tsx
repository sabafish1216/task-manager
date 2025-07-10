import React, { useState, useMemo, useCallback } from 'react';
import { Box, IconButton } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import TaskItem from './TaskItem';
import { Priority } from '../types/task';
import { updateCategory, deleteCategory } from '../store/categorySlice';
import { deleteTask } from '../store/taskSlice';
import { Edit, Delete } from '@mui/icons-material';
import ColorWarningDialog from './ColorWarningDialog';
import { findSimilarColors } from '../utils/colorUtils';
import { Category } from '../types/category';
import CustomTypography from '../custom_props/CustomTypography';
import CategoryEditDialog from './CategoryEditDialog';

/**
 * タスクリストコンポーネント
 * カテゴリ別にタスクを表示・管理する
 */
const TaskList: React.FC = () => {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector((state) => state.tasks.tasks);
  const categories = useAppSelector((state) => state.categories.categories);
 
  // カテゴリ編集状態
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  const [pendingColor, setPendingColor] = useState('');

  // 優先度の順序を定義（数値が大きいほど優先度が高い）
  const priorityOrder: Record<Priority, number> = useMemo(() => ({
    urgent: 4,
    high: 3,
    medium: 2,
    low: 1,
  }), []);

  /**
   * タスクをソートする関数（useCallbackでメモ化）
   * @param taskList - ソート対象のタスクリスト
   * @returns ソートされたタスクリスト
   */
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

  /**
   * カテゴリ編集開始処理
   * @param category - 編集するカテゴリ
   */
  const handleEdit = useCallback((category: Category) => {
    setEditingCategory(category);
  }, []);

  /**
   * カテゴリ編集ダイアログを閉じる処理
   */
  const handleCloseEdit = useCallback(() => {
    setEditingCategory(null);
  }, []);

  /**
   * カテゴリ保存処理
   * @param updatedCategory - 更新されたカテゴリ
   */
  const handleSaveCategory = useCallback((updatedCategory: Category) => {
    const existingColors = categories
      .filter(cat => cat.id !== updatedCategory.id)
      .map(cat => cat.color);
    const similarColors = findSimilarColors(updatedCategory.color, existingColors);
    
    if (similarColors.length > 0) {
      setPendingColor(updatedCategory.color);
      setShowWarning(true);
    } else {
      dispatch(updateCategory({
        id: updatedCategory.id,
        updates: {
          name: updatedCategory.name,
          color: updatedCategory.color,
        },
      }));
      setEditingCategory(null);
    }
  }, [dispatch, categories]);

  /**
   * 警告ダイアログ確認処理
   */
  const handleWarningConfirm = useCallback(() => {
    if (editingCategory && pendingColor) {
      dispatch(updateCategory({
        id: editingCategory.id,
        updates: {
          name: editingCategory.name,
          color: pendingColor,
        },
      }));
      setEditingCategory(null);
    }
    setShowWarning(false);
  }, [dispatch, editingCategory, pendingColor]);

  /**
   * 警告ダイアログキャンセル処理
   */
  const handleWarningCancel = useCallback(() => {
    setShowWarning(false);
  }, []);

  /**
   * カテゴリ削除処理
   * @param categoryId - 削除するカテゴリのID
   */
  const handleDelete = useCallback((categoryId: string) => {
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
  }, [dispatch, tasks]);

  return (
    <Box sx={{ display: 'flex', gap: 10, overflowX: 'auto', pb: 2, mb: 4 }}>
      {categories.map((category) => {
        return (
          <Box key={category.id} sx={{
            width: 540,
            minWidth: 540,
            maxWidth: 540,
            flex: '0 0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 18, height: 18, backgroundColor: category.color, borderRadius: '50%', boxShadow: '0 1px 4px 0 rgba(60,72,88,0.10)' }} />
                <Box>
                  <CustomTypography variant="h6" size="large" sx={{ fontWeight: 700, color: '#2d3748' }}>
                    {category.name}
                  </CustomTypography>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 0.5 }}>
                    <CustomTypography variant="body2" color="muted" sx={{ fontWeight: 500 }}>
                      割当:{categoryTaskMap[category.id]?.length ?? 0}
                    </CustomTypography>
                    <CustomTypography variant="body2" color="success" sx={{ fontWeight: 500 }}>
                      完了:{categoryTaskMap[category.id]?.filter(task => task.completed).length ?? 0}
                    </CustomTypography>
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
              <CustomTypography variant="subtitle2" color="muted" sx={{ fontWeight: 600, mb: 1 }}>
                未完了
              </CustomTypography>
              {categoryTaskMap[category.id]?.filter(task => !task.completed).length > 0 ? (
                categoryTaskMap[category.id].filter(task => !task.completed).map((task) => (
                  <TaskItem key={task.id} task={task} />
                ))
              ) : (
                <CustomTypography variant="body2" color="muted" sx={{ pl: 2, fontStyle: 'italic' }}>
                  タスクがありません
                </CustomTypography>
              )}
            </Box>
            
            {/* 完了タスク */}
            <Box sx={{ width: '100%' }}>
              <CustomTypography variant="subtitle2" color="success" sx={{ fontWeight: 600, mb: 1 }}>
                完了
              </CustomTypography>
              {categoryTaskMap[category.id]?.filter(task => task.completed).length > 0 ? (
                categoryTaskMap[category.id].filter(task => task.completed).map((task) => (
                  <TaskItem key={task.id} task={task} />
                ))
              ) : (
                <CustomTypography variant="body2" color="muted" sx={{ pl: 2, fontStyle: 'italic' }}>
                  完了タスクはありません
                </CustomTypography>
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
            <CustomTypography variant="h6" size="large" sx={{ fontWeight: 600 }}>
              分類なし
            </CustomTypography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', ml: 'auto' }}>
              <CustomTypography variant="body2" color="muted">
                割当:{noCategoryTasks.length}
              </CustomTypography>
              <CustomTypography variant="body2" color="success">
                完了:{noCategoryCompleted.length}
              </CustomTypography>
            </Box>
          </Box>
          
          {/* 分類なし未完了タスク */}
          {noCategoryIncomplete.length > 0 && (
            <Box sx={{ mb: noCategoryCompleted.length > 0 ? 2 : 0, width: '100%' }}>
              <CustomTypography variant="subtitle2" color="muted" sx={{ fontWeight: 600, mb: 1 }}>
                未完了
              </CustomTypography>
              {noCategoryIncomplete.map((task) => (
                <TaskItem key={task.id} task={task} />
              ))}
            </Box>
          )}
          
          {/* 分類なし完了タスク */}
          {noCategoryCompleted.length > 0 && (
            <Box sx={{ width: '100%' }}>
              <CustomTypography variant="subtitle2" color="success" sx={{ fontWeight: 600, mb: 1 }}>
                完了
              </CustomTypography>
              {noCategoryCompleted.map((task) => (
                <TaskItem key={task.id} task={task} />
              ))}
            </Box>
          )}
        </Box>
      )}
      
      {/* カテゴリ編集ダイアログ */}
      {editingCategory && (
        <CategoryEditDialog
          category={editingCategory}
          open={!!editingCategory}
          onClose={handleCloseEdit}
          onSave={handleSaveCategory}
        />
      )}
      
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
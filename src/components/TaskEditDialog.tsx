import React, { useState } from 'react';
import {
  Box,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Checkbox,
} from '@mui/material';
import { Add, Delete, Edit, Save, Cancel } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { updateTask } from '../store/taskSlice';
import { Task, Priority, Subtask } from '../types/task';
import CustomButton from '../custom_props/CustomButton';
import CustomTextField from '../custom_props/CustomTextField';
import CustomFormControl from '../custom_props/CustomFormControl';
import CustomTypography from '../custom_props/CustomTypography';
import { COMMON_STYLES } from '../custom_props/styles';

interface TaskEditDialogProps {
  task: Task;
  open: boolean;
  onClose: () => void;
}

/**
 * タスク編集ダイアログコンポーネント
 * タスクの編集とサブタスク管理を行う
 * @param task - 編集するタスク
 * @param open - ダイアログの表示状態
 * @param onClose - ダイアログを閉じるコールバック
 */
const TaskEditDialog: React.FC<TaskEditDialogProps> = ({ task, open, onClose }) => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.categories.categories);
  
  // 編集状態
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description);
  const [editCategoryId, setEditCategoryId] = useState(task.categoryId || '');
  const [editPriority, setEditPriority] = useState<Priority>(task.priority);
  
  // サブタスク編集状態
  const [editSubtasks, setEditSubtasks] = useState<Subtask[]>(task.subtasks || []);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [editingSubtaskId, setEditingSubtaskId] = useState<string | null>(null);
  const [editingSubtaskTitle, setEditingSubtaskTitle] = useState('');

  /**
   * 編集保存処理
   */
  const handleSave = () => {
    if (editTitle.trim()) {
      dispatch(updateTask({
        id: task.id,
        updates: {
          title: editTitle.trim(),
          description: editDescription.trim(),
          categoryId: editCategoryId || null,
          priority: editPriority,
          subtasks: editSubtasks,
        },
      }));
      onClose();
      resetEditForm();
    }
  };

  /**
   * 編集キャンセル処理
   */
  const handleCancel = () => {
    setEditTitle(task.title);
    setEditDescription(task.description);
    setEditCategoryId(task.categoryId || '');
    setEditPriority(task.priority);
    setEditSubtasks(task.subtasks || []);
    resetEditForm();
    onClose();
  };

  /**
   * 編集フォーム状態をリセット
   */
  const resetEditForm = () => {
    setNewSubtaskTitle('');
    setEditingSubtaskId(null);
    setEditingSubtaskTitle('');
  };

  /**
   * サブタスク追加処理
   */
  const handleAddSubtask = () => {
    if (newSubtaskTitle.trim()) {
      const newSubtask: Subtask = {
        id: Date.now().toString(),
        title: newSubtaskTitle.trim(),
        completed: false,
      };
      setEditSubtasks([...editSubtasks, newSubtask]);
      setNewSubtaskTitle('');
    }
  };

  /**
   * サブタスク削除処理
   * @param subtaskId - 削除するサブタスクのID
   */
  const handleDeleteSubtask = (subtaskId: string) => {
    setEditSubtasks(editSubtasks.filter(st => st.id !== subtaskId));
  };

  /**
   * 編集モード内サブタスク完了状態切り替え処理
   * @param subtaskId - 切り替えるサブタスクのID
   */
  const handleToggleEditSubtaskComplete = (subtaskId: string) => {
    setEditSubtasks(editSubtasks.map(st => 
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    ));
  };

  /**
   * サブタスク編集開始処理
   * @param subtask - 編集するサブタスク
   */
  const handleStartEditSubtask = (subtask: Subtask) => {
    setEditingSubtaskId(subtask.id);
    setEditingSubtaskTitle(subtask.title);
  };

  /**
   * サブタスク編集保存処理
   */
  const handleSaveEditSubtask = () => {
    if (editingSubtaskTitle.trim() && editingSubtaskId) {
      setEditSubtasks(editSubtasks.map(st => 
        st.id === editingSubtaskId 
          ? { ...st, title: editingSubtaskTitle.trim() }
          : st
      ));
      setEditingSubtaskId(null);
      setEditingSubtaskTitle('');
    }
  };

  /**
   * サブタスク編集キャンセル処理
   */
  const handleCancelEditSubtask = () => {
    setEditingSubtaskId(null);
    setEditingSubtaskTitle('');
  };

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="sm" fullWidth>
      <DialogTitle sx={COMMON_STYLES.dialog.title}>
        タスクを編集
      </DialogTitle>
      
      <DialogContent sx={{ p: 4, ...COMMON_STYLES.dialog.content }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, mt: 2 }}>
          {/* タスク名入力 */}
          <CustomTextField
            label="タスク名"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            fullWidth
            required
          />
          
          {/* 説明入力 */}
          <CustomTextField
            label="説明"
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            multiline
            rows={3}
            fullWidth
          />
          
          {/* 優先度選択 */}
          <CustomFormControl>
            <InputLabel>優先度</InputLabel>
            <Select
              value={editPriority}
              label="優先度"
              onChange={(e) => setEditPriority(e.target.value as Priority)}
            >
              <MenuItem value="urgent">緊急</MenuItem>
              <MenuItem value="high">高</MenuItem>
              <MenuItem value="medium">中</MenuItem>
              <MenuItem value="low">低</MenuItem>
            </Select>
          </CustomFormControl>
          
          {/* カテゴリ選択 */}
          <CustomFormControl>
            <InputLabel>分類</InputLabel>
            <Select
              value={editCategoryId}
              label="分類"
              onChange={(e) => setEditCategoryId(e.target.value)}
            >
              <MenuItem value="">
                <em>分類なし</em>
              </MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 16,
                        height: 16,
                        backgroundColor: category.color,
                        borderRadius: '50%',
                      }}
                    />
                    {category.name}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </CustomFormControl>

          {/* サブタスク管理セクション */}
          <Box sx={{ mt: 2 }}>
            <CustomTypography variant="h6" size="large" color="primary" sx={{ mb: 2, fontWeight: 700 }}>
              サブタスク
            </CustomTypography>
            
            {/* サブタスク追加フォーム */}
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 2 }}>
              <CustomTextField
                label="サブタスク名"
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                size="small"
                fullWidth
              />
              <IconButton
                onClick={handleAddSubtask}
                disabled={!newSubtaskTitle.trim()}
                size="small"
                sx={{
                  borderRadius: 2,
                  background: newSubtaskTitle.trim()
                    ? 'linear-gradient(90deg, #1976d2 60%, #1565c0 100%)'
                    : '#e5e7eb',
                  color: newSubtaskTitle.trim() ? '#fff' : '#9ca3af',
                  '&:hover': {
                    background: newSubtaskTitle.trim()
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
                <Add fontSize="small" />
              </IconButton>
            </Box>

            {/* サブタスク一覧 */}
            {editSubtasks.length > 0 && (
              <Box sx={{ mt: 2 }}>
                {editSubtasks.map((subtask) => (
                  <Box key={subtask.id} sx={{ display: 'flex', alignItems: 'center', mb: 1, p: 1, backgroundColor: '#f8fafc', borderRadius: 1 }}>
                    <Checkbox
                      checked={subtask.completed}
                      onChange={() => handleToggleEditSubtaskComplete(subtask.id)}
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    {editingSubtaskId === subtask.id ? (
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexGrow: 1 }}>
                        <CustomTextField
                          value={editingSubtaskTitle}
                          onChange={(e) => setEditingSubtaskTitle(e.target.value)}
                          size="small"
                          fullWidth
                        />
                        <IconButton
                          onClick={handleSaveEditSubtask}
                          size="small"
                          sx={{
                            borderRadius: 50,
                            '&:hover': {
                              background: 'rgba(76, 175, 80, 0.08)',
                              color: '#4caf50',
                            },
                          }}
                        >
                          <Save fontSize="small" />
                        </IconButton>
                        <IconButton
                          onClick={handleCancelEditSubtask}
                          size="small"
                          sx={{
                            borderRadius: 50,
                            '&:hover': {
                              background: 'rgba(158, 158, 158, 0.08)',
                              color: '#9e9e9e',
                            },
                          }}
                        >
                          <Cancel fontSize="small" />
                        </IconButton>
                      </Box>
                    ) : (
                      <>
                        <CustomTypography
                          color={subtask.completed ? 'muted' : 'text'}
                          sx={{
                            textDecoration: subtask.completed ? 'line-through' : 'none',
                            flexGrow: 1,
                          }}
                        >
                          {subtask.title}
                        </CustomTypography>
                        <IconButton
                          onClick={() => handleStartEditSubtask(subtask)}
                          size="small"
                          sx={{
                            borderRadius: 50,
                            mr: 1,
                            '&:hover': {
                              background: 'rgba(25, 118, 210, 0.08)',
                              color: '#1976d2',
                            },
                          }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteSubtask(subtask.id)}
                          size="small"
                          color="error"
                          sx={{
                            borderRadius: 50,
                            '&:hover': {
                              background: 'rgba(244, 67, 54, 0.08)',
                              color: '#d32f2f',
                            },
                          }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </>
                    )}
                  </Box>
                ))}
              </Box>
            )}
          </Box>
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
          disabled={!editTitle.trim()} 
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

export default TaskEditDialog; 
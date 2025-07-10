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
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Cancel, Add } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { addTask } from '../store/taskSlice';
import { Priority, Subtask } from '../types/task';
import CustomButton from '../custom_props/CustomButton';
import CustomTextField from '../custom_props/CustomTextField';
import CustomFormControl from '../custom_props/CustomFormControl';

import SubtaskManager from './SubtaskManager';
import { COMMON_STYLES } from '../custom_props/styles';

/**
 * タスク追加コンポーネント
 * 新しいタスクとサブタスクを作成・管理する
 */
const AddTask: React.FC = () => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.categories.categories);
  
  // フォーム状態
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [open, setOpen] = useState(false);
  
  // サブタスク状態
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);

  /**
   * タスク追加処理
   * @param e - フォームイベント
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      dispatch(addTask({
        title: title.trim(),
        description: description.trim(),
        categoryId: categoryId || null,
        priority,
        completed: false,
        subtasks,
      }));
      resetForm();
    }
  };

  /**
   * フォームキャンセル処理
   */
  const handleCancel = () => {
    resetForm();
  };

  /**
   * フォーム状態をリセット
   */
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategoryId('');
    setPriority('medium');
    setSubtasks([]);
    setOpen(false);
  };

  return (
    <>
      <CustomButton
        variant="contained"
        color="primary"
        size="large"
        startIcon={<AddCircleIcon />}
        onClick={() => setOpen(true)}
        sx={{ mb: 2 }}
      >
        タスク追加
      </CustomButton>
      
      <Dialog open={open} onClose={handleCancel} maxWidth="sm" fullWidth>
        <DialogTitle sx={COMMON_STYLES.dialog.title}>
          新しいタスクを追加
        </DialogTitle>
        
        <DialogContent sx={{ p: 4, ...COMMON_STYLES.dialog.content }}>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 4, mt: 2 }}>
            {/* タスク名入力 */}
            <CustomTextField
              label="タスク名"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              fullWidth
            />
            
            {/* 説明入力 */}
            <CustomTextField
              label="説明（任意）"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={4}
              fullWidth
            />
            
            {/* カテゴリ選択 */}
            <CustomFormControl>
              <InputLabel>カテゴリ</InputLabel>
              <Select
                value={categoryId}
                label="カテゴリ"
                onChange={(e) => setCategoryId(e.target.value)}
              >
                <MenuItem value="">
                  <em>カテゴリなし</em>
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
            
            {/* 優先度選択 */}
            <CustomFormControl>
              <InputLabel>優先度</InputLabel>
              <Select
                value={priority}
                label="優先度"
                onChange={(e) => setPriority(e.target.value as Priority)}
              >
                <MenuItem value="urgent">緊急</MenuItem>
                <MenuItem value="high">高</MenuItem>
                <MenuItem value="medium">中</MenuItem>
                <MenuItem value="low">低</MenuItem>
              </Select>
            </CustomFormControl>

            {/* サブタスク管理 */}
            <SubtaskManager
              subtasks={subtasks}
              onSubtasksChange={setSubtasks}
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
            onClick={handleSubmit} 
            variant="contained" 
            disabled={!title.trim()} 
            startIcon={<Add />}
            color="primary"
            size="medium"
          >
            追加
          </CustomButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddTask; 
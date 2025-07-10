import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { addTask } from '../store/taskSlice';
import { Priority } from '../types/task';

const AddTask: React.FC = () => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.categories.categories);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      dispatch(addTask({
        title: title.trim(),
        description: description.trim(),
        categoryId: categoryId || null,
        priority,
        completed: false,
      }));
      setTitle('');
      setDescription('');
      setCategoryId('');
      setPriority('medium');
      setOpen(false);
    }
  };

  const handleCancel = () => {
    setTitle('');
    setDescription('');
    setCategoryId('');
    setPriority('medium');
    setOpen(false);
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
        ＋タスク追加
      </Button>
      <Dialog open={open} onClose={handleCancel} maxWidth="sm" fullWidth>
        <DialogTitle>新しいタスクを追加</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
            <TextField
              label="タスク名"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              fullWidth
              variant="outlined"
              sx={{ background: '#f8fafc', borderRadius: 2 }}
            />
            <TextField
              label="説明（任意）"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={3}
              fullWidth
              variant="outlined"
              sx={{ background: '#f8fafc', borderRadius: 2 }}
            />
            <FormControl fullWidth sx={{ background: '#fff', borderRadius: 2 }}>
              <InputLabel>分類</InputLabel>
              <Select
                value={categoryId}
                label="分類"
                onChange={(e) => setCategoryId(e.target.value)}
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
            </FormControl>
            <FormControl fullWidth sx={{ background: '#fff', borderRadius: 2 }}>
              <InputLabel>優先度</InputLabel>
              <Select
                value={priority}
                label="優先度"
                onChange={(e) => setPriority(e.target.value as Priority)}
              >
                <MenuItem value="urgent">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 12, height: 12, backgroundColor: '#ef4444', borderRadius: '50%' }} />
                    緊急
                  </Box>
                </MenuItem>
                <MenuItem value="high">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 12, height: 12, backgroundColor: '#f97316', borderRadius: '50%' }} />
                    高
                  </Box>
                </MenuItem>
                <MenuItem value="medium">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 12, height: 12, backgroundColor: '#eab308', borderRadius: '50%' }} />
                    中
                  </Box>
                </MenuItem>
                <MenuItem value="low">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 12, height: 12, backgroundColor: '#22c55e', borderRadius: '50%' }} />
                    低
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>
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
            onClick={handleSubmit}
            variant="contained"
            disabled={!title.trim()}
            sx={{
              px: 4,
              py: 1.2,
              fontWeight: 700,
              fontSize: '1rem',
              background: title.trim() 
                ? 'linear-gradient(90deg, #1976d2 60%, #1565c0 100%)'
                : '#e5e7eb',
              color: title.trim() ? '#fff' : '#9ca3af',
              '&:hover': {
                background: title.trim()
                  ? 'linear-gradient(90deg, #1565c0 60%, #1976d2 100%)'
                  : '#e5e7eb',
              },
              '&:disabled': {
                background: '#e5e7eb',
                color: '#9ca3af',
                boxShadow: 'none',
                transform: 'none',
              },
            }}
          >
            タスクを追加
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddTask; 
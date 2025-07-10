import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Checkbox,
  IconButton,
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
import { Delete, Edit, Save, Cancel, PriorityHigh, TrendingUp, Remove, TrendingDown, ExpandMore, ExpandLess } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { updateTask, deleteTask, toggleTaskComplete } from '../store/taskSlice';
import { Task, Priority } from '../types/task';
import { grey } from '@mui/material/colors';

interface TaskItemProps {
  task: Task;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.categories.categories);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description);
  const [editCategoryId, setEditCategoryId] = useState(task.categoryId || '');
  const [editPriority, setEditPriority] = useState<Priority>(task.priority);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleComplete = () => {
    dispatch(toggleTaskComplete(task.id));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editTitle.trim()) {
      dispatch(updateTask({
        id: task.id,
        updates: {
          title: editTitle.trim(),
          description: editDescription.trim(),
          categoryId: editCategoryId || null,
          priority: editPriority,
        },
      }));
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditDescription(task.description);
    setEditCategoryId(task.categoryId || '');
    setEditPriority(task.priority);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('このタスクを削除しますか？')) {
      dispatch(deleteTask(task.id));
    }
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'urgent': return '#ef4444';
      case 'high': return '#f97316';
      case 'medium': return '#eab308';
      case 'low': return '#22c55e';
      default: return '#eab308';
    }
  };

  const getPriorityLabel = (priority: Priority) => {
    switch (priority) {
      case 'urgent': return '緊急';
      case 'high': return '高';
      case 'medium': return '中';
      case 'low': return '低';
      default: return '中';
    }
  };

  const getPriorityIcon = (priority: Priority) => {
    switch (priority) {
      case 'urgent': return <PriorityHigh fontSize="small" />;
      case 'high': return <TrendingUp fontSize="small" />;
      case 'medium': return <Remove fontSize="small" />;
      case 'low': return <TrendingDown fontSize="small" />;
      default: return <Remove fontSize="small" />;
    }
  };

  return (
    <Card
      elevation={3}
      sx={{
        mb: 2,
        border: 'none',
        borderRadius: 3,
        boxShadow: '0 4px 16px 0 rgba(60,72,88,0.10)',
        background: '#f8fafc',
        transition: 'box-shadow 0.2s',
        '&:hover': {
          boxShadow: '0 8px 32px 0 rgba(60,72,88,0.18)',
        },
        width: '100%',
        display: 'flex',
        alignItems: 'stretch',
      }}
    >
      <CardContent sx={{ p: 3, width: '100%', flex: 1, display: 'block' }}>
        {/* 編集モーダル */}
        <Dialog open={isEditing} onClose={handleCancel} maxWidth="sm" fullWidth>
          <DialogTitle>タスクを編集</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField
                label="タスク名"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                fullWidth
                required
              />
              <TextField
                label="説明"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                multiline
                rows={2}
                fullWidth
              />
              <FormControl fullWidth>
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
              </FormControl>
              <FormControl fullWidth>
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
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={handleCancel} 
              startIcon={<Cancel />}
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
              disabled={!editTitle.trim()} 
              startIcon={<Save />}
              sx={{
                px: 4,
                py: 1.2,
                fontWeight: 700,
                background: editTitle.trim() 
                  ? 'linear-gradient(90deg, #1976d2 60%, #1565c0 100%)'
                  : '#e5e7eb',
                color: editTitle.trim() ? '#fff' : '#9ca3af',
                '&:hover': {
                  background: editTitle.trim()
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
        {/* 通常表示 */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, width: '100%', position: 'relative' }}>
            <Checkbox
              checked={task.completed}
              onChange={handleToggleComplete}
              color="primary"
              sx={{
                mt: 0.5,
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.08)',
                  borderRadius: 50,
                },
              }}
            />
            <Box sx={{ flexGrow: 1, minWidth: 0, display: 'flex', flexDirection: 'column', height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, minWidth: 0 }}>
                <Typography
                  variant="body1"
                  sx={{
                    color: task.completed ? grey[400] : '#2d3748',
                    fontWeight: 600,
                    textDecoration: task.completed ? 'line-through' : 'none',
                    fontSize: '1.1rem',
                    letterSpacing: 0.5,
                    mb: 0.5,
                  }}
                >
                  {task.title}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 2 }}>
                  <Box sx={{ color: getPriorityColor(task.priority), display: 'flex', alignItems: 'center' }}>
                    {getPriorityIcon(task.priority)}
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 700,
                      color: getPriorityColor(task.priority),
                      letterSpacing: 0.5,
                      whiteSpace: 'nowrap',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {getPriorityLabel(task.priority)}
                  </Typography>
                </Box>
              </Box>
              {task.description && (
                <Typography variant="body2" color="text.secondary" sx={{
                  mt: 1,
                  overflow: isExpanded ? 'visible' : 'hidden',
                  textOverflow: isExpanded ? 'clip' : 'ellipsis',
                  whiteSpace: isExpanded ? 'normal' : 'nowrap',
                  width: '100%',
                  display: 'block',
                  fontWeight: 500,
                  color: '#4b5563',
                  wordBreak: 'break-word',
                }}>
                  {task.description}
                </Typography>
              )}
              <Box sx={{ flexGrow: 1 }} />
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 'auto', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#64748b', fontWeight: 500 }}>
                作成日: {new Date(task.createdAt).toLocaleDateString('ja-JP')}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
              <IconButton onClick={handleEdit} size="small" sx={{
                borderRadius: 50,
                transition: 'background 0.2s',
                '&:hover': {
                  background: 'rgba(25, 118, 210, 0.08)',
                  color: '#1976d2',
                },
              }}>
                <Edit />
              </IconButton>
              <IconButton onClick={handleDelete} size="small" color="error" sx={{
                borderRadius: 50,
                transition: 'background 0.2s',
                '&:hover': {
                  background: 'rgba(244, 67, 54, 0.08)',
                  color: '#d32f2f',
                },
              }}>
                <Delete />
              </IconButton>
            </Box>
            {/* 展開ボタンを右下に配置 */}
            <IconButton 
              onClick={() => setIsExpanded(!isExpanded)} 
              size="small" 
              sx={{
                position: 'absolute',
                bottom: 8,
                right: 8,
                borderRadius: 50,
                transition: 'background 0.2s',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(4px)',
                '&:hover': {
                  background: 'rgba(25, 118, 210, 0.08)',
                  color: '#1976d2',
                },
              }}
            >
              {isExpanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Box>
      </CardContent>
    </Card>
  );
};

export default TaskItem; 
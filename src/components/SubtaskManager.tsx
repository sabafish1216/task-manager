import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Checkbox,
} from '@mui/material';
import { Add, Delete, Edit, Save, Cancel } from '@mui/icons-material';
import { Subtask } from '../types/task';
import CustomTextField from '../custom_props/CustomTextField';
import CustomTypography from '../custom_props/CustomTypography';

interface SubtaskManagerProps {
  subtasks: Subtask[];
  onSubtasksChange: (subtasks: Subtask[]) => void;
}

/**
 * サブタスク管理コンポーネント
 * サブタスクの追加・編集・削除・完了切り替えを行う
 * @param subtasks - サブタスクの配列
 * @param onSubtasksChange - サブタスク変更時のコールバック
 */
const SubtaskManager: React.FC<SubtaskManagerProps> = ({ subtasks, onSubtasksChange }) => {
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [editingSubtaskId, setEditingSubtaskId] = useState<string | null>(null);
  const [editingSubtaskTitle, setEditingSubtaskTitle] = useState('');

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
      onSubtasksChange([...subtasks, newSubtask]);
      setNewSubtaskTitle('');
    }
  };

  /**
   * サブタスク削除処理
   * @param subtaskId - 削除するサブタスクのID
   */
  const handleDeleteSubtask = (subtaskId: string) => {
    onSubtasksChange(subtasks.filter(st => st.id !== subtaskId));
  };

  /**
   * サブタスク完了状態切り替え処理
   * @param subtaskId - 切り替えるサブタスクのID
   */
  const handleToggleSubtaskComplete = (subtaskId: string) => {
    onSubtasksChange(subtasks.map(st => 
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
      onSubtasksChange(subtasks.map(st => 
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
      {subtasks.length > 0 && (
        <Box sx={{ mt: 2 }}>
          {subtasks.map((subtask) => (
            <Box key={subtask.id} sx={{ display: 'flex', alignItems: 'center', mb: 1, p: 1, backgroundColor: '#f8fafc', borderRadius: 1 }}>
              <Checkbox
                checked={subtask.completed}
                onChange={() => handleToggleSubtaskComplete(subtask.id)}
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
  );
};

export default SubtaskManager; 
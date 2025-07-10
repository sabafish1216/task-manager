import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Checkbox,
  IconButton,
  Box,
} from '@mui/material';
import { Delete, Edit, PriorityHigh, TrendingUp, Remove, TrendingDown, ExpandMore, ExpandLess } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { deleteTask, toggleTaskComplete, toggleSubtaskComplete } from '../store/taskSlice';
import { Task, Priority } from '../types/task';
import CustomTypography from '../custom_props/CustomTypography';
import TaskEditDialog from './TaskEditDialog';

interface TaskItemProps {
  task: Task;
}

/**
 * タスクアイテムコンポーネント
 * タスクの表示、編集、削除、サブタスク完了切り替えを行う
 * @param task - 表示・編集するタスク
 */
const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.categories.categories);
  
  // 状態管理
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  /**
   * タスク完了状態切り替え処理
   */
  const handleToggleComplete = () => {
    dispatch(toggleTaskComplete(task.id));
  };

  /**
   * 編集モード開始処理
   */
  const handleEdit = () => {
    setIsEditing(true);
  };

  /**
   * 編集ダイアログを閉じる処理
   */
  const handleCloseEdit = () => {
    setIsEditing(false);
  };

  /**
   * タスク削除処理
   */
  const handleDelete = () => {
    if (window.confirm('このタスクを削除しますか？')) {
      dispatch(deleteTask(task.id));
    }
  };

  /**
   * サブタスク完了状態切り替え処理
   * @param subtaskId - 切り替えるサブタスクのID
   */
  const handleToggleSubtaskComplete = (subtaskId: string) => {
    dispatch(toggleSubtaskComplete({ taskId: task.id, subtaskId }));
  };

  /**
   * 優先度に応じた色を取得
   * @param priority - 優先度
   * @returns 色コード
   */
  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'urgent': return '#ef4444';
      case 'high': return '#f97316';
      case 'medium': return '#eab308';
      case 'low': return '#22c55e';
      default: return '#6b7280';
    }
  };

  /**
   * 優先度に応じたラベルを取得
   * @param priority - 優先度
   * @returns ラベル文字列
   */
  const getPriorityLabel = (priority: Priority) => {
    switch (priority) {
      case 'urgent': return '緊急';
      case 'high': return '高';
      case 'medium': return '中';
      case 'low': return '低';
      default: return '未設定';
    }
  };

  /**
   * 優先度に応じたアイコンを取得
   * @param priority - 優先度
   * @returns アイコンコンポーネント
   */
  const getPriorityIcon = (priority: Priority) => {
    switch (priority) {
      case 'urgent': return <PriorityHigh />;
      case 'high': return <TrendingUp />;
      case 'medium': return <Remove />;
      case 'low': return <TrendingDown />;
      default: return <Remove />;
    }
  };

  // カテゴリ情報を取得
  const category = categories.find(cat => cat.id === task.categoryId);
  
  // サブタスクの完了数を計算
  const completedSubtasks = task.subtasks?.filter(st => st.completed).length || 0;
  const totalSubtasks = task.subtasks?.length || 0;

  return (
    <>
      <Card 
        sx={{ 
          mb: 2, 
          border: '1px solid #e5e7eb',
          borderRadius: 3,
          boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1)',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
            transform: 'translateY(-1px)',
          },
        }}
      >
        <CardContent sx={{ p: 3 }}>
          {/* メインタスク情報 */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            {/* 完了チェックボックス */}
            <Checkbox
              checked={task.completed}
              onChange={handleToggleComplete}
              sx={{
                color: '#d1d5db',
                '&.Mui-checked': {
                  color: '#10b981',
                },
                mt: 0.5,
              }}
            />
            
            {/* タスク内容 */}
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              {/* タスク名 */}
              <CustomTypography
                variant="h6"
                size="medium"
                color={task.completed ? 'muted' : 'text'}
                sx={{
                  textDecoration: task.completed ? 'line-through' : 'none',
                  fontWeight: 600,
                  mb: 1,
                }}
              >
                {task.title}
              </CustomTypography>
              
              {/* 説明 */}
              {task.description && (
                <CustomTypography
                  color={task.completed ? 'muted' : 'text'}
                  sx={{
                    textDecoration: task.completed ? 'line-through' : 'none',
                    mb: 2,
                    lineHeight: 1.5,
                  }}
                >
                  {task.description}
                </CustomTypography>
              )}
              
              {/* メタ情報 */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                {/* 優先度 */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box sx={{ color: getPriorityColor(task.priority) }}>
                    {getPriorityIcon(task.priority)}
                  </Box>
                  <CustomTypography
                    size="small"
                    color="muted"
                    sx={{ fontWeight: 500 }}
                  >
                    {getPriorityLabel(task.priority)}
                  </CustomTypography>
                </Box>
                
                {/* カテゴリ */}
                {category && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        backgroundColor: category.color,
                        borderRadius: '50%',
                      }}
                    />
                    <CustomTypography
                      size="small"
                      color="muted"
                      sx={{ fontWeight: 500 }}
                    >
                      {category.name}
                    </CustomTypography>
                  </Box>
                )}
                
                {/* サブタスク進捗 */}
                {totalSubtasks > 0 && (
                  <CustomTypography
                    size="small"
                    color="muted"
                    sx={{ fontWeight: 500 }}
                  >
                    {completedSubtasks}/{totalSubtasks} サブタスク完了
                  </CustomTypography>
                )}
              </Box>
            </Box>
            
            {/* アクションボタン */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* サブタスク展開ボタン */}
              {totalSubtasks > 0 && (
                <IconButton
                  onClick={() => setIsExpanded(!isExpanded)}
                  size="small"
                  sx={{
                    borderRadius: 50,
                    '&:hover': {
                      background: 'rgba(25, 118, 210, 0.08)',
                      color: '#1976d2',
                    },
                  }}
                >
                  {isExpanded ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
              )}
              
              {/* 編集ボタン */}
              <IconButton
                onClick={handleEdit}
                size="small"
                sx={{
                  borderRadius: 50,
                  '&:hover': {
                    background: 'rgba(25, 118, 210, 0.08)',
                    color: '#1976d2',
                  },
                }}
              >
                <Edit />
              </IconButton>
              
              {/* 削除ボタン */}
              <IconButton
                onClick={handleDelete}
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
                <Delete />
              </IconButton>
            </Box>
          </Box>
          
          {/* サブタスク一覧 */}
          {totalSubtasks > 0 && (
            <Box sx={{ mt: 2 }}>
              <Box
                sx={{
                  maxHeight: isExpanded ? 'none' : 0,
                  overflow: 'hidden',
                  transition: 'max-height 0.3s ease-in-out',
                }}
              >
                {task.subtasks?.map((subtask) => (
                  <Box
                    key={subtask.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      ml: 6,
                      mb: 1,
                      p: 1,
                      backgroundColor: '#f8fafc',
                      borderRadius: 1,
                    }}
                  >
                    <Checkbox
                      checked={subtask.completed}
                      onChange={() => handleToggleSubtaskComplete(subtask.id)}
                      size="small"
                      sx={{
                        color: '#d1d5db',
                        '&.Mui-checked': {
                          color: '#10b981',
                        },
                      }}
                    />
                    <CustomTypography
                      color={subtask.completed ? 'muted' : 'text'}
                      sx={{
                        textDecoration: subtask.completed ? 'line-through' : 'none',
                        flexGrow: 1,
                      }}
                    >
                      {subtask.title}
                    </CustomTypography>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
      
      {/* 編集ダイアログ */}
      <TaskEditDialog
        task={task}
        open={isEditing}
        onClose={handleCloseEdit}
      />
    </>
  );
};

export default TaskItem; 
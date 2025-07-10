import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Task, TaskState } from '../types/task';

const defaultTasks: Task[] = [
  {
    id: '1',
    title: 'TaskManagerアプリを試してみる',
    description: '新しく作成したタスク管理アプリの機能を確認してみましょう。タスクの追加、編集、削除、完了の切り替えなど、基本的な機能を試してみてください。',
    categoryId: '3', // 学習カテゴリーに割り当て
    priority: 'medium',
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const initialState: TaskState = {
  tasks: defaultTasks,
  loading: false,
  error: null,
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>) => {
      const newTask: Task = {
        ...action.payload,
        priority: action.payload.priority || 'medium',
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      state.tasks.push(newTask);
    },
    updateTask: (state, action: PayloadAction<{ id: string; updates: Partial<Omit<Task, 'id' | 'createdAt'>> }>) => {
      const { id, updates } = action.payload;
      const taskIndex = state.tasks.findIndex(task => task.id === id);
      if (taskIndex !== -1) {
        state.tasks[taskIndex] = {
          ...state.tasks[taskIndex],
          ...updates,
          updatedAt: new Date().toISOString(),
        };
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
    },
    toggleTaskComplete: (state, action: PayloadAction<string>) => {
      const taskIndex = state.tasks.findIndex(task => task.id === action.payload);
      if (taskIndex !== -1) {
        state.tasks[taskIndex].completed = !state.tasks[taskIndex].completed;
        state.tasks[taskIndex].updatedAt = new Date().toISOString();
      }
    },
  },
});

export const { addTask, updateTask, deleteTask, toggleTaskComplete } = taskSlice.actions;
export default taskSlice.reducer; 
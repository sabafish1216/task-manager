import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Task, TaskState, Subtask } from '../types/task';

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
    subtasks: [],
  },
  {
    id: '2',
    title: '統計グラフの実装',
    description: 'Rechartsを使ってタスクの統計を視覚化するグラフを作成する',
    categoryId: '3',
    priority: 'high',
    completed: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2日前
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1日前に完了
    subtasks: [],
  },
  {
    id: '3',
    title: 'UIデザインの改善',
    description: 'Material-UIを使ってモダンなデザインに改善する',
    categoryId: '3',
    priority: 'medium',
    completed: false,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1日前
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    subtasks: [],
  },
  {
    id: '4',
    title: 'テストデータの追加',
    description: 'グラフ表示のためのテストデータを追加する',
    categoryId: '3',
    priority: 'low',
    completed: true,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3日前
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2日前に完了
    subtasks: [],
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
        subtasks: [],
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
    // サブタスク追加
    addSubtask: (state, action: PayloadAction<{ taskId: string; title: string }>) => {
      const { taskId, title } = action.payload;
      const task = state.tasks.find(t => t.id === taskId);
      if (task) {
        const newSubtask: Subtask = {
          id: Date.now().toString(),
          title,
          completed: false,
        };
        if (!task.subtasks) task.subtasks = [];
        task.subtasks.push(newSubtask);
        task.updatedAt = new Date().toISOString();
      }
    },
    // サブタスク削除
    deleteSubtask: (state, action: PayloadAction<{ taskId: string; subtaskId: string }>) => {
      const { taskId, subtaskId } = action.payload;
      const task = state.tasks.find(t => t.id === taskId);
      if (task && task.subtasks) {
        task.subtasks = task.subtasks.filter(st => st.id !== subtaskId);
        task.updatedAt = new Date().toISOString();
      }
    },
    // サブタスク完了切り替え
    toggleSubtaskComplete: (state, action: PayloadAction<{ taskId: string; subtaskId: string }>) => {
      const { taskId, subtaskId } = action.payload;
      const task = state.tasks.find(t => t.id === taskId);
      if (task && task.subtasks) {
        const subtask = task.subtasks.find(st => st.id === subtaskId);
        if (subtask) {
          subtask.completed = !subtask.completed;
          task.updatedAt = new Date().toISOString();
        }
      }
    },
  },
});

export const { addTask, updateTask, deleteTask, toggleTaskComplete, addSubtask, deleteSubtask, toggleSubtaskComplete } = taskSlice.actions;
export default taskSlice.reducer; 
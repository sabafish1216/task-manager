export type Priority = 'urgent' | 'high' | 'medium' | 'low';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  categoryId: string | null;
  priority: Priority;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  subtasks?: Subtask[]; // サブタスクを追加
}

export interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
} 
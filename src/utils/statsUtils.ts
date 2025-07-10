import { Task } from '../types/task';

export interface DailyStats {
  date: string;
  added: number;
  completed: number;
  balance: number; // added - completed
}

export interface ChartData {
  date: string;
  added: number;
  completed: number;
  balance: number;
}

// 過去7日間の日付配列を生成
export const getLast7Days = (): string[] => {
  const dates: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split('T')[0]); // YYYY-MM-DD形式
  }
  return dates;
};

// タスクから日毎の統計を計算
export const calculateDailyStats = (tasks: Task[]): ChartData[] => {
  const last7Days = getLast7Days();
  
  // 日毎の統計を初期化
  const dailyStats: Record<string, { added: number; completed: number }> = {};
  last7Days.forEach(date => {
    dailyStats[date] = { added: 0, completed: 0 };
  });

  // タスクを日付でグループ化して統計を計算
  tasks.forEach(task => {
    const createdDate = task.createdAt.split('T')[0];
    const completedDate = task.completed ? task.updatedAt.split('T')[0] : null;

    // 作成日が過去7日間内の場合
    if (dailyStats[createdDate]) {
      dailyStats[createdDate].added++;
    }

    // 完了日が過去7日間内の場合
    if (completedDate && dailyStats[completedDate]) {
      dailyStats[completedDate].completed++;
    }
  });

  // グラフ用のデータ形式に変換（追加タスクは負の値として扱う）
  return last7Days.map(date => ({
    date: formatDateForDisplay(date),
    added: -dailyStats[date].added, // 負の値にして下側に表示
    completed: dailyStats[date].completed,
    balance: dailyStats[date].added - dailyStats[date].completed,
  }));
};

// 日付を表示用にフォーマット（MM/DD形式）
export const formatDateForDisplay = (dateString: string): string => {
  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}/${day}`;
};

// 総合統計を計算
export const calculateOverallStats = (tasks: Task[]) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return {
    totalTasks,
    completedTasks,
    pendingTasks,
    completionRate,
  };
}; 
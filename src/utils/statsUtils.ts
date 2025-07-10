import { Task } from '../types/task';

export interface DailyStats {
  date: string;
  added: number;
  completed: number;
  balance: number; // added - completed
  cumulativeBalance: number; // 累積バランス（完了-追加）
}

export interface ChartData {
  date: string;
  added: number;
  completed: number;
  balance: number;
  cumulativeBalance: number;
  addedAbs: number;
  completedAbs: number;
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

  // 累積バランスを計算
  let cumulativeAdded = 0;
  let cumulativeCompleted = 0;

  return last7Days.map(date => {
    const added = dailyStats[date].added;
    const completed = dailyStats[date].completed;
    cumulativeAdded += added;
    cumulativeCompleted += completed;
    return {
      date: formatDateForDisplay(date),
      added: -added, // 負の値で下側
      completed: completed, // 正の値で上側
      balance: added - completed,
      cumulativeBalance: cumulativeCompleted - cumulativeAdded, // 修正
      addedAbs: added,
      completedAbs: completed,
    };
  });
};

// 日付を表示用にフォーマット（MM/DD形式）
export const formatDateForDisplay = (dateString: string): string => {
  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}/${day}`;
};

// 最大値を5の倍数に調整する関数
export const adjustMaxValue = (maxValue: number): number => {
  if (maxValue <= 0) return 5;
  return Math.ceil(maxValue / 5) * 5;
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
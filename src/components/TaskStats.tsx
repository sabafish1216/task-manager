import React, { useMemo } from 'react';
import {
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
} from 'recharts';
import { Box, Typography, Paper } from '@mui/material';
import { useAppSelector } from '../hooks/redux';
import { calculateDailyStats, calculateOverallStats } from '../utils/statsUtils';

const TaskStats: React.FC = () => {
  const tasks = useAppSelector((state) => state.tasks.tasks);
  
  const chartData = useMemo(() => calculateDailyStats(tasks), [tasks]);
  const overallStats = useMemo(() => calculateOverallStats(tasks), [tasks]);

  // カスタムツールチップ
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            background: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid #e2e8f0',
            borderRadius: 2,
            p: 2,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Typography variant="body2" fontWeight={600} color="#2d3748" mb={1}>
            {label}
          </Typography>
          {payload.map((entry: any, index: number) => (
            <Typography
              key={index}
              variant="body2"
              sx={{
                color: entry.color,
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  backgroundColor: entry.color,
                  borderRadius: '50%',
                }}
              />
              {entry.name}: {entry.dataKey === 'added' ? Math.abs(entry.value) : entry.value}
            </Typography>
          ))}
        </Box>
      );
    }
    return null;
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        mb: 4,
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        border: '1px solid rgba(0, 0, 0, 0.08)',
        borderRadius: 3,
      }}
    >
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" fontWeight={700} color="#2d3748" mb={1}>
          タスク統計
        </Typography>
        <Typography variant="body2" color="#64748b">
          過去7日間のタスク追加・完了状況
        </Typography>
      </Box>

      {/* 総合統計 */}
      <Box sx={{ display: 'flex', gap: 3, mb: 4 }}>
        <Box sx={{ textAlign: 'center', flex: 1 }}>
          <Typography variant="h4" fontWeight={800} color="#1976d2">
            {overallStats.totalTasks}
          </Typography>
          <Typography variant="body2" color="#64748b" fontWeight={500}>
            総タスク数
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'center', flex: 1 }}>
          <Typography variant="h4" fontWeight={800} color="#22c55e">
            {overallStats.completedTasks}
          </Typography>
          <Typography variant="body2" color="#64748b" fontWeight={500}>
            完了済み
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'center', flex: 1 }}>
          <Typography variant="h4" fontWeight={800} color="#f97316">
            {overallStats.pendingTasks}
          </Typography>
          <Typography variant="body2" color="#64748b" fontWeight={500}>
            未完了
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'center', flex: 1 }}>
          <Typography variant="h4" fontWeight={800} color="#8b5cf6">
            {overallStats.completionRate}%
          </Typography>
          <Typography variant="body2" color="#64748b" fontWeight={500}>
            完了率
          </Typography>
        </Box>
      </Box>

      {/* グラフ */}
      <Box sx={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12, fill: '#64748b' }}
              axisLine={{ stroke: '#cbd5e1' }}
              tickLine={{ stroke: '#cbd5e1' }}
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#64748b' }}
              axisLine={{ stroke: '#cbd5e1' }}
              tickLine={{ stroke: '#cbd5e1' }}
              tickFormatter={(value) => Math.abs(value).toString()}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* 完了タスク（上側の棒グラフ） */}
            <Bar
              dataKey="completed"
              fill="#22c55e"
              radius={[4, 4, 0, 0]}
              name="完了"
            />
            
            {/* 追加タスク（下側の棒グラフ） */}
            <Bar
              dataKey="added"
              fill="#1976d2"
              radius={[0, 0, 4, 4]}
              name="追加"
            />
            
            {/* バランス（折れ線グラフ） */}
            <Line
              type="monotone"
              dataKey="balance"
              stroke="#8b5cf6"
              strokeWidth={3}
              dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#8b5cf6', strokeWidth: 2 }}
              name="バランス"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </Box>

      {/* 凡例 */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mt: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 12, height: 12, backgroundColor: '#22c55e', borderRadius: 2 }} />
          <Typography variant="body2" color="#64748b" fontWeight={500}>
            完了
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 12, height: 12, backgroundColor: '#1976d2', borderRadius: 2 }} />
          <Typography variant="body2" color="#64748b" fontWeight={500}>
            追加
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 12, height: 12, backgroundColor: '#8b5cf6', borderRadius: '50%' }} />
          <Typography variant="body2" color="#64748b" fontWeight={500}>
            バランス
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default TaskStats; 
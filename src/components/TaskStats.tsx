import React, { useMemo } from 'react';
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Bar,
  ReferenceLine,
} from 'recharts';
import { Box, Paper } from '@mui/material';
import { useAppSelector } from '../hooks/redux';
import { calculateDailyStats, calculateOverallStats, adjustMaxValue } from '../utils/statsUtils';
import CustomTypography from '../custom_props/CustomTypography';

/**
 * タスク統計コンポーネント
 * 過去7日間のタスク追加・完了状況をグラフで表示
 */
const TaskStats: React.FC = () => {
  const tasks = useAppSelector((state) => state.tasks.tasks);
  
  // チャートデータと統計情報をメモ化
  const chartData = useMemo(() => calculateDailyStats(tasks), [tasks]);
  const overallStats = useMemo(() => calculateOverallStats(tasks), [tasks]);
  
  // Y軸の最大値を計算（5の倍数に調整）
  const maxValue = useMemo(() => {
    const maxAdded = Math.max(...chartData.map(d => Math.abs(d.added)));
    const maxCompleted = Math.max(...chartData.map(d => d.completed));
    return adjustMaxValue(Math.max(maxAdded, maxCompleted));
  }, [chartData]);

  console.log(chartData);

  /**
   * カスタムツールチップコンポーネント
   * @param active - ツールチップがアクティブかどうか
   * @param payload - データペイロード
   * @param label - ラベル
   * @returns ツールチップコンポーネント
   */
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const entry = payload[0];
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
          <CustomTypography variant="body2" sx={{ fontWeight: 600, color: '#2d3748', mb: 1 }}>
            {label}
          </CustomTypography>
          <CustomTypography variant="body2" sx={{ color: '#22c55e', fontWeight: 500 }}>
            完了: {entry.payload.completedAbs}
          </CustomTypography>
          <CustomTypography variant="body2" sx={{ color: '#1976d2', fontWeight: 500 }}>
            追加: {entry.payload.addedAbs}
          </CustomTypography>
          <CustomTypography variant="body2" sx={{ color: '#8b5cf6', fontWeight: 500 }}>
            バランス: {entry.payload.cumulativeBalance}
          </CustomTypography>
        </Box>
      );
    }
    return null;
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 6,
        mb: 8,
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        border: '1px solid rgba(0, 0, 0, 0.08)',
        borderRadius: 3,
      }}
    >
      <Box sx={{ mb: 5 }}>
        <CustomTypography variant="h6" size="large" sx={{ fontWeight: 700, color: '#2d3748', mb: 2 }}>
          タスク統計
        </CustomTypography>
        <CustomTypography variant="body2" color="muted">
          過去7日間のタスク追加・完了状況
        </CustomTypography>
      </Box>

      {/* 総合統計 */}
      <Box sx={{ display: 'flex', gap: 5, mb: 6 }}>
        <Box sx={{ textAlign: 'center', flex: 1 }}>
          <CustomTypography variant="h4" size="large" sx={{ fontWeight: 800, color: '#1976d2' }}>
            {overallStats.totalTasks}
          </CustomTypography>
          <CustomTypography variant="body2" color="muted" sx={{ fontWeight: 500 }}>
            総タスク数
          </CustomTypography>
        </Box>
        <Box sx={{ textAlign: 'center', flex: 1 }}>
          <CustomTypography variant="h4" size="large" sx={{ fontWeight: 800, color: '#22c55e' }}>
            {overallStats.completedTasks}
          </CustomTypography>
          <CustomTypography variant="body2" color="muted" sx={{ fontWeight: 500 }}>
            完了済み
          </CustomTypography>
        </Box>
        <Box sx={{ textAlign: 'center', flex: 1 }}>
          <CustomTypography variant="h4" size="large" sx={{ fontWeight: 800, color: '#f97316' }}>
            {overallStats.pendingTasks}
          </CustomTypography>
          <CustomTypography variant="body2" color="muted" sx={{ fontWeight: 500 }}>
            未完了
          </CustomTypography>
        </Box>
        <Box sx={{ textAlign: 'center', flex: 1 }}>
          <CustomTypography variant="h4" size="large" sx={{ fontWeight: 800, color: '#8b5cf6' }}>
            {overallStats.completionRate}%
          </CustomTypography>
          <CustomTypography variant="body2" color="muted" sx={{ fontWeight: 500 }}>
            完了率
          </CustomTypography>
        </Box>
      </Box>

      {/* グラフ */}
      <Box sx={{ height: 340 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart 
            data={chartData} 
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            syncId="taskStats"
            stackOffset="sign"
          >
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
              domain={[-maxValue, maxValue]}
              ticks={[-maxValue, -maxValue/2, 0, maxValue/2, maxValue]}
              allowDataOverflow={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={0} stroke="#000" />
            {/* 追加タスク（下側・青、負の値） */}
            <Bar dataKey="added" fill="#1976d2" name="追加" stackId="stack" />
            {/* 完了タスク（上側・緑、正の値） */}
            <Bar dataKey="completed" fill="#22c55e" name="完了" stackId="stack" />
            {/* バランス（累積・折れ線グラフ） */}
            <Line
              type="monotone"
              dataKey="cumulativeBalance"
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
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 6, mt: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 12, height: 12, backgroundColor: '#22c55e', borderRadius: 2 }} />
          <CustomTypography variant="body2" color="muted" sx={{ fontWeight: 500 }}>
            完了
          </CustomTypography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 12, height: 12, backgroundColor: '#1976d2', borderRadius: 2 }} />
          <CustomTypography variant="body2" color="muted" sx={{ fontWeight: 500 }}>
            追加
          </CustomTypography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 12, height: 12, backgroundColor: '#8b5cf6', borderRadius: '50%' }} />
          <CustomTypography variant="body2" color="muted" sx={{ fontWeight: 500 }}>
            バランス
          </CustomTypography>
        </Box>
      </Box>
    </Paper>
  );
};

export default TaskStats; 
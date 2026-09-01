import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { LineChart as LineChartIcon } from "lucide-react";

function PerformanceChart({ scores }) {
  const hasScores = scores && scores.length > 0;

  if (!hasScores) {
    return (
      <div className="flex h-72 w-full flex-col items-center justify-center rounded-lg border border-dashed bg-muted/20 p-6 text-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border bg-background">
          <LineChartIcon className="h-5 w-5 text-muted-foreground" />
        </div>
        <p className="mt-3 text-sm font-medium">No progress data available yet</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Complete practice interviews to see your score progression graph over time.
        </p>
      </div>
    );
  }

  const chartData = scores.map((item, idx) => ({
    day: item.date
      ? new Date(item.date).toLocaleDateString(undefined, { weekday: "short" })
      : `S${idx + 1}`,
    score: item.score || 0,
  }));

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />

          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12 }}
          />

          <YAxis
            domain={[0, 100]}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12 }}
          />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="score"
            stroke="currentColor"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PerformanceChart;
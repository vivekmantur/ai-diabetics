import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function TrendChart({ data }) {
  if (!data || !data.length) {
    return (
      <div className="trend-empty">
        <h3>Risk Trend</h3>
        <p>No historical data available.</p>
      </div>
    );
  }

  // format data for chart
  const chartData = data
    .slice()
    .reverse()
    .map((p) => ({
      time: new Date(p.timestamp).toLocaleDateString(),
      probability: Number((p.probability * 100).toFixed(1)),
    }));

  return (
    <div className="trend-card">
      <h3>Risk Trend</h3>

      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2a3a" />
          <XAxis dataKey="time" stroke="#9ca3af" />
          <YAxis domain={[0, 100]} stroke="#9ca3af" />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="probability"
            stroke="#38bdf8"
            strokeWidth={3}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

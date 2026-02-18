import { useState } from "react";
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
  const [expanded, setExpanded] = useState(false);

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

  const ChartContent = ({ height = 220 }) => (
    <ResponsiveContainer width="100%" height={height}>
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
  );

  return (
    <>
      {/* ===== Normal Card ===== */}
      <div className="trend-card">
        <div className="trend-header">
          <h3>Risk Trend</h3>

          {/* Expand icon */}
          <button
            className="expand-btn"
            onClick={() => setExpanded(true)}
            title="Expand"
          >
            ⤢
          </button>
        </div>

        <ChartContent />
      </div>

      {/* ===== Expanded Modal ===== */}
      {expanded && (
        <div className="trend-modal">
          <div className="trend-modal-content">
            <div className="trend-header">
              <h3>Risk Trend (Full View)</h3>

              {/* Minimize icon */}
              <button
                className="expand-btn"
                onClick={() => setExpanded(false)}
                title="Minimize"
              >
                ✕
              </button>
            </div>

            {/* Bigger chart */}
            <ChartContent height={400} />
          </div>
        </div>
      )}
    </>
  );
}

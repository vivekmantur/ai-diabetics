export default function RiskPanel({ latest }) {
  if (!latest) {
    return (
      <div className="risk-panel empty">
        <h3>AI Risk Summary</h3>
        <p>No prediction yet. Submit a check to see AI insights.</p>
      </div>
    );
  }

  const percent = (latest.probability * 100).toFixed(1);
  const high = latest.prediction_result === 1;

  return (
    <div className="risk-panel">
      <h3>AI Risk Summary</h3>

      <div className={`risk-status ${high ? "high" : "low"}`}>
        {high ? "High Diabetes Risk" : "Low Diabetes Risk"}
      </div>

      <div className="risk-percent">{percent}%</div>

      <div className="progress-bar">
        <div
          className={`progress-fill ${high ? "high" : "low"}`}
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="risk-meta">
        <span>Latest check</span>
        <small>{new Date(latest.timestamp).toLocaleString()}</small>
      </div>
    </div>
  );
}

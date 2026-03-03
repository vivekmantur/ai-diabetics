import { useState } from "react";
import "../styles/dashboard.css";

export default function ShapCard({ latest }) {
  const [expanded, setExpanded] = useState(false);

  if (!latest || !latest.shap_values) return null;

  const shapValues =
    typeof latest.shap_values === "string"
      ? JSON.parse(latest.shap_values)
      : latest.shap_values;

  const sortedFeatures = Object.entries(shapValues).sort(
    (a, b) => Math.abs(b[1]) - Math.abs(a[1])
  );

  return (
    <div className="shap-card">
      <div className="shap-header">
        <h3>Model Explanation (SHAP)</h3>

        <button
          className="expand-btn"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "− Collapse" : "+ Expand"}
        </button>
      </div>

      {expanded && (
        <div className="shap-content">
          {sortedFeatures.map(([feature, value]) => (
            <div key={feature} className="shap-row">
              <span className="feature">{feature}</span>

              <div className="bar-wrapper">
                <div
                  className={`bar ${
                    value > 0 ? "positive" : "negative"
                  }`}
                  style={{
                    width: `${Math.min(Math.abs(value) * 300, 100)}%`,
                  }}
                />
              </div>

              <span className="value">
                {value.toFixed(3)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
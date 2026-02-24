import { useState } from "react";

export default function ShapCard({ shapImage }) {
  const [open, setOpen] = useState(false);

  if (!shapImage) return null;

  return (
    <>
      <div className="trend-card">
        <div className="trend-header">
          <h3>Model Explanation (SHAP)</h3>
          <button className="expand-btn" onClick={() => setOpen(true)}>
            ↗
          </button>
        </div>

        <img
          src={`data:image/png;base64,${shapImage}`}
          alt="shap"
          style={{ width: "100%", borderRadius: "12px" }}
        />
      </div>

      {open && (
        <div className="trend-modal" onClick={() => setOpen(false)}>
          <div
            className="trend-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={`data:image/png;base64,${shapImage}`}
              alt="shap-large"
              style={{ width: "100%" }}
            />
          </div>
        </div>
      )}
    </>
  );
}
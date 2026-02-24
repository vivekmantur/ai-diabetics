import "../styles/modal.css";

export default function PredictionModal({ data, onClose }) {
  if (!data) return null;

  const percent = (data.probability * 100).toFixed(1);
  const isHigh = data.prediction_result === 1;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card prediction-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="modal-header">
          <h2>Prediction Details</h2>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* SUMMARY */}
        <div className="prediction-summary">
          <span className={`risk-badge ${isHigh ? "high" : "low"}`}>
            {isHigh ? "High Diabetes Risk" : "Low Diabetes Risk"}
          </span>

          <div className="probability-value">{percent}%</div>

          <div className="progress-bar">
            <div
              className={`progress-fill ${isHigh ? "high" : "low"}`}
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        {/* DETAILS GRID */}
        <div className="details-grid">

          {/* BASIC VALUES */}
          <Detail label="Age" value={data.age} />
          <Detail label="Gender" value={data.gender ?? "N/A"} />
          <Detail label="Pregnancies" value={data.pregnancies} />
          <Detail label="Glucose" value={data.glucose} />
          <Detail label="Blood Pressure" value={data.blood_pressure} />
          <Detail label="BMI" value={data.bmi} />
          <Detail label="Insulin" value={data.insulin} />
          <Detail label="Skin Thickness" value={data.skin_thickness} />
          <Detail label="Diabetes Pedigree" value={data.diabetes_pedigree} />

          {/* CLINICAL QUESTIONS */}
          <Detail label="Glucose Symptoms" value={yesNo(data.glucose_symptoms)} />
          <Detail label="Obesity History" value={yesNo(data.obesity_history)} />
          <Detail label="Sedentary Lifestyle" value={yesNo(data.sedentary_lifestyle)} />
          <Detail label="Sleep Apnea" value={yesNo(data.sleep_apnea)} />
          <Detail label="Weight Loss Attempts" value={yesNo(data.weight_loss_attempts)} />
          <Detail label="PCOS" value={yesNo(data.pcos)} />

          {/* TIMESTAMP */}
          <Detail
            label="Checked On"
            value={new Date(data.timestamp).toLocaleString()}
          />
        </div>
      </div>
    </div>
  );
}

/* ---------- helpers ---------- */

function Detail({ label, value }) {
  return (
    <div className="detail-item">
      <span className="detail-label">{label}:</span>
      <span className="detail-value">{value ?? "N/A"}</span>
    </div>
  );
}

function yesNo(v) {
  if (v === true) return "Yes";
  if (v === false) return "No";
  return "N/A";
}

import { useState } from "react";
import { createPrediction } from "../api/predictApi";

export default function DiabetesForm({ userId, onSuccess }) {
  const [form, setForm] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const change = (e) =>
    setForm({ ...form, [e.target.name]: parseFloat(e.target.value) });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await createPrediction({ ...form, user_id: userId });
      setResult(res);

      // close modal after short delay
      if (onSuccess) {
        setTimeout(() => onSuccess(), 1200);
      }
    } catch (err) {
      console.error("Prediction failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    "pregnancies",
    "glucose",
    "blood_pressure",
    "skin_thickness",
    "insulin",
    "bmi",
    "diabetes_pedigree",
    "age",
  ];

  return (
    <div>
      <form className="form-grid" onSubmit={submit}>
        {fields.map((f) => (
          <input
            key={f}
            name={f}
            placeholder={f.replace("_", " ")}
            onChange={change}
            required
          />
        ))}

        <button type="submit" disabled={loading}>
          {loading ? "Predicting..." : "Predict Risk"}
        </button>
      </form>

      {result && (
        <div className="prediction-result">
          <h3 className={result.prediction ? "red" : "green"}>
            {result.prediction ? "High Diabetes Risk" : "Low Diabetes Risk"}
          </h3>
          <p>Probability: {(result.probability * 100).toFixed(1)}%</p>
        </div>
      )}
    </div>
  );
}

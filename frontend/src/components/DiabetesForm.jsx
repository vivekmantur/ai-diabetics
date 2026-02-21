import { useState } from "react";
import { createPrediction } from "../api/predictApi";
import "../styles/modal.css";

export default function DiabetesForm({ userId, onSuccess }) {
  const [form, setForm] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const change = (name, value) => {
    setForm((prev) => {
      const updated = { ...prev, [name]: value };

      if (name === "gender" && value === "male") {
        delete updated.pregnancies;
        delete updated.pcos;
      }

      return updated;
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await createPrediction({
        pregnancies: form.gender === "male" ? 0 : form.pregnancies || 0,
        glucose: Number(form.glucose),
        blood_pressure: Number(form.blood_pressure),
        skin_thickness: Number(form.skin_thickness),
        insulin: Number(form.insulin),
        bmi: Number(form.bmi),
        diabetes_pedigree: Number(form.diabetes_pedigree),
        age: Number(form.age),

        glucose_symptoms: form.glucoseSymptoms === "yes",
        obesity_history: form.obesityHistory === "yes",
        sedentary_lifestyle: form.sedentaryLifestyle === "yes",
        sleep_apnea: form.sleepApnea === "yes",
        weight_loss_attempts: form.weightLossAttempts === "yes",
        pcos: form.pcos === "yes",
        gender: form.gender,
      });

      setResult(res);
      if (onSuccess) setTimeout(onSuccess, 1500);
    } catch (err) {
      console.error("Prediction failed:", err);
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return (
      <div className="prediction-result">
        <h3 className={result.prediction ? "red" : "green"}>
          {result.prediction ? "High Diabetes Risk" : "Low Diabetes Risk"}
        </h3>
        <p>Probability: {(result.probability * 100).toFixed(1)}%</p>
      </div>
    );
  }

  return (
    <form className="form-grid" onSubmit={submit}>

      {/* ROW 1: Age + Gender */}
      <Input
        label="Age"
        value={form.age}
        onChange={(v) => change("age", v)}
      />

      <SelectGender
        value={form.gender}
        onChange={(v) => change("gender", v)}
      />

      {/* BASE FIELDS */}
      <Input
        label="Glucose"
        value={form.glucose}
        onChange={(v) => change("glucose", v)}
      />

      <Input
        label="Blood Pressure"
        value={form.blood_pressure}
        onChange={(v) => change("blood_pressure", v)}
      />

      <Input
        label="Skin Thickness"
        value={form.skin_thickness}
        onChange={(v) => change("skin_thickness", v)}
      />

      <Input
        label="Insulin"
        value={form.insulin}
        onChange={(v) => change("insulin", v)}
      />

      <Input
        label="BMI"
        value={form.bmi}
        onChange={(v) => change("bmi", v)}
      />

      <Input
        label="Diabetes Pedigree"
        step="0.01"
        value={form.diabetes_pedigree}
        onChange={(v) => change("diabetes_pedigree", v)}
      />

      {/* CONDITIONAL QUESTIONS AT END */}

      {form.gender === "female" && (
        <Input
          label="Pregnancies"
          value={form.pregnancies}
          onChange={(v) => change("pregnancies", v)}
        />
      )}

      {form.gender === "female" && (
        <YesNo
          label="Do you have PCOS?"
          value={form.pcos}
          onChange={(v) => change("pcos", v)}
        />
      )}

      {Number(form.glucose) > 140 && (
        <YesNo
          label="Excessive thirst or fatigue?"
          value={form.glucoseSymptoms}
          onChange={(v) => change("glucoseSymptoms", v)}
        />
      )}

      {Number(form.bmi) > 30 && (
        <>
          <YesNo
            label="History of obesity?"
            value={form.obesityHistory}
            onChange={(v) => change("obesityHistory", v)}
          />

          {form.obesityHistory === "yes" && (
            <>
              <YesNo
                label="Sedentary lifestyle?"
                value={form.sedentaryLifestyle}
                onChange={(v) => change("sedentaryLifestyle", v)}
              />

              <YesNo
                label="Sleep apnea history?"
                value={form.sleepApnea}
                onChange={(v) => change("sleepApnea", v)}
              />

              <YesNo
                label="Recent weight loss attempts?"
                value={form.weightLossAttempts}
                onChange={(v) => change("weightLossAttempts", v)}
              />
            </>
          )}
        </>
      )}

      <div className="full-width">
        <button className="primary-btn" disabled={loading}>
          {loading ? "Predicting..." : "Predict Risk"}
        </button>
      </div>
    </form>
  );
}

/* ================== Helper Components ================== */

function Input({ label, value, onChange, step }) {
  return (
    <div className="field">
      <label>{label}</label>
      <input
        type="number"
        step={step}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        required
      />
    </div>
  );
}

function YesNo({ label, value, onChange }) {
  return (
    <div className="field">
      <label>{label}</label>
      <div className="yesno-buttons">
        <button
          type="button"
          className={value === "yes" ? "active" : ""}
          onClick={() => onChange("yes")}
        >
          {value === "yes" && "✔ "}Yes
        </button>

        <button
          type="button"
          className={value === "no" ? "active" : ""}
          onClick={() => onChange("no")}
        >
          {value === "no" && "✔ "}No
        </button>
      </div>
    </div>
  );
}

function SelectGender({ value, onChange }) {
  return (
    <div className="field">
      <label>Gender</label>
      <div className="yesno-buttons">
        <button
          type="button"
          className={value === "male" ? "active" : ""}
          onClick={() => onChange("male")}
        >
          {value === "male" && "✔ "}Male
        </button>

        <button
          type="button"
          className={value === "female" ? "active" : ""}
          onClick={() => onChange("female")}
        >
          {value === "female" && "✔ "}Female
        </button>
      </div>
    </div>
  );
}

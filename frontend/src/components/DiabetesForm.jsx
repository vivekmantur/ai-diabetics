import { useState } from "react";
import { createPrediction } from "../api/predictApi";

export default function DiabetesForm({ onSuccess }) {
  const [form, setForm] = useState({});

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: Number(e.target.value) });

  const submit = async e => {
    e.preventDefault();
    await createPrediction(form);
    onSuccess();
  };

  const fields = [
    "user_id","pregnancies","glucose","blood_pressure",
    "skin_thickness","insulin","bmi","diabetes_pedigree","age"
  ];

  return (
    <form onSubmit={submit}>
      {fields.map(f => (
        <input key={f} name={f} placeholder={f} onChange={handleChange} required />
      ))}
      <button type="submit">Submit</button>
    </form>
  );
}

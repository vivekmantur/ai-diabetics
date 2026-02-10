import { useEffect, useState } from "react";
import { fetchPredictions } from "../api/predictApi";
import ResultCard from "../components/ResultCard";
import DiabetesForm from "../components/DiabetesForm";

export default function Home() {
  const [predictions, setPredictions] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    const data = await fetchPredictions();
    setPredictions(data);
  };

  useEffect(() => { load(); }, []);

  return (
    <div>
      <h1>Diabetes Predictions</h1>

      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? "Close" : "Add Prediction"}
      </button>

      {showForm && <DiabetesForm onSuccess={() => { setShowForm(false); load(); }} />}

      {predictions.map(p => (
        <ResultCard key={p.prediction_id} p={p} />
      ))}
    </div>
  );
}

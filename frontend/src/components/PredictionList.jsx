import { useEffect, useState } from "react";
import { fetchPredictions } from "../api/predictApi";
import ResultCard from "./ResultCard";

export default function PredictionList({ userId }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchPredictions().then((all) => {
      const filtered = all.filter((p) => p.user_id === userId);
      setData(filtered);
    });
  }, [userId]);

  if (!data.length) return <p>No predictions yet.</p>;

  return (
    <div>
      {data.map((p) => (
        <ResultCard key={p.prediction_id} p={p} />
      ))}
    </div>
  );
}

import { useEffect, useState } from "react";
import { fetchPredictions } from "../api/predictApi";
import ResultCard from "./ResultCard";
import PredictionModal from "./PredictionModal";

export default function PredictionList({ userId }) {
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetchPredictions().then((all) => {
      const filtered = all.filter((p) => p.user_id === userId);
      setData(filtered);
    });
  }, [userId]);

  if (!data.length) return <p>No predictions yet.</p>;

  return (
    <>
      <div className="history-scroll">
        {data.map((p) => (
          <ResultCard
            key={p.prediction_id}
            p={p}
            onClick={() => setSelected(p)}
          />
        ))}
      </div>

      {/* MODAL */}
      <PredictionModal data={selected} onClose={() => setSelected(null)} />
    </>
  );
}

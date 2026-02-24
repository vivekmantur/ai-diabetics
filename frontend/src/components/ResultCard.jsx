export default function ResultCard({ p, onClick }) {
  return (
    <div className="result-card clickable" onClick={onClick}>
      <h4 className={p.prediction_result ? "red" : "green"}>
        {p.prediction_result ? "Diabetic" : "Healthy"}
      </h4>

      <p>Probability: {(p.probability * 100).toFixed(1)}%</p>
      <small>{new Date(p.timestamp).toLocaleString()}</small>
    </div>
  );
}

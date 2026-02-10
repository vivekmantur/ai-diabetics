export default function ResultCard({ p }) {
  return (
    <div style={{ border: "1px solid #ccc", margin: 10, padding: 10 }}>
      <p>User: {p.user_id}</p>
      <p>Prediction: {p.prediction_result === 1 ? "Diabetic" : "Not Diabetic"}</p>
      <p>Probability: {p.probability}</p>
      <p>Date: {p.timestamp}</p>
    </div>
  );
}

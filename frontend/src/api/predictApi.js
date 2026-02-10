const BASE = "http://localhost:8000/predict";

export async function fetchPredictions() {
  const res = await fetch(BASE + "/");
  return res.json();
}

export async function createPrediction(data) {
  const res = await fetch(BASE + "/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

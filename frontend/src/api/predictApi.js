const BASE = "http://localhost:8000/predict";

function getAuthHeaders() {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// 🔐 Get predictions for logged-in user
export async function fetchPredictions() {
  const res = await fetch(BASE + "/", {
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error("Failed to fetch predictions");

  return res.json();
}

// 🔐 Create prediction
export async function createPrediction(body) {
  const res = await fetch(BASE + "/", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error("Prediction failed");

  return res.json();
}

// src/api/predictApi.js

const BASE = "http://localhost:8000/predict";

// ================= AUTH HEADER =================
function getAuthHeaders() {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// ================= GET HISTORY =================
export async function fetchPredictions() {
  const res = await fetch(BASE + "/", {
    headers: getAuthHeaders(),
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("Fetch predictions error:", data);
    throw new Error(data.detail || "Failed to fetch predictions");
  }

  return data;
}

// ================= CREATE PREDICTION =================
export async function createPrediction(body) {
  const res = await fetch(BASE + "/", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("Backend error:", data);

    // ⭐ Extract FastAPI validation message
    if (data.detail) {
      if (Array.isArray(data.detail)) {
        throw new Error(data.detail.map(e => e.msg).join(", "));
      }
      throw new Error(data.detail);
    }

    throw new Error("Prediction failed");
  }

  return data;
}
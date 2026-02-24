const BASE = "http://localhost:8000/chat";

// 🔐 attach JWT token
function getAuthHeaders() {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// 🧠 Ask AI coach
export async function askChat(question) {
  const res = await fetch(BASE + "/ask", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ question }),
  });

  if (!res.ok) {
    throw new Error("Chat request failed");
  }

  return res.json();
}

const BASE = "http://127.0.0.1:8000";

export async function loginByPhone(phone) {
  const res = await fetch("http://localhost:8000/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone }),
  });

  if (!res.ok) throw new Error("Login failed");

  return res.json();
}

const BASE = "http://127.0.0.1:8000";

export async function loginByPhone(phone) {
  const res = await fetch(`${BASE}/users/${phone}`);
  if (!res.ok) throw new Error("User not found");
  return res.json();
}

const BASE = "http://localhost:8000";

// ===== LOGIN =====
export async function requestOtp(phone) {
  const res = await fetch(`${BASE}/auth/request-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone }),
  });

  if (!res.ok) throw new Error("User not found");
  return res.json();
}

export async function verifyOtp(phone, otp) {
  const res = await fetch(`${BASE}/auth/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, otp }),
  });

  if (!res.ok) throw new Error("Invalid OTP");
  return res.json();
}


// ===== REGISTER =====
export async function requestRegisterOtp(phone) {
  const res = await fetch(`${BASE}/auth/register-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone }),
  });

  if (!res.ok) throw new Error("User already exists");
  return res.json();
}

export async function registerUser(phone, otp) {
  const res = await fetch(`${BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, otp }),
  });

  if (!res.ok) throw new Error("Registration failed");
  return res.json();
}

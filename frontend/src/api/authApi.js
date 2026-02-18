const BASE = "http://localhost:8000";

// helper to extract backend error
async function handleResponse(res, defaultMsg) {
  if (res.ok) return res.json();

  let msg = defaultMsg;
  try {
    const data = await res.json();
    msg = data.detail || defaultMsg;
  } catch {}

  throw new Error(msg);
}


// ===== LOGIN =====
export async function requestOtp(phone) {
  const res = await fetch(`${BASE}/auth/request-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone }),
  });

  return handleResponse(res, "User not found");
}

export async function verifyOtp(phone, otp) {
  const res = await fetch(`${BASE}/auth/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, otp }),
  });

  return handleResponse(res, "Invalid OTP");
}


// ===== REGISTER =====
export async function requestRegisterOtp(phone, email) {
  const res = await fetch(`${BASE}/auth/register-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, email }),
  });

  return handleResponse(res, "User already exists");
}

export async function registerUser(phone, email, otp) {
  const res = await fetch(`${BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, email, otp }),
  });

  return handleResponse(res, "Registration failed");
}

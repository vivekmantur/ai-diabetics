import { useState } from "react";
import { requestOtp, verifyOtp } from "../api/authApi";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/login.css";

export default function Login({ onLogin, goToRegister }) {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("phone"); // phone | otp
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ===== Send OTP =====
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await requestOtp(phone);
      setStep("otp");
    } catch (err) {
      setError(err.message || "User not found");
    } finally {
      setLoading(false);
    }
  };

  // ===== Verify OTP =====
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await verifyOtp(phone, otp);

      localStorage.setItem("token", data.access_token);
      onLogin(data.user);
    } catch (err) {
      setError(err.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  // ===== Resend OTP =====
  const handleResend = async () => {
    setError("");
    try {
      await requestOtp(phone);
    } catch (err) {
      setError(err.message || "Failed to resend OTP");
    }
  };

  // ===== Go back to phone step =====
  const goBack = () => {
    setStep("phone");
    setOtp("");
    setError("");
  };

  return (
    <div className="login-page">
      <Header />

      <section className="hero">
        {/* LEFT SIDE */}
        <div className="hero-left">
          <h1>Predict Diabetes Early with AI</h1>
          <p>
            Monitor health, analyze diabetes risk trends, and take preventive
            action using AI-powered healthcare.
          </p>
        </div>

        {/* LOGIN CARD */}
        <div className="login-card">
          {step === "phone" ? (
            <>
              <h2>Login</h2>

              <form onSubmit={handleSendOTP}>
                <input
                  type="tel"
                  placeholder="Phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />

                <button type="submit" disabled={loading}>
                  {loading ? "Sending..." : "Send OTP"}
                </button>
              </form>

              {/* 👉 Register navigation */}
              <p className="switch-link" onClick={goToRegister}>
                New user? Create account
              </p>
            </>
          ) : (
            <>
              <h2>Enter OTP</h2>

              <form onSubmit={handleVerifyOTP}>
                <input
                  type="text"
                  placeholder="6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />

                <button type="submit" disabled={loading}>
                  {loading ? "Verifying..." : "Verify & Login"}
                </button>
              </form>

              {/* 🔁 Resend OTP */}
              <p className="switch-link" onClick={handleResend}>
                Resend OTP
              </p>

              {/* ⬅ Back */}
              <p className="switch-link" onClick={goBack}>
                Change phone number
              </p>
            </>
          )}

          {error && <p className="error">{error}</p>}
        </div>
      </section>

      <Footer />
    </div>
  );
}

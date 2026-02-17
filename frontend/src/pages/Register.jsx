import { useState } from "react";
import { requestRegisterOtp, registerUser } from "../api/authApi";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/login.css";

export default function Register({ onLogin, goToLogin }) {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("phone"); // phone | otp
  const [error, setError] = useState("");

  // ===== Send Register OTP =====
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await requestRegisterOtp(phone);
      setStep("otp");
    } catch (err) {
      setError(err.message);
    }
  };

  // ===== Verify & Register =====
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await registerUser(phone, otp);

      localStorage.setItem("token", data.access_token);
      onLogin(data.user);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-page">
      <Header />

      <section className="hero">
        <div className="hero-left">
          <h1>Create Account</h1>
          <p>Register to start AI-powered diabetes prediction.</p>
        </div>

        <div className="login-card">
          {step === "phone" ? (
            <>
              <h2>Register</h2>

              <form onSubmit={handleSendOTP}>
                <input
                  type="tel"
                  placeholder="Phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />

                <button type="submit">Send OTP</button>
              </form>

              <p className="switch-link" onClick={goToLogin}>
                Already have an account? Login
              </p>
            </>
          ) : (
            <>
              <h2>Verify OTP</h2>

              <form onSubmit={handleRegister}>
                <input
                  type="text"
                  placeholder="6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />

                <button type="submit">Register & Login</button>
              </form>
            </>
          )}

          {error && <p className="error">{error}</p>}
        </div>
      </section>

      <Footer />
    </div>
  );
}

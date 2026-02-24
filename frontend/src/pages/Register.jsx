import { useState } from "react";
import { requestRegisterOtp, registerUser } from "../api/authApi";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/login.css";

export default function Register({ onLogin, goToLogin }) {
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("phone"); // phone | otp
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ===== Send Register OTP =====
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await requestRegisterOtp(phone, email);
      setStep("otp");
    } catch (err) {
      setError(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // ===== Verify & Register =====
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await registerUser(phone, email, otp);

      localStorage.setItem("token", data.access_token);
      onLogin(data.user);
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // ===== Go back to edit phone/email =====
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
          <h1>Create Account</h1>
          <p>Register to start AI-powered diabetes prediction.</p>
        </div>

        {/* REGISTER CARD */}
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

                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <button type="submit" disabled={loading}>
                  {loading ? "Sending..." : "Send OTP"}
                </button>
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

                <button type="submit" disabled={loading}>
                  {loading ? "Registering..." : "Register & Login"}
                </button>
              </form>

              {/* Back option */}
              <p className="switch-link" onClick={goBack}>
                Change phone or email
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

import { useState } from "react";
import { loginByPhone } from "../api/authApi";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/login.css";

export default function Login({ onLogin }) {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    try {
        const data = await loginByPhone(phone);

        localStorage.setItem("token", data.access_token);

        onLogin(data.user);
    } catch {
        setError("User not found");
    }
    };


  return (
    <div className="login-page">
      {/* HEADER */}
      <Header />

      {/* HERO SECTION */}
      <section className="hero">
        {/* LEFT CONTENT */}
        <div className="hero-left">
          <h1>Predict Diabetes Early with AI</h1>
          <p>
            Monitor your health, analyze long-term diabetes risk trends,
            and take preventive action using our intelligent
            machine-learning powered healthcare platform.
          </p>

          <div className="hero-features">
            <span>✔ Real-time AI prediction</span>
            <span>✔ Health risk analytics</span>
            <span>✔ Preventive insights</span>
          </div>
        </div>

        {/* LOGIN CARD */}
        <div className="login-card">
          <h2>Login to Continue</h2>
          <p className="subtitle">Enter your registered phone number</p>

          <form onSubmit={submit}>
            <input
              type="tel"
              placeholder="Phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />

            <button type="submit">Continue</button>
          </form>

          {error && <p className="error">{error}</p>}
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}

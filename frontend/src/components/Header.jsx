import "../styles/login.css";
import logo from "../assets/logo.png";

export default function Header({ user, onLogout }) {
  return (
    <header className="site-header">
      {/* LEFT SIDE LOGO */}
      <div className="logo-wrapper">
        <div className="logo-box">
          <img src={logo} alt="Cognine Logo" />
        </div>
        <span className="app-title">AI Diabetes Predictor</span>
      </div>

      {/* RIGHT SIDE */}
      {user && (
        <button className="logout-btn" onClick={onLogout}>
          Logout
        </button>
      )}
    </header>
  );
}

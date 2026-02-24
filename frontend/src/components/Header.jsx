import "../styles/login.css";
import logo from "../assets/logo.png";

export default function Header({
  user,
  onLogout,
  onTestClick,
  onDietClick
}) {
  return (
    <header className="site-header">
      
      {/* LEFT - LOGO */}
      <div className="logo-box">
        <img src={logo} alt="Cognine Logo" />
      </div>

      {/* CENTER - TITLE */}
      <div className="header-title">
        AI Diabetes Predictor
      </div>

      {/* RIGHT - BUTTONS */}
      {user && (
        <div className="header-actions">
          <button className="header-btn" onClick={onTestClick}>
            Take Diabetes Test
          </button>

          <button className="header-btn" onClick={onDietClick}>
            Get Diet Plan
          </button>

          <button className="header-btn logout" onClick={onLogout}>
            Logout
          </button>
        </div>
      )}
    </header>
  );
}
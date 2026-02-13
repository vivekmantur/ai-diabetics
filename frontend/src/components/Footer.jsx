import "../styles/login.css";

export default function Footer() {
  return (
    <footer className="site-footer">
      © {new Date().getFullYear()} AI Diabetes Predictor • Built with AI for Early Health Detection
    </footer>
  );
}

import "../styles/modal.css";
import DiabetesForm from "./DiabetesForm";

export default function TestModal({ open, onClose, userId }) {
  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-header">
          <h2>Diabetes Risk Assessment</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <DiabetesForm userId={userId} onSuccess={onClose} />
      </div>
    </div>
  );
}

import ReactMarkdown from "react-markdown";
import "../styles/modal.css";

export default function DietPlanModal({
  open,
  onClose,
  content,
  onDownload
}) {
  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card diet-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="modal-header">
          <h2>Your Personalized Diet Plan</h2>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* FORMATTED CONTENT */}
        <div className="diet-content">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>

        {/* FOOTER */}
        <div className="modal-actions">
          <button className="download-btn" onClick={onDownload}>
            ⬇ Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}

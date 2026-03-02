import ReactMarkdown from "react-markdown";
import html2pdf from "html2pdf.js";
import "../styles/modal.css";

export default function DietPlanModal({
  open,
  onClose,
  content
}) {
  if (!open) return null;

  // ================= PDF DOWNLOAD =================
  const handleDownloadPDF = () => {
    const element = document.getElementById("diet-pdf-content");

    if (!element) return;

    const options = {
      margin: 0.5,
      filename: "diabetes-diet-plan.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
      },
      jsPDF: {
        unit: "in",
        format: "a4",
        orientation: "portrait",
      },
      pagebreak: { mode: ["avoid-all", "css", "legacy"] },
    };

    html2pdf().set(options).from(element).save();
  };

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

        {/* ========= PDF CAPTURE AREA ========= */}
        <div id="diet-pdf-content" className="diet-content pdf-area">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>

        {/* FOOTER */}
        <div className="modal-actions">
          <button
            className="download-btn"
            onClick={handleDownloadPDF}
          >
            ⬇ Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}
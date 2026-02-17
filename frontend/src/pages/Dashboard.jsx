import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

import PredictionList from "../components/PredictionList";
import RiskPanel from "../components/RiskPanel";
import TrendChart from "../components/TrendChart";
import ChatBox from "../components/ChatBox";
import TestModal from "../components/TestModal";

import { fetchPredictions } from "../api/predictApi";
import "../styles/dashboard.css";

export default function Dashboard({ user, onLogout }) {
  const [latest, setLatest] = useState(null);
  const [history, setHistory] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  // 🔐 Fetch predictions for logged-in user (JWT already applied in API)
  useEffect(() => {
    const loadData = async () => {
      try {
        const userData = await fetchPredictions(); // already filtered in backend
        setHistory(userData);
        if (userData.length) setLatest(userData[0]);
      } catch (err) {
        console.error("Failed to fetch predictions:", err);
      }
    };

    loadData();
  }, [openModal]); // refresh after new test

  return (
    <div className="dashboard-page">
      {/* HEADER with logout */}
      <Header user={user} onLogout={onLogout} />

      {/* DASHBOARD BODY */}
      <div className="dashboard">
        {/* LEFT — HISTORY */}
        <aside className="sidebar">
          <h3>History</h3>
          <PredictionList userId={user.user_id} />
        </aside>

        {/* CENTER */}
        <main className="center">
          <h2>New Diabetes Check</h2>

          {/* CTA BUTTON */}
          <button
            className="primary-btn"
            onClick={() => setOpenModal(true)}
          >
            Take Diabetes Test
          </button>

          {/* CHATBOT */}
          <ChatBox userId={user.user_id} />
        </main>

        {/* RIGHT — AI INSIGHTS */}
        <aside className="right-panel">
          <RiskPanel latest={latest} />
          <TrendChart data={history} />
        </aside>
      </div>

      {/* MODAL */}
      <TestModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        userId={user.user_id}
      />

      {/* FOOTER */}
      <Footer />
    </div>
  );
}

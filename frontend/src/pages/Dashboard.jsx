import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PredictionList from "../components/PredictionList";
import RiskPanel from "../components/RiskPanel";
import TrendChart from "../components/TrendChart";
import ChatBox from "../components/ChatBox";
import TestModal from "../components/TestModal";
import ShapCard from "../components/ShapCard";
import DietPlanModal from "../components/DietPlanModal";
import { fetchPredictions } from "../api/predictApi";
import { askChat } from "../api/chatApi";
import "../styles/dashboard.css";

export default function Dashboard({ user, onLogout }) {
  const [latest, setLatest] = useState(null);
  const [history, setHistory] = useState([]);
  const [openTestModal, setOpenTestModal] = useState(false);

  const [dietContent, setDietContent] = useState("");
  const [openDietModal, setOpenDietModal] = useState(false);

  // 🔐 Load predictions
  useEffect(() => {
    const loadData = async () => {
      try {
        const userData = await fetchPredictions();
        setHistory(userData);

        if (userData.length) {
          setLatest(userData[0]);
        }
      } catch (err) {
        console.error("Failed to fetch predictions:", err);
      }
    };

    loadData();
  }, [openTestModal]);

  // 🍎 Generate Diet Plan
  const handleDietPlan = async () => {
    if (!latest) return;

    const prompt = `
Create a personalized diabetes diet plan.

Patient details:
Age: ${latest.age}
Gender: ${latest.gender || "Not specified"}
BMI: ${latest.bmi}
Glucose: ${latest.glucose}
Blood Pressure: ${latest.blood_pressure}
Risk Level: ${latest.prediction_result ? "High" : "Low"}
Probability: ${(latest.probability * 100).toFixed(1)}%

Provide:
• Daily meal plan
• Foods to avoid
• Lifestyle recommendations
• Simple explanation in clear language
`;

    try {
      const res = await askChat(prompt);
      setDietContent(res.answer);
      setOpenDietModal(true);
    } catch {
      setDietContent("Failed to generate diet plan.");
      setOpenDietModal(true);
    }
  };

  // 📄 Download diet as text file (simple & safe)
  const handleDownload = () => {
    const blob = new Blob([dietContent], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "diet-plan.txt";
    link.click();
  };

  return (
    <div className="dashboard-page">

      {/* HEADER */}
      <Header
        user={user}
        onLogout={onLogout}
        onTestClick={() => setOpenTestModal(true)}
        onDietClick={handleDietPlan}
      />

      {/* BODY */}
      <div className="dashboard">

        {/* LEFT */}
        <aside className="sidebar">
          <h3>History</h3>
          <PredictionList userId={user.user_id} />
        </aside>

        {/* CENTER */}
        <main className="center">
          <ChatBox userId={user.user_id} />
        </main>

        {/* RIGHT */}
        <aside className="right-panel">
          <RiskPanel latest={latest} />
          <TrendChart data={history} />
          <ShapCard latest={latest} />   
        </aside>
      </div>

      {/* TEST MODAL */}
      <TestModal
        open={openTestModal}
        onClose={() => setOpenTestModal(false)}
        userId={user.user_id}
      />

      {/* 🍎 DIET PLAN MODAL */}
      <DietPlanModal
        open={openDietModal}
        onClose={() => setOpenDietModal(false)}
        content={dietContent}
      />

      <Footer />
    </div>
  );
}

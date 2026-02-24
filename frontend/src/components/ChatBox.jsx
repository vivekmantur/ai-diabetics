import {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import ReactMarkdown from "react-markdown";
import { askChat } from "../api/chatApi";
import DietPlanModal from "./DietPlanModal";

import "../styles/chat.css";

const ChatBox = forwardRef(function ChatBox(_, ref) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [openModal, setOpenModal] = useState(false);

  const bottomRef = useRef(null);

  /* expose askAI to dashboard */
  useImperativeHandle(ref, () => ({
    askAI: async (prompt) => {
      if (!prompt) return;

      const userMsg = { role: "user", text: prompt };
      setMessages((m) => [...m, userMsg]);

      try {
        const data = await askChat(prompt);
        const botMsg = { role: "ai", text: data.answer };
        setMessages((m) => [...m, botMsg]);
      } catch {
        setMessages((m) => [
          ...m,
          { role: "ai", text: "❌ Failed to get AI response." },
        ]);
      }
    },
  }));

  /* manual send */
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input };
    setMessages((m) => [...m, userMsg]);

    try {
      const data = await askChat(input);
      const botMsg = { role: "ai", text: data.answer };
      setMessages((m) => [...m, botMsg]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "ai", text: "❌ Failed to get AI response." },
      ]);
    }

    setInput("");
  };

  /* latest AI response */
  const latestAI =
    [...messages].reverse().find((m) => m.role === "ai")?.text || "";

  /* PDF download */
  const downloadPDF = () => {
    const blob = new Blob([latestAI], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "diet-plan.pdf";
    a.click();

    URL.revokeObjectURL(url);
  };

  /* auto scroll */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <div className="chatbox-wrapper">
        <div className="chatbox">

          {/* HEADER */}
          <div className="chat-header">
            <h3>AI Diabetes Coach</h3>

            <div className="chat-actions">
              {latestAI && (
                <button
                  className="icon-btn"
                  onClick={() => setOpenModal(true)}
                  title="View / Download Diet Plan"
                >
                  ⬇
                </button>
              )}
            </div>
          </div>

          {/* MESSAGES */}
          <div className="chat-messages">
            {messages.map((m, i) => (
              <div key={i} className={`msg ${m.role}`}>
                {m.role === "ai" ? <ReactMarkdown>{m.text}</ReactMarkdown> : m.text}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* INPUT */}
          <div className="chat-input">
            <input
              placeholder="Ask about diet, glucose, BMI..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      </div>

      {/* DIET PLAN MODAL */}
      <DietPlanModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        content={latestAI}
        onDownload={downloadPDF}
      />
    </>
  );
});

export default ChatBox;

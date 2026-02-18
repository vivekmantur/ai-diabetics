import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { askChat } from "../api/chatApi";

import "../styles/chat.css";

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  // ===== Send message =====
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input };
    setMessages((m) => [...m, userMsg]);

    try {
      const data = await askChat(input);
      const botMsg = { role: "ai", text: data.answer };
      setMessages((m) => [...m, botMsg]);
    } catch {
      const errorMsg = { role: "ai", text: "❌ Failed to get AI response." };
      setMessages((m) => [...m, errorMsg]);
    }

    setInput("");
  };

  // ===== Clear chat =====
  const clearChat = () => setMessages([]);

  // ===== Auto scroll =====
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chatbox-wrapper">
      <div className="chatbox">
        {/* HEADER */}
        <div className="chat-header">
          <h3>AI Diabetes Coach</h3>

          {messages.length > 0 && (
            <button className="clear-btn" onClick={clearChat}>
              Clear
            </button>
          )}
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
  );
}

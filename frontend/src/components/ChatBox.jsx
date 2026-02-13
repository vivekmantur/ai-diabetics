import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import "../styles/chat.css";

export default function ChatBox({ userId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input };
    setMessages((m) => [...m, userMsg]);

    const res = await fetch("http://localhost:8000/chat/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, question: input }),
    });

    const data = await res.json();

    const botMsg = { role: "ai", text: data.answer }; // ⚠️ use "ai" not "bot"
    setMessages((m) => [...m, botMsg]);

    setInput("");
  };

  // auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chatbox-wrapper">
      <div className="chatbox">
        <h3>AI Diabetes Coach</h3>

        <div className="chat-messages">
          {messages.map((m, i) => (
            <div key={i} className={`msg ${m.role}`}>
              {m.role === "ai" ? (
                <ReactMarkdown>{m.text}</ReactMarkdown>
              ) : (
                m.text
              )}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <div className="chat-input">
          <input
            placeholder="Ask about diet, glucose, BMI..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import "./styles/global.css";

export default function App() {
  const [user, setUser] = useState(null);
  return user ? <Dashboard user={user} /> : <Login onLogin={setUser} />;
}

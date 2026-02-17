import { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("login"); // login | register

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setPage("login");
  };

  // ===== NOT LOGGED IN =====
  if (!user) {
    if (page === "register") {
      return (
        <Register
          onLogin={handleLogin}
          goToLogin={() => setPage("login")}
        />
      );
    }

    return (
      <Login
        onLogin={handleLogin}
        goToRegister={() => setPage("register")}
      />
    );
  }

  // ===== LOGGED IN =====
  return <Dashboard user={user} onLogout={handleLogout} />;
}

export default App;

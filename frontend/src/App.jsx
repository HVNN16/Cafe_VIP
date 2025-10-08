import React, { useState, useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";

export default function App() {
  const [page, setPage] = useState(window.location.pathname);

  // 🔁 Theo dõi thay đổi URL (khi chuyển bằng window.location.href)
  useEffect(() => {
    const handlePopState = () => setPage(window.location.pathname);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleLoginSuccess = () => {
    window.location.href = "/home";
  };

  // 🔀 Điều hướng giữa các trang
  if (page === "/register") return <Register />;
  if (page === "/home") return <Home />;
  return <Login onLoginSuccess={handleLoginSuccess} />;
}

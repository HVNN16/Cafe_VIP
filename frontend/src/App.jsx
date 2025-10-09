import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import MenuUser from "./pages/MenuUser";
import MenuAdmin from "./pages/MenuAdmin";
import TableList from "./pages/TableList";
import TableAdmin from "./pages/TableAdmin";
import OrderCreate from "./pages/OrderCreate.jsx";

// ✅ Hàm tiện ích kiểm tra login và quyền
const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return token && token !== "null" && token !== "undefined";
};

const getRole = () => localStorage.getItem("role");

// ✅ Route bảo vệ
function PrivateRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
}

function AdminRoute({ children }) {
  const role = getRole();
  if (!isAuthenticated()) return <Navigate to="/login" replace />;
  if (role !== "ADMIN") return <Navigate to="/home" replace />;
  return children;
}

export default function App() {
  return (
      <BrowserRouter>
        <Routes>
          {/* 🟢 Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* 🏠 User */}
          <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/menu" element={<PrivateRoute><MenuUser /></PrivateRoute>} />
          <Route path="/tables" element={<PrivateRoute><TableList /></PrivateRoute>} />

          {/* 🧾 Admin */}
          <Route path="/menu-admin" element={<AdminRoute><MenuAdmin /></AdminRoute>} />
          <Route path="/table-admin" element={<AdminRoute><TableAdmin /></AdminRoute>} />
          <Route path="/order/:tableId" element={<OrderCreate />} />

          {/* 🔄 Mặc định */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
  );
}

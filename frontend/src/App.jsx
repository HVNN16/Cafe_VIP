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
import OrderPage from "./pages/OrderPage";
import OrderAdmin from "./pages/admin/OrderAdmin.jsx";
import Dashboard from "./pages/admin/Dashboard.jsx";

// ✅ Kiểm tra login & role
const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return token && token !== "null" && token !== "undefined";
};

const getRole = () => localStorage.getItem("role");

// ✅ Route bảo vệ user
function PrivateRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
}

// ✅ Route bảo vệ admin
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

          {/* 🏠 USER */}
          <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/menu" element={<PrivateRoute><MenuUser /></PrivateRoute>} />
          <Route path="/tables" element={<PrivateRoute><TableList /></PrivateRoute>} />
          <Route path="/order/:tableId" element={<PrivateRoute><OrderCreate /></PrivateRoute>} />

          {/* 🧾 ADMIN */}
          <Route path="/menu-admin" element={<AdminRoute><MenuAdmin /></AdminRoute>} />
          <Route path="/table-admin" element={<AdminRoute><TableAdmin /></AdminRoute>} />
          <Route path="/admin/order/:tableId" element={<AdminRoute><OrderPage /></AdminRoute>} />
          <Route path="/admin/orders" element={<AdminRoute><OrderAdmin /></AdminRoute>} />
          <Route path="/admin/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />


          {/* 🔄 Mặc định */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
  );
}

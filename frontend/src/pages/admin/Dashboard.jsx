import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import {
    LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
    Legend, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";

const COLORS = ["#f87171", "#facc15", "#34d399", "#60a5fa", "#a78bfa"];

export default function Dashboard() {
    const [overview, setOverview] = useState({});
    const [daily, setDaily] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [o, d, t] = await Promise.all([
                    axios.get("/stats/overview", { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get("/stats/daily", { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get("/stats/top-products", { headers: { Authorization: `Bearer ${token}` } }),
                ]);
                setOverview(o.data);
                setDaily(d.data);
                setTopProducts(t.data);
            } catch (err) {
                console.error("❌ Lỗi khi tải thống kê:", err);
            }
        };
        fetchData();
    }, [token]);

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* 🧭 Sidebar */}
            <aside className="w-64 bg-amber-800 text-white flex flex-col p-4">
                <h1 className="text-2xl font-bold mb-8 text-center">☕ Cafe Admin</h1>
                <nav className="flex flex-col gap-4 text-lg">
                    <a href="/admin/dashboard" className="hover:text-amber-300">📊 Dashboard</a>
                    <a href="/menu-admin" className="hover:text-amber-300">🍽️ Menu</a>
                    <a href="/table-admin" className="hover:text-amber-300">🪑 Bàn</a>
                    <a href="/admin/orders" className="hover:text-amber-300">🧾 Đơn hàng</a>
                </nav>
            </aside>

            {/* 📈 Nội dung chính */}
            <main className="flex-1 p-8">
                <header className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">📊 Thống kê tổng quan</h2>
                    <button
                        onClick={() => {
                            localStorage.clear();
                            window.location.href = "/login";
                        }}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                        🚪 Đăng xuất
                    </button>
                </header>

                {/* Tổng quan */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                    <div className="bg-white p-6 rounded-xl shadow text-center">
                        <h3 className="text-gray-600 text-lg">💰 Tổng doanh thu</h3>
                        <p className="text-3xl font-bold text-green-700">
                            {overview.totalRevenue?.toLocaleString()} ₫
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow text-center">
                        <h3 className="text-gray-600 text-lg">📦 Tổng đơn hàng</h3>
                        <p className="text-3xl font-bold text-blue-700">{overview.totalOrders}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow text-center">
                        <h3 className="text-gray-600 text-lg">✅ Đơn đã thanh toán</h3>
                        <p className="text-3xl font-bold text-amber-600">{overview.totalPaidOrders}</p>
                    </div>
                </div>

                {/* Biểu đồ doanh thu */}
                <div className="bg-white p-6 rounded-xl shadow mb-10">
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">📆 Doanh thu theo ngày</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={daily}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={3} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Biểu đồ top món */}
                <div className="bg-white p-6 rounded-xl shadow">
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">🥇 Top 5 món bán chạy</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={topProducts}
                                dataKey="quantity"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={120}
                                label
                            >
                                {topProducts.map((_, i) => (
                                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </main>
        </div>
    );
}

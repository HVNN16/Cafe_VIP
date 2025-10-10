import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { Link } from "react-router-dom";

export default function MenuUser() {
    const [menu, setMenu] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const res = await axios.get("/products", {
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                });
                setMenu(res.data);
            } catch (err) {
                console.error("❌ Lỗi khi tải menu:", err);
                alert("Không thể tải danh sách menu. Vui lòng đăng nhập lại!");
            } finally {
                setLoading(false);
            }
        };
        fetchMenu();
    }, [token]);

    const formatMoney = (n) =>
        n?.toLocaleString("vi-VN", { style: "currency", currency: "VND" }) || "0 ₫";

    if (loading) return <p className="text-center mt-10">Đang tải menu...</p>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 flex flex-col">
            {/* 🌟 Navbar */}
            <nav className="bg-amber-900 text-white shadow-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <span className="text-3xl">☕</span>
                        <h1 className="text-2xl font-bold tracking-wide">Luxury Café</h1>
                    </div>

                    {/* Menu Links */}
                    <div className="hidden md:flex gap-8 text-lg">
                        <Link to="/home" className="hover:text-amber-300 transition">
                            🏠 Trang chủ
                        </Link>
                        <Link
                            to="/menu"
                            className="text-amber-200 font-semibold hover:text-amber-300 transition"
                        >
                            🍽️ Menu
                        </Link>
                        <Link to="/tables" className="hover:text-amber-300 transition">
                            🪑 Bàn
                        </Link>
                    </div>

                    {/* Logout */}
                    <button
                        onClick={() => {
                            localStorage.clear();
                            window.location.href = "/";
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition shadow"
                    >
                        🚪 Đăng xuất
                    </button>
                </div>
            </nav>

            {/* 🍰 Nội dung Menu */}
            <main className="flex-1 px-6 py-10 max-w-7xl mx-auto">
                <h2 className="text-4xl font-extrabold text-center text-[#6b3e26] mb-12 drop-shadow">
                    ☕ Thực Đơn Hôm Nay
                </h2>

                {menu.length === 0 ? (
                    <p className="text-center text-gray-500 text-lg">
                        Hiện chưa có sản phẩm nào trong menu.
                    </p>
                ) : (
                    <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {menu.map((item) => (
                            <div
                                key={item._id || item.id}
                                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden border border-amber-100 transform hover:-translate-y-2 duration-300"
                            >
                                <div className="relative group">
                                    <img
                                        src={item.image || "https://via.placeholder.com/400x300?text=No+Image"}
                                        alt={item.name}
                                        className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center text-white text-lg font-semibold">
                                        {item.category || "Đồ uống"}
                                    </div>
                                </div>

                                <div className="p-5 text-center">
                                    <h3 className="text-xl font-bold text-[#6b3e26] mb-1">
                                        {item.name}
                                    </h3>
                                    <p className="text-[#d97706] font-semibold text-lg mb-3">
                                        {formatMoney(item.price)}
                                    </p>

                                    <button

                                        className="bg-[#6b3e26] hover:bg-[#8c5a3b] text-white px-5 py-2 rounded-full text-sm font-semibold transition"
                                    >
                                        <Link to="/tables" className="hover:text-amber-300 transition">
                                            Đặt Bàn Ngay !!
                                        </Link>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* 🌿 Footer */}
            <footer className="bg-amber-900 text-white text-center py-4 mt-auto">
                © 2025 Luxury Café — Designed by Văn Nghĩa ☕
            </footer>
        </div>
    );
}

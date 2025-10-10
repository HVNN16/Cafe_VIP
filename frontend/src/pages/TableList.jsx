import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

export default function TableList() {
    const [tables, setTables] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    // 🟢 Lấy toàn bộ danh sách bàn (kể cả đang phục vụ / đã thanh toán)
    const fetchTables = async () => {
        try {
            const res = await axios.get("/tables", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTables(res.data);
        } catch (err) {
            console.error("🚫 Lỗi khi tải danh sách bàn:", err);
            alert("Không thể tải danh sách bàn!");
        }
    };

    useEffect(() => {
        fetchTables();
    }, []);

    // 🪑 Khi user click bàn trống → sang trang đặt món
    const handleSelect = (tableId) => {
        navigate(`/order/${tableId}`);
    };

    // 🎨 Hàm xác định màu trạng thái
    const getStatusStyle = (status) => {
        switch (status) {
            case "available":
                return "text-green-600 bg-green-50 border-green-300";
            case "occupied":
                return "text-yellow-600 bg-yellow-50 border-yellow-300";
            case "paid":
                return "text-blue-600 bg-blue-50 border-blue-300";
            default:
                return "text-gray-600 bg-gray-50 border-gray-300";
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 flex flex-col">
            {/* 🌟 Navbar */}
            <nav className="bg-amber-900 text-white shadow-lg sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">☕</span>
                        <h1 className="text-2xl font-bold tracking-wide">Luxury Café</h1>
                    </div>

                    {/* Menu Links */}
                    <div className="hidden md:flex gap-8 text-lg">
                        <Link to="/home" className="hover:text-amber-300 transition">
                            🏠 Trang chủ
                        </Link>
                        <Link to="/menu" className="hover:text-amber-300 transition">
                            🍽️ Menu
                        </Link>
                        <Link
                            to="/tables"
                            className="font-semibold text-amber-200 hover:text-amber-300 transition"
                        >
                            🪑 Bàn
                        </Link>
                    </div>

                    {/* Logout */}
                    <button
                        onClick={() => {
                            localStorage.clear();
                            window.location.href = "/";
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
                    >
                        🚪 Đăng xuất
                    </button>
                </div>
            </nav>

            {/* 🪑 Nội dung chính */}
            <main className="flex-1 px-8 py-10 max-w-7xl mx-auto w-full">
                <h2 className="text-4xl font-extrabold text-center text-[#6b3e26] mb-10 drop-shadow">
                    🪑 Danh Sách Tất Cả Bàn
                </h2>

                {tables.length === 0 ? (
                    <p className="text-center text-gray-500 text-lg">
                        Hiện chưa có bàn nào trong hệ thống ☕
                    </p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {tables.map((t) => (
                            <div
                                key={t.id || t._id}
                                className={`p-6 rounded-2xl border shadow-md hover:shadow-xl hover:-translate-y-1 transition bg-white ${getStatusStyle(
                                    t.status
                                )}`}
                            >
                                <h3 className="text-2xl font-bold mb-2 text-[#6b3e26]">
                                    Bàn {t.tableNumber}
                                </h3>
                                <p className="text-gray-700 font-medium">
                                    👥 Sức chứa: {t.capacity} người
                                </p>
                                <p className="text-gray-700 font-medium">
                                    📍 Vị trí: {t.location || "—"}
                                </p>

                                <p className="mt-3 text-lg font-semibold capitalize">
                                    {t.status === "available"
                                        ? "🟢 Trống"
                                        : t.status === "occupied"
                                            ? "🟡 Đang phục vụ"
                                            : t.status === "paid"
                                                ? "🔵 Đã thanh toán"
                                                : "⚪ Không rõ"}
                                </p>

                                <button
                                    disabled={t.status !== "available"}
                                    onClick={() => handleSelect(t.id || t._id)}
                                    className={`w-full mt-4 py-2 rounded-lg text-white font-semibold shadow ${
                                        t.status === "available"
                                            ? "bg-green-600 hover:bg-green-700"
                                            : "bg-gray-400 cursor-not-allowed"
                                    }`}
                                >
                                    {t.status === "available" ? "🪑 Chọn bàn" : "🚫 Không khả dụng"}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* 🌿 Footer */}
            <footer className="bg-amber-900 text-white text-center py-4 mt-auto">
                © 2025 Luxury Café — Designed Văn Nghĩa ☕
            </footer>
        </div>
    );
}

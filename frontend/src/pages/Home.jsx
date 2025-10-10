import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = "/";
    };

    return (
        <div className="min-h-screen bg-amber-50 flex flex-col">
            {/* 🌟 Navbar */}
            <nav className="bg-amber-900 text-white shadow-lg">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">☕</span>
                        <h1 className="text-2xl font-bold tracking-wide">Luxury Café</h1>
                    </div>

                    {/* Menu Links */}
                    <div className="hidden md:flex gap-8 text-lg">
                        <Link
                            to="/home"
                            className="hover:text-amber-300 transition"
                        >
                            🏠 Trang chủ
                        </Link>
                        <Link
                            to="/menu"
                            className="hover:text-amber-300 transition"
                        >
                            🍽️ Menu
                        </Link>
                        <Link
                            to="/tables"
                            className="hover:text-amber-300 transition"
                        >
                            🪑 Đặt Bàn
                        </Link>
                    </div>

                    {/* User info + logout */}
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="font-semibold">{username || "Khách"}</p>
                            <p className="text-sm opacity-80">{role}</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
                        >
                            🚪 Đăng xuất
                        </button>
                    </div>
                </div>
            </nav>

            {/* 🏠 Main Content */}
            <main className="flex flex-col justify-center items-center flex-1 text-center px-6 py-20">
                <h2 className="text-4xl font-extrabold text-amber-900 mb-6">
                    Chào mừng đến với Luxury Café ☕
                </h2>
                <p className="text-lg text-gray-700 max-w-2xl mb-10">
                    Hãy chọn món yêu thích của bạn, đặt bàn, và tận hưởng trải nghiệm cà phê tuyệt vời.
                    Chúng tôi luôn sẵn sàng phục vụ bạn với chất lượng tốt nhất 💛
                </p>

                <div className="flex flex-wrap gap-6 justify-center">
                    <Link
                        to="/menu"
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl shadow-md transition text-lg"
                    >
                        🍰 Xem Menu
                    </Link>
                    <Link
                        to="/tables"
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-xl shadow-md transition text-lg"
                    >
                        🪑 Đặt Bàn
                    </Link>
                </div>
            </main>

            {/* 🌿 Footer */}
            <footer className="bg-amber-900 text-white text-center py-4 mt-auto">
                © 2025 Luxury Café — Designed Văn Nghĩa ☕
            </footer>
        </div>
    );
}

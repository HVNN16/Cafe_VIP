import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function AdminLayout({ children }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    return (
        <div className="flex min-h-screen bg-amber-50">
            {/* 🧭 Sidebar */}
            <aside className="w-64 bg-amber-900 text-white flex flex-col p-4">
                <h1 className="text-2xl font-bold mb-8 text-center">☕ Cafe Admin</h1>
                <nav className="flex flex-col gap-4 text-lg">
                    <Link to="/admin/dashboard" className="hover:text-amber-300">
                        📊 Dashboard
                    </Link>
                    <Link to="/menu-admin" className="hover:text-amber-300">
                        🍽️ Menu
                    </Link>
                    <Link to="/table-admin" className="hover:text-amber-300">
                        🪑 Bàn
                    </Link>
                    <Link to="/admin/orders" className="hover:text-amber-300">
                        🧾 Đơn hàng
                    </Link>
                </nav>

                <div className="mt-auto">
                    <button
                        onClick={handleLogout}
                        className="w-full bg-red-600 mt-6 py-2 rounded hover:bg-red-700"
                    >
                        🚪 Đăng xuất
                    </button>
                </div>
            </aside>

            {/* Nội dung chính */}
            <main className="flex-1 p-8">
                <header className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-800">Khu vực quản lý</h2>
                    <span className="text-gray-600">👤 Admin</span>
                </header>
                {children}
            </main>
        </div>
    );
}

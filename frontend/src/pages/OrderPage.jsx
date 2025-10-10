import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "../api/axios";

export default function OrderPage() {
    const { tableId } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const [menu, setMenu] = useState([]);
    const [orderItems, setOrderItems] = useState([]);

    // 🟢 Lấy danh sách món từ backend
    useEffect(() => {
        axios
            .get("/products", {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => setMenu(res.data))
            .catch((err) => console.error("❌ Lỗi khi tải menu:", err));
    }, [token]);

    // 🔄 Reset đơn khi đổi bàn
    useEffect(() => {
        setOrderItems([]);
    }, [tableId]);

    // ➕ Thêm món vào đơn hàng
    const handleAddToOrder = (item) => {
        setOrderItems((prev) => {
            const found = prev.find((i) => i.productId === item.id || i.productId === item._id);
            if (found) {
                return prev.map((i) =>
                    i.productId === found.productId ? { ...i, quantity: i.quantity + 1 } : i
                );
            } else {
                return [
                    ...prev,
                    {
                        productId: item.id || item._id,
                        name: item.name,
                        price: item.price,
                        quantity: 1,
                    },
                ];
            }
        });
    };

    // 🔢 Thay đổi số lượng
    const handleChangeQty = (productId, qty) => {
        if (qty < 1) qty = 1;
        setOrderItems((prev) =>
            prev.map((i) => (i.productId === productId ? { ...i, quantity: qty } : i))
        );
    };

    // ❌ Xóa món
    const handleRemoveItem = (productId) => {
        setOrderItems((prev) => prev.filter((i) => i.productId !== productId));
    };

    // 💰 Tổng tiền
    const total = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

    // ✅ Gửi đơn hàng
    const handleSubmitOrder = async () => {
        if (orderItems.length === 0) {
            alert("Vui lòng chọn ít nhất 1 món!");
            return;
        }

        const payload = {
            tableId,
            items: orderItems,
        };

        try {
            await axios.post("/orders", payload, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert("✅ Đặt món thành công!");
            setOrderItems([]);
            navigate("/tables");
        } catch (err) {
            console.error("🚫 Lỗi khi đặt món:", err);
            alert("Không thể đặt món!");
        }
    };

    const formatMoney = (n) =>
        n?.toLocaleString("vi-VN", { style: "currency", currency: "VND" }) || "0 ₫";

    return (
        <div className="min-h-screen bg-amber-50 flex flex-col">
            {/* 🌟 Navbar */}
            <nav className="bg-amber-900 text-white shadow-lg">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">☕</span>
                        <h1 className="text-2xl font-bold tracking-wide">Luxury Café</h1>
                    </div>

                    <div className="hidden md:flex gap-8 text-lg">
                        <Link to="/home" className="hover:text-amber-300 transition">
                            🏠 Trang chủ
                        </Link>
                        <Link to="/menu" className="hover:text-amber-300 transition">
                            🍽️ Menu
                        </Link>
                        <Link
                            to="/tables"
                            className="hover:text-amber-300 transition font-semibold text-amber-200"
                        >
                            🪑 Bàn
                        </Link>
                    </div>

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

            {/* 🍽️ Nội dung */}
            <main className="flex-1 px-8 py-10">
                <h1 className="text-3xl font-bold mb-8 text-center text-amber-900">
                    🍽️ Đặt món cho bàn #{tableId}
                </h1>

                {/* Thực đơn */}
                <h2 className="text-xl font-semibold mb-4 text-amber-800">☕ Thực đơn hôm nay</h2>
                <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {menu.map((m) => (
                        <div
                            key={m._id}
                            className="bg-white border border-amber-200 rounded-2xl shadow hover:shadow-xl transition overflow-hidden"
                        >
                            <img
                                src={m.image || "https://placehold.co/300x200?text=No+Image"}
                                alt={m.name}
                                className="w-full h-44 object-cover"
                            />
                            <div className="p-4 text-center">
                                <h3 className="font-bold text-lg text-amber-900">{m.name}</h3>
                                <p className="text-green-700 font-semibold mb-2">{formatMoney(m.price)}</p>
                                <p className="text-sm text-gray-500 italic mb-3">
                                    {m.category || "Chưa phân loại"}
                                </p>
                                <button
                                    onClick={() => handleAddToOrder(m)}
                                    className="bg-amber-700 text-white px-5 py-2 rounded-lg hover:bg-amber-800 transition w-full"
                                >
                                    ➕ Thêm vào đơn
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Đơn hàng */}
                {orderItems.length > 0 && (
                    <div className="mt-12 bg-white p-6 rounded-2xl shadow-lg">
                        <h2 className="text-2xl font-bold mb-4 text-amber-900">🧾 Đơn hàng của bạn</h2>
                        <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                            <thead className="bg-amber-100">
                            <tr>
                                <th className="border p-2">Món</th>
                                <th className="border p-2">Số lượng</th>
                                <th className="border p-2">Đơn giá</th>
                                <th className="border p-2">Tổng</th>
                                <th className="border p-2">Xóa</th>
                            </tr>
                            </thead>
                            <tbody>
                            {orderItems.map((i) => (
                                <tr key={i.productId} className="text-center">
                                    <td className="border p-2 font-semibold">{i.name}</td>
                                    <td className="border p-2">
                                        <input
                                            type="number"
                                            min="1"
                                            value={i.quantity}
                                            onChange={(e) => handleChangeQty(i.productId, Number(e.target.value))}
                                            className="border rounded w-16 text-center"
                                        />
                                    </td>
                                    <td className="border p-2">{formatMoney(i.price)}</td>
                                    <td className="border p-2 font-bold text-green-700">
                                        {formatMoney(i.price * i.quantity)}
                                    </td>
                                    <td className="border p-2">
                                        <button
                                            onClick={() => handleRemoveItem(i.productId)}
                                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                                        >
                                            🗑️
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>

                        <div className="mt-6 text-right text-xl font-bold text-amber-900">
                            Tổng cộng: <span className="text-green-700">{formatMoney(total)}</span>
                        </div>

                        <div className="flex justify-end mt-4 gap-3">
                            <button
                                onClick={() => navigate("/tables")}
                                className="bg-gray-500 text-white px-5 py-2 rounded hover:bg-gray-600"
                            >
                                🔙 Quay lại
                            </button>
                            <button
                                onClick={handleSubmitOrder}
                                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                            >
                                ✅ Đặt món
                            </button>
                        </div>
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

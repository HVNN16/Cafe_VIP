import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { useParams, useNavigate } from "react-router-dom";

export default function OrderCreate() {
    const { tableId } = useParams();
    const navigate = useNavigate();
    const [menu, setMenu] = useState([]);
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("token");

    // 🧭 Lấy danh sách menu
    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const res = await axios.get("/products", {
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                });
                setMenu(res.data);
            } catch (err) {
                console.error("❌ Lỗi khi tải menu:", err);
                alert("Không thể tải menu!");
            } finally {
                setLoading(false);
            }
        };
        fetchMenu();
    }, [token]);

    // ➕ Thêm hoặc cập nhật món trong giỏ
    const addToCart = (product, qty) => {
        const key = `${product._id || product.id}-${product.name}-${product.price}`;
        if (qty < 0) qty = 0;

        setCart((prev) => {
            const exist = prev.find((i) => i.key === key);
            if (exist) {
                return prev.map((i) =>
                    i.key === key ? { ...i, quantity: qty } : i
                );
            } else {
                return [
                    ...prev,
                    {
                        key,
                        productId: product._id || product.id,
                        name: product.name,
                        price: product.price,
                        quantity: qty,
                    },
                ];
            }
        });
    };

    // 🧾 Tính tổng tiền
    const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

    // 🟢 Gửi đơn hàng
    const handleSubmit = async () => {
        const validItems = cart.filter((i) => i.quantity > 0);
        if (validItems.length === 0) {
            alert("Vui lòng chọn ít nhất 1 món!");
            return;
        }

        if (!window.confirm(`Xác nhận đặt ${validItems.length} món, tổng ${total.toLocaleString()}₫ ?`)) {
            return;
        }

        const payload = { tableId, items: validItems };

        try {
            await axios.post("/orders", payload, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert("✅ Đặt món thành công!");
            navigate("/tables");
        } catch (err) {
            console.error("🚫 Lỗi khi gửi đơn hàng:", err);
            alert("Không thể gửi đơn hàng!");
        }
    };

    if (loading)
        return <p className="text-center mt-10">Đang tải menu...</p>;

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
                        <button onClick={() => navigate("/home")} className="hover:text-amber-300 transition">🏠 Trang chủ</button>
                        <button onClick={() => navigate("/menu")} className="hover:text-amber-300 transition">🍽️ Menu</button>
                        <button onClick={() => navigate("/tables")} className="hover:text-amber-300 transition font-semibold text-amber-200">🪑 Bàn</button>
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

            {/* 🍴 Nội dung chia làm 2 cột */}
            <main className="flex-1 flex flex-col md:flex-row p-6 gap-6">
                {/* ✅ Cột trái: Menu có thể cuộn */}
                <div className="flex-1 overflow-y-auto h-[calc(100vh-180px)] pr-4">
                    <h1 className="text-3xl font-bold text-center text-amber-900 mb-6">
                        🍽️ Đặt món cho bàn #{tableId}
                    </h1>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {menu.map((item) => {
                            const key = `${item._id || item.id}-${item.name}-${item.price}`;
                            const cartItem = cart.find((c) => c.key === key) || { quantity: 0 };
                            return (
                                <div
                                    key={key}
                                    className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden"
                                >
                                    <img
                                        src={item.image || "https://placehold.co/300x200?text=No+Image"}
                                        alt={item.name}
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="p-5 text-center">
                                        <h3 className="text-lg font-bold text-[#6b3e26]">{item.name}</h3>
                                        <p className="text-[#d97706] font-semibold mt-1">
                                            {item.price.toLocaleString()} ₫
                                        </p>
                                        <p className="text-sm text-gray-500 italic mb-3">{item.category}</p>

                                        {/* Bộ điều khiển số lượng */}
                                        <div className="flex justify-center items-center gap-3 mb-3">
                                            <button
                                                className="bg-[#d4a373] text-white px-3 py-1 rounded-full hover:bg-[#b08968]"
                                                onClick={() =>
                                                    addToCart(item, Math.max(cartItem.quantity - 1, 0))
                                                }
                                            >
                                                -
                                            </button>
                                            <span className="text-lg font-semibold">{cartItem.quantity}</span>
                                            <button
                                                className="bg-[#6b3e26] text-white px-3 py-1 rounded-full hover:bg-[#8c5a3b]"
                                                onClick={() => addToCart(item, cartItem.quantity + 1)}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ✅ Cột phải: Tóm tắt đơn hàng (cố định khi cuộn) */}
                <div className="w-full md:w-[380px] bg-white p-6 rounded-2xl shadow-lg h-fit md:sticky md:top-6 self-start">
                    <h2 className="text-2xl font-bold text-center mb-4 text-[#6b3e26]">
                        🧾 Tóm tắt đơn hàng
                    </h2>

                    {cart.filter((i) => i.quantity > 0).length === 0 ? (
                        <p className="text-center text-gray-500">Chưa có món nào được chọn</p>
                    ) : (
                        <table className="w-full border-t border-gray-300 text-sm">
                            <thead>
                            <tr className="bg-amber-100 text-[#6b3e26]">
                                <th className="py-2">Món</th>
                                <th className="py-2">SL</th>
                                <th className="py-2">Tổng</th>
                            </tr>
                            </thead>
                            <tbody>
                            {cart
                                .filter((i) => i.quantity > 0)
                                .map((i) => (
                                    <tr key={i.key} className="text-center border-b">
                                        <td className="py-1">{i.name}</td>
                                        <td>{i.quantity}</td>
                                        <td>{(i.price * i.quantity).toLocaleString()} ₫</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    <div className="text-right mt-4 text-lg font-bold text-[#6b3e26]">
                        Tổng cộng: {total.toLocaleString()} ₫
                    </div>

                    <div className="flex justify-center mt-6">
                        <button
                            onClick={handleSubmit}
                            className="bg-[#6b3e26] text-white px-8 py-3 rounded-lg hover:bg-[#8c5a3b] transition-all w-full"
                        >
                            ✅ Xác nhận đặt món
                        </button>
                    </div>
                </div>
            </main>

            {/* 🌿 Footer */}
            <footer className="bg-amber-900 text-white text-center py-4 mt-auto">
                © 2025 Luxury Café — Designed by Văn Nghĩa ☕
            </footer>
        </div>
    );
}

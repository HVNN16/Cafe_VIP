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
        if (qty < 0) qty = 0;
        setCart((prev) => {
            const exist = prev.find((i) => i.productId === product._id);
            if (exist) {
                return prev.map((i) =>
                    i.productId === product._id ? { ...i, quantity: qty } : i
                );
            } else {
                return [...prev, { productId: product._id, name: product.name, price: product.price, quantity: qty }];
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

        const payload = { tableId, items: validItems };

        try {
            const res = await axios.post("/orders", payload, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert("✅ Đặt món thành công!");
            navigate("/home");
        } catch (err) {
            console.error("🚫 Lỗi khi gửi đơn hàng:", err);
            alert("Không thể gửi đơn hàng!");
        }
    };

    if (loading) return <p className="text-center mt-10">Đang tải menu...</p>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-8">
            <h1 className="text-4xl font-extrabold text-center mb-8 text-[#6b3e26]">
                🍽️ Đặt món cho bàn #{tableId}
            </h1>

            {/* Danh sách món */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {menu.map((item) => {
                    const cartItem = cart.find((c) => c.productId === item._id) || { quantity: 0 };
                    return (
                        <div
                            key={item._id}
                            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden"
                        >
                            <img
                                src={item.image || "https://via.placeholder.com/300x200?text=No+Image"}
                                alt={item.name}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-5 text-center">
                                <h3 className="text-xl font-bold text-[#6b3e26]">{item.name}</h3>
                                <p className="text-[#d97706] font-semibold mt-1">{item.price} ₫</p>
                                <p className="text-sm text-gray-500 italic mb-3">{item.category}</p>

                                {/* Bộ điều khiển số lượng */}
                                <div className="flex justify-center items-center gap-3 mb-3">
                                    <button
                                        className="bg-[#d4a373] text-white px-3 py-1 rounded-full hover:bg-[#b08968]"
                                        onClick={() => addToCart(item, cartItem.quantity - 1)}
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

            {/* Tóm tắt đơn hàng */}
            <div className="bg-white mt-12 p-6 rounded-2xl shadow-lg max-w-3xl mx-auto">
                <h2 className="text-2xl font-bold text-center mb-4 text-[#6b3e26]">
                    🧾 Tóm tắt đơn hàng
                </h2>
                {cart.filter((i) => i.quantity > 0).length === 0 ? (
                    <p className="text-center text-gray-500">Chưa có món nào được chọn</p>
                ) : (
                    <table className="w-full border-t border-gray-300">
                        <thead>
                        <tr className="bg-amber-100 text-[#6b3e26]">
                            <th className="py-2">Món</th>
                            <th className="py-2">SL</th>
                            <th className="py-2">Giá</th>
                            <th className="py-2">Tổng</th>
                        </tr>
                        </thead>
                        <tbody>
                        {cart
                            .filter((i) => i.quantity > 0)
                            .map((i) => (
                                <tr key={i.productId} className="text-center border-b">
                                    <td className="py-2">{i.name}</td>
                                    <td>{i.quantity}</td>
                                    <td>{i.price.toLocaleString()} ₫</td>
                                    <td>{(i.price * i.quantity).toLocaleString()} ₫</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                <div className="text-right mt-4 text-xl font-bold text-[#6b3e26]">
                    Tổng cộng: {total.toLocaleString()} ₫
                </div>
                <div className="flex justify-center mt-6">
                    <button
                        onClick={handleSubmit}
                        className="bg-[#6b3e26] text-white px-8 py-3 rounded-lg hover:bg-[#8c5a3b] transition-all"
                    >
                        ✅ Xác nhận đặt món
                    </button>
                </div>
            </div>
        </div>
    );
}

import React, { useEffect, useState } from "react";
import axios from "../api/axios";

export default function MenuUser() {
    const [menu, setMenu] = useState([]);
    const [loading, setLoading] = useState(true);

    // ✅ Gửi token (nếu có) để xác thực
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

    if (loading) return <p className="text-center mt-10">Đang tải menu...</p>;

    return (
        <div className="p-10 grid grid-cols-3 gap-6">
            {menu.length === 0 ? (
                <p className="col-span-3 text-center text-gray-500">
                    Hiện chưa có sản phẩm nào trong menu.
                </p>
            ) : (
                menu.map((item) => (
                    <div
                        key={item.id || item._id}
                        className="border p-4 rounded-xl shadow text-center bg-white hover:shadow-lg transition"
                    >
                        <img
                            src={item.image || "https://via.placeholder.com/150"}
                            alt={item.name}
                            className="w-full h-48 object-cover rounded"
                        />
                        <h2 className="font-bold text-lg mt-2">{item.name}</h2>
                        <p className="text-pink-600 font-semibold">{item.price}₫</p>
                        <p className="text-sm text-gray-500">{item.category}</p>
                    </div>
                ))
            )}
        </div>
    );
}

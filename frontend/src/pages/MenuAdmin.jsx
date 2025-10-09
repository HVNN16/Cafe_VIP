import React, { useState, useEffect } from "react";
import axios from "../api/axios";

export default function MenuAdmin() {
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState({
        _id: "",
        name: "",
        price: "",
        image: "",
        category: "",
    });
    const [editing, setEditing] = useState(false);

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    // 🔒 Kiểm tra quyền truy cập
    useEffect(() => {
        if (role !== "ADMIN") {
            alert("🚫 Bạn không có quyền truy cập trang này!");
            window.location.href = "/home";
        }
    }, [role]);

    // 📦 Lấy danh sách sản phẩm
    const fetchProducts = async () => {
        try {
            const res = await axios.get("/products", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProducts(res.data);
        } catch (err) {
            console.error("❌ Lỗi khi tải danh sách sản phẩm:", err);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // ➕ Thêm sản phẩm
    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await axios.post("/products", form, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert("✅ Thêm sản phẩm thành công!");
            setForm({ _id: "", name: "", price: "", image: "", category: "" });
            fetchProducts();
        } catch (err) {
            console.error("❌ Lỗi thêm sản phẩm:", err);
            alert("❌ Không thể thêm sản phẩm!");
        }
    };

    // ✏️ Chọn sản phẩm để sửa
    const handleEdit = (p) => {
        console.log("🪄 Đang sửa sản phẩm:", p);
        setForm({
            _id: p._id || p.id || "", // ✅ luôn lấy đúng ID từ MongoDB
            name: p.name || "",
            price: p.price || "",
            image: p.image || "",
            category: p.category || "",
        });
        setEditing(true);
    };

    // 💾 Cập nhật sản phẩm
    const handleUpdate = async (e) => {
        e.preventDefault();

        if (!form._id) {
            alert("❌ Không tìm thấy ID sản phẩm!");
            return;
        }

        try {
            await axios.put(`/products/${form._id}`, form, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert("✏️ Cập nhật sản phẩm thành công!");
            setEditing(false);
            setForm({ _id: "", name: "", price: "", image: "", category: "" });
            fetchProducts();
        } catch (err) {
            console.error("🚫 Lỗi cập nhật sản phẩm:", err);
            alert("❌ Không thể cập nhật sản phẩm!");
        }
    };

    // 🗑️ Xóa sản phẩm
    const handleDelete = async (id) => {
        if (!window.confirm("Bạn chắc chắn muốn xóa món này?")) return;
        try {
            await axios.delete(`/products/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert("🗑️ Xóa sản phẩm thành công!");
            fetchProducts();
        } catch (err) {
            console.error("❌ Lỗi xóa sản phẩm:", err);
            alert("❌ Không thể xóa sản phẩm!");
        }
    };

    return (
        <div className="min-h-screen bg-[#faf6f3] text-gray-900 p-10">
            <h1 className="text-4xl font-extrabold mb-6 text-center text-[#6b3e26]">
                ☕ Quản lý Menu Nhà Hàng
            </h1>

            {/* FORM */}
            <form
                onSubmit={editing ? handleUpdate : handleAdd}
                className="bg-white p-6 rounded-2xl shadow-lg mb-10 flex flex-wrap gap-4 justify-center"
            >
                <input
                    type="text"
                    placeholder="Tên món"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="border rounded-lg p-3 w-60 focus:outline-none focus:ring-2 focus:ring-[#d4a373]"
                    required
                />
                <input
                    type="number"
                    placeholder="Giá"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="border rounded-lg p-3 w-40 focus:outline-none focus:ring-2 focus:ring-[#d4a373]"
                    required
                />
                <input
                    type="text"
                    placeholder="Link ảnh (URL)"
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    className="border rounded-lg p-3 w-72 focus:outline-none focus:ring-2 focus:ring-[#d4a373]"
                />
                <input
                    type="text"
                    placeholder="Phân loại"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="border rounded-lg p-3 w-52 focus:outline-none focus:ring-2 focus:ring-[#d4a373]"
                />

                <button
                    type="submit"
                    className="bg-[#6b3e26] text-white px-6 py-3 rounded-lg hover:bg-[#8c5a3b] transition-all"
                >
                    {editing ? "💾 Lưu thay đổi" : "➕ Thêm món"}
                </button>

                {editing && (
                    <button
                        type="button"
                        onClick={() => {
                            setEditing(false);
                            setForm({
                                _id: "",
                                name: "",
                                price: "",
                                image: "",
                                category: "",
                            });
                        }}
                        className="bg-gray-400 text-white px-6 py-3 rounded-lg hover:bg-gray-500"
                    >
                        ❌ Hủy
                    </button>
                )}
            </form>

            {/* DANH SÁCH MÓN */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {products.map((p) => (
                    <div
                        key={p._id || p.id}
                        className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden"
                    >
                        <img
                            src={p.image || "https://via.placeholder.com/300x200?text=No+Image"}
                            alt={p.name}
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-5 text-center">
                            <h3 className="text-xl font-bold text-[#6b3e26]">{p.name}</h3>
                            <p className="text-[#d97706] font-semibold mt-1">{p.price} ₫</p>
                            <p className="text-sm text-gray-500 italic mb-3">{p.category}</p>

                            <div className="flex justify-center gap-3">
                                <button
                                    onClick={() => handleEdit(p)}
                                    className="bg-[#facc15] text-white px-4 py-2 rounded hover:bg-[#eab308]"
                                >
                                    ✏️ Sửa
                                </button>
                                <button
                                    onClick={() => handleDelete(p._id || p.id)}
                                    className="bg-[#dc2626] text-white px-4 py-2 rounded hover:bg-[#b91c1c]"
                                >
                                    🗑️ Xóa
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* FOOTER */}
            <footer className="text-center mt-16 text-gray-500 text-sm">
                © 2025 Luxury Cafe Manager – Designed by Văn Nghĩa ☕
            </footer>
        </div>
    );
}

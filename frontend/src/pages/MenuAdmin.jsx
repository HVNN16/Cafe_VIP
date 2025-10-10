import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import AdminLayout from "../layouts/AdminLayout";

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

    // 🔒 Kiểm tra quyền ADMIN
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
        setForm({
            _id: p._id || p.id || "",
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
        if (!form._id) return alert("❌ Không tìm thấy ID sản phẩm!");

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

    // 💵 Format giá
    const formatMoney = (n) =>
        n?.toLocaleString("vi-VN", { style: "currency", currency: "VND" }) || "0 ₫";

    return (
        <AdminLayout>
            <div>
                <h1 className="text-3xl font-bold mb-8 text-gray-800">
                    ☕ Quản lý Menu
                </h1>

                {/* FORM thêm / sửa món */}
                <form
                    onSubmit={editing ? handleUpdate : handleAdd}
                    className="bg-white shadow-md rounded-xl p-6 mb-10 flex flex-wrap gap-4 justify-center border-l-4 border-amber-400"
                >
                    <input
                        type="text"
                        placeholder="Tên món"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="border p-2 rounded w-60 focus:ring focus:ring-amber-200"
                        required
                    />
                    <input
                        type="number"
                        placeholder="Giá"
                        value={form.price}
                        onChange={(e) => setForm({ ...form, price: e.target.value })}
                        className="border p-2 rounded w-40 focus:ring focus:ring-amber-200"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Link ảnh (URL)"
                        value={form.image}
                        onChange={(e) => setForm({ ...form, image: e.target.value })}
                        className="border p-2 rounded w-80 focus:ring focus:ring-amber-200"
                    />
                    <input
                        type="text"
                        placeholder="Phân loại"
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                        className="border p-2 rounded w-52 focus:ring focus:ring-amber-200"
                    />

                    <button
                        type="submit"
                        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
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
                            className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition"
                        >
                            ❌ Hủy
                        </button>
                    )}
                </form>

                {/* DANH SÁCH MÓN */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {products.map((p) => (
                        <div
                            key={p._id || p.id}
                            className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden border border-gray-200"
                        >
                            <img
                                src={p.image || "https://via.placeholder.com/300x200?text=No+Image"}
                                alt={p.name}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-4 text-center">
                                <h3 className="text-lg font-bold text-amber-900">{p.name}</h3>
                                <p className="text-green-700 font-semibold mt-1">
                                    {formatMoney(p.price)}
                                </p>
                                <p className="text-sm text-gray-500 italic mb-3">
                                    {p.category || "Chưa phân loại"}
                                </p>

                                <div className="flex justify-center gap-3">
                                    <button
                                        onClick={() => handleEdit(p)}
                                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                                    >
                                        ✏️ Sửa
                                    </button>
                                    <button
                                        onClick={() => handleDelete(p._id || p.id)}
                                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                                    >
                                        🗑️ Xóa
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* FOOTER */}
                <footer className="text-center mt-10 text-gray-500 text-sm">
                    © 2025 Luxury Cafe Manager – Designed Văn Nghĩa ☕
                </footer>
            </div>
        </AdminLayout>
    );
}

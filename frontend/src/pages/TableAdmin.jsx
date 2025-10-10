import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import AdminLayout from "../layouts/AdminLayout";

export default function TableAdmin() {
    const [tables, setTables] = useState([]);
    const [form, setForm] = useState({
        id: "",
        tableNumber: "",
        capacity: "",
        location: "",
        status: "available",
    });
    const [editing, setEditing] = useState(false);
    const token = localStorage.getItem("token");

    // 🧩 Lấy danh sách bàn
    const fetchTables = async () => {
        try {
            const res = await axios.get("/tables", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTables(res.data);
        } catch (err) {
            console.error("🚫 Lỗi khi tải danh sách bàn:", err);
            if (err.response?.status === 403)
                alert("❌ Bạn không có quyền xem danh sách bàn!");
        }
    };

    useEffect(() => {
        fetchTables();
    }, []);

    // 🧩 Thêm / Sửa bàn
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...form };
            if (!editing) delete payload.id;

            if (editing) {
                await axios.put(`/tables/${form.id || form._id}`, payload, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                alert("✅ Cập nhật bàn thành công!");
            } else {
                await axios.post("/tables", payload, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                alert("✅ Thêm bàn mới thành công!");
            }

            setEditing(false);
            setForm({
                id: "",
                tableNumber: "",
                capacity: "",
                location: "",
                status: "available",
            });
            fetchTables();
        } catch (err) {
            console.error("🚫 Lỗi khi lưu bàn:", err);
            alert("⚠️ Không thể lưu bàn!");
        }
    };

    // 🗑️ Xóa bàn
    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc muốn xóa bàn này không?")) {
            try {
                await axios.delete(`/tables/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                fetchTables();
            } catch (err) {
                console.error("🚫 Lỗi khi xóa bàn:", err);
                alert("⚠️ Không thể xóa bàn!");
            }
        }
    };

    // 🔄 Reset trạng thái bàn
    const handleReset = async (id) => {
        try {
            await axios.put(`/tables/${id}/reset`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchTables();
        } catch (err) {
            console.error("🚫 Lỗi khi reset bàn:", err);
            alert("⚠️ Không thể reset bàn!");
        }
    };

    return (
        <AdminLayout>
            <div>
                <h1 className="text-3xl font-bold mb-8 text-gray-800">
                    🪑 Quản lý bàn
                </h1>

                {/* Form thêm/sửa bàn */}
                <form
                    onSubmit={handleSubmit}
                    className="bg-white shadow-md rounded-xl p-6 mb-8 flex flex-wrap gap-4 items-center justify-center border-l-4 border-amber-400"
                >
                    <input
                        type="number"
                        placeholder="Số bàn"
                        value={form.tableNumber}
                        onChange={(e) => setForm({ ...form, tableNumber: e.target.value })}
                        className="border p-2 rounded w-32 focus:ring focus:ring-amber-200"
                        required
                    />
                    <input
                        type="number"
                        placeholder="Sức chứa"
                        value={form.capacity}
                        onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                        className="border p-2 rounded w-32 focus:ring focus:ring-amber-200"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Vị trí"
                        value={form.location}
                        onChange={(e) => setForm({ ...form, location: e.target.value })}
                        className="border p-2 rounded w-60 focus:ring focus:ring-amber-200"
                    />
                    <select
                        value={form.status}
                        onChange={(e) => setForm({ ...form, status: e.target.value })}
                        className="border p-2 rounded w-40"
                    >
                        <option value="available">Trống</option>
                        <option value="occupied">Đang phục vụ</option>
                        <option value="paid">Đã thanh toán</option>
                    </select>

                    <button
                        type="submit"
                        className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 transition"
                    >
                        {editing ? "💾 Lưu thay đổi" : "➕ Thêm bàn"}
                    </button>

                    {editing && (
                        <button
                            type="button"
                            onClick={() => {
                                setEditing(false);
                                setForm({
                                    id: "",
                                    tableNumber: "",
                                    capacity: "",
                                    location: "",
                                    status: "available",
                                });
                            }}
                            className="bg-gray-500 text-white px-5 py-2 rounded hover:bg-gray-600 transition"
                        >
                            ❌ Hủy
                        </button>
                    )}
                </form>

                {/* Danh sách bàn */}
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300 text-center shadow-md rounded-lg overflow-hidden">
                        <thead className="bg-amber-100 text-amber-900">
                        <tr>
                            <th className="border p-2">Số bàn</th>
                            <th className="border p-2">Sức chứa</th>
                            <th className="border p-2">Vị trí</th>
                            <th className="border p-2">Trạng thái</th>
                            <th className="border p-2">Hành động</th>
                        </tr>
                        </thead>
                        <tbody>
                        {tables.map((t) => (
                            <tr
                                key={t.id || t._id}
                                className="bg-white hover:bg-amber-50 transition"
                            >
                                <td className="border p-2 font-semibold text-blue-800">
                                    {t.tableNumber}
                                </td>
                                <td className="border p-2">{t.capacity}</td>
                                <td className="border p-2">{t.location}</td>
                                <td
                                    className={`border p-2 font-bold ${
                                        t.status === "available"
                                            ? "text-green-600"
                                            : t.status === "occupied"
                                                ? "text-yellow-600"
                                                : "text-blue-600"
                                    }`}
                                >
                                    {t.status === "available"
                                        ? "Trống"
                                        : t.status === "occupied"
                                            ? "Đang phục vụ"
                                            : "Đã thanh toán"}
                                </td>
                                <td className="border p-2">
                                    <button
                                        onClick={() => {
                                            setForm(t);
                                            setEditing(true);
                                        }}
                                        className="bg-yellow-500 text-white px-3 py-1 rounded mr-2 hover:bg-yellow-600 transition"
                                    >
                                        ✏️ Sửa
                                    </button>
                                    <button
                                        onClick={() => handleDelete(t.id || t._id)}
                                        className="bg-red-600 text-white px-3 py-1 rounded mr-2 hover:bg-red-700 transition"
                                    >
                                        🗑️ Xóa
                                    </button>
                                    <button
                                        onClick={() => handleReset(t.id || t._id)}
                                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                                    >
                                        🔄 Reset
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}

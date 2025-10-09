import React, { useEffect, useState } from "react";
import axios from "../api/axios";

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

    // 🧩 Hàm lấy danh sách bàn
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

    // 🧠 Log token và payload để debug
    if (token) {
        try {
            console.log("🔑 Token:", token);
            console.log("🧾 Payload:", JSON.parse(atob(token.split(".")[1])));
        } catch (e) {
            console.warn("⚠️ Token không hợp lệ!");
        }
    }

    // 🧩 Hàm xử lý thêm/sửa bàn
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...form };
            if (!editing) delete payload.id; // ⚡ Xóa id khi thêm mới để tránh lỗi ObjectId

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

            // Reset form
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
            if (err.response?.status === 403)
                alert("❌ Bạn không có quyền (chỉ ADMIN mới được)!");
            else alert("⚠️ Lỗi không xác định!");
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

    // 🔄 Reset bàn (status → available)
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
        <div className="p-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
                🍽️ Quản lý bàn (Admin)
            </h1>

            {/* 🧾 Form thêm/sửa bàn */}
            <form
                onSubmit={handleSubmit}
                className="flex flex-wrap gap-3 mb-6 justify-center"
            >
                <input
                    type="number"
                    placeholder="Số bàn"
                    value={form.tableNumber}
                    onChange={(e) => setForm({ ...form, tableNumber: e.target.value })}
                    className="border p-2 rounded w-32"
                    required
                />
                <input
                    type="number"
                    placeholder="Sức chứa"
                    value={form.capacity}
                    onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                    className="border p-2 rounded w-32"
                    required
                />
                <input
                    type="text"
                    placeholder="Vị trí"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="border p-2 rounded w-60"
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
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
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
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
                    >
                        ❌ Hủy
                    </button>
                )}
            </form>

            {/* 🪑 Danh sách bàn */}
            <table className="w-full border-collapse border border-gray-300 text-center">
                <thead className="bg-gray-200">
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
                    <tr key={t.id || t._id}>
                        <td className="border p-2 font-semibold">{t.tableNumber}</td>
                        <td className="border p-2">{t.capacity}</td>
                        <td className="border p-2">{t.location}</td>
                        <td
                            className={`border p-2 ${
                                t.status === "available"
                                    ? "text-green-600"
                                    : t.status === "occupied"
                                        ? "text-yellow-600"
                                        : "text-blue-600"
                            }`}
                        >
                            {t.status}
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
    );
}

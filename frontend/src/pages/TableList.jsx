import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function TableList() {
    const [tables, setTables] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const fetchTables = async () => {
        try {
            const res = await axios.get("/tables", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTables(res.data);
        } catch (err) {
            alert("Không thể tải danh sách bàn!");
        }
    };

    useEffect(() => {
        fetchTables();
    }, []);

    const handleSelect = async (id) => {
        console.log("🪑 Table ID:", id);
        console.log("🔑 Token:", token);
        try {
            const res = await axios.put(`/tables/${id}/occupy`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert("✅ " + res.data.message);
            fetchTables();
        } catch (err) {
            if (err.response?.status === 400) {
                alert("❌ " + err.response.data.error);
            } else if (err.response?.status === 404) {
                alert("⚠️ " + err.response.data.error);
            } else if (err.response?.status === 403) {
                alert("🚫 Bạn không có quyền chọn bàn!");
            } else {
                alert("Lỗi không xác định khi chọn bàn!");
            }
            console.error("🚫 Lỗi khi chọn bàn:", err);
        }
    };


    return (
        <div className="p-8 min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
            <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">🪑 Danh sách bàn</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {tables.map((t) => (
                    <div
                        key={t.id || t._id}
                        className={`p-6 rounded-xl border shadow ${
                            t.status === "available"
                                ? "bg-green-50 border-green-400"
                                : t.status === "occupied"
                                    ? "bg-yellow-50 border-yellow-400"
                                    : "bg-blue-50 border-blue-400"
                        }`}
                    >
                        <h3 className="text-xl font-bold mb-2">Bàn {t.tableNumber}</h3>
                        <p>👥 {t.capacity} người</p>
                        <p>📍 {t.location}</p>
                        <p
                            className={`mt-2 font-semibold ${
                                t.status === "available"
                                    ? "text-green-600"
                                    : t.status === "occupied"
                                        ? "text-yellow-600"
                                        : "text-blue-600"
                            }`}
                        >
                            {t.status}
                        </p>
                        <button
                            disabled={t.status !== "available"}
                            onClick={() => handleSelect(t.id || t._id)}
                            className={`w-full mt-4 py-2 rounded text-white ${
                                t.status === "available"
                                    ? "bg-green-600 hover:bg-green-700"
                                    : "bg-gray-400 cursor-not-allowed"
                            }`}
                        >
                            {t.status === "available" ? "Chọn bàn" : "Không khả dụng"}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

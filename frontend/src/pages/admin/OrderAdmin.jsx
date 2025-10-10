import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import AdminLayout from "../../layouts/AdminLayout";

export default function OrderAdmin() {
    const token = localStorage.getItem("token");
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentOrderId, setPaymentOrderId] = useState(null);

    // 🧭 Lấy danh sách đơn hàng
    const fetchOrders = async () => {
        try {
            const res = await axios.get("/orders", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setOrders(res.data);
        } catch (err) {
            console.error("❌ Lỗi khi tải đơn hàng:", err);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // 🟢 Cập nhật trạng thái đơn hàng
    const handleStatusChange = async (id, status, paymentMethod = null) => {
        try {
            const url = paymentMethod
                ? `/orders/${id}/status?status=${status}&paymentMethod=${paymentMethod}`
                : `/orders/${id}/status?status=${status}`;

            await axios.put(url, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });

            fetchOrders();
            setShowPaymentModal(false);
        } catch (err) {
            alert("⚠️ Lỗi khi cập nhật trạng thái!");
        }
    };

    const handleViewDetails = (order) => setSelectedOrder(order);

    const formatMoney = (n) =>
        n?.toLocaleString("vi-VN", { style: "currency", currency: "VND" }) || "0 ₫";

    const totalRevenue = orders
        .filter((o) => o.status === "paid")
        .reduce((sum, o) => sum + (o.totalPrice || 0), 0);

    return (
        <AdminLayout>
            <div>
                <h1 className="text-3xl font-bold mb-6 text-gray-800">
                    🧾 Quản lý đơn hàng
                </h1>

                <div className="text-right mb-4 text-lg font-semibold text-green-700">
                    💰 Tổng doanh thu: {formatMoney(totalRevenue)}
                </div>

                {/* Danh sách đơn hàng */}
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300 text-center shadow-md rounded-lg">
                        <thead className="bg-amber-100 text-amber-900">
                        <tr>
                            <th className="border p-2">#</th>
                            <th className="border p-2">Số bàn</th>
                            <th className="border p-2">Vị trí</th>
                            <th className="border p-2">Số món</th>
                            <th className="border p-2">Trạng thái</th>
                            <th className="border p-2">Thanh toán</th>
                            <th className="border p-2">Tổng tiền</th>
                            <th className="border p-2">Ngày giờ đặt</th>
                            <th className="border p-2">Hành động</th>
                        </tr>
                        </thead>
                        <tbody>
                        {orders.map((o, index) => (
                            <tr
                                key={o.id || o._id}
                                className="bg-white hover:bg-amber-50 transition"
                            >
                                <td className="border p-2">{index + 1}</td>
                                <td className="border p-2 text-blue-700 font-semibold">
                                    Bàn {o.tableNumber || "?"}
                                </td>
                                <td className="border p-2">{o.tableLocation || "—"}</td>
                                <td className="border p-2">{o.items?.length || 0}</td>
                                <td
                                    className={`border p-2 font-bold ${
                                        o.status === "pending"
                                            ? "text-yellow-600"
                                            : o.status === "served"
                                                ? "text-blue-600"
                                                : "text-green-700"
                                    }`}
                                >
                                    {o.status}
                                </td>
                                <td className="border p-2 italic text-gray-600">
                                    {o.paymentMethod
                                        ? o.paymentMethod === "cash"
                                            ? "💵 Tiền mặt"
                                            : "📱 QR"
                                        : "—"}
                                </td>
                                <td className="border p-2 text-green-700 font-bold">
                                    {formatMoney(o.totalPrice)}
                                </td>
                                <td className="border p-2 text-gray-500">
                                    {o.createdAt
                                        ? new Date(o.createdAt).toLocaleString("vi-VN")
                                        : "—"}
                                </td>
                                <td className="border p-2 flex justify-center gap-2 flex-wrap">
                                    <button
                                        onClick={() => handleViewDetails(o)}
                                        className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                                    >
                                        👁️ Xem
                                    </button>
                                    {o.status !== "paid" && (
                                        <>
                                            <button
                                                onClick={() => handleStatusChange(o.id, "served")}
                                                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                                            >
                                                🍽️ Phục vụ
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setPaymentOrderId(o.id);
                                                    setShowPaymentModal(true);
                                                }}
                                                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                                            >
                                                💰 Thanh toán
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* 💵 Modal chọn phương thức thanh toán */}
                {showPaymentModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl p-8 shadow-xl w-[90%] max-w-md text-center">
                            <h2 className="text-2xl font-bold text-amber-900 mb-6">
                                💳 Chọn phương thức thanh toán
                            </h2>

                            <div className="flex flex-col gap-6">
                                {/* 💵 Thanh toán tiền mặt */}
                                <button
                                    onClick={() =>
                                        handleStatusChange(paymentOrderId, "paid", "cash")
                                    }
                                    className="bg-green-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition"
                                >
                                    💵 Thanh toán tiền mặt
                                </button>

                                {/* 📱 Thanh toán bằng QR */}
                                <div className="bg-blue-50 p-4 rounded-lg shadow-inner">
                                    <p className="font-semibold text-blue-800 mb-2">
                                        📱 Quét mã QR để thanh toán:
                                    </p>
                                    <img
                                        src="/images/qr-momo.png" // 🔸 ảnh QR của em để trong thư mục public/images
                                        alt="QR Payment"
                                        className="w-48 h-48 mx-auto rounded-lg border-2 border-blue-300 shadow"
                                    />
                                    <button
                                        onClick={() =>
                                            handleStatusChange(paymentOrderId, "paid", "qr")
                                        }
                                        className="mt-4 bg-blue-600 text-white py-2 px-6 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
                                    >
                                        ✅ Xác nhận đã thanh toán QR
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={() => setShowPaymentModal(false)}
                                className="mt-6 text-gray-600 hover:text-gray-800 underline"
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                )}

                {/* 📋 Chi tiết đơn hàng */}
                {selectedOrder && (
                    <div className="mt-10 bg-white p-6 rounded-xl shadow-lg border-t-4 border-amber-400">
                        <h2 className="text-2xl font-bold mb-4 text-amber-900">
                            🧾 Chi tiết đơn hàng #{selectedOrder.id}
                        </h2>
                        <p className="mb-1 text-gray-700 font-semibold">
                            🪑 Bàn: {selectedOrder.tableNumber || "?"}
                        </p>
                        <p className="mb-1 text-gray-700">
                            📍 Vị trí: {selectedOrder.tableLocation || "—"}
                        </p>
                        <p className="mb-1 text-gray-700">
                            💳 Thanh toán:{" "}
                            <span className="font-semibold text-blue-700">
                {selectedOrder.paymentMethod
                    ? selectedOrder.paymentMethod === "cash"
                        ? "Tiền mặt"
                        : "Quét QR"
                    : "Chưa thanh toán"}
              </span>
                        </p>
                        <p className="mb-3 text-gray-600">
                            ⏰ Ngày giờ đặt:{" "}
                            {selectedOrder.createdAt
                                ? new Date(selectedOrder.createdAt).toLocaleString("vi-VN")
                                : "—"}
                        </p>
                        <p className="mb-4 text-gray-600">
                            📦 Trạng thái:{" "}
                            <span className="font-bold text-blue-600">
                {selectedOrder.status}
              </span>
                        </p>

                        <table className="w-full border border-gray-300 text-center rounded-lg overflow-hidden">
                            <thead className="bg-amber-100">
                            <tr>
                                <th className="border p-2">Món</th>
                                <th className="border p-2">Số lượng</th>
                                <th className="border p-2">Đơn giá</th>
                                <th className="border p-2">Tổng</th>
                            </tr>
                            </thead>
                            <tbody>
                            {selectedOrder.items.map((item, index) => (
                                <tr key={index}>
                                    <td className="border p-2">{item.name}</td>
                                    <td className="border p-2">{item.quantity}</td>
                                    <td className="border p-2">{formatMoney(item.price)}</td>
                                    <td className="border p-2">
                                        {formatMoney(item.price * item.quantity)}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>

                        <div className="mt-4 text-right font-bold text-lg">
                            Tổng cộng:{" "}
                            <span className="text-green-700">
                {formatMoney(selectedOrder.totalPrice)}
              </span>
                        </div>

                        <div className="mt-4 flex justify-end gap-3">
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="bg-gray-500 text-white px-5 py-2 rounded hover:bg-gray-600"
                            >
                                ✖️ Đóng
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}

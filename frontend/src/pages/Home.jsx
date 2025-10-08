import React from "react";

export default function Home() {
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">
        Xin chào, {username} 👋
      </h1>
      <p className="mb-6">
        Bạn đang đăng nhập với quyền: <b>{role}</b>
      </p>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
      >
        Đăng xuất
      </button>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import axios from "axios";

function Login() {
  // States để lưu trữ dữ liệu form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Hàm xử lý đăng nhập
  const handleLogin = async (e) => {
    e.preventDefault(); // Ngăn form reload trang
    setLoading(true);
    setError(""); // Xóa lỗi cũ

    try {
      // Gọi API login theo schema trong ảnh
      const response = await axios.post("/api/auth/login", {
        email: email,
        password: password,
      });

      // Lưu token từ response
      setToken(response.data.token);
      console.log("✅ Đăng nhập thành công!");
    } catch (err) {
      // Xử lý lỗi
      if (err.response) {
        // Server trả về lỗi (400, 401, 500...)
        setError(err.response.data.message || "Email hoặc mật khẩu không đúng");
      } else if (err.request) {
        // Không kết nối được server
        setError("Không thể kết nối đến server. Vui lòng thử lại.");
      } else {
        // Lỗi khác
        setError("Có lỗi xảy ra. Vui lòng thử lại.");
      }
      console.error("❌ Lỗi đăng nhập:", err);
    } finally {
      setLoading(false);
    }
  };

  // useEffect xử lý khi đăng nhập thành công
  useEffect(() => {
    if (token) {
      // Lưu token vào localStorage
      localStorage.setItem("authToken", token);

      // Có thể lưu thêm thông tin khác
      localStorage.setItem("isLoggedIn", "true");

      console.log("🔐 Token đã được lưu:", token);

      // Chuyển hướng đến trang dashboard
      // window.location.href = "/dashboard";
      // hoặc dùng React Router: navigate("/dashboard");

      alert("Đăng nhập thành công! 🎉");
    }
  }, [token]); // Chỉ chạy khi token thay đổi

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "50px auto",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "8px",
      }}
    >
      <h2 style={{ textAlign: "center", color: "#333" }}>🔐 Đăng nhập</h2>

      <form onSubmit={handleLogin}>
        {/* Input Email */}
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            📧 Email:
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Nhập email của bạn"
            required
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          />
        </div>

        {/* Input Password */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            🔒 Mật khẩu:
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Nhập mật khẩu"
            required
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: loading ? "#ccc" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            fontSize: "16px",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "⏳ Đang đăng nhập..." : "🚀 Đăng nhập"}
        </button>
      </form>

      {/* Hiển thị lỗi */}
      {error && (
        <div
          style={{
            marginTop: "15px",
            padding: "10px",
            backgroundColor: "#ffe6e6",
            color: "#d00",
            border: "1px solid #ffcccc",
            borderRadius: "4px",
          }}
        >
          ❌ {error}
        </div>
      )}

      {/* Hiển thị thành công */}
      {token && (
        <div
          style={{
            marginTop: "15px",
            padding: "10px",
            backgroundColor: "#e6ffe6",
            color: "#0a0",
            border: "1px solid #ccffcc",
            borderRadius: "4px",
          }}
        >
          ✅ Đăng nhập thành công! Token: {token.substring(0, 20)}...
        </div>
      )}

      {/* Thông tin demo */}
      <div
        style={{
          marginTop: "20px",
          fontSize: "12px",
          color: "#666",
          textAlign: "center",
        }}
      >
        <p>
          📝 <strong>Demo credentials:</strong>
        </p>
        <p>Email: demo@example.com</p>
        <p>Password: 123456</p>
      </div>
    </div>
  );
}

export default Login;

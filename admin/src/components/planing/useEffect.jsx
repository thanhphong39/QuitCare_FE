import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Xử lý gọi API khi submit
  const handleLogin = async (e) => {
    e.preventDefault(); // Ngăn form reload page

    try {
      const res = await axios.post("https://example.com/api/login", {
        username,
        password,
      });
      setToken(res.data.token); // lưu token vào state
      setError("");
    } catch (err) {
      setError("Đăng nhập thất bại. Vui lòng kiểm tra thông tin.");
      console.error("Login error:", err);
    }
  };

  useEffect(() => {
    if (token) {
      localStorage.setItem("authToken", token);
      console.log("Login thành công! Token đã được lưu.");
      if (username && password) {
        navigate("/dashboard");
      }
    }
  }, [token, navigate]);

  return (
    <div>
      <form onSubmit={handleLogin}>
        <div>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
          />
        </div>
        <div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
        </div>
        <button type="submit">Đăng nhập</button>

        {error && <div style={{ color: "red" }}>{error}</div>}
      </form>
    </div>
  );
}

export default Login;

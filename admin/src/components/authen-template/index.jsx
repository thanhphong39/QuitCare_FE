import React from "react";
import "./index.css";
import LoginForm from "../authen-form/LoginForm";
import RegisterForm from "../authen-form/RegisterForm";
import { useNavigate } from "react-router-dom";
import Navbar_authen from "../authen-navbar/Navbar-authen";
import mountainBg from "../../assets/images/login1.png";

function AuthenTemplate({ isLogin }) {
  const navigate = useNavigate();

  // Nếu là trang đăng nhập, sử dụng layout 2 cột mới
  if (isLogin) {
    return <LoginForm />;
  }
  
  // Nếu là trang đăng ký, hiển thị layout 2 cột mới
  if (!isLogin) {
    return <RegisterForm />;
  }

  // Nếu là trang đăng nhập, giữ nguyên layout cũ
  return (
    <div
      className="authen-template"
      style={{ backgroundImage: `url(${mountainBg})` }}
    >
      <div className="authen-template__form">
        <LoginForm />
      </div>
    </div>
  );
}

export default AuthenTemplate;

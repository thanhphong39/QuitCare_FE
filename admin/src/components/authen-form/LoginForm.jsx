import React from "react";
import { Button, Checkbox, Form, Input, Card } from "antd";
import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../redux/features/userSlice";
import { toast } from "react-toastify";
import api from "../../configs/axios";

const LoginForm = ({ onLogin, errorMessage }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    console.log("Login data:", values);
    try {
      const response = await api.post("/auth/login", values);

      const user = response.data;
      dispatch(login(user));

      localStorage.setItem("token", user.token);
      localStorage.setItem("accountId", user.id);

      if (user.role === "ADMIN") {
        navigate("/dashboard");
      } else if (
        user.role === "GUEST" ||
        user.role === "CUSTOMER" ||
        user.role === "STAFF"
      ) {
        navigate("/");
      } else if (user.role === "COACH") {
        navigate("/dashboard-coach");
      }
    } catch (error) {
      console.log("login:" + error);
      toast.error("Đăng nhập không thành công, vui lòng thử lại sau!");
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Login failed:", errorInfo);
  };

  return (
    <div className="auth-login-container">
      <div className="auth-login-welcome">
        <div className="auth-login-welcome-content">
          <h1 className="auth-login-welcome-title">Chào mừng trở lại!</h1>

          <p className="auth-login-welcome-subtitle">
            Tiếp tục hành trình cai thuốc lá cùng QuitCare - Nơi bạn tìm thấy sự
            hỗ trợ và động lực để có một cuộc sống khỏe mạnh hơn.
          </p>

          <div className="auth-login-welcome-features">
            <div className="auth-login-welcome-feature">
              <div className="auth-login-welcome-feature-icon">🎯</div>
              <div className="auth-login-welcome-feature-text">
                Kế hoạch cai thuốc cá nhân hóa
              </div>
            </div>

            <div className="auth-login-welcome-feature">
              <div className="auth-login-welcome-feature-icon">📊</div>
              <div className="auth-login-welcome-feature-text">
                Theo dõi tiến trình chi tiết
              </div>
            </div>

            <div className="auth-login-welcome-feature">
              <div className="auth-login-welcome-feature-icon">🤝</div>
              <div className="auth-login-welcome-feature-text">
                Hỗ trợ từ chuyên gia và cộng đồng
              </div>
            </div>

            <div className="auth-login-welcome-feature">
              <div className="auth-login-welcome-feature-icon">🏆</div>
              <div className="auth-login-welcome-feature-text">
                Thành tích và động lực
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form Section */}
      <div className="auth-login-form-section">
        <div className="auth-login-form-wrapper">
          <Card className="auth-login-card" title="ĐĂNG NHẬP">
            {errorMessage && (
              <div className="auth-login-error">{errorMessage}</div>
            )}

            <Form
              name="login-form"
              layout="vertical"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              className="auth-login-form"
            >
              <Form.Item
                label="Email"
                name="email"
                className="auth-login-form-item"
                rules={[
                  { required: true, message: "Vui lòng nhập email!" },
                  { type: "email", message: "Email không hợp lệ!" },
                ]}
              >
                <Input
                  placeholder="Nhập email của bạn"
                  className="auth-login-input"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                label="Mật khẩu"
                name="password"
                className="auth-login-form-item"
                rules={[
                  { required: true, message: "Vui lòng nhập mật khẩu!" },
                  { min: 6, message: "Mật khẩu phải ít nhất 6 ký tự!" },
                ]}
              >
                <Input.Password
                  placeholder="Nhập mật khẩu"
                  className="auth-login-input"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="remember"
                valuePropName="checked"
                className="auth-login-form-item-remember"
              >
                <div className="auth-login-haha">
                  <Checkbox className="auth-login-checkbox">
                    Ghi nhớ đăng nhập
                  </Checkbox>

                  <div className="auth-login-forgot-link">
                    <Link
                      to="/forgot-password"
                      className="auth-login-forgot-link-a"
                    >
                      Quên mật khẩu?
                    </Link>
                  </div>
                </div>
              </Form.Item>

              <Form.Item className="auth-login-form-item">
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  className="auth-login-button"
                  size="large"
                >
                  Đăng nhập
                </Button>
              </Form.Item>

              <div className="auth-login-register-link">
                Chưa có tài khoản?
                <Link to="/register" className="auth-login-register-link-a">
                  Đăng ký ngay
                </Link>
              </div>
            </Form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;

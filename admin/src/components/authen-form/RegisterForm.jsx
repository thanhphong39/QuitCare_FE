import React from "react";
import { Button, Form, Input, Card } from "antd";
import { Link } from "react-router-dom";
import "./register.css";
import { useNavigate } from "react-router-dom";
import api from "../../configs/axios";
import { toast } from "react-toastify";

function RegisterForm() {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    console.log("Success:", values);
    try {
      await api.post("auth/register", values);
      toast.success("Đăng ký thành công!");
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error.message);
      toast.error("Đăng ký không thành công, vui lòng thử lại sau!");
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="auth-register-container">
      {/* Cột trái - Thông tin giới thiệu */}
      <div className="auth-register-left">
        <div className="auth-register-left-content">
          <h1 className="auth-register-welcome-title">
            Hành trình cai thuốc lá hiệu quả và bền vững
          </h1>
          

          <div className="auth-register-features">
            <div className="auth-register-feature-item">
              <div className="auth-register-feature-icon">🎯</div>
              <div className="auth-register-feature-text">
                <h3>Kế hoạch cá nhân hóa</h3>
                <p>Lập kế hoạch cai thuốc phù hợp với từng cá nhân</p>
              </div>
            </div>

            <div className="auth-register-feature-item">
              <div className="auth-register-feature-icon">📊</div>
              <div className="auth-register-feature-text">
                <h3>Theo dõi tiến trình</h3>
                <p>Giám sát quá trình cai thuốc một cách chi tiết</p>
              </div>
            </div>

            <div className="auth-register-feature-item">
              <div className="auth-register-feature-icon">👨‍⚕️</div>
              <div className="auth-register-feature-text">
                <h3>Tư vấn chuyên gia</h3>
                <p>Nhận hỗ trợ từ đội ngũ chuyên gia y tế</p>
              </div>
            </div>
          </div>

          <div className="auth-register-stats">
            <div className="auth-register-stat-item">
              <h4>1000+</h4>
              <p>Người đã thành công</p>
            </div>
            <div className="auth-register-stat-item">
              <h4>95%</h4>
              <p>Tỷ lệ hài lòng</p>
            </div>
            <div className="auth-register-stat-item">
              <h4>24/7</h4>
              <p>Hỗ trợ liên tục</p>
            </div>
          </div>
        </div>
      </div>

      {/* Cột phải - Form đăng ký */}
      <div className="auth-register-right">
        <Card className="auth-register-card" title="Đăng ký tài khoản">
          <Form
            name="register"
            layout="vertical"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            className="auth-register-form"
          >
            <div className="auth-register-form-row">
              <Form.Item
                label="Họ và tên"
                name="fullname"
                rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
                className="auth-register-form-item"
              >
                <Input placeholder="Nhập họ và tên" size="large" />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Vui lòng nhập email!" },
                  { type: "email", message: "Email không hợp lệ!" },
                ]}
                className="auth-register-form-item"
              >
                <Input placeholder="Nhập email" size="large" />
              </Form.Item>
            </div>

            <Form.Item
              label="Tên đăng nhập"
              name="username"
              rules={[
                { required: true, message: "Vui lòng nhập tên đăng nhập!" },
              ]}
            >
              <Input placeholder="Nhập tên đăng nhập" size="large" />
            </Form.Item>

            <div className="auth-register-form-row">
              <Form.Item
                label="Mật khẩu"
                name="password"
                rules={[
                  { required: true, message: "Vui lòng nhập mật khẩu!" },
                  { min: 6, message: "Mật khẩu ít nhất 6 ký tự" },
                ]}
                hasFeedback
                className="auth-register-form-item"
              >
                <Input.Password placeholder="Nhập mật khẩu" size="large" />
              </Form.Item>

              <Form.Item
                label="Xác nhận mật khẩu"
                name="confirmPassword"
                dependencies={["password"]}
                hasFeedback
                rules={[
                  { required: true, message: "Vui lòng xác nhận mật khẩu!" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error("Mật khẩu không khớp!"));
                    },
                  }),
                ]}
                className="auth-register-form-item"
              >
                <Input.Password placeholder="Nhập lại mật khẩu" size="large" />
              </Form.Item>
            </div>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                className="auth-register-button"
              >
                Đăng ký ngay
              </Button>
            </Form.Item>

            <div className="auth-register-login-link">
              Đã có tài khoản?{" "}
              <Link to="/login" className="auth-register-login-link-a">
                Đăng nhập ngay
              </Link>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
}

export default RegisterForm;

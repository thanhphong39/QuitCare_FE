import React, { useState } from "react";
import "./dashboard.css";
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
  HomeOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Layout, Menu, theme, Button } from "antd";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/features/userSlice";

const { Header, Content, Footer, Sider } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label: <Link to={`/dashboard/${key}`}> {label} </Link>,
  };
}

const items = [
  getItem("Quản lý người dùng", "users", <UserOutlined />),
  getItem("Quản lý bình luận", "comments", <PieChartOutlined />),
  getItem("Quản lý doanh thu", "revenue", <DesktopOutlined />),
  getItem("Quản lý gói", "packages", <DesktopOutlined />),
  getItem("Quản lý bài viết", "posts", <DesktopOutlined />),
  getItem("Quản lý ngày nghỉ", "leavedays", <DesktopOutlined />),
];

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get user from Redux store
  const currentUser = useSelector((state) => state.user);
  const isStaff = currentUser?.role === "STAFF";
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleGoHome = () => {
    navigate("/");
  };

  const handleLogout = () => {
    // Xóa thông tin từ localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("accountId");
    localStorage.removeItem("user");

    // Cập nhật Redux store
    dispatch(logout());
    // Chuyển hướng về trang đăng nhập
    navigate("/login");
  };

  return (
    <div className="qc-dashboard-root">
      <div className="qc-dashboard-layout">
        <aside className={`qc-dashboard-sider${collapsed ? " collapsed" : ""}`}>
          <div className="qc-dashboard-logo" />
          <button
            className="qc-dashboard-toggle-btn"
            onClick={() => setCollapsed((prev) => !prev)}
            aria-label={collapsed ? "Mở rộng menu" : "Thu gọn menu"}
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </button>
          <Menu
            theme="dark"
            defaultSelectedKeys={["1"]}
            mode="inline"
            items={items}
            className="qc-dashboard-menu"
            inlineCollapsed={collapsed}
          />
        </aside>
        <div className="qc-dashboard-main">
          <header className="qc-dashboard-header">
            <div className="qc-dashboard-title">QuitCare Dashboard</div>
            <div className="qc-dashboard-actions">
              {isStaff && (
                <Button
                  className="qc-dashboard-btn qc-dashboard-btn-home"
                  type="default"
                  icon={<HomeOutlined />}
                  onClick={handleGoHome}
                >
                  Về trang chủ
                </Button>
              )}
              <Button
                className="qc-dashboard-btn qc-dashboard-btn-logout"
                type="primary"
                icon={<LogoutOutlined />}
                onClick={handleLogout}
              >
                Đăng xuất
              </Button>
            </div>
          </header>
          <main className="qc-dashboard-content-wrapper">
            <Breadcrumb className="qc-dashboard-breadcrumb" />
            <div className="qc-dashboard-content">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

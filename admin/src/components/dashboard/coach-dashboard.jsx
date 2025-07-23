import React, { useState } from "react";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  UserOutlined,
  DownOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Layout, Menu, Dropdown, Space, theme } from "antd";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/features/userSlice";

const { Header, Content, Footer, Sider } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label: <Link to={`/dashboard-coach/${key}`}>{label}</Link>,
  };
}

const items = [
  getItem("Quản lý Tư Vấn", "calendar", <CalendarOutlined />),
  getItem("Đăng ký lịch làm", "register", <ClockCircleOutlined />),
  getItem("Quản lý hồ sơ cá nhân", "profile-coach", <UserOutlined />),
];

const CoachDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const handleLogout = () => {
    dispatch(logout()); // hoặc localStorage.clear() nếu bạn không dùng Redux
    navigate("/login");
  };

  const dropdownMenu = (
    <Menu
      items={[
        {
          key: "logout",
          icon: <LogoutOutlined />,
          label: <span onClick={handleLogout}>Đăng xuất</span>,
        },
      ]}
    />
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        style={{
          boxShadow: "2px 0 8px rgba(0, 0, 0, 0.15)",
        }}
      >
        <div
          className="demo-logo-vertical"
          style={{
            height: 64,
            margin: 16,
            background: "rgba(255, 255, 255, 0.3)",
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: "bold",
            fontSize: 16,
          }}
        >
          {collapsed ? "QC" : "QuitCare Coach"}
        </div>
        <Menu
          theme="dark"
          defaultSelectedKeys={["calendar"]}
          mode="inline"
          items={items}
          style={{ border: "none" }}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            padding: "0 24px",
            background: colorBgContainer,
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              fontSize: 20,
              fontWeight: 600,
              color: "#1890ff",
            }}
          >
            Dashboard Coach
          </div>

          <Dropdown trigger={["click"]} overlay={dropdownMenu}>
            <span style={{ cursor: "pointer" }}>
              <Space>
                <UserOutlined style={{ fontSize: 18, color: "#666" }} />
                <span style={{ color: "#666", fontWeight: 500 }}>
                  {user?.fullName || user?.name || "Coach Dashboard"}
                </span>
                <DownOutlined style={{ fontSize: 12, color: "#999" }} />
              </Space>
            </span>
          </Dropdown>
        </Header>

        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb
            style={{
              margin: "16px 0",
              padding: "8px 16px",
              background: "#fafafa",
              borderRadius: 6,
            }}
          />
          <div
            style={{
              padding: 24,
              minHeight: "calc(100vh - 112px)",
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Outlet />
          </div>
        </Content>

        <Footer
          style={{
            textAlign: "center",
            background: "#f0f2f5",
            borderTop: "1px solid #d9d9d9",
          }}
        >
          QuitCare Coach Dashboard ©{new Date().getFullYear()} - Hỗ trợ cai
          thuốc lá
        </Footer>
      </Layout>
    </Layout>
  );
};

export default CoachDashboard;

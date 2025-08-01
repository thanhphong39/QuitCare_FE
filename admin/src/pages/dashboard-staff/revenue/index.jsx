import React, { useEffect, useState } from "react";
import {
  Card,
  Typography,
  Row,
  Col,
  Statistic,
  Modal,
  Table,
  Spin,
  Select,
  Button,
} from "antd";
import {
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import api from "../../../configs/axios";
import "./RevenueManagement.css";

// Đăng ký các component của Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ChartTitle,
  Tooltip,
  Legend
);

const { Title } = Typography;
const { Option } = Select;

const RevenueManagement = () => {
  const [plans, setPlans] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [planRes, paymentRes, userRes] = await Promise.all([
          api.get("/membership-plans"),
          api.get("/v1/payments/history"),
          api.get("/admin/user"),
        ]);

        setPlans(planRes.data);
        setPayments(paymentRes.data);
        setUsers(userRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getPaymentsByPlan = (planId) => {
    return payments.filter((p) => {
      const membership = plans.find((plan) => plan.id === planId);
      return p.amountPaid === membership?.price;
    });
  };

  const getRevenueByPlan = (planId) => {
    const matchedPayments = getPaymentsByPlan(planId);
    return matchedPayments.reduce((acc, cur) => acc + cur.amountPaid, 0);
  };

  const totalRevenue = plans.reduce(
    (acc, plan) => acc + getRevenueByPlan(plan.id),
    0
  );

  const totalPackagesSold = plans.reduce(
    (acc, plan) => acc + getPaymentsByPlan(plan.id).length,
    0
  );

  //  Thêm các thống kê chi tiết về doanh thu
  const revenueStats = {
    today: payments
      .filter((p) => {
        const paymentDate = new Date(p.createdAt);
        const today = new Date();
        return paymentDate.toDateString() === today.toDateString();
      })
      .reduce((acc, p) => acc + p.amountPaid, 0),

    thisWeek: payments
      .filter((p) => {
        const paymentDate = new Date(p.createdAt);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return paymentDate >= weekAgo;
      })
      .reduce((acc, p) => acc + p.amountPaid, 0),

    thisMonth: payments
      .filter((p) => {
        const paymentDate = new Date(p.createdAt);
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return paymentDate >= monthAgo;
      })
      .reduce((acc, p) => acc + p.amountPaid, 0),

    averageOrderValue: payments.length > 0 ? totalRevenue / payments.length : 0,

    completedPayments: payments.filter((p) => p.status === "SUCCESS").length,
    pendingPayments: payments.filter((p) => p.status !== "SUCCESS").length,
  };

  const showPlanDetails = (plan) => {
    setSelectedPlan(plan);
    setModalVisible(true);
  };

  //  Helper function để lấy username từ accountId
  const getUsernameById = (accountId) => {
    const user = users.find((u) => u.id === accountId);
    return user ? user.username : `User #${accountId}`;
  };

  // dữ liệu cho biểu đồ cột
  const chartData = {
    labels: ["Doanh thu hôm nay", "Doanh thu tuần này", "Doanh thu tháng này"],
    datasets: [
      {
        label: "Doanh thu (VND)",
        data: [
          revenueStats.today,
          revenueStats.thisWeek,
          revenueStats.thisMonth,
        ],
        backgroundColor: [
          "rgba(250, 173, 20, 0.8)",
          "rgba(82, 196, 26, 0.8)",
          "rgba(24, 144, 255, 0.8)",
        ],
        borderColor: [
          "rgba(250, 173, 20, 1)",
          "rgba(82, 196, 26, 1)",
          "rgba(24, 144, 255, 1)",
        ],
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 14,
            weight: "bold",
          },
        },
      },
      title: {
        display: true,
        text: "📊 Biểu đồ doanh thu chi tiết",
        font: {
          size: 18,
          weight: "bold",
        },
        padding: {
          top: 10,
          bottom: 30,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const value = context.parsed.y;
            return `${context.dataset.label}: ${value.toLocaleString(
              "vi-VN"
            )} VND`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return value.toLocaleString("vi-VN");
          },
        },
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxRotation: 45,
          minRotation: 0,
        },
      },
    },
    animation: {
      duration: 2000,
      easing: "easeInOutQuart",
    },
  };

  // ✅ Biểu đồ trạng thái thanh toán
  const statusChartData = {
    labels: ["Đã thanh toán", "Chờ thanh toán"],
    datasets: [
      {
        label: "Số đơn hàng",
        data: [revenueStats.completedPayments, revenueStats.pendingPayments],
        backgroundColor: ["rgba(82, 196, 26, 0.8)", "rgba(250, 173, 20, 0.8)"],
        borderColor: ["rgba(82, 196, 26, 1)", "rgba(250, 173, 20, 1)"],
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const statusChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 14,
            weight: "bold",
          },
        },
      },
      title: {
        display: true,
        text: "💳 Trạng thái đơn hàng",
        font: {
          size: 16,
          weight: "bold",
        },
        padding: {
          top: 10,
          bottom: 20,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const total =
              revenueStats.completedPayments + revenueStats.pendingPayments;
            const percentage =
              total > 0 ? ((context.parsed.y / total) * 100).toFixed(1) : 0;
            return `${context.label}: ${context.parsed.y} đơn (${percentage}%)`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
    animation: {
      duration: 1500,
      easing: "easeInOutQuart",
    },
  };

  // ✅ Statistics với dữ liệu thực
  const stats = [
    {
      title: "Tổng người dùng",
      value: users.length,
      icon: <UserOutlined />,
      color: "#1890ff",
    },
    {
      title: "Số lượng gói",
      value: totalPackagesSold,
      icon: <ShoppingCartOutlined />,
      color: "#52c41a",
    },
    {
      title: "Doanh thu tháng",
      value: totalRevenue,
      suffix: "VND",
      icon: <DollarOutlined />,
      color: "#722ed1",
    },
  ];

  // ✅ Đơn hàng gần đây từ API
  const recentOrders = payments
    .slice(-8)
    .reverse()
    .map((payment) => {
      const plan = plans.find((p) => p.price === payment.amountPaid);
      return {
        key: payment.id,
        date: new Date(payment.createdAt).toLocaleDateString("vi-VN"),
        customer: getUsernameById(payment.accountId),
        package: plan?.name || "Gói không xác định",
        amount: payment.amountPaid,
        status:
          payment.status === "SUCCESS" ? "Đã thanh toán" : "Chờ thanh toán",
      };
    });

  // ✅ Columns cho bảng đơn hàng
  const orderColumns = [
    {
      title: "Ngày",
      dataIndex: "date",
      key: "date",
      width: 100,
    },
    {
      title: "Khách hàng",
      dataIndex: "customer",
      key: "customer",
    },
    {
      title: "Gói mua",
      dataIndex: "package",
      key: "package",
    },
    {
      title: "Số tiền",
      dataIndex: "amount",
      key: "amount",
      render: (value) => `${value.toLocaleString("vi-VN")} VND`,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
    },
  ];

  // ✅ Columns cho modal chi tiết
  const detailColumns = [
    {
      title: "Mã giao dịch",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Số tiền",
      dataIndex: "amountPaid",
      key: "amountPaid",
      render: (amount) => `${amount.toLocaleString("vi-VN")} VND`,
    },
    {
      title: "Khách hàng",
      dataIndex: "accountId",
      key: "accountId",
      render: (accountId) => getUsernameById(accountId),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleString("vi-VN"),
    },
  ];

  // ✅ Loading state
  if (loading) {
    return (
      <div
        className="revenue-simple"
        style={{ textAlign: "center", padding: "100px" }}
      >
        <Spin size="large" />
        <p style={{ marginTop: 16 }}>Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="revenue-simple">
      {/* ✅ Header dashboard */}
      <div className="header">
        <h2>Quản lý Doanh Thu</h2>
      </div>

      {/* ✅ Thống kê tổng quan */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} lg={8} key={index}>
            <Card>
              <Statistic
                title={stat.title}
                value={stat.value}
                suffix={stat.suffix}
                prefix={
                  <span style={{ color: stat.color, fontSize: 20 }}>
                    {stat.icon}
                  </span>
                }
                valueStyle={{ color: "#0c1c2c" }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* ✅ Biểu đồ doanh thu thay thế cho thống kê chi tiết */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={16}>
          <Card>
            <div style={{ height: "400px" }}>
              <Bar data={chartData} options={chartOptions} />
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card>
            <div style={{ height: "400px" }}>
              <Bar data={statusChartData} options={statusChartOptions} />
            </div>
          </Card>
        </Col>
      </Row>

      {/*  Phần gói dịch vụ chi tiết từ API */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Title level={3}>Chi tiết theo gói dịch vụ</Title>
        </Col>
        {plans.map((plan) => {
          const planPayments = getPaymentsByPlan(plan.id);
          const revenue = getRevenueByPlan(plan.id);
          return (
            <Col xs={24} sm={12} lg={6} key={plan.id}>
              <Card hoverable>
                <div style={{ marginBottom: "0.5rem" }}>
                  <strong>{plan.name}</strong> <br />
                  <span style={{ color: "#8c8c8c", fontSize: "14px" }}>
                    {plan.price.toLocaleString("vi-VN")} VND
                  </span>
                </div>
                <Statistic
                  title="Doanh thu"
                  value={revenue}
                  valueStyle={{ color: "#3f8600" }}
                  suffix="VND"
                  formatter={(value) => value.toLocaleString("vi-VN")}
                />
                <p style={{ margin: "8px 0", color: "#595959" }}>
                  Số đơn hàng: <strong>{planPayments.length}</strong>
                </p>
                <Button
                  type="link"
                  size="small"
                  onClick={() => showPlanDetails(plan)}
                  style={{ padding: 0 }}
                >
                  Xem chi tiết
                </Button>
              </Card>
            </Col>
          );
        })}

        {/*  Card tổng doanh thu */}
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ border: "2px solid #1890ff" }}>
            <Statistic
              title="Tổng doanh thu"
              value={totalRevenue}
              valueStyle={{ color: "#cf1322", fontSize: "28px" }}
              suffix="VND"
              formatter={(value) => value.toLocaleString("vi-VN")}
            />
            <p style={{ margin: "8px 0", color: "#595959" }}>
              Tổng đơn hàng: <strong>{payments.length}</strong>
            </p>
          </Card>
        </Col>
      </Row>

      {/*  Bảng đơn hàng gần đây - Mở rộng full width */}
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card title="🛍️ Đơn hàng gần đây">
            <Table
              columns={orderColumns}
              dataSource={recentOrders}
              pagination={{ pageSize: 10 }}
              size="small"
            />
          </Card>
        </Col>
      </Row>

      {/* Tóm tắt doanh thu đơn giản */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="💰 Tóm tắt doanh thu">
            <div style={{ textAlign: "center" }}>
              <h3 style={{ color: "#52c41a", margin: 0 }}>
                {totalRevenue.toLocaleString("vi-VN")} VND
              </h3>
              <p style={{ margin: 0, color: "#8c8c8c" }}>Tổng doanh thu</p>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="📈 Tổng giao dịch">
            <div style={{ textAlign: "center" }}>
              <h3 style={{ color: "#722ed1", margin: 0 }}>{payments.length}</h3>
              <p style={{ margin: 0, color: "#8c8c8c" }}>Đơn hàng đã xử lý</p>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Modal chi tiết giao dịch */}
      <Modal
        title={`Chi tiết giao dịch - ${selectedPlan?.name}`}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
      >
        <Table
          columns={detailColumns}
          dataSource={getPaymentsByPlan(selectedPlan?.id).map((item) => ({
            ...item,
            key: item.id,
          }))}
          pagination={{ pageSize: 5 }}
          size="small"
        />
      </Modal>
    </div>
  );
};

export default RevenueManagement;

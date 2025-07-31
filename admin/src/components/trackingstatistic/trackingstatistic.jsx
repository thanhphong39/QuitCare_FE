import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Progress,
  Spin,
  message,
  Typography,
  Button,
} from "antd";
import {
  DollarOutlined,
  CalendarOutlined,
  FireFilled,
  LineChartOutlined,
  WarningFilled,
  TrophyFilled,
} from "@ant-design/icons";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Bar,
  ResponsiveContainer,
} from "recharts";
import "./trackingstatistic.css";
import api from "../../configs/axios";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const COLORS = ["#52c41a", "#faad14"];

function TrackingStatistic() {
  const accountId = localStorage.getItem("accountId");
  const [loading, setLoading] = useState(true);
  const [stat, setStat] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchStatistic() {
      setLoading(true);
      try {
        const planRes = await api.get(`/v1/customers/${accountId}/quit-plans`);
        const plan = planRes.data;
        if (!plan || !plan.stages || plan.stages.length === 0) {
          setLoading(false);
          return;
        }
        const lastStage = plan.stages[plan.stages.length - 1];
        const response = await api.get(
          `/quit-progress/stage/${lastStage.id}/user/${accountId}`
        );
        setStat(response.data);
      } catch (err) {
        message.error("Không thể lấy thống kê hoàn thành.");
      } finally {
        setLoading(false);
      }
    }
    if (accountId) fetchStatistic();
  }, [accountId]);

  if (loading) {
    return (
      <div className="tracking-statistic-loading">
        <Spin size="large" />
      </div>
    );
  }

  // Nếu không có kế hoạch hoặc không có thống kê
  if (!stat || stat.daysWithoutSmoking === undefined) {
    return (
      <>
        <Navbar />
        <div className="tracking-statistic-empty">
            <h2>Chưa có dữ liệu thống kê</h2>
            <p>Bạn chưa có kế hoạch hoặc chưa theo dõi tiến trình cai thuốc.</p>
            <Button
              type="primary"
              size="large"
              onClick={() => navigate("/planning")}
              style={{ marginTop: 16 }}
            >
              Tạo kế hoạch ngay
            </Button>
        </div>
        <Footer />
      </>
    );
  }

  let percent = stat.completionRate;
  if (percent > 1 && percent <= 100) {
    percent = Math.round(percent);
  } else if (percent <= 1) {
    percent = Math.round(percent * 100);
  } else if (percent > 100) {
    percent = 100;
  }

  const showBadge = percent >= 100;

  const pieData = [
    { name: "Đã theo dõi", value: stat.daysWithoutSmoking },
    { name: "Chưa theo dõi", value: stat.daysNotTracked },
  ];

  const barData = [
    {
      name: "Thống kê",
      "Không hút": stat.daysWithoutSmoking,
      "Chưa theo dõi": stat.daysNotTracked,
    },
  ];

  return (
    <>
      <Navbar />
      <div className="tracking-statistic-page">
        <Title level={2} className="page-title">
          Thống kê hành trình cai thuốc
        </Title>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12} lg={6}>
            <Card className="stat-box calendar">
              <Statistic
                title="Ngày bắt đầu"
                value={stat.startDate}
                prefix={<CalendarOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} md={12} lg={6}>
            <Card className="stat-box calendar">
              <Statistic
                title="Ngày kết thúc"
                value={stat.endDate}
                prefix={<CalendarOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} md={12} lg={6}>
            <Card className="stat-box smoke">
              <Statistic
                title="Số ngày hoàn thành chỉ tiêu"
                value={stat.daysWithoutSmoking}
                prefix={<FireFilled />}
              />
            </Card>
          </Col>
          <Col xs={24} md={12} lg={6}>
            <Card className="stat-box chart">
              <Statistic
                title="Điếu thuốc tránh được"
                value={stat.cigarettesAvoided}
                prefix={<LineChartOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} md={12} lg={6}>
            <Card className="stat-box money">
              <Statistic
                title="Tiền tiết kiệm (VNĐ)"
                value={stat.moneySaved.toLocaleString()}
                prefix={<DollarOutlined />}
              />
            </Card>
          </Col>
          {/* <Col xs={24} lg={18}>
            <Card className="stat-box progress">
              <Text strong>Tiến độ hoàn thành:</Text>
              <Progress
                percent={percent}
                strokeColor={{ from: "#108ee9", to: "#87d068" }}
                status="active"
                showInfo
              />
            </Card>
          </Col> */}

          {/* {showBadge && (
            <Col span={24}>
              <Card className="badge-card" bordered={false}>
                <TrophyFilled
                  style={{ fontSize: 36, color: "#faad14", marginRight: 16 }}
                />
                <span className="badge-text">
                  Chúc mừng! Bạn đã hoàn thành 100% kế hoạch cai thuốc! 🎉
                </span>
              </Card>
            </Col>
          )} */}

          {stat.daysNotTracked > 0 && (
            <Col span={24}>
              <div className="warning-banner">
                <WarningFilled style={{ marginRight: 8 }} />
                Có {stat.daysNotTracked} ngày bạn chưa theo dõi.
              </div>
            </Col>
          )}

          {/* <Col span={24} md={12}>
            <Card title="Tỷ lệ theo dõi (Pie Chart)" className="chart-card">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </Col> */}

          <Col span={24} md={12}>
            <Card title="So sánh theo dõi (Bar Chart)" className="chart-card">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={barData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Không hút" fill="#52c41a" />
                  <Bar dataKey="Chưa theo dõi" fill="#faad14" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>
      </div>
      <Footer />
    </>
  );
}

export default TrackingStatistic;

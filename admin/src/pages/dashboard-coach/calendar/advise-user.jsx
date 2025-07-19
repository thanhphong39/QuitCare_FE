import React, { useState, useEffect } from "react";
import {
  Table,
  Tabs,
  Button,
  Tag,
  Space,
  message,
  Card,
  Badge,
  Avatar,
  Typography,
  Input,
  Row,
  Col,
  Statistic,
  Empty,
} from "antd";
import {
  VideoCameraOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
  SearchOutlined,
  CalendarOutlined,
  LinkOutlined,
  ReloadOutlined,
  MailOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import moment from "moment";
import "./advise-user.css";
import api from "../../../configs/axios";
import { toast } from "react-toastify";

const { TabPane } = Tabs;
const { Title, Text } = Typography;
const { Search } = Input;

const AdviseUser = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("pending");
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetchAppointments();
    const interval = setInterval(fetchAppointments, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/booking/coach", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = response.data.map((item) => {
        const start = moment(`${item.appointmentDate} ${item.startTime}`);
        return {
          id: item.id,
          memberName: item.customerName,
          memberEmail: "",
          startTime: start,
          endTime: start.clone().add(60, "minutes"),
          status: item.status.toLowerCase(),
          meetLink: item.googleMeetLink,
          memberAvatar: null,
        };
      });

      setAppointments(data);
    } catch (error) {
      console.error(error);
      message.error("Không thể tải danh sách lịch hẹn");
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (id, status) => {
    const token = localStorage.getItem("token");
    let url = "";

    if (status === "COMPLETED") {
      url = `/booking/coach/complete/${id}`;
    } else if (status === "CANCELLED") {
      url = `/booking/${id}/cancel`;
    } else {
      console.warn("Trạng thái không hợp lệ:", status);
      return;
    }

    try {
      await api.put(
        url,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAppointments((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: status.toLowerCase() } : item
        )
      );

      message.success("Cập nhật trạng thái thành công");
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái:", error);
      message.error("Không thể cập nhật trạng thái");
    }
  };

  const handleCompleteConsultation = async (record) => {
    await updateAppointmentStatus(record.id, "COMPLETED");
    toast.success("Đã hoàn thành buổi tư vấn thành công!");
  };

  const handleCancelConsultation = async (record) => {
    await updateAppointmentStatus(record.id, "CANCELLED");
    toast.error("Đã hủy buổi tư vấn thành công!");
  };

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "pending" && appointment.status === "pending") ||
      (activeTab === "completed" && appointment.status === "completed") ||
      (activeTab === "cancelled" && appointment.status === "cancelled");

    const matchesSearch = appointment.memberName
      .toLowerCase()
      .includes(searchText.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "orange";
      case "in_progress":
        return "blue";
      case "completed":
        return "green";
      case "cancelled":
        return "red";
      default:
        return "default";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Chờ tư vấn";
      case "in_progress":
        return "Đang tư vấn";
      case "completed":
        return "Hoàn thành";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const columns = [
    {
      title: "Thành viên",
      dataIndex: "memberName",
      key: "memberName",
      render: (text) => (
        <div className="member-info">
          <Avatar icon={<UserOutlined />} size={40} />
          <span style={{ marginLeft: 10 }}>{text}</span>
        </div>
      ),
    },
    {
      title: "Thời gian",
      key: "time",
      render: (_, record) => (
        <div>
          <div>
            <CalendarOutlined /> {moment(record.startTime).format("DD/MM/YYYY")}
          </div>
          <div>
            <ClockCircleOutlined /> {moment(record.startTime).format("HH:mm")} -{" "}
            {moment(record.endTime).format("HH:mm")}
          </div>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      ),
    },
    // {
    //   title: "Link tư vấn",
    //   dataIndex: "meetLink",
    //   key: "meetLink",
    //   render: (link) => (
    //     <a href={link} target="_blank" rel="noopener noreferrer">
    //       <LinkOutlined /> Mở liên kết
    //     </a>
    //   ),
    // },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <div>
          {record.status === "pending" && (
            <Button
              type="primary"
              icon={<VideoCameraOutlined />}
              size="small"
              onClick={() => {
                window.open(record.meetLink, "_blank");
                // ✅ Cập nhật trạng thái sang "in_progress"
                setAppointments((prev) =>
                  prev.map((item) =>
                    item.id === record.id
                      ? { ...item, status: "in_progress" }
                      : item
                  )
                );
              }}
            >
              Bắt đầu
            </Button>
          )}

          {record.status === "in_progress" && (
            <Space>
              <Button
                icon={<LinkOutlined />}
                size="small"
                onClick={() => window.open(record.meetLink, "_blank")}
              >
                Vào phòng
              </Button>
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                size="small"
                onClick={() => handleCompleteConsultation(record)}
              >
                Hoàn thành
              </Button>
              <Button
                danger
                size="small"
                onClick={() => handleCancelConsultation(record)}
              >
                Hủy
              </Button>
            </Space>
          )}

          {record.status === "completed" && (
            <Tag color="green">Đã hoàn thành</Tag>
          )}

          {record.status === "cancelled" && <Tag color="red">Đã hủy</Tag>}
        </div>
      ),
    },
  ];

  return (
    <div className="advise-user-page">
      <div className="page-container">
        <div className="page-header">
          <div className="header-content">
            <div className="header-info">
              <Title level={2}>Quản lý lịch tư vấn</Title>
              <Text>Theo dõi và quản lý các buổi tư vấn</Text>
            </div>
            <div className="header-actions">
              <Search
                placeholder="Tìm kiếm thành viên..."
                allowClear
                onChange={(e) => setSearchText(e.target.value)}
                prefix={<SearchOutlined />}
                style={{ width: 300 }}
              />
              <Button
                icon={<ReloadOutlined />}
                onClick={fetchAppointments}
                loading={loading}
                style={{ marginLeft: 16 }}
              >
                Làm mới
              </Button>
            </div>
          </div>
        </div>

        <Card className="main-content-card">
          <Tabs activeKey={activeTab} onChange={setActiveTab} size="large">
            <TabPane
              tab={
                <Badge
                  count={
                    appointments.filter((a) => a.status === "pending").length
                  }
                >
                  Chờ tư vấn
                </Badge>
              }
              key="pending"
            />
            <TabPane
              tab={
                <Badge
                  count={
                    appointments.filter((a) => a.status === "completed").length
                  }
                >
                  Hoàn thành
                </Badge>
              }
              key="completed"
            />
            <TabPane
              tab={
                <Badge
                  count={
                    appointments.filter((a) => a.status === "cancelled").length
                  }
                >
                  Đã hủy
                </Badge>
              }
              key="cancelled"
            />
            <TabPane
              tab={<Badge count={appointments.length}>Tất cả</Badge>}
              key="all"
            />
          </Tabs>

          <Table
            columns={columns}
            dataSource={filteredAppointments}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 10 }}
          />
        </Card>
      </div>
    </div>
  );
};

export default AdviseUser;

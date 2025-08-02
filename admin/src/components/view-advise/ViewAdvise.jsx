import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  Table,
  Tag,
  Button,
  Row,
  Col,
  Typography,
  Select,
  Input,
  Modal,
  Avatar,
  Empty,
  message,notification,
  Alert,
} from "antd";
import {
  CalendarOutlined,
  UserOutlined,
  LinkOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  PlayCircleOutlined,
  EyeOutlined,
  SearchOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import api from "../../configs/axios";
import "./ViewAdvise.css";
import { toast } from "react-toastify";

const { Title, Text } = Typography;
const { Option } = Select;
const { Search } = Input;

function ViewAdvise() {
  const user = useSelector((state) => state.user);

  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchText, setSearchText] = useState("");
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  // const hasNotifiedRef = useRef(false);
  // const checkUpcomingPending = (consultations) => {
  //   const now = dayjs();
  //   const oneHourLater = now.add(1, "hour");
  
  //   const upcoming = consultations.find((item) => {
  //     const start = dayjs(`${item.date} ${item.time}`);
  //     const match =
  //       item.status === "PENDING" &&
  //       start.isAfter(now) &&
  //       start.isBefore(oneHourLater);
      
  //     // console.log("⏰ CHECK:", item.coachName, start.format(), match);
  //     return match;
  //   });
  
  //   if (upcoming && !hasNotifiedRef.current) {
  //     console.log(" SHOWING NOTIFICATION FOR:", upcoming);
  //     hasNotifiedRef.current = true;
  //      toast.success("Bạn có một buổi tư vấn sau 1 tiếng nữa. Xin hãy chú ý tham gia", {
  //   duration: 8000, 
  // });
  //   }
  // };
  
  
  useEffect(() => {
    fetchConsultations();
    const interval = setInterval(fetchConsultations, 15000);
    return () => clearInterval(interval);
  }, []);

  const fetchConsultations = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      // 1. Lấy danh sách tư vấn
      const response = await api.get("/booking/customer", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = response.data;

      // 2. Lấy danh sách huấn luyện viên
      const userResponse = await api.get("/admin/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const users = userResponse.data;

      // 3. Ghép avatar huấn luyện viên vào tư vấn
      const transformedData = data.map((item, index) => {
        const matchedCoach = users.find(
          (u) => u.fullName === item.coachName 
        );

        return {
          id: index,
          coachName: item.coachName,
          date: item.appointmentDate,
          time: item.startTime,
          endTime: dayjs(item.startTime, "HH:mm:ss")
            .add(60, "minute")
            .format("HH:mm:ss"),
          status: item.status,
          meetingLink: item.googleMeetLink,
          platform: "Google Meet",
          notes: "",
          coachAvatar: matchedCoach?.avatar || null,
          createdAt: new Date().toISOString(),
          completedAt:
            item.status === "COMPLETED"
              ? dayjs(`${item.appointmentDate} ${item.startTime}`)
                  .add(60, "minute")
                  .toISOString()
              : null,
        };
      });
// // ⚠️ DỮ LIỆU GIẢ LẬP DÙNG ĐỂ TEST THÔNG BÁO
// if (window.location.search.includes("test=true")) {
//   const fakeUpcoming = {
//     id: 9999,
//     coachName: "Coach Demo",
//     date: dayjs().format("YYYY-MM-DD"),
//     time: dayjs().add(60 , "minute").format("HH:mm:ss"), // sau 30 phút
//     endTime: dayjs().add(90, "minute").format("HH:mm:ss"),
//     status: "PENDING",
//     meetingLink: "https://meet.google.com/demo-link",
//     platform: "Google Meet",
//     coachAvatar: null,
//     createdAt: new Date().toISOString(),
//   };

//   const demoData = [...transformedData, fakeUpcoming];
//   setConsultations(demoData);
//   checkUpcomingPending(demoData);
// } else {
//   setConsultations(transformedData);
//   checkUpcomingPending(transformedData);
// }
      setConsultations(transformedData);
      checkUpcomingPending(transformedData);
    } catch (error) {
      console.error("Lỗi khi tải danh sách tư vấn:", error);
      message.error("Không thể tải danh sách tư vấn");
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      PENDING: {
        color: "orange",
        text: "Chờ tư vấn",
        icon: <ClockCircleOutlined />,
      },
      COMPLETED: {
        color: "green",
        text: "Đã hoàn thành",
        icon: <CheckCircleOutlined />,
      },
      CANCELLED: {
        color: "red",
        text: "Đã hủy",
        icon: <ExclamationCircleOutlined />,
      },
      IN_PROGRESS: {
        color: "blue",
        text: "Đang diễn ra",
        icon: <PlayCircleOutlined />,
      },
    };
    return configs[status] || { color: "default", text: "Không xác định" };
  };

  const joinMeeting = (consultation) => {
    if (consultation.meetingLink) {
      window.open(consultation.meetingLink, "_blank");
      message.success("Đã mở link tư vấn");
    }
  };

  const filteredConsultations = consultations.filter((item) => {
    const statusMatch = statusFilter === "ALL" || item.status === statusFilter;
    const searchMatch = item.coachName
      .toLowerCase()
      .includes(searchText.toLowerCase());
    return statusMatch && searchMatch;
  });

  const columns = [
    {
      title: "Huấn luyện viên",
      dataIndex: "coachName",
      key: "coachName",
      render: (name, record) => (
        <div className="coach-info">
          <Avatar
            src={record.coachAvatar}
            icon={!record.coachAvatar && <UserOutlined />}
            size={40}
          />
          <div className="coach-details">
            <Text strong>{name}</Text>
            <Text type="secondary">{record.platform}</Text>
          </div>
        </div>
      ),
    },
    {
      title: "Ngày giờ",
      key: "datetime",
      render: (_, record) => (
        <div>
          <div>
            <CalendarOutlined /> {dayjs(record.date).format("DD/MM/YYYY")}
          </div>
          <div>
            {record.time} - {record.endTime}
          </div>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status) => {
        const config = getStatusConfig(status);
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.text}
          </Tag>
        );
      },
    },
    {
      title: "Chi tiết",
      render: (_, record) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => {
            setSelectedConsultation(record);
            setDetailModalVisible(true);
          }}
        >
          Xem
        </Button>
      ),
    },
  ];

  return (
    <>
      <Navbar />
      <div
        className="view-advise-page"
        style={{ maxWidth: 1000, margin: "0 auto", padding: 20 }}
      >
        <Card
          title={
            <div>
              <CalendarOutlined /> Lịch tư vấn của tôi
            </div>
          }
          extra={
            <Button
              icon={<ReloadOutlined />}
              loading={loading}
              onClick={fetchConsultations}
            >
              Làm mới
            </Button>
          }
        >
          <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
            <Col span={8}>
              <Select
                value={statusFilter}
                onChange={setStatusFilter}
                style={{ width: "100%" }}
              >
                <Option value="ALL">Tất cả</Option>
                <Option value="PENDING">Chờ tư vấn</Option>
                <Option value="IN_PROGRESS">Đang diễn ra</Option>
                <Option value="COMPLETED">Đã hoàn thành</Option>
                <Option value="CANCELLED">Đã hủy</Option>
              </Select>
            </Col>
            <Col span={16}>
              <Search
                placeholder="Tìm theo tên huấn luyện viên..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
              />
            </Col>
          </Row>

          <Alert
            message="Lưu ý"
            description="Mỗi buổi tư vấn kéo dài 60 phút. Vui lòng tham gia đúng giờ."
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />

          <Table
            columns={columns}
            dataSource={filteredConsultations}
            rowKey="id"  
            loading={loading}
            pagination={{ pageSize: 10 }}
            locale={{
              emptyText: <Empty description="Chưa có buổi tư vấn nào" />,
            }}
          />
        </Card>
      </div>

      <Modal
        title="Chi tiết tư vấn"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            Đóng
          </Button>,
        ]}
      >
        {selectedConsultation && (
          <>
            <p>
              <strong>Coach:</strong> {selectedConsultation.coachName}
            </p>
            <p>
              <strong>Ngày giờ:</strong>{" "}
              {dayjs(selectedConsultation.date).format("DD/MM/YYYY")}{" "}
              {selectedConsultation.time}
            </p>
            <p>
              <strong>Trạng thái:</strong>{" "}
              {getStatusConfig(selectedConsultation.status).text}
            </p>

            {selectedConsultation.status === "PENDING" &&
              selectedConsultation.meetingLink && (
                <p>
                  <strong>Link:</strong>{" "}
                  <a
                    href={selectedConsultation.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {selectedConsultation.meetingLink}
                  </a>
                </p>
              )}
          </>
        )}
      </Modal>
      <Footer />
    </>
  );
}

export default ViewAdvise;

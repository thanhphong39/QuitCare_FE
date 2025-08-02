import React, { useState, useEffect } from "react";
import {
  Card,
  Checkbox,
  Button,
  message,
  Tag,
  Typography,
  Row,
  Col,
  DatePicker,
  Alert,
  Modal,
} from "antd";
import Swal from "sweetalert2";
import {
  CalendarOutlined,
  CloseCircleOutlined,
  SaveOutlined,
  LeftOutlined,
  RightOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import api from "../../../configs/axios";
import { useSelector } from "react-redux";
import "./management-schedule.css";

const { Title, Text } = Typography;

const WorkScheduleManagement = () => {
  const user = useSelector((state) => state.user);
  const accountId = user?.id;

  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [serverWorkingDays, setServerWorkingDays] = useState([]);

  useEffect(() => {
    generateMonthSchedule();
  }, [currentMonth]);

  const generateMonthSchedule = async () => {
    const startOfMonth = currentMonth.startOf("month").format("YYYY-MM-DD");
    const endOfMonth = currentMonth.endOf("month").format("YYYY-MM-DD");

    try {
      const res = await api.get("/session/working-days", {
        params: {
          from: startOfMonth,
          to: endOfMonth,
        },
      });

      const workingDays = res.data || [];
      const workingDateMap = {};
      workingDays.forEach((item) => {
        workingDateMap[item.date] = item;
      });

      const daysInMonth = currentMonth.daysInMonth();
      const startDate = dayjs(startOfMonth);

      const monthData = Array.from({ length: daysInMonth }, (_, i) => {
        const date = startDate.add(i, "day");
        const dateStr = date.format("YYYY-MM-DD");
        const dayData = workingDateMap[dateStr];

        const leaveStatus = dayData?.leaveStatus || "NONE";
        const isLeave = ["PENDING", "COMPLETED"].includes(leaveStatus);


        return {
          key: dateStr,
          date,
          dateStr,
          dayName: date.format("dddd"),
          isLeave,
          leaveStatus,
        };
      });

      setData(monthData);
      setServerWorkingDays(Object.keys(workingDateMap));
    } catch (err) {
      console.error(" Error fetching working days:", err);
      message.error("Lỗi khi tải dữ liệu lịch làm việc!");
    }
  };

  const handleLeaveChange = (dateStr, checked) => {
    setData((prev) =>
      prev.map((item) =>
        item.dateStr === dateStr
          ? {
              ...item,
              isLeave: checked,
              leaveStatus: checked ? "PENDING" : "NONE",
              isNewLeave: checked && !item.isLeave && !item.isNewLeave,
            }
          : item
      )
    );
  };

  const handleSubmitAll = async () => {
    const result = await Swal.fire({
      title: "Xác nhận cập nhật ngày nghỉ",
      html: `
        
        <p style="color: red; font-weight: bold;">🔔 Lưu ý: Yêu cầu nghỉ phép của bạn đang được xử lý. Vui lòng đợi trong giây lát để hệ thống xác nhận.
Cảm ơn bạn đã thông báo sớm!</p>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy",
    });
  
    if (!result.isConfirmed) return;
  
    setLoading(true);
  
    try {
      const leaveRecords = data.filter(
        (record) => record.isLeave && record.leaveStatus === "PENDING"
      );
  
      for (const record of leaveRecords) {
        await api.put("/session/availability-day", {
          accountId,
          date: record.dateStr,
        });
      }
  
      await Swal.fire({
        icon: "success",
        title: "Cập nhật thành công!",
        text: `Đã cập nhật ngày nghỉ cho tháng ${currentMonth.format("MM/YYYY")} thành công!`,
        confirmButtonText: "OK",
      });
      setLoading(false);
      await generateMonthSchedule();
    }  catch (error) {
      console.error("Đã gặp lỗi quá trời là nặng: ",error);
    
      const errorMsg = error.response?.data || "";
    
      if (errorMsg.includes("đã có lịch hẹn") || errorMsg.includes("already booked")) {
        Swal.fire({
          icon: "error",
          title: "Ngày đã bị đặt lịch!",
          text: "Ngày này đã được khách hàng đặt lịch. Vui lòng chọn ngày khác.",
        });
        setLoading(false);
      } else if (errorMsg.includes("Không có lịch làm ") || errorMsg.includes("not in schedule")) {
        Swal.fire({
          icon: "error",
          title: "Ngày bạn muốn nghỉ không hợp lệ!",
          text: "Ngày này không nằm trong lịch làm việc của bạn. Bạn chỉ có thể đăng ký nghỉ trong tháng hiện tại.",
        });
        setLoading(false);
      } else {
        Swal.fire({
          icon: "error",
          title: "Lỗi không xác định!",
          text: "Đã xảy ra lỗi khi cập nhật ngày nghỉ.",
        });
        setLoading(false);
      }
    }
  };
  

  const getDateStatus = (record) => {
    const isPast = dayjs(record.dateStr).isBefore(dayjs(), "day");
  
    const statusColorMap = {
      NONE: { label: "Đi làm", color: "green", status: "working" },
      PENDING: { label: "Chờ duyệt", color: "gold", status: "pending" },
      COMPLETED: {
        label: "Đã duyệt nghỉ",
        color: "#f5222d", // đỏ
        status: "completed",
      },
      CANCELLED: { label: "Đi làm", color: "green", status: "working" }, // coi như NONE
    };
  
    if (isPast) {
      return { label: "Đã qua", color: "#d9d9d9", status: "past" };
    }
  
    return (
      statusColorMap[record.leaveStatus] || {
        label: "Không rõ",
        color: "#ccc",
        status: "unknown",
      }
    );
  };
  

  const workingDays = data.filter((item) => !item.isLeave).length;
  const leaveDays = data.filter((item) => item.isLeave).length;

  return (
    <div className="schedule-page">
      <div className="container">
        <div className="page-header">
          <div className="header-content">
            <div className="title-section">
              <CalendarOutlined className="page-icon" />
              <div>
                <Title level={2} className="page-title">
                  Đăng ký lịch nghỉ
                </Title>
                <Text className="page-subtitle">
                  Mặc định là làm việc. Tick vào để đăng ký nghỉ từng ngày.
                </Text>
              </div>
            </div>

            <div className="header-actions">
              <DatePicker
                picker="month"
                value={currentMonth}
                onChange={(date) => setCurrentMonth(date || dayjs())}
                format="MM/YYYY"
                size="large"
                className="month-picker"
              />
            </div>
          </div>
        </div>

        <div className="month-nav">
          <Button
            icon={<LeftOutlined />}
            onClick={() => setCurrentMonth(currentMonth.subtract(1, "month"))}
            size="large"
            className="nav-btn"
          >
            Tháng trước
          </Button>

          <div className="current-month">
            <Text strong className="month-text">
              Tháng {currentMonth.format("MM/YYYY")}
            </Text>
          </div>

          <Button
            icon={<RightOutlined />}
            onClick={() => setCurrentMonth(currentMonth.add(1, "month"))}
            size="large"
            className="nav-btn"
          >
            Tháng sau
          </Button>
        </div>

        <Row gutter={24} className="stats-row">
          <Col span={8}>
            <div className="stat-card working">
              <div className="stat-icon">
                <CheckCircleOutlined />
              </div>
              <div className="stat-info">
                <div className="stat-number">{workingDays}</div>
                <div className="stat-label">Ngày làm việc</div>
              </div>
            </div>
          </Col>
          <Col span={8}>
            <div className="stat-card leave">
              <div className="stat-icon">
                <CloseCircleOutlined />
              </div>
              <div className="stat-info">
                <div className="stat-number">{leaveDays}</div>
                <div className="stat-label">Ngày nghỉ</div>
              </div>
            </div>
          </Col>
          <Col span={8}>
            <div className="stat-card total">
              <div className="stat-icon">
                <ClockCircleOutlined />
              </div>
              <div className="stat-info">
                <div className="stat-number">{workingDays * 8}</div>
                <div className="stat-label">Tổng giờ làm</div>
              </div>
            </div>
          </Col>
        </Row>

        <Alert
          message="Lịch làm việc cố định"
          description="Mặc định: 07:00-17:00 giờ . Tick vào ngày bạn muốn nghỉ."
          type="info"
          showIcon
          className="schedule-info"
        />

        <Card className="calendar-card">
          <div className="calendar-header">
            <Title level={4}>Chọn ngày nghỉ</Title>
            <Text type="secondary">Click vào ô checkbox để chọn ngày nghỉ</Text>
          </div>

          <div className="calendar-grid">
            {data.map((record) => {
              const dateStatus = getDateStatus(record);
              const isPast = dayjs(record.dateStr).isBefore(dayjs(), "day");

              return (
                <div
                  key={record.dateStr}
                  className={`day-cell ${dateStatus.status} ${
                    isPast ? "disabled" : ""
                  }`}
                  style={{ borderColor: dateStatus.color }}
                >
                  <div className="day-header">
                    <span className="day-number">
                      {record.date.format("DD")}
                    </span>
                    <span className="day-name">
                      {record.date.format("ddd")}
                    </span>
                  </div>

                  <div className="day-content">
                    {!isPast && (
                      <Checkbox
                      checked={record.isLeave}
                      disabled={record.leaveStatus === "COMPLETED"}
                      onChange={(e) =>
                        handleLeaveChange(record.dateStr, e.target.checked)
                      }
                      className="leave-checkbox"
                    >
                      Nghỉ
                    </Checkbox>
                    
                    )}

                    {isPast && (
                      <Tag size="small" color="default">
                        Đã qua
                      </Tag>
                    )}
                  </div>

                  <div className="day-status">
                    <Tag color={dateStatus.color} size="small">
                      {dateStatus.label}
                    </Tag>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <div className="save-section">
          <Button
            type="primary"
            size="large"
            icon={<SaveOutlined />}
            onClick={handleSubmitAll}
            loading={loading}
            className="save-btn"
          >
            Lưu lịch tháng {currentMonth.format("MM/YYYY")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WorkScheduleManagement;

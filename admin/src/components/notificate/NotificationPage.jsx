import React, { useEffect, useState, useCallback, useRef } from "react";
import { format } from "date-fns";
import { message, Spin, Empty, Card, Button, Statistic, Row, Col } from "antd";
import {
  BellOutlined,
  ReloadOutlined,
  TrophyOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import "./NotificationPage.css";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import api from "../../configs/axios";

function NotificationPage() {
  const accountId = localStorage.getItem("accountId");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [totalStats, setTotalStats] = useState({
    totalPoints: 0,
    totalMoneySaved: 0,
    totalCigarettesSmoked: 0,
    totalNotifications: 0,
  });

  // Thêm ref để track API call
  const isLoadingRef = useRef(false);
  const hasFetchedRef = useRef(false);

  // Sử dụng useCallback để tránh tạo lại function
  const fetchNotifications = useCallback(async () => {
    // Tránh gọi API nhiều lần
    if (isLoadingRef.current) {
      console.log("⚠️ API đang được gọi, bỏ qua request trùng lặp");
      return;
    }

    try {
      isLoadingRef.current = true;
      setLoading(true);

      const notificationResponse = await api.get("/message-notifications");

      if (
        !notificationResponse.data ||
        notificationResponse.data.length === 0
      ) {
        setNotifications([]);
        setTotalStats({
          totalPoints: 0,
          totalMoneySaved: 0,
          totalCigarettesSmoked: 0, 
          totalNotifications: 0,
        });
        console.log("ℹ️ Không có thông báo nào");
        return;
      }

      // Lấy danh sách unique progressId để tránh gọi API trùng lặp
      const uniqueProgressIds = [
        ...new Set(notificationResponse.data.map((n) => n.quitProgressId)),
      ];
      console.log("📋 Unique Progress IDs:", uniqueProgressIds);

      // Lấy thông tin progress cho các notification để có stats
      const progressMap = new Map();
      let totalPoints = 0;
      let totalMoneySaved = 0;
      let totalCigarettesSmoked = 0; 

      // Sử dụng Promise.all để tối ưu performance
      const progressPromises = uniqueProgressIds.map(async (progressId) => {
        try {
          const progressResponse = await api.get(
            `/quit-progress/${progressId}`
          );
          const progressData = progressResponse.data;

          progressMap.set(progressId, progressData);

          // Cộng dồn stats (chỉ cộng 1 lần cho mỗi progress)
          totalPoints += progressData.point || 0;
          totalMoneySaved += progressData.money_saved || 0;
          totalCigarettesSmoked += progressData.cigarettes_smoked || 0; 

          return { progressId, data: progressData };
        } catch (error) {
          console.error(`❌ Lỗi lấy progress ${progressId}:`, error);
          const defaultData = {
            date: null,
            cigarettes_smoked: 0,
            money_saved: 0,
            point: 0,
          };
          progressMap.set(progressId, defaultData);
          return { progressId, data: defaultData };
        }
      });

      // Đợi tất cả API calls hoàn thành
      await Promise.all(progressPromises);

      // Format dữ liệu thông báo với thông tin progress
      const formattedNotifications = notificationResponse.data.map(
        (notification) => {
          const progressData = progressMap.get(notification.quitProgressId);

          return {
            id: notification.id,
            content: notification.content,
            messageStatus: notification.messageStatus,
            quitProgressId: notification.quitProgressId,
            displayDate: progressData?.date || notification.sendAt,
            cigarettes_smoked: progressData?.cigarettes_smoked || 0,
            money_saved: progressData?.money_saved || 0,
            point: progressData?.point || 0,
            progressData: progressData,
          };
        }
      );

      // Loại bỏ thông báo trùng lặp dựa trên ID
      const uniqueNotifications = formattedNotifications.filter(
        (notification, index, self) =>
          index === self.findIndex((n) => n.id === notification.id)
      );

      // Sắp xếp theo ngày mới nhất
      const sortedNotifications = uniqueNotifications.sort(
        (a, b) => new Date(b.displayDate) - new Date(a.displayDate)
      );

      // Cập nhật state với tổng số điếu
      setNotifications(sortedNotifications);
      setTotalStats({
        totalPoints,
        totalMoneySaved,
        totalCigarettesSmoked, // Thêm vào state
        totalNotifications: sortedNotifications.length,
      });

      console.log("🔔 Danh sách thông báo cuối cùng:", sortedNotifications);
      console.log("📊 Tổng kết:", {
        totalPoints,
        totalMoneySaved,
        totalCigarettesSmoked,
      });

      hasFetchedRef.current = true;
    } catch (error) {
      console.error("❌ Lỗi lấy thông báo:", error);
      message.error("Không thể tải danh sách thông báo");
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  }, [accountId]);

  // Làm mới danh sách thông báo
  const handleRefresh = async () => {
    setRefreshing(true);
    hasFetchedRef.current = false; // Reset để cho phép fetch lại
    await fetchNotifications();
    setRefreshing(false);
    message.success("Đã cập nhật thông báo!");
  };

  // Format ngày
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Ngày không hợp lệ";
      }
      return format(date, "dd/MM/yyyy");
    } catch (error) {
      return "Ngày không hợp lệ";
    }
  };

  // Render thông báo với thông tin chi tiết
  const renderNotificationItem = (notification) => (
    <Card
      key={notification.id}
      className="notification-item-card"
      size="small"
      style={{ marginBottom: 16 }}
    >
      <div className="notification-header">
        <div className="notification-date">
          📅 {formatDate(notification.displayDate)}
        </div>
        {/* Xóa Tag messageStatus */}
      </div>

      <div className="notification-content">{notification.content}</div>

      {/* Hiển thị stats chi tiết */}
      <div className="notification-stats">
        <Row gutter={16}>
          <Col span={6}>
            <div className="stat-item">
              🚬 Số điếu: <strong>{notification.cigarettes_smoked}</strong>
            </div>
          </Col>
          <Col span={6}>
            <div className="stat-item">
              💰 Tiết kiệm:{" "}
              <strong>{notification.money_saved?.toLocaleString()}</strong> VND
            </div>
          </Col>
          <Col span={6}>
            <div className="stat-item">
              🏆 Điểm: <strong>{notification.point}</strong>
            </div>
          </Col>
          <Col span={6}>
            <div className="stat-item">
              📅 Ngày: <strong>{formatDate(notification.displayDate)}</strong>
            </div>
          </Col>
        </Row>
      </div>
    </Card>
  );

  // Tối ưu useEffect để tránh gọi nhiều lần
  useEffect(() => {
    if (accountId && !hasFetchedRef.current && !isLoadingRef.current) {
      fetchNotifications();
    } else if (!accountId) {
      message.error("Vui lòng đăng nhập để xem thông báo.");
      setLoading(false);
    }
  }, [accountId, fetchNotifications]);

  // Cleanup khi component unmount
  useEffect(() => {
    return () => {
      isLoadingRef.current = false;
      hasFetchedRef.current = false;
    };
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="notification-container">
          <div className="notification-loading">
            <Spin size="large" />
            <p>Đang tải thông báo...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="notification-container">
        <div className="notification-header">
          <h2 className="notification-title">
            <BellOutlined /> Thông Báo Theo Dõi
          </h2>
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            loading={refreshing}
            onClick={handleRefresh}
          >
            Làm mới
          </Button>
        </div>

        {/* Tổng kết thống kê - Đã thêm cột Tổng Số Điếu */}
        <Card className="stats-summary" style={{ marginBottom: 24 }}>
          <h3>📊 Tổng Kết Theo Dõi</h3>
          <Row gutter={16}>
            <Col span={6}>
              <Statistic
                title="Tổng Thông Báo"
                value={totalStats.totalNotifications}
                prefix={<BellOutlined />}
                valueStyle={{ color: "#1890ff" }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="Tổng Điểm"
                value={totalStats.totalPoints}
                prefix={<TrophyOutlined />}
                valueStyle={{ color: "#52c41a" }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="Tiền Tiết Kiệm"
                value={totalStats.totalMoneySaved}
                prefix={<DollarOutlined />}
                suffix="VND"
                valueStyle={{ color: "#faad14" }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="Tổng Số Điếu"
                value={totalStats.totalCigarettesSmoked}
                prefix="🚬"
                suffix="điếu"
                valueStyle={{ color: "#f5222d" }}
              />
            </Col>
          </Row>
        </Card>

        {notifications.length === 0 ? (
          <div className="empty-state">
            <Empty
              description="Chưa có thông báo nào"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
            <p style={{ textAlign: "center", color: "#666", marginTop: 16 }}>
              Các thông báo về tiến trình cai thuốc sẽ xuất hiện tại đây
            </p>
          </div>
        ) : (
          <div className="notification-list">
            {notifications.map(renderNotificationItem)}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default NotificationPage;

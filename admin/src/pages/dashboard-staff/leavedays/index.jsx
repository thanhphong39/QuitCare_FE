import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { Table, Button, Spin, Typography, Space, message } from "antd";
import api from "../../../configs/axios";

const { Title, Text } = Typography;

function LeaveDays() {
  const [groupedLeaves, setGroupedLeaves] = useState({});
  const [coachNameMap, setCoachNameMap] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchCoaches = async () => {
    try {
      const res = await api.get("/session/coaches");
      const map = {};
      (res.data || []).forEach((c) => {
        map[c.id] = c.fullName;
      });
      setCoachNameMap(map);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách coach:", error);
    }
  };

  const fetchLeaveRequests = async () => {
    setLoading(true);
    try {
      const res = await api.get("/session/pending-leave-requests");
      const data = res.data || [];

      const grouped = data.reduce((acc, item) => {
        const dateKey = dayjs(item.date).format("YYYY-MM-DD");
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(item);
        return acc;
      }, {});
      setGroupedLeaves(grouped);
    } catch (error) {
      console.error("Lỗi khi lấy đơn nghỉ:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (date, requests) => {
    try {
      await Promise.all(
        requests.map((item) =>
          api.put("/session/approve-leave", {
            coachId: item.coachId,
            date,
          })
        )
      );
      message.success("✅ Duyệt thành công!");
      fetchLeaveRequests();
    } catch (error) {
      console.error("Lỗi khi duyệt đơn:", error);
      message.error("❌ Lỗi khi duyệt");
    }
  };

  const handleCancel = async (date, requests) => {
    try {
      await Promise.all(
        requests.map((item) =>
          api.put("/session/cancel-leave", {
            coachId: item.coachId,
            date,
          })
        )
      );
      message.warning("🚫 Đã huỷ đơn nghỉ.");
      fetchLeaveRequests();
    } catch (error) {
      console.error("Lỗi khi huỷ đơn:", error);
      message.error("❌ Lỗi khi huỷ");
    }
  };

  useEffect(() => {
    fetchCoaches();
    fetchLeaveRequests();
  }, []);

  const dataSource = Object.entries(groupedLeaves).map(([date, requests]) => {
    const coachNames = requests
      .map((item) => coachNameMap[item.coachId] || `Coach ${item.coachId}`)
      .join(", ");
    return {
      key: date,
      date,
      coachNames,
      requests,
    };
  });

  const columns = [
    {
      title: "Ngày xin nghỉ",
      dataIndex: "date",
      key: "date",
      render: (date) => (
        <Text strong type="secondary">
          {dayjs(date).format("DD/MM/YYYY")}
        </Text>
      ),
      width: "25%",
    },
    {
      title: "Tên các Coach",
      dataIndex: "coachNames",
      key: "coachNames",
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            onClick={() => handleApprove(record.date, record.requests)}
          >
            Duyệt
          </Button>
          <Button
            danger
            onClick={() => handleCancel(record.date, record.requests)}
          >
            Huỷ
          </Button>
        </Space>
      ),
      width: "25%",
      align: "center",
    },
  ];

  return (
    <div style={{ padding: 24, maxWidth: 1000, margin: "0 auto" }}>
      <Title level={3} style={{ color: "#1677ff", marginBottom: 24 }}>
        Danh sách đơn nghỉ chờ duyệt
      </Title>

      {loading ? (
        <Spin tip="Đang tải dữ liệu..." size="large" />
      ) : dataSource.length === 0 ? (
        <Text type="secondary">Không có đơn nào đang chờ duyệt.</Text>
      ) : (
        <Table
          dataSource={dataSource}
          columns={columns}
          bordered
          pagination={false}
        />
      )}
    </div>
  );
}

export default LeaveDays;



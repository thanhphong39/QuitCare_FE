import React, { useEffect, useState } from "react";
import { Table, Tag, Typography, Spin, Alert } from "antd";
import {
  DollarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import api from "../../configs/axios";
import dayjs from "dayjs";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import "./PaymentHistory.css";
import { Modal, Descriptions } from "antd";

const { Title } = Typography;

const HistoryPayment = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const accountId = localStorage.getItem("accountId");
  const PAGE_SIZE = 8;
  const [visibleModal, setVisibleModal] = useState(false);
  const [selectedMembership, setSelectedMembership] = useState(null);
  // const [packageStatusMap, setPackageStatusMap] = useState({});
  useEffect(() => {
    const fetchPaymentsWithMembershipStatus = async () => {
      try {
        const [paymentsRes] = await Promise.all([
          api.get(`/v1/payments/history/account/${accountId}`)
        ]);
  
        const payments = paymentsRes.data || [];
        const sortedPayments = payments.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
  
        const successPayments = sortedPayments.filter(
          (p) => p.status === "SUCCESS"
        );
  
        const uniqueMembershipIds = [
          ...new Set(
            successPayments
              .map((p) => p.userMembershipId)
              .filter((id) => id !== null && id !== undefined)
          ),
        ];
  
        const membershipStatuses = await Promise.all(
          uniqueMembershipIds.map((id) =>
            api
              .get(`/user-memberships/${id}`)
              .then((res) => ({ id, data: res.data }))
              .catch((err) => {
                console.error(`❌ Lỗi khi lấy trạng thái gói #${id}:`, err);
                return { id, data: { status: "UNKNOWN" } };
              })
          )
        );
  
        const statusMap = {};
        for (const { id, data } of membershipStatuses) {
          let membershipPlan = null;
          if (data && data.planId) {
            try {
              const planRes = await api.get(`/membership-plans/${data.planId}`);
              membershipPlan = planRes.data;
            } catch (err) {
              console.error(`❌ Lỗi khi lấy gói thành viên #${data.planId}:`, err);
            }
          }
  
          statusMap[id] = {
            ...data,
            membershipPlan,
          };
        }
  
        const paymentsWithStatus = sortedPayments.map((payment) => {
          const membership =
            payment.status === "SUCCESS"
              ? statusMap[payment.userMembershipId] || null
              : null;
  
          return {
            ...payment,
            membershipStatus: membership,
          };
        });
  
        setPayments(paymentsWithStatus);
      } catch (err) {
        console.error("❌ Lỗi khi lấy lịch sử thanh toán:", err);
      } finally {
        setLoading(false);
      }
    };
  
    if (accountId) {
      fetchPaymentsWithMembershipStatus();
    }
  }, [accountId]);
  

  const getStatusDisplay = (status) => {
    switch (status) {
      case "ACTIVE":
        return { text: "Xem chi tiết", color: "green" };
      case "INACTIVE":
        return { text: "Không hoạt động", color: "gray" };
      case "EXPIRED":
        return { text: "Hết hạn", color: "red" };
      default:
        return { text: "Không xác định", color: "gray" };
    }
  };

  const columns = [
    {
      title: "STT",
      key: "stt",
      render: (text, record, index) => (
        <span className="payment-transaction-id">
          #{(currentPage - 1) * PAGE_SIZE + index + 1}
        </span>
      ),
    },
    {
      title: "Số tiền ",
      dataIndex: "amountPaid",
      key: "amountPaid",
      render: (amount, record) => {
        if (record.status === "SUCCESS") {
          return (
            <span className="payment-amount">
              {amount.toLocaleString("vi-VN")} VND
            </span>
          );
        } else {
          return <span style={{ color: "gray" }}>{amount.toLocaleString("vi-VN")} VND</span>;
        }
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const statusClass =
          status === "SUCCESS"
            ? "payment-status-success"
            : status === "PENDING"
            ? "payment-status-pending"
            : "payment-status-failed";

        return (
          <span className={statusClass}>
            {status === "SUCCESS"
              ? "Thành công"
              : status === "PENDING"
              ? "Đang xử lý"
              : "Thất bại"}
          </span>
        );
      },
    },
    {
      title: "Thời gian tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => (
        <span className="payment-date">
          {dayjs(date).format("HH:mm DD/MM/YYYY")}
        </span>
      ),
    },
    {
      title: "Chi tiết gói",
      dataIndex: "membershipStatus",
      key: "membershipStatus",
      render: (membership) => {
        if (!membership)
          return <span style={{ color: "gray" }}>Không xác định</span>;

        const { text, color } = getStatusDisplay(membership.status);

        return (
          <span
            style={{
              color,
              fontWeight: 500,
              cursor: "pointer",
              textDecoration: "underline",
            }}
            onClick={() => {
              setSelectedMembership(membership);
              setVisibleModal(true);
            }}
          >
             {text}
          </span>
        );
      },
    },
  ];

  // Calculate statistics
  const totalAmount = payments.reduce(
    (sum, payment) =>
      payment.status === "SUCCESS" ? sum + payment.amountPaid : sum,
    0
  );
  const successCount = payments.filter((p) => p.status === "SUCCESS").length;
  const pendingCount = payments.filter((p) => p.status === "PENDING").length;

  return (
    <>
      <Navbar />
      <div className="payment-history-container">
        <div className="payment-history-wrapper">
          <div className="payment-history-header">
            <Title className="payment-history-title">Lịch sử thanh toán</Title>
            <p className="payment-history-subtitle">
              Theo dõi tất cả các giao dịch thanh toán của bạn
            </p>
          </div>

          {!loading && payments.length > 0 && (
            <div className="payment-statistics">
              <div className="payment-stat-card">
                <DollarOutlined className="payment-stat-icon" />
                <div className="payment-stat-value">
                  {totalAmount.toLocaleString("vi-VN")} VND
                </div>
                <div className="payment-stat-label">Tổng số tiền</div>
              </div>
              <div className="payment-stat-card">
                <CheckCircleOutlined className="payment-stat-icon" />
                <div className="payment-stat-value">{successCount}</div>
                <div className="payment-stat-label">Giao dịch thành công</div>
              </div>
              <div className="payment-stat-card">
                <ClockCircleOutlined className="payment-stat-icon" />
                <div className="payment-stat-value">{pendingCount}</div>
                <div className="payment-stat-label">Đang xử lý</div>
              </div>
            </div>
          )}

          <div className="payment-history-card">
            {loading ? (
              <div className="payment-history-loading">
                <Spin size="large" />
                <div className="payment-history-loading-text">
                  Đang tải lịch sử thanh toán...
                </div>
              </div>
            ) : payments.length === 0 ? (
              <div className="payment-history-empty">
                <DollarOutlined className="payment-history-empty-icon" />
                <div className="payment-history-empty-title">
                  Chưa có giao dịch nào
                </div>
                <div className="payment-history-empty-desc">
                  Bạn chưa thực hiện giao dịch thanh toán nào
                </div>
              </div>
            ) : (
              <div className="payment-history-table">
                <Table
                  dataSource={payments}
                  columns={columns}
                  rowKey="id"
                  pagination={{
                    current: currentPage,
                    pageSize: PAGE_SIZE,
                    showSizeChanger: false,
                    onChange: (page) => setCurrentPage(page),
                    showTotal: (total, range) =>
                      `${range[0]}-${range[1]} của ${total} giao dịch`,
                  }}
                  bordered={false}
                />
                <Modal
                  title="Chi tiết gói thành viên"
                  open={visibleModal}
                  onCancel={() => setVisibleModal(false)}
                  footer={null}
                >
                  {selectedMembership ? (
                    <Descriptions column={1} bordered size="small">
                      {/* <Descriptions.Item label="ID gói">
                        {selectedMembership.id}
                      </Descriptions.Item> */}
                      <Descriptions.Item label="Trạng thái">
                        {getStatusDisplay(selectedMembership.status).text}
                      </Descriptions.Item>
                      <Descriptions.Item label="Ngày bắt đầu">
                        {dayjs(selectedMembership.startDate).format(
                          "DD/MM/YYYY"
                        )}
                      </Descriptions.Item>
                      <Descriptions.Item label="Ngày kết thúc">
                        {dayjs(selectedMembership.endDate).format("DD/MM/YYYY")}
                      </Descriptions.Item>
                      <Descriptions.Item label="Tên gói">
                        {selectedMembership.membershipPlan?.name ||
                          "Không xác định"}
                      </Descriptions.Item>
                      <Descriptions.Item label="Giá">
                        {selectedMembership.membershipPlan?.price?.toLocaleString(
                          "vi-VN"
                        ) || "?"}{" "}
                        VND
                      </Descriptions.Item>
                    </Descriptions>
                  ) : (
                    <Alert
                      message="Không có dữ liệu gói"
                      type="warning"
                      showIcon
                    />
                  )}
                </Modal>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default HistoryPayment;

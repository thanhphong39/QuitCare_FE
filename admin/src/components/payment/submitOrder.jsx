import React, { useEffect, useState } from "react";
import api from "../../configs/axios";
import { useNavigate } from "react-router-dom";
import "./PaymentPage.css";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { HomeOutlined } from "@ant-design/icons";
import { Modal,Button } from "antd";
const PaymentPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const membershipPlanId = searchParams.get("membershipPlanId");

  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const user = useSelector((state) => state.user);
  const accountId = user?.id;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const [hasActivePremium, setHasActivePremium] = useState(false);

  useEffect(() => {
    const checkActivePremium = async () => {
      try {
        if (!user?.id) {
          console.log("⚠️ Không có user.id để kiểm tra gói Premium.");
          return;
        }
  
        console.log("📥 Kiểm tra gói Premium đang hoạt động...");
  
        const historyRes = await api.get(
          `/v1/payments/history/account/${user.id}`
        );
        const transactions = historyRes.data || [];
  
        const successTransactions = transactions
          .filter((tx) => tx.status === "SUCCESS" && tx.userMembershipId)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sắp xếp mới nhất trước
  
        for (const tx of successTransactions) {
          const { userMembershipId } = tx;
  
          // Lấy thông tin membership
          const membershipRes = await api.get(`/user-memberships/${userMembershipId}`);
          const membership = membershipRes.data;
  
          if (membership.status !== "ACTIVE") continue;
  
          // Lấy thông tin gói
          const planRes = await api.get(`/membership-plans/${membership.planId}`);
          const plan = planRes.data;
  
          if (plan.name === "Premium") {
            console.log(" Có gói Premium đang ACTIVE và mới nhất.");
            setHasActivePremium(true);
            return;
          }
        }
  
        console.log("Không tìm thấy gói Premium ACTIVE.");
        setHasActivePremium(false);
      } catch (error) {
        console.error(" Lỗi khi kiểm tra Premium:", error);
        setHasActivePremium(false);
      }
    };
  
    checkActivePremium();
  }, [user?.id]);
  

  // Lấy thông tin gói
  useEffect(() => {
    if (!membershipPlanId) {
      setError("Không có thông tin gói được chọn.");
      return;
    }

    const fetchPackage = async () => {
      try {
        const res = await api.get(`/membership-plans/${membershipPlanId}`);
        setPkg(res.data);
      } catch (err) {
        console.error("❌ Lỗi lấy thông tin gói:", err);
        setError("Không thể tải thông tin gói.");
      }
    };

    fetchPackage();
  }, [membershipPlanId]);

  const [confirmModalVisible, setConfirmModalVisible] = useState(false);

  // Xử lý thanh toán
  const handleBuyPremium = () => {
    if (hasActivePremium) {
      setConfirmModalVisible(true); // mở modal xác nhận
    } else {
      proceedToBuy(); // mua luôn nếu không có Premium
    }
  };

  const proceedToBuy = async () => {
    setError("");
    setLoading(true);

    if (!accountId || !membershipPlanId) {
      setError("Thiếu thông tin tài khoản hoặc gói.");
      setLoading(false);
      return;
    }

    if (!pkg || typeof pkg.price !== "number") {
      setError("Thông tin gói không hợp lệ hoặc thiếu giá.");
      setLoading(false);
      return;
    }

    try {
      console.log("📦 ID gói:", pkg?.id);
      console.log("👤 ID người dùng:", accountId);

      const res = await api.post(`/v1/payments/buy/${membershipPlanId}`);
      const paymentData = res.data;

      console.log("✅ Kết quả trả về:", paymentData);

      let paymentUrl = null;

      if (typeof paymentData === "string" && paymentData.startsWith("http")) {
        // Trường hợp trả về URL trực tiếp (trong log của bạn)
        paymentUrl = paymentData;
      } else if (
        typeof paymentData === "string" &&
        paymentData.startsWith("redirect:")
      ) {
        // Trường hợp trả về redirect:url
        paymentUrl = paymentData.split("redirect:")[1];
      } else if (typeof paymentData === "object" && paymentData.redirectUrl) {
        // Trường hợp trả về JSON object
        paymentUrl = paymentData.redirectUrl;
      }

      if (paymentUrl && paymentUrl.startsWith("http")) {
        console.log("🌐 Điều hướng đến:", paymentUrl);
        window.location.href = paymentUrl;
      } else {
        setError(" Không tìm thấy URL thanh toán hợp lệ.");
        console.warn(" Không có URL hợp lệ:", paymentUrl);
      }
    } catch (err) {
      console.error(" Lỗi khi gửi yêu cầu thanh toán:", err);
      setError("Không thể gửi yêu cầu thanh toán.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-container">
      {/* Nút quay lại nằm góc trái trên cùng */}
      <div
        className="back-home-top-left"
        style={{ position: "absolute", top: 20, left: 20 }}
      >
        <button
          onClick={() => navigate("/")}
          className="back-button"
          style={{
            backgroundColor: "#ffffff",
            color: "#333",
            padding: "8px 16px",
            border: "1px solid #ccc",
            borderRadius: "6px",
            fontSize: "14px",
            cursor: "pointer",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          }}
        >
          ← Quay lại trang chủ
        </button>
      </div>

      {/* Nội dung chính */}
      <div className="payment-card">
        <div className="payment-header">
          <img
            src="https://vnpay.vn/s1/statics.vnpay.vn/2023/6/0oxhzjmxbksr1686814746087.png"
            alt="VNPay Logo"
            className="vnpay-logo"
          />
          <h2>Xác nhận thanh toán</h2>
        </div>

        {pkg ? (
          <div className="order-details">
            <p className="order-title">Thông tin đơn hàng</p>
            <div className="order-item">
              <span>Tên gói</span>
              <span>{pkg.name}</span>
            </div>
            <div className="order-item">
              <span>Mô tả</span>
              <span>{pkg.description}</span>
            </div>
            <div className="order-item total">
              <span>Tổng số tiền</span>
              <span className="amount-highlight">
                {formatCurrency(pkg.price)}
              </span>
            </div>
          </div>
        ) : (
          <p>Đang tải thông tin gói...</p>
        )}

        {error && <div className="payment-error">{error}</div>}
        <Modal
          title="Bạn đã có gói Premium đang hoạt động"
          open={confirmModalVisible}
          onCancel={() => setConfirmModalVisible(false)}
          footer={[
            <Button key="cancel" onClick={() => setConfirmModalVisible(false)}>
              Hủy
            </Button>,
            <Button
              key="confirm"
              type="primary"
              onClick={() => {
                setConfirmModalVisible(false);
                proceedToBuy();
              }}
            >
              Tiếp tục mua
            </Button>,
          ]}
        >
          <p>Bạn chắc chắn muốn mua lại gói Premium mới?</p>
        </Modal>
        <div className="payment-actions">
          <button
            onClick={handleBuyPremium}
            className="cta-button"
            disabled={loading || !pkg}
          >
            {loading ? "Đang xử lý..." : "Tiến hành thanh toán"}
          </button>
          <p className="secure-note">
            Bạn sẽ được chuyển đến cổng thanh toán an toàn của VNPay.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;

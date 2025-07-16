import React, { useEffect, useState } from "react";
import { HomeOutlined, HistoryOutlined } from "@ant-design/icons";
import useGetParams from "../../hook/useGetParam";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux"; // ✅ Thêm useDispatch
import { updateUserRole } from "../../redux/features/userSlice"; // ✅ Import action
import { Result, Button, Descriptions, Spin, Card } from "antd";
import "./PaymentResult.css";
import api from "../../configs/axios";

const PaymentResult = () => {
  const getParam = useGetParams();
  const navigate = useNavigate();
  const dispatch = useDispatch(); // ✅ Khởi tạo dispatch

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("success");
  const [countdown, setCountdown] = useState(20);

  const transactionStatus = getParam("vnp_TransactionStatus");

  const paymentDetails = {
    transactionNo: getParam("vnp_TransactionNo"),
    amount: Number(getParam("vnp_Amount") || 0) / 100,
    bank: getParam("vnp_BankCode"),
    cardType: getParam("vnp_CardType"),
    payDate: getParam("vnp_PayDate"),
  };

  const formatVNPayDate = (rawDateStr) => {
    if (!rawDateStr || rawDateStr.length !== 14) return rawDateStr;
    const year = rawDateStr.slice(0, 4);
    const month = rawDateStr.slice(4, 6);
    const day = rawDateStr.slice(6, 8);
    const hour = rawDateStr.slice(8, 10);
    const minute = rawDateStr.slice(10, 12);
    const second = rawDateStr.slice(12, 14);
    return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
  };

  // ✅ useEffect cho countdown và redirect
  useEffect(() => {
    if (status === "success" && !loading) {
      const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            // ✅ Cập nhật Redux trước khi chuyển hướng
            dispatch(updateUserRole("CUSTOMER"));
            // Chuyển hướng về planning
            navigate("/planning");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(countdownInterval);
    }
  }, [status, loading, dispatch, navigate]);

  useEffect(() => {
    const updatePaymentStatus = async () => {
      const paymentId = getParam("paymentID");
      const packageID = getParam("packageID");
      console.log("payment id la:", paymentId);

      if (transactionStatus === "00") {
        try {
          await api.post("/v1/payments", {
            paymentId: Number(paymentId),
            membershipPlanId: packageID,
            paymentStatus: "SUCCESS",
          });

          setStatus("success");

          // ✅ Cập nhật Redux ngay sau khi API thành công
          dispatch(updateUserRole("CUSTOMER"));
        } catch (error) {
          console.error("Lỗi khi cập nhật trạng thái thanh toán:", error);
          setStatus("error");
        }
      } else {
        try {
          await api.post("/v1/payments", {
            paymentId: Number(paymentId),
            membershipPlanId: packageID,
            paymentStatus: "FAILED",
          });

          setStatus("error");
        } catch (error) {
          console.error("Lỗi khi cập nhật trạng thái thanh toán:", error);
          setStatus("error");
        }
      }

      // Cho loading hiển thị ít nhất 500ms trước khi tắt
      const timer = setTimeout(() => setLoading(false), 800);
      return () => clearTimeout(timer);
    };

    updatePaymentStatus();
  }, [transactionStatus, getParam, dispatch]); // ✅ Thêm dispatch vào dependency

  if (loading) {
    return (
      <div className="payment-result-loading">
        <Spin size="large" />
        <div className="payment-result-loading-text">
          Đang xử lý kết quả thanh toán...
        </div>
      </div>
    );
  }

  return (
    <div className="payment-result-main-container">
      <div className="payment-result-wrapper">
        <Result
          status={status}
          title={
            status === "success"
              ? "Thanh toán thành công!"
              : "Thanh toán thất bại!"
          }
          subTitle={
            status === "success" ? (
              <>
                Cảm ơn bạn đã thanh toán qua VNPay.
                <br />
                <strong style={{ color: "#52c41a" }}>
                  Tài khoản đã được nâng cấp thành khách hàng!
                </strong>
                <br />
                <span style={{ color: "#666" }}>
                  Tự động chuyển về trang lập kế hoạch sau {countdown} giây...
                </span>
              </>
            ) : (
              "Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại."
            )
          }
          extra={[
            <Button
              type="primary"
              icon={<HomeOutlined />}
              onClick={() => navigate("/")}
              key="home"
            >
              Về trang chủ
            </Button>,
            <Button
              icon={<HistoryOutlined />}
              onClick={() => navigate("/history-transactions")}
              key="history"
            >
              Xem lịch sử đơn hàng
            </Button>,
          ]}
        />

        {status === "success" && (
          <Card
            title="Chi tiết giao dịch"
            bordered={false}
            className="payment-transaction-card"
          >
            <Descriptions
              column={1}
              layout="horizontal"
              labelStyle={{ fontWeight: 500 }}
            >
              <Descriptions.Item label="Mã giao dịch">
                <span className="payment-transaction-no">
                  {paymentDetails.transactionNo}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Số tiền">
                <span className="payment-amount">
                  {paymentDetails.amount.toLocaleString("vi-VN")} VND
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Ngân hàng">
                <span className="payment-bank">{paymentDetails.bank}</span>
              </Descriptions.Item>
              <Descriptions.Item label="Loại thẻ">
                <span className="payment-card-type">
                  {paymentDetails.cardType}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Thời gian thanh toán">
                <span className="payment-datetime">
                  {formatVNPayDate(paymentDetails.payDate)}
                </span>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PaymentResult;

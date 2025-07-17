import React, { useEffect, useState } from "react";
import api from "../../configs/axios";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import "./SuggestPlaning.css";
import { useNavigate, Link } from "react-router-dom";
import { Modal, Button } from "antd";
import dayjs from "dayjs"; // ✅ Thêm import dayjs

function SuggestPlaning() {
  // Đọc trạng thái xác nhận từ localStorage khi khởi tạo
  const accountId = localStorage.getItem("accountId");
  const [isConfirmed, setIsConfirmed] = useState(
    () => localStorage.getItem(`plan_confirmed_${accountId}`) === "true"
  );
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [showConfirmedMessage, setShowConfirmedMessage] = useState(false);
  const [justConfirmed, setJustConfirmed] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const navigate = useNavigate();

  // ✅ Sửa lại hàm tính toán ngày bắt đầu và kết thúc
  const getPlanDates = (plan) => {
    if (!plan || !plan.stages || plan.stages.length === 0) {
      return { startDate: null, endDate: null };
    }

    // Lấy ngày bắt đầu từ backend hoặc dùng ngày hiện tại
    const startDate = plan.startDate ? dayjs(plan.startDate) : dayjs();

    // ✅ Tính ngày kết thúc = ngày kết thúc của giai đoạn cuối cùng
    const lastStageIndex = plan.stages.length - 1;
    const lastStageStart = startDate.add(lastStageIndex * 4, "week");
    const endDate = lastStageStart.add(4, "week").subtract(1, "day");

    return { startDate, endDate };
  };

  // ✅ Giữ nguyên hàm getStageDates
  const getStageDates = (stageIndex, startDate) => {
    if (!startDate) return { stageStart: null, stageEnd: null };

    const stageStart = startDate.add(stageIndex * 4, "week");
    const stageEnd = stageStart.add(4, "week").subtract(1, "day");

    return { stageStart, stageEnd };
  };

  // ✅ Sửa useEffect - chỉ hiển thị khi vừa mới xác nhận
  useEffect(() => {
    if (justConfirmed) {
      setShowConfirmedMessage(true);
      setCountdown(10); // Reset countdown về 10

      // ✅ Tạo interval để đếm ngược mỗi giây
      const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            // Khi đếm về 0, ẩn thông báo
            setShowConfirmedMessage(false);
            setJustConfirmed(false);
            clearInterval(countdownInterval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Cleanup interval khi component unmount hoặc dependency thay đổi
      return () => clearInterval(countdownInterval);
    }
  }, [justConfirmed]);

  useEffect(() => {
    if (!accountId) {
      navigate("/login");
      return;
    }

    // Hàm lấy kế hoạch đề xuất
    async function fetchPlan() {
      setLoading(true);
      setError("");

      try {
        // Kiểm tra xem có kế hoạch đã được lưu trong backend không
        const res = await api.get(`/v1/customers/${accountId}/quit-plans`);
        if (res.data && !Array.isArray(res.data)) {
          setPlan(res.data);
          // Kiểm tra xem đã xác nhận chưa
          if (res.data.isAgreedPlan) {
            setIsConfirmed(true);
          }
          setLoading(false);
          return;
        }
      } catch (err) {
        // Nếu chưa có kế hoạch trong backend, đọc từ localStorage
        console.log("Chưa có kế hoạch trong backend, đọc từ localStorage");
      }

      // Đọc kế hoạch đề xuất từ localStorage
      const suggestedPlan = localStorage.getItem("suggestedPlan");
      if (suggestedPlan) {
        const planData = JSON.parse(suggestedPlan);
        setPlan(planData);
      } else {
        setError("Không tìm thấy kế hoạch đề xuất.");
      }

      setLoading(false);
    }

    fetchPlan();
  }, [accountId, navigate]);

  // Hàm xử lý xác nhận kế hoạch
  const handleConfirmPlan = async () => {
    setConfirmLoading(true);
    try {
      // Lấy thông tin khảo sát từ localStorage
      const surveyData = localStorage.getItem("planSurvey");
      if (!surveyData) {
        throw new Error("Không tìm thấy thông tin khảo sát");
      }

      const survey = JSON.parse(surveyData);

      // Bước 1: Gửi thông tin khảo sát
      const payload = {
        started_smoking_age: parseInt(survey.started_smoking_age),
        cigarettes_per_day: parseInt(survey.cigarettes_per_day),
        cigarettes_per_pack: parseInt(survey.cigarettes_per_pack),
        timeToFirstCigarette: mapTime(survey.timeToFirstCigarette),
        status: "ACTIVE",
        quitAttempts: mapQuitAttempts(survey.quitAttempts),
        longestQuitDuration: mapDuration(survey.longestQuitDuration),
        cravingWithoutSmoking: survey.cravingWithoutSmoking === "true",
        triggerSituation: survey.triggerSituation.trim(),
        quitIntentionTimeline: mapTimeline(survey.quitIntentionTimeline),
        readinessLevel: mapReadiness(survey.readinessLevel),
        quitReasons: survey.quitReasons,
      };

      await api.post(`/smoking-status/account/${accountId}`, payload);

      // Bước 2: Tạo kế hoạch với systemPlan = true và startDate
      const planResponse = await api.post(
        `/v1/customers/${accountId}/quit-plans`,
        {
          systemPlan: true,
          startDate: dayjs().format("YYYY-MM-DD"), // ✅ Thêm ngày bắt đầu
        }
      );

      // Bước 3: Xác nhận kế hoạch
      await api.put(
        `/v1/customers/${accountId}/quit-plans/${planResponse.data.id}`,
        {
          isAgreedPlan: true,
          quitPlanStatus: "DRAFT",
          startDate: dayjs().format("YYYY-MM-DD"), // ✅ Thêm ngày bắt đầu
        }
      );

      // Bước 4: Lấy lại dữ liệu kế hoạch từ backend và cập nhật state
      const updatedPlanResponse = await api.get(
        `/v1/customers/${accountId}/quit-plans`
      );
      if (updatedPlanResponse.data) {
        setPlan(updatedPlanResponse.data);
      }

      // Đánh dấu đã xác nhận và vừa mới xác nhận
      setIsConfirmed(true);
      setJustConfirmed(true);
      localStorage.setItem(`plan_confirmed_${accountId}`, "true");

      // Xóa dữ liệu tạm thời
      localStorage.removeItem("suggestedPlan");
      localStorage.removeItem("planSurvey");

      Modal.success({
        title: "Xác nhận thành công!",
        content: "Kế hoạch cai thuốc đã được xác nhận. Chúc bạn thành công!",
        okText: "Đóng",
      });
    } catch (err) {
      console.error("Lỗi xác nhận:", err);
      Modal.error({
        title: "Lỗi xác nhận",
        content: "Không thể xác nhận kế hoạch. Vui lòng thử lại!",
      });
    } finally {
      setConfirmLoading(false);
    }
  };

  // ✅ Tính toán ngày bắt đầu và kết thúc
  const { startDate, endDate } = getPlanDates(plan);

  // Thêm các hàm mapping từ Planning.jsx
  const mapTime = (value) => {
    switch (value) {
      case "≤5 phút":
        return "LESS_THAN_5_MIN";
      case "6–30 phút":
        return "BETWEEN_6_AND_30_MIN";
      case "31–60 phút":
        return "BETWEEN_31_AND_60_MIN";
      case ">60 phút":
        return "MORE_THAN_60_MIN";
      default:
        return "";
    }
  };

  const mapQuitAttempts = (value) => {
    const num = parseInt(value);
    if (num === 0) return "NONE";
    if (num <= 2) return "ONE_TO_TWO";
    return "MORE_THAN_THREE";
  };

  const mapDuration = (value) => {
    switch (value) {
      case "LESS_THAN_1_DAY":
        return "LESS_THAN_1_DAY";
      case "BETWEEN_1_AND_3_DAYS":
        return "BETWEEN_1_AND_3_DAYS";
      case "ONE_WEEK":
        return "ONE_WEEK";
      case "MORE_THAN_ONE_WEEK":
        return "MORE_THAN_ONE_WEEK";
      default:
        return "";
    }
  };

  const mapTimeline = (value) => {
    switch (value) {
      case "7 ngày":
        return "ONEWEEK";
      case "1 tháng":
        return "ONEMONTH";
      case "3 tháng":
        return "THREEMONTH";
      case "5 tháng":
        return "FIVEMONTH";
      case "Chưa chắc":
        return "UNKNOWN";
      default:
        return "";
    }
  };

  const mapReadiness = (value) => {
    switch (value) {
      case "Chưa sẵn sàng":
        return "NOTREADY";
      case "Đang cân nhắc":
        return "UNDERCONSIDERATION";
      case "Rất sẵn sàng":
        return "ALREADY";
      default:
        return "";
    }
  };

  return (
    <>
      <Navbar />
      <div className="suggest-container">
        {loading ? (
          <div style={{ textAlign: "center", padding: 40 }}>Đang tải...</div>
        ) : error ? (
          <div style={{ color: "red", textAlign: "center", padding: 40 }}>
            {error}
          </div>
        ) : (
          <>
            <div className="suggest-header">
              <div>
                <span role="img" aria-label="plan">
                  📋
                </span>
                <b> Kế hoạch cai thuốc được đề xuất</b>
              </div>
              <div>
                <span role="img" aria-label="brain">
                  🧠
                </span>
                Mức độ nghiện hệ thống đánh giá:{" "}
                <b>
                  {plan.addictionLevel === "LOW"
                    ? "Thấp"
                    : plan.addictionLevel === "MEDIUM"
                    ? "Trung bình"
                    : "Cao"}
                </b>
              </div>
              <div>
                <span role="img" aria-label="cigarette">
                  🚬
                </span>
                Trung bình số điếu hút mỗi ngày:{" "}
                <b>
                  {plan.stages && plan.stages.length > 0
                    ? plan.stages[0].targetCigarettes
                    : "-"}
                </b>
              </div>
              {/* ✅ Thêm hiển thị ngày bắt đầu dự kiến */}
              <div>
                <span role="img" aria-label="calendar">
                  📅
                </span>
                Ngày bắt đầu dự kiến:{" "}
                <b>
                  {startDate ? startDate.format("DD/MM/YYYY") : "07/07/2025"}
                </b>
              </div>
              {/* ✅ Thêm hiển thị ngày kết thúc dự kiến */}
              <div>
                <span role="img" aria-label="finish">
                  🏁
                </span>
                Ngày kết thúc dự kiến:{" "}
                <b>{endDate ? endDate.format("DD/MM/YYYY") : "24/11/2025"}</b>
              </div>
            </div>

            <div className="suggest-table-wrapper">
              <table className="suggest-table">
                <thead>
                  <tr>
                    <th>Giai đoạn</th>
                    <th>Thời gian</th>
                    <th>Ngày bắt đầu</th>
                    <th>Ngày kết thúc</th>
                    <th>Số điếu mỗi ngày</th>
                  </tr>
                </thead>
                <tbody>
                  {plan.stages && plan.stages.length > 0 ? (
                    plan.stages.map((stage, idx) => {
                      const { stageStart, stageEnd } = getStageDates(
                        idx,
                        startDate
                      );

                      return (
                        <tr key={stage.id || idx}>
                          <td>Giai đoạn {stage.stageNumber || idx + 1}</td>
                          <td>
                            {stage.week_range ||
                              `Tuần ${1 + idx * 4} - ${4 + idx * 4}`}
                          </td>
                          <td>
                            {stageStart ? stageStart.format("DD/MM/YYYY") : "-"}
                          </td>
                          <td>
                            {stageEnd ? stageEnd.format("DD/MM/YYYY") : "-"}
                          </td>
                          <td>
                            {stage.targetCigarettes === 0 ? (
                              <span
                                style={{ color: "#52c41a", fontWeight: "bold" }}
                              >
                                Hoàn toàn cai
                              </span>
                            ) : (
                              `${stage.targetCigarettes} điếu`
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5}>Không có dữ liệu giai đoạn</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Chỉ hiển thị phần xác nhận nếu chưa được xác nhận */}
            {!isConfirmed && (
              <div className="suggest-actions">
                <div className="suggest-question">
                  <h3>🤔 Bạn có chắc chắn xác nhận kế hoạch này không?</h3>
                  <p>
                    Nếu đồng ý, kế hoạch sẽ được lưu và bạn có thể bắt đầu theo
                    dõi tiến trình cai thuốc. Nếu không, bạn có thể tự lập kế
                    hoạch khác.
                  </p>
                </div>

                <div className="suggest-buttons">
                  <Button
                    type="primary"
                    size="large"
                    loading={confirmLoading}
                    onClick={handleConfirmPlan}
                    style={{
                      backgroundColor: "#52c41a",
                      borderColor: "#52c41a",
                      marginRight: 16,
                    }}
                  >
                    ✅ Xác nhận kế hoạch này
                  </Button>

                  <Button
                    type="default"
                    size="large"
                    onClick={() => {
                      navigate("/planning");
                    }}
                  >
                    📝 Tự lập kế hoạch khác
                  </Button>
                </div>
              </div>
            )}

            {/* Hiển thị thông báo đã xác nhận */}
            {isConfirmed && showConfirmedMessage && (
              <div className="suggest-confirmed">
                <div
                  style={{
                    textAlign: "center",
                    padding: 30,
                    backgroundColor: "#f6ffed",
                    border: "1px solid #b7eb8f",
                    borderRadius: 8,
                    marginTop: 20,
                    position: "relative",
                  }}
                >
                  <button
                    onClick={() => {
                      setShowConfirmedMessage(false);
                      setJustConfirmed(false);
                    }}
                    style={{
                      position: "absolute",
                      right: "12px",
                      top: "12px",
                      background: "none",
                      border: "none",
                      fontSize: "18px",
                      cursor: "pointer",
                      color: "#52c41a",
                    }}
                    title="Đóng thông báo"
                  >
                    ×
                  </button>

                  <h3
                    style={{
                      color: "#52c41a",
                      marginBottom: 10,
                    }}
                  >
                    ✅ Kế hoạch đã được xác nhận!
                  </h3>
                  <p style={{ color: "#666", margin: 0 }}>
                    Kế hoạch sẽ được lưu và bạn có thể bắt đầu theo dõi tiến
                    trình cai thuốc. Chúc bạn thành công!
                  </p>

                  {/* ✅ Thông báo đếm ngược - đã xóa progress bar */}
                  <div
                    style={{
                      fontSize: "14px",
                      color: "#52c41a",
                      marginTop: "12px",
                      fontWeight: "500",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                    }}
                  >
                    <span>Thông báo sẽ tự động ẩn sau</span>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "24px",
                        height: "24px",
                        backgroundColor: "#52c41a",
                        color: "#fff",
                        borderRadius: "50%",
                        fontSize: "12px",
                        fontWeight: "bold",
                        animation:
                          countdown <= 3 ? "pulse 0.5s infinite" : "none",
                      }}
                    >
                      {countdown}
                    </span>
                    <span>giây</span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </>
  );
}

export default SuggestPlaning;

// Hãy xử lý check người dùng được xóa kế hoạch khi họ chưa nhập số thuốc đã hút , chưa lưu dữ liệu về form theo dõi hằng ngày chưa được Lưu dữ liệu . Nếu đã nhập có dư liệu người dùng nhập ở data thì ẩn nút xóa và không được xóa
// Tôi muốn Call API xóa kế hoạch đề xuất sau khi xác nhận. Nút xóa kế hoạch nhấn vào Hiển thị xác nhận bạn có chắc chắn xóa không.  Khi xóa xong quay lại trang kế hoạch /planning

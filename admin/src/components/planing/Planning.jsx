import React, { useState, useEffect } from "react";
import api from "../../configs/axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Footer from "../footer/Footer";
import Navbar from "../navbar/Navbar";
import { Input, Radio, Modal } from "antd";
import "./Planning.css";
import planningBanner from "../../assets/images/planning1.png";

// ================ CONSTANTS & INITIAL STATE ================
const initialState = {
  started_smoking_age: "",
  cigarettes_per_day: "",
  cigarettes_per_pack: "",
  timeToFirstCigarette: "",
  quitAttempts: "",
  longestQuitDuration: "",
  cravingWithoutSmoking: "",
  triggerSituation: "",
  quitIntentionTimeline: "",
  readinessLevel: "",
  quitReasons: "",
};

// ================ MAPPING FUNCTIONS ================
const mapTime = (value) => {
  const timeMap = {
    "≤5 phút": "LESS_THAN_5_MIN",
    "6–30 phút": "BETWEEN_6_AND_30_MIN",
    "31–60 phút": "BETWEEN_31_AND_60_MIN",
    ">60 phút": "MORE_THAN_60_MIN",
  };
  return timeMap[value] || "";
};

const mapQuitAttempts = (value) => {
  const num = parseInt(value);
  if (num === 0) return "NONE";
  if (num <= 2) return "ONE_TO_TWO";
  return "MORE_THAN_THREE";
};

const mapDuration = (value) => {
  const durationMap = {
    LESS_THAN_1_DAY: "LESS_THAN_1_DAY",
    BETWEEN_1_AND_3_DAYS: "BETWEEN_1_AND_3_DAYS",
    ONE_WEEK: "ONE_WEEK",
    MORE_THAN_ONE_WEEK: "MORE_THAN_ONE_WEEK",
  };
  return durationMap[value] || "";
};

const mapTimeline = (value) => {
  const timelineMap = {
    "7 ngày": "ONEWEEK",
    "1 tháng": "ONEMONTH",
    "3 tháng": "THREEMONTH",
    "5 tháng": "FIVEMONTH",
    "Chưa chắc": "UNKNOWN",
  };
  return timelineMap[value] || "";
};

const mapReadiness = (value) => {
  const readinessMap = {
    "Chưa sẵn sàng": "NOTREADY",
    "Đang cân nhắc": "UNDERCONSIDERATION",
    "Rất sẵn sàng": "ALREADY",
  };
  return readinessMap[value] || "";
};

// ================ BUSINESS LOGIC FUNCTIONS ================
// Hàm đánh giá mức độ nghiện thuốc lá
function calcAddictionLevel(form) {
  // Tính điểm cho số điếu/ngày
  const cigarettes = parseInt(form.cigarettes_per_day, 10);
  let pointCig = 0;
  if (cigarettes <= 10) pointCig = 0;
  else if (cigarettes <= 20) pointCig = 1;
  else if (cigarettes <= 30) pointCig = 2;
  else pointCig = 3;

  // Tính điểm cho thời gian hút điếu đầu tiên
  let pointTime = 0;
  const timeMap = {
    "≤5 phút": 3,
    "6–30 phút": 2,
    "31–60 phút": 1,
    ">60 phút": 0,
  };
  pointTime = timeMap[form.timeToFirstCigarette] || 0;

  // Tính tổng điểm và xác định mức độ
  const total = pointCig + pointTime;
  let level = "";
  let message = "";

  if (total <= 2) {
    level = "Nhẹ";
    message =
      "Theo các chuyên gia cai nghiện, bạn đang ở mức độ nghiện thuốc lá nhẹ – đây là giai đoạn thuận lợi nhất để bắt đầu từ bỏ thuốc. Hãy tận dụng cơ hội này, vì chỉ sau vài ngày không thuốc, cơ thể bạn sẽ có những cải thiện rõ rệt.";
  } else if (total <= 4) {
    level = "Trung bình";
    message =
      "Với mức độ nghiện trung bình, bạn có thể gặp một số cơn thèm thuốc trong quá trình cai. Tuy nhiên, theo chuyên gia, nếu kết hợp chiến lược phù hợp và có hệ thống hỗ trợ, khả năng thành công của bạn là rất cao.";
  } else {
    level = "Cao";
    message =
      "Bạn đang ở mức độ nghiện cao – điều này không hiếm và hoàn toàn có thể vượt qua. Các chuyên gia khuyến nghị bạn nên lập kế hoạch rõ ràng, sử dụng các phương pháp hỗ trợ tâm lý hoặc y tế, và duy trì kết nối với người hỗ trợ trong suốt hành trình.";
  }

  return {
    total,
    level,
    message,
    summary: `Bạn hút khoảng ${form.cigarettes_per_day} điếu/ngày và hút điếu đầu tiên sau khi thức dậy ${form.timeToFirstCigarette}.`,
  };
}

// Hàm tính toán kế hoạch đề xuất
const generateSuggestedPlan = (form) => {
  const cigarettesPerDay = parseInt(form.cigarettes_per_day);
  const addictionLevel = calcAddictionLevel(form);
  const stages = [];

  // Giai đoạn 1: Giảm 50% số điếu ban đầu
  const stage1Target = Math.max(1, Math.ceil(cigarettesPerDay * 0.5));
  stages.push({
    stageNumber: 1,
    week_range: "Tuần 1 - 4",
    targetCigarettes: stage1Target,
  });

  // Giai đoạn 2: Giảm 75% số điếu ban đầu
  const stage2Target = Math.max(1, Math.ceil(cigarettesPerDay * 0.25));
  stages.push({
    stageNumber: 2,
    week_range: "Tuần 5 - 8",
    targetCigarettes: stage2Target,
  });

  // Giai đoạn 3: Giảm 87.5% số điếu ban đầu
  const stage3Target = Math.max(1, Math.ceil(cigarettesPerDay * 0.125));
  stages.push({
    stageNumber: 3,
    week_range: "Tuần 9 - 12",
    targetCigarettes: stage3Target,
  });

  // Giai đoạn 4: Quyết định dựa trên giai đoạn 3
  if (stage3Target <= 1) {
    // Nếu giai đoạn 3 đã xuống 1 điếu, giai đoạn 4 sẽ cai hoàn toàn
    stages.push({
      stageNumber: 4,
      week_range: "Tuần 13 - 16",
      targetCigarettes: 0,
    });
  } else {
    // Nếu chưa, giảm xuống 1 điếu trước
    stages.push({
      stageNumber: 4,
      week_range: "Tuần 13 - 16",
      targetCigarettes: 1,
    });

    // Thêm giai đoạn 5: Cai hoàn toàn
    stages.push({
      stageNumber: 5,
      week_range: "Tuần 17 - 20",
      targetCigarettes: 0,
    });
  }

  return {
    addictionLevel:
      addictionLevel.level === "Nhẹ"
        ? "LOW"
        : addictionLevel.level === "Trung bình"
        ? "MEDIUM"
        : "HIGH",
    stages: stages,
    systemPlan: true,
    customPlan: false,
  };
};

// ================ MAIN COMPONENT ================
function PlanPage() {
  // ================ STATE MANAGEMENT ================
  const [form, setForm] = useState(initialState);
  const [showChoice, setShowChoice] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [addictionInfo, setAddictionInfo] = useState(null);
  const [showGuestModal, setShowGuestModal] = useState(false);
  // Thêm state mới cho Guest
  const [showAddictionResult, setShowAddictionResult] = useState(false);

  // ================ HOOKS ================
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const accountId = localStorage.getItem("accountId");

  // ================ EFFECTS ================
  useEffect(() => {
    if (!accountId) {
      navigate("/login");
      return;
    }

    // Kiểm tra phân quyền
    if (!user || !["CUSTOMER", "GUEST", "STAFF"].includes(user.role)) {
      setError("Bạn không có quyền truy cập trang này.");
      setLoading(false);
      return;
    }

    // Kiểm tra kế hoạch hiện có (chỉ cho CUSTOMER)
    if (user.role === "CUSTOMER") {
      async function checkPlan() {
        try {
          const res = await api.get(`/v1/customers/${accountId}/quit-plans`);
          if (res.data && typeof res.data === "object" && res.data.id) {
            // Đã có kế hoạch, chuyển hướng theo loại kế hoạch
            if (res.data.systemPlan === false) {
              navigate("/create-planning");
            } else {
              navigate("/suggest-planing");
            }
            return;
          }
        } catch (err) {
          // Chưa có kế hoạch hoặc lỗi API
          setLoading(false);
        }
      }

      checkPlan();
    } else {
      // GUEST hoặc STAFF không cần check plan
      setLoading(false);
    }
  }, [accountId, navigate, user]);

  // ================ EVENT HANDLERS ================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setError("");
  };

  // Handler mới cho Guest xem tình trạng nghiện
  const handleCheckAddiction = (e) => {
    e.preventDefault();

    // Kiểm tra form đầy đủ
    if (!isFilled()) {
      setError("Vui lòng nhập đầy đủ tất cả các thông tin để xem đánh giá!");
      return;
    }

    // Tính toán và hiển thị kết quả nghiện
    const addiction = calcAddictionLevel(form);
    setAddictionInfo(addiction);
    setShowAddictionResult(true);
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Kiểm tra đăng nhập
    if (!user) {
      setError("Vui lòng đăng nhập để sử dụng chức năng này.");
      return;
    }

    // Kiểm tra GUEST
    if (user.role === "GUEST") {
      setShowGuestModal(true);
      return;
    }

    // Kiểm tra CUSTOMER
    if (user.role !== "CUSTOMER") {
      setError("Chỉ khách hàng mới có thể sử dụng chức năng này.");
      return;
    }

    // Kiểm tra form đầy đủ
    if (!isFilled()) {
      setError("Vui lòng nhập đầy đủ tất cả các thông tin!");
      return;
    }

    // Đánh giá mức độ nghiện và hiển thị lựa chọn
    const addiction = calcAddictionLevel(form);
    setAddictionInfo(addiction);
    setShowChoice(true);
  };

  const handlePlanChoice = async (type) => {
    // Double check phân quyền
    if (!user || user.role !== "CUSTOMER") {
      setError("Chỉ khách hàng mới có thể tạo kế hoạch cai thuốc.");
      setShowChoice(false);
      return;
    }

    try {
      setError("");
      setShowChoice(false);
      setLoading(true);

      if (type === "recommend") {
        // Kế hoạch đề xuất từ hệ thống
        const suggestedPlan = generateSuggestedPlan(form);
        localStorage.setItem("planSurvey", JSON.stringify(form));
        localStorage.setItem("suggestedPlan", JSON.stringify(suggestedPlan));
        navigate("/suggest-planing");
      } else {
        // Kế hoạch tự lập
        const payload = {
          started_smoking_age: parseInt(form.started_smoking_age),
          cigarettes_per_day: parseInt(form.cigarettes_per_day),
          cigarettes_per_pack: parseInt(form.cigarettes_per_pack),
          timeToFirstCigarette: mapTime(form.timeToFirstCigarette),
          status: "ACTIVE",
          quitAttempts: mapQuitAttempts(form.quitAttempts),
          longestQuitDuration: mapDuration(form.longestQuitDuration),
          cravingWithoutSmoking: form.cravingWithoutSmoking === "true",
          triggerSituation: form.triggerSituation.trim(),
          quitIntentionTimeline: mapTimeline(form.quitIntentionTimeline),
          readinessLevel: mapReadiness(form.readinessLevel),
          quitReasons: form.quitReasons,
        };

        await api.post(`/smoking-status/account/${accountId}`, payload);
        const res = await api.post(`/v1/customers/${accountId}/quit-plans`, {
          systemPlan: false,
        });

        localStorage.setItem("quitPlanId", res.data.id);
        localStorage.setItem("planSurvey", JSON.stringify(payload));
        navigate("/create-planning");
      }
    } catch (err) {
      console.error(err);
      if (err?.response?.status === 403 || err?.response?.status === 401) {
        setError(
          "Bạn không có quyền lập kế hoạch. Vui lòng đăng nhập bằng tài khoản khách hàng."
        );
      } else if (err?.response?.status === 409) {
        setError("Bạn đã có kế hoạch. Không thể tạo thêm.");
      } else {
        setError("Có lỗi xảy ra. Vui lòng thử lại!");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpgradeAccount = () => {
    setShowGuestModal(false);
    navigate("/");
  };

  // ================ HELPER FUNCTIONS ================
  const isFilled = () => {
    return (
      form.started_smoking_age &&
      form.cigarettes_per_day &&
      form.cigarettes_per_pack &&
      form.timeToFirstCigarette &&
      form.quitAttempts !== "" &&
      form.longestQuitDuration &&
      form.cravingWithoutSmoking !== "" &&
      form.triggerSituation &&
      form.quitIntentionTimeline &&
      form.readinessLevel &&
      form.quitReasons !== ""
    );
  };

  const isFieldDisabled = () => false; // Cho phép GUEST nhập form

  // ================ RENDER CONDITIONS ================
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="planpage-container">
          <div style={{ textAlign: "center", padding: 40 }}>Đang tải...</div>
        </div>
        <Footer />
      </>
    );
  }

  // ================ MAIN RENDER ================
  return (
    <>
      <Navbar />

      {/* Banner Section */}
      <div className="planpage-banner">
        <img
          src={planningBanner}
          alt="QuitCare Planning Banner"
          className="planpage-banner-image"
        />
        <div className="planpage-banner-overlay">
          <h1 className="planpage-banner-title">
            Bắt đầu hành trình cai thuốc của bạn
          </h1>
          <p className="planpage-banner-subtitle">
            vì sức khỏe, vì gia đình, vì chính bạn.
          </p>
        </div>
      </div>

      <div className="planpage-container">
        {/* Guest Warning */}
        {user && user.role === "GUEST" && (
          <div
            style={{
              background: "linear-gradient(135deg, #fff3cd, #ffeaa7)",
              border: "2px solid #ffc107",
              borderRadius: "12px",
              padding: "16px 20px",
              margin: "20px auto 30px",
              maxWidth: "800px",
              textAlign: "center",
              boxShadow: "0 4px 12px rgba(255, 193, 7, 0.2)",
            }}
          >
            <h4 style={{ margin: "0 0 8px 0", color: "#856404" }}>
              ⚠️ Tài khoản của bạn chưa nâng cấp
            </h4>
            <p style={{ margin: "0", color: "#856404", fontSize: "14px" }}>
              Bạn có thể nhập form và xem đánh giá mức độ nghiện miễn phí. Để
              tạo kế hoạch cai thuốc cá nhân, vui lòng nâng cấp tài khoản.
            </p>
          </div>
        )}

        {/* Form Title */}
        <h2 className="planpage-title">📋 Thông tin khảo sát cai thuốc lá</h2>

        {/* Survey Form */}
        <form className="planpage-form">
          <div className="planpage-grid">
            {/* Left Column */}
            <div>
              {/* Question 1: Age started smoking */}
              <div className="planpage-question">
                <b>[1]</b> Bạn bắt đầu hút thuốc từ năm bao nhiêu tuổi?
              </div>
              <input
                type="number"
                name="started_smoking_age"
                min="10"
                max="50"
                value={form.started_smoking_age}
                onChange={handleChange}
                className="planpage-input"
                placeholder="Nhập tuổi"
                disabled={isFieldDisabled()}
              />

              {/* Question 2: Cigarettes per day */}
              <div className="planpage-question">
                <b>[2]</b> Hiện tại hút bao nhiêu điếu/ngày?
              </div>
              <input
                type="number"
                name="cigarettes_per_day"
                min="1"
                max="50"
                value={form.cigarettes_per_day}
                onChange={handleChange}
                className="planpage-input"
                placeholder="Số điếu/ngày"
                disabled={isFieldDisabled()}
              />

              {/* Question 3: Cigarettes per pack */}
              <div className="planpage-question">
                <b>[3]</b> Một bao có bao nhiêu điếu?
              </div>
              <input
                type="number"
                name="cigarettes_per_pack"
                min="1"
                max="50"
                value={form.cigarettes_per_pack}
                onChange={handleChange}
                className="planpage-input"
                placeholder="Số điếu/bao"
                disabled={isFieldDisabled()}
              />

              {/* Question 4: Time to first cigarette */}
              <div className="planpage-question">
                <b>[4]</b> Sau khi thức dậy bao lâu bạn hút điếu đầu?
              </div>
              <div className="planpage-options">
                {["≤5 phút", "6–30 phút", "31–60 phút", ">60 phút"].map(
                  (option) => (
                    <label key={option}>
                      <input
                        type="radio"
                        name="timeToFirstCigarette"
                        value={option}
                        checked={form.timeToFirstCigarette === option}
                        onChange={handleChange}
                        disabled={isFieldDisabled()}
                      />
                      {option === ">60 phút" ? ">60 phút" : option}
                    </label>
                  )
                )}
              </div>

              {/* Question 5: Quit attempts */}
              <div className="planpage-question">
                <b>[5]</b> Bạn đã từng cố gắng cai thuốc chưa? (Số lần)
              </div>
              <input
                type="number"
                name="quitAttempts"
                min="0"
                max="10"
                value={form.quitAttempts}
                onChange={handleChange}
                className="planpage-input"
                placeholder="Số lần"
                disabled={isFieldDisabled()}
              />

              {/* Question 6: Longest quit duration */}
              <div className="planpage-question">
                <b>[6]</b> Thời gian dài nhất từng không hút thuốc?
              </div>
              <div className="planpage-options">
                {[
                  { value: "LESS_THAN_1_DAY", label: "Ít hơn 1 ngày" },
                  { value: "BETWEEN_1_AND_3_DAYS", label: "Giữa 1 và 3 ngày" },
                  { value: "ONE_WEEK", label: "1 tuần" },
                  { value: "MORE_THAN_ONE_WEEK", label: "Hơn 1 tuần" },
                ].map((option) => (
                  <label key={option.value}>
                    <input
                      type="radio"
                      name="longestQuitDuration"
                      value={option.value}
                      checked={form.longestQuitDuration === option.value}
                      onChange={handleChange}
                      disabled={isFieldDisabled()}
                    />
                    {option.label}
                  </label>
                ))}
              </div>

              {/* Question 7: Craving without smoking */}
              <div className="planpage-question">
                <b>[7]</b> Bạn có cảm thấy khó chịu nếu không hút?
              </div>
              <div className="planpage-options">
                <label>
                  <input
                    type="radio"
                    name="cravingWithoutSmoking"
                    value="true"
                    checked={form.cravingWithoutSmoking === "true"}
                    onChange={handleChange}
                    disabled={isFieldDisabled()}
                  />
                  Có
                </label>
                <label>
                  <input
                    type="radio"
                    name="cravingWithoutSmoking"
                    value="false"
                    checked={form.cravingWithoutSmoking === "false"}
                    onChange={handleChange}
                    disabled={isFieldDisabled()}
                  />
                  Không
                </label>
              </div>

              {/* Question 8: Trigger situations */}
              <div className="planpage-question">
                <b>[8]</b> Bạn hút nhiều hơn khi nào?
              </div>
              <input
                type="text"
                name="triggerSituation"
                value={form.triggerSituation}
                onChange={handleChange}
                className="planpage-input"
                placeholder="Ví dụ: căng thẳng, sau bữa ăn..."
                disabled={isFieldDisabled()}
              />
            </div>

            {/* Right Column */}
            <div>
              {/* Question 9: Quit intention timeline */}
              <div className="planpage-question">
                <b>[9]</b> Ý định cai thuốc trong bao lâu tới?
              </div>
              <div className="planpage-options">
                {["7 ngày", "1 tháng", "3 tháng", "5 tháng", "Chưa chắc"].map(
                  (option) => (
                    <label key={option}>
                      <input
                        type="radio"
                        name="quitIntentionTimeline"
                        value={option}
                        checked={form.quitIntentionTimeline === option}
                        onChange={handleChange}
                        disabled={isFieldDisabled()}
                      />
                      {option}
                    </label>
                  )
                )}
              </div>

              {/* Question 10: Readiness level */}
              <div className="planpage-question">
                <b>[10]</b> Mức độ sẵn sàng cai thuốc
              </div>
              <div className="planpage-options">
                {["Chưa sẵn sàng", "Đang cân nhắc", "Rất sẵn sàng"].map(
                  (option) => (
                    <label key={option}>
                      <input
                        type="radio"
                        name="readinessLevel"
                        value={option}
                        checked={form.readinessLevel === option}
                        onChange={handleChange}
                        disabled={isFieldDisabled()}
                      />
                      {option}
                    </label>
                  )
                )}
              </div>

              {/* Question 11: Quit reasons */}
              <div className="planpage-question">
                <b>[11]</b> Lý do chính muốn cai thuốc?
              </div>
              <Radio.Group
                name="quitReasons"
                value={form.quitReasons}
                onChange={handleChange}
                disabled={isFieldDisabled()}
                options={[
                  { value: "Improving_health", label: "Cải thiện sức khỏe" },
                  {
                    value: "Family_loved_ones",
                    label: "Vì gia đình và người thân",
                  },
                  { value: "Financial_pressure", label: "Áp lực tài chính" },
                  {
                    value: "Feeling_tired_of_addiction",
                    label: "Cảm thấy mệt mỏi với việc nghiện thuốc",
                  },
                  {
                    value: "Wanting_to_set_an_example_for_children",
                    label: "Muốn làm gương cho con cái",
                  },
                  {
                    value: "Being_banned_from_smoking_at_work_home",
                    label: "Bị cấm hút thuốc ở nơi làm việc/nhà",
                  },
                ]}
              />
            </div>
          </div>

          {/* Button Container */}
          <div className="planpage-button-container">
            {user && user.role === "GUEST" ? (
              // Buttons cho GUEST
              <div className="planpage-guest-buttons">
                <button
                  onClick={handleCheckAddiction}
                  className="planpage-check-addiction"
                  type="button"
                >
                  📊 Xem tình trạng
                </button>
                <button
                  onClick={handleSubmit}
                  className="planpage-submit-guest"
                  type="button"
                >
                  🔒 Nâng cấp tài khoản
                </button>
              </div>
            ) : (
              // Button cho CUSTOMER
              <button
                onClick={handleSubmit}
                className="planpage-submit"
                type="submit"
              >
                📝 Gửi thông tin
              </button>
            )}
          </div>

          {/* Error Message */}
          {error && <div className="planpage-error">{error}</div>}
        </form>

        {/* Guest Addiction Result Modal */}
        {showAddictionResult && user && user.role === "GUEST" && (
          <div
            className="planpage-choice-modal"
            onClick={() => setShowAddictionResult(false)}
          >
            <div
              className="planpage-choice-box"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 style={{ color: "#1890ff", marginBottom: "24px" }}>
                📊 Đánh giá mức độ nghiện thuốc lá
              </h3>

              {addictionInfo && (
                <div className="planpage-addiction-info">
                  <div className="planpage-addiction-summary">
                    {addictionInfo.summary}
                  </div>
                  <div className="planpage-addiction-level">
                    <b>Mức độ nghiện: </b>
                    <span
                      style={{
                        color:
                          addictionInfo.level === "Cao"
                            ? "#e74c3c"
                            : addictionInfo.level === "Trung bình"
                            ? "#f39c12"
                            : "#27ae60",
                        fontWeight: "bold",
                        fontSize: "18px",
                      }}
                    >
                      {addictionInfo.level}
                    </span>
                  </div>
                  <div className="planpage-addiction-message">
                    💡 <strong>Lời khuyên:</strong> {addictionInfo.message}
                  </div>
                </div>
              )}

              {/* <div
                style={{
                  background:
                    "linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)",
                  border: "1px solid #1890ff",
                  borderRadius: "12px",
                  padding: "20px",
                  marginBottom: "24px",
                  textAlign: "center",
                }}
              >
                <h4 style={{ margin: "0 0 12px 0", color: "#0050b3" }}>
                  🚀 Muốn có kế hoạch cai thuốc cá nhân?
                </h4>
                <p
                  style={{
                    margin: "0 0 16px 0",
                    color: "#0050b3",
                    fontSize: "14px",
                  }}
                >
                  Nâng cấp tài khoản để nhận kế hoạch cai thuốc được thiết kế
                  riêng cho bạn!
                </p>
                
              </div> */}

              <div style={{ textAlign: "center" }}>
                <button
                  className="planpage-choice-btn close"
                  onClick={() => setShowAddictionResult(false)}
                >
                  ✕ Đóng
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Guest Modal */}
        {showGuestModal && (
          <div
            className="planpage-choice-modal"
            onClick={() => setShowGuestModal(false)}
          >
            <div
              className="planpage-choice-box"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 style={{ color: "#856404", marginBottom: "20px" }}>
                🔒 Nâng cấp tài khoản
              </h3>
              <div
                style={{
                  background: "#fff3cd",
                  border: "1px solid #ffeeba",
                  borderRadius: "8px",
                  padding: "20px",
                  marginBottom: "20px",
                  textAlign: "left",
                }}
              >
                <h4 style={{ margin: "0 0 12px 0", color: "#856404" }}>
                  Tại sao cần nâng cấp?
                </h4>
                <ul
                  style={{ margin: "0", paddingLeft: "20px", color: "#856404" }}
                >
                  <li>✅ Tạo kế hoạch cai thuốc cá nhân hóa</li>
                  <li>✅ Theo dõi tiến trình cai thuốc</li>
                  <li>✅ Nhận tư vấn từ chuyên gia</li>
                  <li>✅ Truy cập đầy đủ tính năng</li>
                </ul>
              </div>

              <div className="planpage-choice-btns two-buttons">
                <button
                  className="planpage-choice-btn recommend"
                  type="button"
                  onClick={handleUpgradeAccount}
                >
                  🚀 Nâng cấp ngay
                </button>
                <button
                  className="planpage-choice-btn self"
                  type="button"
                  onClick={() => setShowGuestModal(false)}
                >
                  ⏸️ Để sau
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Choice Modal for Customers */}
        {showChoice && user && user.role === "CUSTOMER" && (
          <div
            className="planpage-choice-modal"
            onClick={() => setShowChoice(false)}
          >
            <div
              className="planpage-choice-box"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Addiction Assessment Display */}
              {addictionInfo && (
                <div
                  style={{
                    marginBottom: 20,
                    padding: 16,
                    backgroundColor: "#f8f9fa",
                    borderRadius: 8,
                    border: "1px solid #e9ecef",
                  }}
                >
                  <h4 style={{ margin: "0 0 12px 0", color: "#495057" }}>
                    📊 Đánh giá mức độ nghiện thuốc lá
                  </h4>
                  <div style={{ marginBottom: 8, fontSize: 14 }}>
                    {addictionInfo.summary}
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <b>Mức độ nghiện: </b>
                    <span
                      style={{
                        color:
                          addictionInfo.level === "Cao"
                            ? "#e74c3c"
                            : addictionInfo.level === "Trung bình"
                            ? "#f39c12"
                            : "#27ae60",
                        fontWeight: "bold",
                      }}
                    >
                      {addictionInfo.level}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      color: "#6c757d",
                      fontStyle: "italic",
                    }}
                  >
                    {addictionInfo.message}
                  </div>
                </div>
              )}

              <h3>Bạn muốn chọn phương án nào?</h3>
              <div className="planpage-choice-btns two-buttons">
                <button
                  className="planpage-choice-btn recommend"
                  type="button"
                  onClick={() => handlePlanChoice("recommend")}
                >
                  🎯 Đề xuất
                </button>
                <button
                  className="planpage-choice-btn self"
                  type="button"
                  onClick={() => handlePlanChoice("self")}
                >
                  ✏️ Tự lập
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}

export default PlanPage;

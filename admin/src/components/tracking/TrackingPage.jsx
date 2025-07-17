import React, { useEffect, useState } from "react";
import {
  Modal,
  Button,
  message,
  Card,
  Tag,
  Progress,
  Statistic,
  Row,
  Col,
} from "antd";
import {
  CalendarOutlined,
  TrophyOutlined,
  HeartOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import {
  format,
  startOfDay,
  differenceInDays,
  addDays,
  isBefore,
  isAfter,
  isSameDay,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  getMonth,
  getYear,
  addMonths,
  subMonths,
} from "date-fns";
import { vi } from "date-fns/locale";
import api from "../../configs/axios";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import "./TrackingPage.css";
import { useSelector } from "react-redux";

const SYMPTOMS = {
  SYMPTOM1: "Thèm thuốc lá",
  SYMPTOM2: "Thèm ăn",
  SYMPTOM3: "Ho dai dẳng",
  SYMPTOM4: "Triệu chứng cảm cúm",
  SYMPTOM5: "Thay đổi tâm trạng",
  SYMPTOM6: "Táo bón",
};

const SYMPTOM_MESSAGES = {
  SYMPTOM1:
    "Thèm thuốc là triệu chứng bình thường khi bạn đang cai thuốc. Hãy thử nhai kẹo cao su hoặc đi dạo để làm dịu cảm giác này.",
  SYMPTOM2:
    "Nicotin giúp điều chỉnh đường huyết, nên khi cai thuốc bạn sẽ cảm thấy thèm ăn hơn. Hãy duy trì chế độ ăn lành mạnh.",
  SYMPTOM3:
    "Ho nhiều hơn là dấu hiệu tốt! Phổi bạn đang dần phục hồi và làm sạch các chất độc tồn đọng.",
  SYMPTOM4:
    "Bạn có thể thấy hơi sốt, khó chịu - đây là phản ứng tự nhiên của cơ thể khi không còn nicotin.",
  SYMPTOM5:
    "Cảm thấy cáu gắt là phản ứng phổ biến. Hãy thử thư giãn, đi bộ, trò chuyện với bạn bè.",
  SYMPTOM6:
    "Cai thuốc có thể làm chậm tiêu hóa. Hãy uống đủ nước và ăn nhiều rau xanh, thực phẩm giàu chất xơ.",
};

const TrackingPage = () => {
  const accountId = localStorage.getItem("accountId");
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [smokingStatusId, setSmokingStatusId] = useState(null);
  const [trackingData, setTrackingData] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [todayData, setTodayData] = useState({
    cigarettes_smoked: "",
    symptoms: [],
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [stats, setStats] = useState({
    totalDays: 0,
    completedDays: 0,
    averageProgress: 0,
  });
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isCompletionModalVisible, setIsCompletionModalVisible] =
    useState(false);
  const [completionData, setCompletionData] = useState(null);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const user = useSelector((state) => state.user);
  // Thêm test mode - chỉnh true/false tùy ý
  const isTestMode = true; // Đặt true khi muốn test, false khi production
  const [showlinkBooking, setShowBooking] = useState(false);
  const BOOKING_LINK = "http://localhost:5173/booking";

  // Script tự động điền dữ liệu
  const [isAutoFilling, setIsAutoFilling] = useState(false);
  useEffect(() => {
    const fetchMembershipPlan = async () => {
      try {
        if (!user?.id) {
          console.log("⚠️ Không có accountId.");
          return;
        }

        console.log("📥 Gọi API lịch sử giao dịch với accountId:", user.id);

        const historyRes = await api.get(
          `/v1/payments/history/account/${user.id}`
        );
        const transactions = historyRes.data || [];
        console.log("📦 Danh sách giao dịch:", transactions);

        // Lọc các giao dịch SUCCESS
        const successTransactions = transactions.filter(
          (tx) => tx.status === "SUCCESS"
        );

        if (successTransactions.length === 0) {
          console.log("⛔ Không có giao dịch SUCCESS.");
          return;
        }

        // Tìm giao dịch SUCCESS có số tiền lớn nhất
        const maxTransaction = successTransactions.reduce((max, curr) =>
          curr.amountPaid > max.amountPaid ? curr : max
        );
        const { amountPaid } = maxTransaction;

        console.log("💵 Giao dịch có số tiền lớn nhất:", amountPaid);

        // Gọi API lấy danh sách gói
        const planRes = await api.get(`/membership-plans`);
        const allPlans = planRes.data || [];
        console.log("📋 Danh sách gói:", allPlans);

        // Tìm gói nào có giá bằng với amountPaid lớn nhất và tên là Premium
        const matchedPlan = allPlans.find(
          (plan) =>
            Math.abs(plan.price - amountPaid) < 1 && plan.name === "Premium"
        );

        if (matchedPlan) {
          console.log("✅ Gói Premium đã mua, hiển thị nút ĐẶT LỊCH");
          setShowBooking(true);
          console.log("👁️ showBooking đã set:", true);
        } else {
          console.log("ℹ️ Không có gói Premium tương ứng.");
        }
      } catch (err) {
        console.error("❌ Lỗi khi lấy membership:", err);
      }
    };

    fetchMembershipPlan();
  }, [user?.id]);

  // Script tự động điền dữ liệu tracking cho kế hoạch 2 tuần
  const autoFillTrackingData = async () => {
    if (!plan || isAutoFilling) return;

    setIsAutoFilling(true);
    message.info("🤖 Bắt đầu điền dữ liệu tự động...");

    try {
      const planStartDate = startOfDay(new Date(plan.localDateTime));
      const planEndDate = getPlanEndDate();

      if (!planEndDate) {
        message.error("Không thể xác định ngày kết thúc kế hoạch");
        return;
      }

      // Tạo danh sách tất cả ngày trong kế hoạch trừ ngày cuối
      const allDays = [];
      let currentDate = planStartDate;

      while (isBefore(currentDate, planEndDate)) {
        // Không bao gồm ngày cuối
        allDays.push(new Date(currentDate));
        currentDate = addDays(currentDate, 1);
      }

      console.log(
        `📅 Sẽ điền dữ liệu cho ${allDays.length} ngày (trừ ngày cuối)`
      );

      // Dữ liệu mẫu đa dạng để mô phỏng thực tế
      const sampleDataTemplates = [
        {
          cigarettes: 8,
          symptoms: ["SYMPTOM1"],
          notes: "Ngày đầu khó khăn nhưng quyết tâm",
        },
        {
          cigarettes: 6,
          symptoms: ["SYMPTOM1", "SYMPTOM2"],
          notes: "Thèm thuốc nhiều, cố gắng ăn kẹo",
        },
        {
          cigarettes: 5,
          symptoms: ["SYMPTOM3"],
          notes: "Ho nhiều hơn, có lẽ phổi đang làm sạch",
        },
        {
          cigarettes: 4,
          symptoms: ["SYMPTOM1", "SYMPTOM5"],
          notes: "Cáu gắt một chút nhưng kiểm soát được",
        },
        {
          cigarettes: 3,
          symptoms: ["SYMPTOM2"],
          notes: "Ăn nhiều hơn bình thường",
        },
        {
          cigarettes: 2,
          symptoms: ["SYMPTOM4"],
          notes: "Cảm thấy hơi mệt nhưng vẫn ổn",
        },
        { cigarettes: 1, symptoms: [], notes: "Tiến bộ rõ rệt, tự tin hơn" },
        {
          cigarettes: 0,
          symptoms: [],
          notes: "Tuyệt vời! Hoàn toàn không hút thuốc",
        },
        {
          cigarettes: 1,
          symptoms: ["SYMPTOM1"],
          notes: "Hơi thèm nhưng đã kiểm soát được",
        },
        {
          cigarettes: 2,
          symptoms: ["SYMPTOM6"],
          notes: "Tiêu hóa chậm một chút",
        },
        { cigarettes: 1, symptoms: [], notes: "Cảm thấy khỏe mạnh hơn" },
        { cigarettes: 0, symptoms: [], notes: "Rất tự hào về bản thân" },
        { cigarettes: 0, symptoms: [], notes: "Sức khỏe cải thiện rõ rệt" },
        {
          cigarettes: 1,
          symptoms: ["SYMPTOM1"],
          notes: "Thỉnh thoảng vẫn thèm nhưng vượt qua được",
        },
      ];

      // Điền dữ liệu từng ngày với delay để mô phỏng thực tế
      for (let i = 0; i < allDays.length; i++) {
        const date = allDays[i];
        const dateStr = format(date, "yyyy-MM-dd");
        const currentStage = getCurrentStage(date);

        if (!currentStage) continue;

        // Chọn template dữ liệu phù hợp với giai đoạn
        const template = sampleDataTemplates[i % sampleDataTemplates.length];

        // Điều chỉnh số điếu theo target của stage (thêm yếu tố ngẫu nhiên)
        const targetCigs = currentStage.targetCigarettes;
        const randomFactor = Math.random() * 0.3; // 0-30% biến động
        let cigarettes_smoked = Math.max(
          0,
          Math.floor(targetCigs * (0.7 + randomFactor))
        );

        // Đảm bảo có sự tiến bộ theo thời gian
        const progressFactor = i / allDays.length; // 0 -> 1
        cigarettes_smoked = Math.max(
          0,
          Math.floor(cigarettes_smoked * (1 - progressFactor * 0.5))
        );

        // Lưu vào localStorage
        const trackingEntry = {
          cigarettes_smoked: cigarettes_smoked,
          symptoms: template.symptoms,
          notes: template.notes + ` (Ngày ${i + 1})`,
          target: targetCigs,
          submitted: true,
          submittedAt: new Date().toISOString(),
          stageId: currentStage.id,
          isAutoFilled: true, // Đánh dấu là dữ liệu tự động
        };

        localStorage.setItem(
          `tracking_${accountId}_${dateStr}`,
          JSON.stringify(trackingEntry)
        );

        // Cập nhật state
        setTrackingData((prev) => ({
          ...prev,
          [dateStr]: trackingEntry,
        }));

        // Gửi API (tùy chọn - có thể bỏ comment nếu muốn gửi thật)
        try {
          const progressData = {
            date: dateStr,
            cigarettes_smoked,
            quitHealthStatus: template.symptoms[0] || "SYMPTOM1",
            quitProgressStatus: "SUBMITTED",
            quitPlanStageId: currentStage.id,
            smokingStatusId,
          };

          // await api.post("/quit-progress", progressData);
          console.log(
            `✅ Đã lưu ngày ${format(
              date,
              "dd/MM/yyyy"
            )}: ${cigarettes_smoked}/${targetCigs} điếu`
          );
        } catch (apiError) {
          console.warn(`⚠️ Lỗi API cho ngày ${dateStr}:`, apiError.message);
        }

        // Delay nhỏ để tránh spam
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      // Reload dữ liệu tracking và tính toán stats
      loadTrackingData();

      message.success(
        `🎉 Đã điền thành công ${allDays.length} ngày! Còn lại ngày cuối để bạn tự nhập.`
      );
    } catch (error) {
      console.error("❌ Lỗi auto fill:", error);
      message.error("Có lỗi xảy ra khi điền dữ liệu tự động");
    } finally {
      setIsAutoFilling(false);
    }
  };

  // Xóa tất cả dữ liệu tracking (để test lại)
  const clearAllTrackingData = () => {
    // Debug log để kiểm tra
    console.log("🗑️ clearAllTrackingData được gọi");

    Modal.confirm({
      title: "🗑️ Xóa tất cả dữ liệu tracking?",
      content: (
        <div>
          <p>
            ⚠️{" "}
            <strong>
              Hành động này sẽ xóa TOÀN BỘ dữ liệu tracking đã lưu!
            </strong>
          </p>
          <p>• Tất cả dữ liệu theo dõi hàng ngày sẽ bị xóa</p>
          <p>• Thống kê và tiến độ sẽ được reset về 0</p>
          <p>
            • Hành động này <strong>KHÔNG THỂ HOÀN TÁC</strong>
          </p>
          <br />
          <p>
            🎯 <strong>Bạn có chắc chắn muốn xóa không?</strong>
          </p>
        </div>
      ),
      okText: "🗑️ XÓA TẤT CẢ",
      cancelText: "❌ Hủy bỏ",
      okType: "danger",
      width: 500,
      centered: true,
      onOk: () => {
        console.log("🗑️ Bắt đầu xóa dữ liệu...");

        // Đếm số dữ liệu sẽ xóa
        let deletedCount = 0;
        Object.keys(localStorage).forEach((key) => {
          if (key.startsWith(`tracking_${accountId}_`)) {
            localStorage.removeItem(key);
            deletedCount++;
          }
        });

        // Reset state
        setTrackingData({});
        calculateStats({});

        console.log(`🗑️ Đã xóa ${deletedCount} dữ liệu tracking`);
        message.success({
          content: `🗑️ Đã xóa thành công ${deletedCount} dữ liệu tracking!`,
          duration: 3,
        });
      },
      onCancel: () => {
        console.log("❌ Đã hủy xóa dữ liệu");
        message.info("❌ Đã hủy thao tác xóa");
      },
    });
  };

  const handleInputChange = (field, value) => {
    setTodayData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSymptomChange = (symptom, checked) => {
    setTodayData((prev) => ({
      ...prev,
      symptoms: checked
        ? [...prev.symptoms, symptom]
        : prev.symptoms.filter((s) => s !== symptom),
    }));
  };

  // Parse week range thành số ngày - CẬP NHẬT để hiểu định dạng từ CreatePlanning
  const parseWeekRangeToDays = (weekRange) => {
    if (!weekRange || typeof weekRange !== "string") return 7;

    const cleanRange = weekRange.trim();

    // ✅ Xử lý định dạng từ CreatePlanning: "Tuần 1 - 2", "Tuần 3", etc.
    if (cleanRange.toLowerCase().includes("tuần")) {
      // Loại bỏ từ "tuần" và các ký tự không cần thiết
      const numbersOnly = cleanRange
        .toLowerCase()
        .replace(/tuần\s*/gi, "")
        .replace(/\s*đến\s*/gi, "-")
        .replace(/\s*-\s*/g, "-")
        .trim();

      // Sau khi clean, xử lý như bình thường
      const rangeMatch = numbersOnly.match(/^(\d+)-(\d+)$/);
      if (rangeMatch) {
        const startWeek = parseInt(rangeMatch[1]);
        const endWeek = parseInt(rangeMatch[2]);
        return Math.max(1, endWeek - startWeek + 1) * 7;
      }

      const numberMatch = numbersOnly.match(/^(\d+)$/);
      if (numberMatch) {
        return 7; // 1 tuần = 7 ngày
      }

      return 7; // Default nếu không parse được
    }

    // ✅ Xử lý định dạng cũ: "1-2", "3", etc.
    const rangeMatch = cleanRange.match(/^(\d+)-(\d+)$/);
    if (rangeMatch) {
      const startWeek = parseInt(rangeMatch[1]);
      const endWeek = parseInt(rangeMatch[2]);
      return Math.max(1, endWeek - startWeek + 1) * 7;
    }

    const numberMatch = cleanRange.match(/^(\d+)$/);
    if (numberMatch) {
      return 7;
    }

    return 7; // Default fallback
  };

  // Lấy stage hiện tại dựa trên ngày
  const getCurrentStage = (date) => {
    if (!plan || !plan.stages) return null;

    const planStartDate = startOfDay(new Date(plan.localDateTime));
    const checkDate = startOfDay(date);
    const daysDiff = differenceInDays(checkDate, planStartDate);

    if (plan.systemPlan) {
      const stageIndex = Math.floor(daysDiff / 28);
      return plan.stages[stageIndex] || null;
    } else {
      // Kế hoạch tự tạo: xử lý theo từng week_range riêng biệt
      if (daysDiff < 0) return null;

      let currentDayCount = 0;

      // ✅ Sort stages an toàn hơn - xử lý cả định dạng mới và cũ
      const sortedStages = [...plan.stages].sort((a, b) => {
        const getFirstWeekNumber = (weekRange) => {
          if (!weekRange) return 0;

          // Xử lý định dạng "Tuần 1 - 2" hoặc "Tuần 1"
          if (weekRange.toLowerCase().includes("tuần")) {
            const numbers = weekRange.match(/\d+/g);
            return numbers ? parseInt(numbers[0]) : 0;
          }

          // Xử lý định dạng "1-2" hoặc "1"
          const firstNumber = weekRange.split("-")[0];
          return parseInt(firstNumber) || 0;
        };

        const aStart = getFirstWeekNumber(a.week_range);
        const bStart = getFirstWeekNumber(b.week_range);
        return aStart - bStart;
      });

      for (const stage of sortedStages) {
        const stageDays = parseWeekRangeToDays(stage.week_range);

        if (
          daysDiff >= currentDayCount &&
          daysDiff < currentDayCount + stageDays
        ) {
          return {
            id: stage.id,
            stageNumber: stage.stageNumber,
            targetCigarettes: stage.targetCigarettes,
            week_range: stage.week_range,
            reductionPercentage: stage.reductionPercentage,
            quitPlanId: stage.quitPlanId,
          };
        }

        currentDayCount += stageDays;
      }

      return null;
    }
  };

  // Tính ngày kết thúc kế hoạch
  const getPlanEndDate = () => {
    if (!plan || !plan.stages || plan.stages.length === 0) return null;

    const startDate = startOfDay(new Date(plan.localDateTime));

    if (plan.systemPlan) {
      const totalStages = plan.stages.length;
      const totalDays = totalStages * 28;
      return addDays(startDate, totalDays - 1);
    } else {
      // Kế hoạch tự tạo: tính tổng số ngày từ tất cả các stage entries
      let totalDays = 0;

      // ✅ Sort stages an toàn như getCurrentStage
      const sortedStages = [...plan.stages].sort((a, b) => {
        const getFirstWeekNumber = (weekRange) => {
          if (!weekRange) return 0;

          if (weekRange.toLowerCase().includes("tuần")) {
            const numbers = weekRange.match(/\d+/g);
            return numbers ? parseInt(numbers[0]) : 0;
          }

          const firstNumber = weekRange.split("-")[0];
          return parseInt(firstNumber) || 0;
        };

        const aStart = getFirstWeekNumber(a.week_range);
        const bStart = getFirstWeekNumber(b.week_range);
        return aStart - bStart;
      });

      for (const stage of sortedStages) {
        if (stage.week_range) {
          totalDays += parseWeekRangeToDays(stage.week_range);
        }
      }

      return totalDays > 0 ? addDays(startDate, totalDays - 1) : null;
    }
  };

  // Kiểm tra ngày có trong kế hoạch không
  const isDateInPlan = (date) => {
    if (!plan) return false;

    const startDate = startOfDay(new Date(plan.localDateTime));
    const endDate = getPlanEndDate();
    const checkDate = startOfDay(date);

    if (!endDate) return false;

    // Kiểm tra ngày có trong khoảng từ startDate đến endDate (bao gồm cả 2 ngày)
    return (
      !isBefore(checkDate, startDate) &&
      !isAfter(checkDate, startOfDay(endDate))
    );
  };

  // Lấy dữ liệu của ngày được chọn
  const getSelectedDateData = () => {
    const dateStr = format(selectedDate, "yyyy-MM-dd");
    return trackingData[dateStr] || null;
  };

  // Sửa lại hàm canEdit
  const canEdit = (date) => {
    if (isTestMode) return isDateInPlan(date); // Test mode: chỉ cần trong kế hoạch

    const now = new Date();
    const today = format(now, "yyyy-MM-dd");
    const dayDate = format(date, "yyyy-MM-dd");

    // Production mode: chỉ cho phép edit ngày hiện tại và trong giờ cho phép (trước 22h)
    return dayDate === today && now.getHours() < 22 && isDateInPlan(date);
  };

  // Thêm hàm getDayStatus
  const getDayStatus = (date) => {
    if (isTestMode) {
      return {
        canEdit: isDateInPlan(date),
        message: isDateInPlan(date) ? "" : "Ngoài kế hoạch",
        type: "test",
      };
    }

    const now = new Date();
    const today = format(now, "yyyy-MM-dd");
    const dayDate = format(date, "yyyy-MM-dd");
    const dateStr = format(date, "yyyy-MM-dd");
    const isSubmitted = trackingData[dateStr]?.submitted;

    if (!isDateInPlan(date)) {
      return {
        canEdit: false,
        message: "Ngoài kế hoạch",
        type: "out-of-plan",
      };
    }

    if (dayDate < today) {
      // Ngày đã qua
      if (isSubmitted) {
        return {
          canEdit: false,
          message: "",
          type: "past",
          showSubmitted: true,
        };
      } else {
        return {
          canEdit: false,
          message: "Đã qua",
          type: "past",
        };
      }
    } else if (dayDate > today) {
      // Ngày tương lai
      return {
        canEdit: false,
        message: "Sắp tới",
        type: "future",
      };
    } else {
      // Ngày hiện tại
      if (now.getHours() >= 22) {
        return {
          canEdit: false,
          message: "Quá 22h - không thể chỉnh sửa",
          type: "late",
        };
      } else {
        return {
          canEdit: true,
          message: "",
          type: "current",
        };
      }
    }
  };

  // Kiểm tra triệu chứng thường xuyên
  const checkFrequentSymptoms = (dayKey, smoked, targetCigs, showBooking) => {
    const symptomsToday = todayData.symptoms || [];
    const checkedSymptoms = symptomsToday.filter((symptom) => symptom);
    const showlink = showlinkBooking; // Đảm bảo showBooking là boolean
    // Logic 1: Kiểm tra >= 3 triệu chứng trong ngày hiện tại
    if (checkedSymptoms.length >= 3) {
      return {
        hasFrequentSymptoms: true,
        content: `<div style="margin: 12px 0; padding: 12px; background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 4px;">
          <strong>🌟 Bạn đang gặp nhiều triệu chứng hôm nay</strong><br/>
          Chúng tôi hiểu rằng việc cai thuốc có thể khiến bạn cảm thấy khó chịu. Những triệu chứng này là hoàn toàn bình thường và cho thấy cơ thể đang điều chỉnh để thích nghi với việc không có nicotine.<br/><br/>
          <strong>💡 Đừng lo lắng:</strong> Hầu hết các triệu chứng sẽ giảm dần trong vài tuần tới. Hãy nhớ rằng mỗi ngày bạn kiên trì là một bước tiến lớn cho sức khỏe!<br/><br/>
          ${
            showlink
              ? `Nếu bạn cảm thấy cần hỗ trợ thêm, đừng ngần ngại <a href="${BOOKING_LINK}" target="_blank" style="color: #007bff; text-decoration: underline;">đặt lịch tư vấn với chuyên gia</a> của chúng tôi.<br/><br/>`
              : "Hãy nâng cấp gói hội viên để được hỗ trợ tốt nhất!<br/><br/>"
          }
          <strong>🎯 Bạn đang làm rất tốt! Hãy tiếp tục kiên trì nhé! 💪</strong>
        </div>`,
      };
    }
    console.log("👁️ showBooking hiện tại:", showBooking);
    // Logic 2: Kiểm tra triệu chứng kéo dài qua nhiều ngày
    const dayKeys = Object.keys(trackingData).sort(
      (a, b) => new Date(a) - new Date(b)
    );

    for (const symptom of checkedSymptoms) {
      let consecutive = 0;

      for (let i = dayKeys.length - 1; i >= 0; i--) {
        const dayData = trackingData[dayKeys[i]];
        if (dayData?.symptoms?.includes(symptom)) {
          consecutive++;
        } else if (dayData?.symptoms?.length > 0) {
          break;
        }
      }

      if (checkedSymptoms.includes(symptom)) {
        consecutive++;
      }

      if (consecutive >= 3) {
        return {
          hasFrequentSymptoms: true,
          content: `<div style="margin: 12px 0; padding: 12px; background: #f8d7da; border: 1px solid #f5c6cb; border-radius: 4px;">
            <strong>📌 Chú ý: Triệu chứng "${
              SYMPTOMS[symptom]
            }" kéo dài</strong><br/>
            Chúng tôi nhận thấy triệu chứng này đã xuất hiện liên tiếp ${consecutive} ngày. Mặc dù đây có thể là phần của quá trình cai thuốc, nhưng chúng tôi khuyến nghị bạn nên tham khảo ý kiến chuyên gia để được hỗ trợ tốt nhất.<br/><br/>
            <strong>🩺 Lời khuyên:</strong> 
            ${
              showlink
                ? `Hãy <a href="${BOOKING_LINK}" target="_blank" style="color: #007bff; text-decoration: underline;">đặt lịch tư vấn với bác sĩ</a> để được đánh giá và tư vấn cách giảm thiểu triệu chứng này một cách hiệu quả.<br/><br/>`
                : "Hãy nâng cấp gói hội viên để được hỗ trợ tốt nhất!<br/><br/>"
            }
            <em>Sức khỏe của bạn là ưu tiên hàng đầu! 🌟</em>
          </div>`,
        };
      }
    }

    return { hasFrequentSymptoms: false, content: "" };
  };

  // Hiển thị popup thành công
  const showSuccessPopup = (smoked, target, isTestData = false) => {
    const savedCigs = Math.max(0, target - smoked);
    const savedMoney = savedCigs * 1000;

    let content = "";

    if (isTestData) {
      content += `
        <div class="quit-tracking-test-notice">
          <h4>🔧 Chế độ Test - Dữ liệu mẫu</h4>
          <p>Dữ liệu này chỉ để test giao diện, không ảnh hưởng đến kết quả thật.</p>
        </div>
      `;
    }

    if (smoked <= target) {
      content += `
        <div class="quit-tracking-success-popup">
          <h3>🎉 Chúc mừng! Bạn đã hoàn thành mục tiêu ${
            isTestData ? "mẫu" : "hôm nay"
          }!</h3>
          <p>Bạn đã tiết kiệm được ${savedCigs} điếu thuốc và ${savedMoney.toLocaleString()} VNĐ!</p>
        </div>
      `;
    } else {
      content += `
        <div class="quit-tracking-warning-popup">
          <h3>⚠️ ${
            isTestData ? "Dữ liệu mẫu:" : "Hôm nay"
          } bạn đã hút nhiều hơn kế hoạch</h3>
          <p>Đừng nản lòng! ${
            isTestData ? "Đây chỉ là test." : "Ngày mai hãy cố gắng hơn nhé!"
          }</p>
        </div>
      `;
    }

    if (todayData.symptoms.length > 0) {
      content += `
        <div class="quit-tracking-symptoms-popup">
          <h4>🌟 Triệu chứng ${isTestData ? "mẫu" : "hôm nay"}:</h4>
          ${todayData.symptoms
            .map(
              (symptom) => `
            <div class="quit-tracking-symptom-item">
              <strong>${SYMPTOMS[symptom]}</strong>
              <p>${SYMPTOM_MESSAGES[symptom]}</p>
            </div>
          `
            )
            .join("")}
        </div>
      `;
    }

    const dateStr = format(selectedDate, "yyyy-MM-dd");
    const bookingCheck = checkFrequentSymptoms(dateStr, smoked, target);
    if (bookingCheck.hasFrequentSymptoms) {
      content += bookingCheck.content;
    }

    content += `
      <div class="quit-tracking-motivation-popup">
        <p><strong>💪 ${
          isTestData
            ? "Test hoàn tất!"
            : "Bạn đang làm rất tốt! Hãy tiếp tục kiên trì!"
        }</strong></p>
      </div>
    `;

    setPopupContent(content);
    setIsModalVisible(true);
  };

  // Thêm hàm tạo thông báo tự động
  const generateNotification = async (progressId) => {
    try {
      console.log("🔔 Tạo thông báo cho progress ID:", progressId);

      const response = await api.post(
        `/quit-progress/generate-notification/${progressId}`
      );
      console.log("✅ Thông báo đã được tạo:", response.data);

      // Hiển thị thông báo thành công nhẹ nhàng
      message.success("📢 Đã tạo thông báo theo dõi!");

      return response.data;
    } catch (error) {
      console.error("❌ Lỗi tạo thông báo:", error);
      // Không hiển thị lỗi để không làm phiền user
      return null;
    }
  };

  // Hiển thị modal xác nhận trước khi lưu
  const showConfirmModal = () => {
    const currentStage = getCurrentStage(selectedDate);

    if (!isDateInPlan(selectedDate)) {
      message.error("Ngày này không thuộc kế hoạch cai thuốc.");
      return;
    }

    if (!currentStage) {
      message.error("Không tìm thấy giai đoạn phù hợp cho ngày này.");
      return;
    }

    if (!todayData.cigarettes_smoked) {
      message.error("Vui lòng nhập số điếu thuốc đã hút.");
      return;
    }

    // ✅ Thêm validation số lượng
    const cigarettes = parseInt(todayData.cigarettes_smoked);
    if (cigarettes < 0 || cigarettes > 50) {
      message.error("Số điếu thuốc phải từ 0 đến 50.");
      return;
    }

    setIsConfirmModalVisible(true);
  };

  // Sửa lại hàm handleSubmit để tránh double submit và double notification
  const handleSubmit = async () => {
    // Protection tránh double submit
    if (submitting) {
      console.log("⚠️ Đang xử lý, bỏ qua request trùng lặp");
      return;
    }

    const currentStage = getCurrentStage(selectedDate);

    if (!isDateInPlan(selectedDate)) {
      message.error("Ngày này không thuộc kế hoạch cai thuốc.");
      return;
    }

    if (!currentStage) {
      message.error("Không tìm thấy giai đoạn phù hợp cho ngày này.");
      return;
    }

    const cigarettes_smoked = parseInt(todayData.cigarettes_smoked) || 0;
    const mainSymptom =
      todayData.symptoms.length > 0 ? todayData.symptoms[0] : "SYMPTOM1";

    setSubmitting(true);
    try {
      console.log("🚀 Gọi API quit-progress:", {
        date: format(selectedDate, "yyyy-MM-dd"),
        cigarettes_smoked,
        quitHealthStatus: mainSymptom,
        quitProgressStatus: "SUBMITTED",
        quitPlanStageId: currentStage.id,
        smokingStatusId,
      });

      const progressData = {
        date: format(selectedDate, "yyyy-MM-dd"),
        cigarettes_smoked,
        quitHealthStatus: mainSymptom,
        quitProgressStatus: "SUBMITTED",
        quitPlanStageId: currentStage.id,
        smokingStatusId,
      };

      const response = await api.post("/quit-progress", progressData);
      console.log("✅ API quit-progress Response:", response.data);

      message.success("✅ Đã lưu dữ liệu!");

      // Lưu vào localStorage
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      const trackingEntry = {
        ...todayData,
        cigarettes_smoked,
        target: currentStage.targetCigarettes,
        submitted: true,
        submittedAt: new Date().toISOString(),
        stageId: currentStage.id,
        isTestData: false,
      };

      localStorage.setItem(
        `tracking_${accountId}_${dateStr}`,
        JSON.stringify(trackingEntry)
      );

      const newTrackingData = {
        ...trackingData,
        [dateStr]: trackingEntry,
      };
      setTrackingData(newTrackingData);
      calculateStats(newTrackingData);

      // Kiểm tra xem có phải ngày cuối cùng không
      if (isLastDayOfPlan(selectedDate)) {
        // Đợi một chút để modal thành công hiển thị trước
        setTimeout(() => {
          setIsModalVisible(false); // Đóng modal thường
          showCompletionModal(newTrackingData); // Hiện modal hoàn thành
        }, 2000);
      } else {
        showSuccessPopup(
          cigarettes_smoked,
          currentStage.targetCigarettes,
          false
        );
      }
    } catch (error) {
      console.error("❌ Lỗi:", error);
      message.error(
        `❌ Lỗi: ${error.response?.data?.message || error.message}`
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Xử lý xác nhận lưu dữ liệu
  const handleConfirmSubmit = () => {
    setIsConfirmModalVisible(false);
    handleSubmit();
  };

  // Thêm hàm kiểm tra ngày cuối cùng
  const isLastDayOfPlan = (date) => {
    const endDate = getPlanEndDate();
    if (!endDate) return false;
    return isSameDay(date, endDate);
  };

  // Thêm hàm hiển thị modal hoàn thành
  const showCompletionModal = (totalStats) => {
    const planStartDate = new Date(plan.localDateTime);
    const planEndDate = getPlanEndDate();
    const totalDaysInPlan = differenceInDays(planEndDate, planStartDate) + 1;

    // Tính toán thống kê đơn giản - TẤT CẢ dữ liệu đã submit
    const realDataEntries = Object.entries(totalStats).filter(
      ([_, value]) => value.submitted
    );

    const completionRate = (realDataEntries.length / totalDaysInPlan) * 100;
    const totalSavedCigarettes = realDataEntries.reduce((sum, [_, value]) => {
      return sum + Math.max(0, value.target - value.cigarettes_smoked);
    }, 0);
    const totalSavedMoney = totalSavedCigarettes * 1000;

    const successDays = realDataEntries.filter(
      ([_, value]) => value.cigarettes_smoked <= value.target
    ).length;

    const successRate =
      realDataEntries.length > 0
        ? (successDays / realDataEntries.length) * 100
        : 0;

    setCompletionData({
      totalDays: totalDaysInPlan,
      completedDays: realDataEntries.length,
      completionRate: Math.round(completionRate),
      successRate: Math.round(successRate),
      savedCigarettes: totalSavedCigarettes,
      savedMoney: totalSavedMoney,
      planType: plan.systemPlan ? "Kế hoạch hệ thống" : "Kế hoạch tự tạo",
      startDate: format(planStartDate, "dd/MM/yyyy"),
      endDate: format(planEndDate, "dd/MM/yyyy"),
    });

    setIsCompletionModalVisible(true);
  };

  // Lấy kế hoạch cai thuốc
  const fetchPlan = async () => {
    try {
      const response = await api.get(`/v1/customers/${accountId}/quit-plans`);
      if (response.data) {
        let planData = response.data;

        // Nếu là kế hoạch tự tạo, lấy thêm stages từ API riêng
        if (!planData.systemPlan && planData.id) {
          try {
            const stagesResponse = await api.get(
              `/v1/customers/${accountId}/quit-plans/${planData.id}/stages`
            );
            if (stagesResponse.data && stagesResponse.data.length > 0) {
              // Gán stages vào planData
              planData.stages = stagesResponse.data;
              console.log(
                "📊 Đã lấy stages cho kế hoạch tự tạo:",
                stagesResponse.data
              );
            }
          } catch (stagesError) {
            console.error("Lỗi lấy stages:", stagesError);
            message.error("Không thể tải chi tiết kế hoạch tự tạo.");
          }
        }

        setPlan(planData);
        console.log("📋 Kế hoạch đã load:", planData);
        return planData;
      }
    } catch (error) {
      console.error("Lỗi lấy kế hoạch:", error);
      message.error("Không thể tải kế hoạch. Vui lòng tạo kế hoạch trước.");
    }
    return null;
  };

  // Lấy smoking status
  const fetchSmokingStatus = async () => {
    try {
      const response = await api.get(`/smoking-status/account/${accountId}`);
      if (response.data && response.data.id) {
        setSmokingStatusId(response.data.id);
        return response.data.id;
      }
    } catch (error) {
      console.error("Lỗi lấy smoking status:", error);
    }
    return null;
  };

  // Load dữ liệu theo dõi từ localStorage
  const loadTrackingData = () => {
    const savedData = {};
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(`tracking_${accountId}_`)) {
        const dateStr = key.replace(`tracking_${accountId}_`, "");
        try {
          const data = JSON.parse(localStorage.getItem(key));
          if (data) {
            savedData[dateStr] = data;
          }
        } catch (e) {
          console.error("Lỗi parse dữ liệu:", e);
        }
      }
    });

    setTrackingData(savedData);
    calculateStats(savedData);
    console.log("📊 Đã load lại dữ liệu tracking:", savedData);
  };

  // Tính toán thống kê (bao gồm cả dữ liệu auto-filled)
  const calculateStats = (data) => {
    const allEntries = Object.entries(data);
    const completedDays = allEntries.filter(
      ([_, value]) => value.submitted
    ).length;

    const averageProgress =
      completedDays > 0
        ? allEntries.reduce((sum, [_, value]) => {
            if (value.submitted && value.target > 0) {
              return (
                sum +
                Math.max(
                  0,
                  ((value.target - value.cigarettes_smoked) / value.target) *
                    100
                )
              );
            }
            return sum;
          }, 0) / completedDays
        : 0;

    setStats({
      totalDays: allEntries.length,
      completedDays,
      averageProgress: Math.round(averageProgress),
    });
  };

  // Load dữ liệu của ngày được chọn vào form
  const loadSelectedDateData = () => {
    const dateStr = format(selectedDate, "yyyy-MM-dd");
    const selectedData = trackingData[dateStr];

    if (selectedData && selectedData.submitted) {
      setTodayData({
        cigarettes_smoked: selectedData.cigarettes_smoked.toString(),
        symptoms: selectedData.symptoms || [],
        notes: selectedData.notes || "",
      });
    } else {
      setTodayData({
        cigarettes_smoked: "",
        symptoms: [],
        notes: "",
      });
    }
  };

  const initializeData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchPlan(),
        fetchSmokingStatus(),
        loadTrackingData(),
      ]);
    } catch (error) {
      console.error("Lỗi khởi tạo dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accountId) {
      initializeData();
    } else {
      message.error("Vui lòng đăng nhập để xem trang theo dõi.");
    }
  }, [accountId]);

  useEffect(() => {
    loadSelectedDateData();
  }, [selectedDate, trackingData]);

  // Thêm hàm renderInputForm
  const renderInputForm = () => {
    const dayStatus = getDayStatus(selectedDate);
    const currentStage = getCurrentStage(selectedDate);
    const selectedData = getSelectedDateData();

    if (!isDateInPlan(selectedDate)) {
      return (
        <div className="quit-tracking-out-of-plan">
          <p>📅 Ngày này không thuộc kế hoạch cai thuốc của bạn.</p>
          <p>
            Kế hoạch của bạn từ ngày{" "}
            {format(new Date(plan.localDateTime), "dd/MM/yyyy")}
            {getPlanEndDate() &&
              ` đến ngày ${format(getPlanEndDate(), "dd/MM/yyyy")}`}
          </p>
        </div>
      );
    }

    if (selectedData && selectedData.submitted) {
      return (
        <div className="quit-tracking-submitted-data">
          <h4>✅ Dữ liệu đã lưu</h4>
          <div className="quit-tracking-data-item">
            <span className="quit-tracking-data-label">Số điếu đã hút:</span>
            <span className="quit-tracking-data-value">
              {selectedData.cigarettes_smoked}
            </span>
          </div>
          <div className="quit-tracking-data-item">
            <span className="quit-tracking-data-label">Mục tiêu:</span>
            <span className="quit-tracking-data-value">
              {selectedData.target} điếu
            </span>
          </div>
          {selectedData.symptoms && selectedData.symptoms.length > 0 && (
            <div className="quit-tracking-data-item">
              <span className="quit-tracking-data-label">Triệu chứng:</span>
              <div className="quit-tracking-symptoms-list">
                {selectedData.symptoms.map((symptom) => (
                  <span key={symptom} className="quit-tracking-symptom-tag">
                    {SYMPTOMS[symptom]}
                  </span>
                ))}
              </div>
            </div>
          )}
          {selectedData.notes && (
            <div className="quit-tracking-data-item">
              <span className="quit-tracking-data-label">Ghi chú:</span>
              <span className="quit-tracking-data-value">
                {selectedData.notes}
              </span>
            </div>
          )}
        </div>
      );
    }

    if (dayStatus.canEdit) {
      return (
        <div className="quit-tracking-input-form">
          <div className="quit-tracking-form-group">
            <label>Số điếu thuốc đã hút:</label>
            <input
              type="number"
              min="0"
              max="50"
              value={todayData.cigarettes_smoked}
              onChange={(e) => {
                const value = e.target.value;

                // ✅ Validation đơn giản: chỉ cho phép 0-50
                if (
                  value === "" ||
                  (parseInt(value) >= 0 && parseInt(value) <= 50)
                ) {
                  handleInputChange("cigarettes_smoked", value);
                }
              }}
              placeholder="Nhập số điếu (0-50)"
              className="quit-tracking-form-input"
            />

            {/* ✅ Hiển thị lỗi validation */}
            {todayData.cigarettes_smoked &&
              (parseInt(todayData.cigarettes_smoked) < 0 ||
                parseInt(todayData.cigarettes_smoked) > 50) && (
                <div
                  style={{
                    color: "#ff4d4f",
                    fontSize: "12px",
                    marginTop: "4px",
                    fontStyle: "italic",
                  }}
                >
                  ⚠️ Số điếu phải từ 0 đến 50
                </div>
              )}
          </div>

          <div className="quit-tracking-form-group">
            <label>Triệu chứng gặp phải:</label>
            <div className="quit-tracking-symptoms-grid">
              {Object.entries(SYMPTOMS).map(([key, label]) => (
                <label key={key} className="quit-tracking-symptom-checkbox">
                  <input
                    type="checkbox"
                    checked={todayData.symptoms.includes(key)}
                    onChange={(e) => handleSymptomChange(key, e.target.checked)}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          <div className="quit-tracking-form-group">
            <label>Ghi chú (tùy chọn):</label>
            <textarea
              value={todayData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="Ghi chú về cảm xúc, hoạt động..."
              className="quit-tracking-form-textarea"
            />
          </div>

          <div className="quit-tracking-form-actions">
            <Button
              type="primary"
              size="large"
              loading={submitting}
              onClick={showConfirmModal}
              disabled={
                !todayData.cigarettes_smoked ||
                parseInt(todayData.cigarettes_smoked) < 0 ||
                parseInt(todayData.cigarettes_smoked) > 50
              }
            >
              💾 Lưu dữ liệu
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="quit-tracking-cannot-edit">
        <p>⏰ Không thể chỉnh sửa dữ liệu này</p>
        <p>{dayStatus.message}</p>
      </div>
    );
  };

  // Render Calendar
  const renderCalendar = () => {
    if (!plan) return null;

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const dateRange = eachDayOfInterval({ start: startDate, end: endDate });
    const today = new Date();

    const calendarRows = [];
    let days = [];

    dateRange.forEach((date, index) => {
      const dateStr = format(date, "yyyy-MM-dd");
      const dayData = trackingData[dateStr];
      const isSelected = isSameDay(date, selectedDate);
      const isToday = isSameDay(date, today);
      const isPast = isBefore(date, today);
      const isFuture = isAfter(date, today);
      const isCurrentMonth = getMonth(date) === getMonth(currentMonth);
      const isInPlan = isDateInPlan(date);

      days.push(
        <div
          key={dateStr}
          className={`
            quit-tracking-calendar-cell 
            ${isSelected ? "quit-tracking-cell-selected" : ""}
            ${isToday ? "quit-tracking-cell-today" : ""}
            ${!isCurrentMonth ? "quit-tracking-cell-other-month" : ""}
            ${!isInPlan ? "quit-tracking-cell-out-of-plan" : ""}
            ${isPast ? "quit-tracking-cell-past" : ""}
            ${isFuture ? "quit-tracking-cell-future" : ""}
          `}
          onClick={() => setSelectedDate(date)}
        >
          <div className="quit-tracking-cell-number">{format(date, "d")}</div>

          {/* Hiển thị trạng thái hoàn thành đơn giản */}
          {dayData && dayData.submitted && isInPlan && (
            <div
              className={`quit-tracking-cell-status ${
                dayData.cigarettes_smoked <= dayData.target
                  ? "quit-tracking-cell-success"
                  : "quit-tracking-cell-warning"
              }`}
            >
              ✓
            </div>
          )}
        </div>
      );

      if ((index + 1) % 7 === 0) {
        calendarRows.push(
          <div
            key={`week-${calendarRows.length}`}
            className="quit-tracking-calendar-row"
          >
            {days}
          </div>
        );
        days = [];
      }
    });

    const planStartDate = new Date(plan.localDateTime);
    const planEndDate = getPlanEndDate();

    return (
      <div className="quit-tracking-calendar-container">
        <div className="quit-tracking-calendar-header">
          <div className="quit-tracking-calendar-nav">
            <Button
              type="text"
              icon={<span>‹</span>}
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            />
            <h3>{format(currentMonth, "MMMM yyyy", { locale: vi })}</h3>
            <Button
              type="text"
              icon={<span>›</span>}
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            />
          </div>

          <div className="quit-tracking-plan-summary">
            <span>📅 {format(planStartDate, "dd/MM/yyyy")}</span>
            {planEndDate && <span>🏁 {format(planEndDate, "dd/MM/yyyy")}</span>}
            <span className="quit-tracking-plan-type">
              {plan.systemPlan ? "🏥 Hệ thống" : "👤 Tự tạo"}
            </span>
          </div>
        </div>

        <div className="quit-tracking-calendar-legend">
          <span className="quit-tracking-legend-today">Hôm nay</span>
          <span className="quit-tracking-legend-success">Hoàn thành</span>
          <span className="quit-tracking-legend-warning">Chưa đạt</span>
          <span className="quit-tracking-legend-out-plan">Ngoài kế hoạch</span>
        </div>

        <div className="quit-tracking-calendar-weekdays">
          {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((day) => (
            <div key={day} className="quit-tracking-weekday-header">
              {day}
            </div>
          ))}
        </div>

        <div className="quit-tracking-calendar-grid">{calendarRows}</div>

        <div className="quit-tracking-calendar-quick-nav">
          <Button
            size="small"
            type={isSameDay(currentMonth, new Date()) ? "primary" : "default"}
            onClick={() => setCurrentMonth(new Date())}
          >
            Tháng này
          </Button>
          <Button
            size="small"
            type={
              isSameDay(currentMonth, planStartDate) ? "primary" : "default"
            }
            onClick={() => setCurrentMonth(planStartDate)}
          >
            Tháng bắt đầu
          </Button>
          {planEndDate && (
            <Button
              size="small"
              type={
                isSameDay(currentMonth, planEndDate) ? "primary" : "default"
              }
              onClick={() => setCurrentMonth(planEndDate)}
            >
              Tháng kết thúc
            </Button>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="quit-tracking-main-container">
          <div className="quit-tracking-loading-container">
            <div className="quit-tracking-loading-spinner"></div>
            <p>Đang tải dữ liệu...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!plan) {
    return (
      <>
        <Navbar />
        <div className="quit-tracking-main-container">
          <div className="quit-tracking-error-container">
            <h3>Chưa có kế hoạch cai thuốc</h3>
            <p>Vui lòng tạo kế hoạch trước khi theo dõi tiến trình.</p>
            <Button
              type="primary"
              onClick={() => (window.location.href = "/planning")}
            >
              Tạo kế hoạch
            </Button>
          </div>
        </div>
      </>
    );
  }

  // Cập nhật phần render Card form
  return (
    <>
      <Navbar />
      <div className="quit-tracking-main-container">
        <div className="quit-tracking-page-header">
          <h1>📊 Theo dõi tiến trình cai thuốc</h1>
          <div className="quit-tracking-plan-info">
            <Tag color={plan.systemPlan ? "blue" : "green"}>
              {plan.systemPlan ? "Kế hoạch hệ thống" : "Kế hoạch tự tạo"}
            </Tag>
            <Tag color="orange">
              Mức độ nghiện:{" "}
              {plan.addictionLevel === "LOW"
                ? "Thấp"
                : plan.addictionLevel === "MEDIUM"
                ? "Trung bình"
                : "Cao"}
            </Tag>
          </div>

          {/* Script controls - chỉ hiển thị trong test mode */}
          {isTestMode && (
            <div
              className="quit-tracking-script-controls"
              style={{
                marginTop: "16px",
                padding: "12px",
                background: "#f0f8ff",
                border: "1px solid #1890ff",
                borderRadius: "6px",
              }}
            >
              <h4 style={{ margin: "0 0 8px 0", color: "#1890ff" }}>🔧 Test</h4>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <Button
                  type="primary"
                  loading={isAutoFilling}
                  onClick={autoFillTrackingData}
                  disabled={!plan || !smokingStatusId}
                  size="small"
                >
                  🤖 Điền dữ liệu 2 tuần
                </Button>
                <Button
                  danger
                  onClick={clearAllTrackingData}
                  disabled={isAutoFilling}
                  size="small"
                >
                  🗑️ Xóa tất cả dữ liệu
                </Button>
                <span style={{ fontSize: "12px", color: "#666" }}>
                  Script sẽ tạo dữ liệu mẫu cho{" "}
                  {plan && getPlanEndDate()
                    ? differenceInDays(
                        getPlanEndDate(),
                        new Date(plan.localDateTime)
                      )
                    : "?"}{" "}
                  ngày
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Giữ nguyên stats */}
        <Row gutter={[16, 16]} className="quit-tracking-stats-row">
          <Col xs={24} sm={12} md={8}>
            <Card className="quit-tracking-stats-card">
              <Statistic
                title="Tổng số ngày"
                value={stats.totalDays}
                prefix={<CalendarOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card className="quit-tracking-stats-card">
              <Statistic
                title="Ngày hoàn thành"
                value={stats.completedDays}
                prefix={<SmileOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card className="quit-tracking-stats-card">
              <Statistic
                title="Tiến độ trung bình"
                value={stats.averageProgress}
                suffix="%"
                prefix={<HeartOutlined />}
              />
            </Card>
          </Col>
        </Row>

        {renderCalendar()}

        <Card
          className="quit-tracking-form-card"
          title={`📝 Nhập dữ liệu ngày ${format(selectedDate, "dd/MM/yyyy")}`}
        >
          {(() => {
            const currentStage = getCurrentStage(selectedDate);

            return (
              <>
                {currentStage && isDateInPlan(selectedDate) && (
                  <div className="quit-tracking-stage-info">
                    <Tag color="blue">Giai đoạn {currentStage.stageNumber}</Tag>
                    <span>
                      Mục tiêu: {currentStage.targetCigarettes} điếu/ngày
                    </span>
                    {!plan.systemPlan && currentStage.week_range && (
                      <Tag color="green">{currentStage.week_range}</Tag>
                    )}
                  </div>
                )}

                {renderInputForm()}
              </>
            );
          })()}
        </Card>

        {/* Giữ nguyên Modal */}
        <Modal
          title="📣 Kết quả hôm nay"
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={[
            <Button
              key="close"
              type="primary"
              onClick={() => setIsModalVisible(false)}
            >
              Đóng
            </Button>,
          ]}
          width={700}
          centered
        >
          <div dangerouslySetInnerHTML={{ __html: popupContent }} />
        </Modal>

        {/* Modal xác nhận lưu dữ liệu */}
        <Modal
          title="🔒 Xác nhận lưu dữ liệu"
          open={isConfirmModalVisible}
          onCancel={() => setIsConfirmModalVisible(false)}
          footer={[
            <Button
              key="cancel"
              onClick={() => setIsConfirmModalVisible(false)}
            >
              ❌ Hủy
            </Button>,
            <Button
              key="confirm"
              type="primary"
              loading={submitting}
              onClick={handleConfirmSubmit}
            >
              ✅ Xác nhận lưu
            </Button>,
          ]}
          width={500}
          centered
        >
          <div className="quit-confirm-content">
            <p>
              <strong>📅 Ngày:</strong> {format(selectedDate, "dd/MM/yyyy")}
            </p>
            <p>
              <strong>🚬 Số điếu đã hút:</strong> {todayData.cigarettes_smoked}
            </p>
            {(() => {
              const currentStage = getCurrentStage(selectedDate);
              return currentStage ? (
                <p>
                  <strong>🎯 Mục tiêu:</strong> {currentStage.targetCigarettes}{" "}
                  điếu
                </p>
              ) : null;
            })()}
            {todayData.symptoms.length > 0 && (
              <div>
                <p>
                  <strong>😷 Triệu chứng:</strong>
                </p>
                <div style={{ marginLeft: "20px" }}>
                  {todayData.symptoms.map((symptom) => (
                    <div key={symptom}>• {SYMPTOMS[symptom]}</div>
                  ))}
                </div>
              </div>
            )}
            {todayData.notes && (
              <p>
                <strong>📝 Ghi chú:</strong> {todayData.notes}
              </p>
            )}
            <div
              style={{
                marginTop: "16px",
                padding: "12px",
                background: "#f6ffed",
                border: "1px solid #b7eb8f",
                borderRadius: "4px",
              }}
            >
              <p>
                <strong>⚠️ Lưu ý:</strong> Sau khi lưu, bạn sẽ không thể chỉnh
                sửa dữ liệu này nữa.
              </p>
            </div>
          </div>
        </Modal>

        {/* Modal hoàn thành - Professional Design */}
        <Modal
          title={null}
          open={isCompletionModalVisible}
          onCancel={() => setIsCompletionModalVisible(false)}
          footer={null}
          width={600}
          centered
          className="quit-completion-modal"
          styles={{
            body: { padding: 0 },
            header: { display: "none" },
          }}
        >
          {completionData && (
            <div
              style={{
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                lineHeight: 1.5,
              }}
            >
              {/* Header Section */}
              <div
                style={{
                  background:
                    "linear-gradient(135deg, #4CAF50 0%, #45a049 100%)",
                  padding: "32px 24px",
                  textAlign: "center",
                  color: "white",
                  position: "relative",
                  borderRadius: "8px 8px 0 0",
                }}
              >
                <div
                  style={{
                    fontSize: "56px",
                    marginBottom: "12px",
                    filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
                  }}
                >
                  🏆
                </div>
                <h2
                  style={{
                    margin: 0,
                    fontSize: "24px",
                    fontWeight: "700",
                    marginBottom: "8px",
                    textShadow: "0 1px 3px rgba(0,0,0,0.2)",
                  }}
                >
                  Hoàn thành xuất sắc!
                </h2>
                <p
                  style={{
                    margin: 0,
                    fontSize: "16px",
                    opacity: 0.95,
                    fontWeight: "500",
                  }}
                >
                  Kế hoạch cai thuốc • {completionData.startDate} -{" "}
                  {completionData.endDate}
                </p>
              </div>

              {/* Main Stats Section */}
              <div style={{ padding: "32px 24px 24px" }}>
                <Row gutter={[24, 24]} align="middle">
                  <Col xs={24} md={12}>
                    <div
                      style={{
                        textAlign: "center",
                        padding: "24px",
                        background: "#f8f9fa",
                        borderRadius: "12px",
                        border: "2px solid #e9ecef",
                        height: "140px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "36px",
                          fontWeight: "800",
                          color: "#2196F3",
                          marginBottom: "8px",
                          lineHeight: 1,
                        }}
                      >
                        {completionData.totalDays}
                        <span
                          style={{
                            fontSize: "24px",
                            // fontWeight: "600",
                            color: "#666",
                          }}
                        >
                          /{completionData.completedDays}
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: "14px",
                          color: "#666",
                          fontWeight: "600",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          marginBottom: "12px",
                        }}
                      >
                        Ngày hoàn thành
                      </div>
                      <Progress
                        percent={completionData.completionRate}
                        strokeColor={{
                          "0%": "#2196F3",
                          "100%": "#4CAF50",
                        }}
                        trailColor="#e9ecef"
                        strokeWidth={8}
                        showInfo={false}
                        style={{ maxWidth: "200px", margin: "0 auto" }}
                      />
                    </div>
                  </Col>

                  <Col xs={24} md={12}>
                    <div
                      style={{
                        textAlign: "center",
                        padding: "24px",
                        background: "#f8f9fa",
                        borderRadius: "12px",
                        border: "2px solid #e9ecef",
                        height: "140px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "36px",
                          fontWeight: "800",
                          color: "#4CAF50",
                          marginBottom: "8px",
                          lineHeight: 1,
                        }}
                      >
                        {completionData.savedCigarettes}
                      </div>
                      <div
                        style={{
                          fontSize: "14px",
                          color: "#666",
                          fontWeight: "600",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          marginBottom: "8px",
                        }}
                      >
                        Điếu thuốc tiết kiệm
                      </div>
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background:
                            "linear-gradient(135deg, #FFC107 0%, #FF9800 100%)",
                          color: "white",
                          padding: "6px 16px",
                          borderRadius: "20px",
                          fontSize: "15px",
                          fontWeight: "600",
                          boxShadow: "0 2px 8px rgba(255, 193, 7, 0.3)",
                        }}
                      >
                        💰 {completionData.savedMoney.toLocaleString()} VNĐ
                      </div>
                    </div>
                  </Col>
                </Row>

                {/* Performance Metrics */}
                <div
                  style={{
                    marginTop: "24px",
                    padding: "20px",
                    background:
                      "linear-gradient(135deg, #fff 0%, #f8f9fa 100%)",
                    borderRadius: "12px",
                    border: "1px solid #e9ecef",
                  }}
                >
                  <Row gutter={24} align="middle">
                    <Col xs={12}>
                      <div style={{ textAlign: "center" }}>
                        <div
                          style={{
                            fontSize: "12px",
                            color: "#6c757d",
                            fontWeight: "600",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                            marginBottom: "6px",
                          }}
                        >
                          Tỷ lệ hoàn thành
                        </div>
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background:
                              completionData.completionRate >= 80
                                ? "#e3f2fd"
                                : "#fff3e0",
                            color:
                              completionData.completionRate >= 80
                                ? "#1976d2"
                                : "#f57c00",
                            padding: "8px 16px",
                            borderRadius: "8px",
                            fontSize: "20px",
                            fontWeight: "700",
                            border: `2px solid ${
                              completionData.completionRate >= 80
                                ? "#bbdefb"
                                : "#ffcc02"
                            }`,
                          }}
                        >
                          {completionData.completionRate}%
                        </div>
                      </div>
                    </Col>
                    <Col xs={12}>
                      <div style={{ textAlign: "center" }}>
                        <div
                          style={{
                            fontSize: "12px",
                            color: "#6c757d",
                            fontWeight: "600",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                            marginBottom: "6px",
                          }}
                        >
                          Tỷ lệ thành công
                        </div>
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background:
                              completionData.successRate >= 70
                                ? "#e8f5e8"
                                : "#fff3e0",
                            color:
                              completionData.successRate >= 70
                                ? "#2e7d32"
                                : "#f57c00",
                            padding: "8px 16px",
                            borderRadius: "8px",
                            fontSize: "20px",
                            fontWeight: "700",
                            border: `2px solid ${
                              completionData.successRate >= 70
                                ? "#c8e6c9"
                                : "#ffcc02"
                            }`,
                          }}
                        >
                          {completionData.successRate}%
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>

                {/* Motivational Message */}
                <div
                  style={{
                    marginTop: "24px",
                    padding: "20px",
                    background:
                      "linear-gradient(135deg, #fff8e1 0%, #ffecb3 100%)",
                    borderRadius: "12px",
                    border: "2px solid #ffc107",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: "28px",
                      marginBottom: "8px",
                    }}
                  >
                    🌟
                  </div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "16px",
                      color: "#e65100",
                      fontWeight: "600",
                      lineHeight: 1.4,
                    }}
                  >
                    Chúc mừng! Bạn đã vượt qua thử thách và chứng minh được ý
                    chí mạnh mẽ.
                    <br />
                    Hãy tiếp tục duy trì lối sống khỏe mạnh này!
                  </p>
                </div>

                {/* Action Button */}
                <div
                  style={{
                    textAlign: "center",
                    marginTop: "32px",
                    paddingTop: "24px",
                    borderTop: "1px solid #e9ecef",
                  }}
                >
                  <Button
                    type="primary"
                    size="large"
                    onClick={() => setIsCompletionModalVisible(false)}
                    style={{
                      background:
                        "linear-gradient(135deg, #4CAF50 0%, #45a049 100%)",
                      border: "none",
                      borderRadius: "25px",
                      height: "50px",
                      padding: "0 40px",
                      fontSize: "16px",
                      fontWeight: "600",
                      boxShadow: "0 4px 16px rgba(76, 175, 80, 0.3)",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = "translateY(-2px)";
                      e.target.style.boxShadow =
                        "0 6px 20px rgba(76, 175, 80, 0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow =
                        "0 4px 16px rgba(76, 175, 80, 0.3)";
                    }}
                  >
                    ✨ Hoàn tất
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </>
  );
};

export default TrackingPage;

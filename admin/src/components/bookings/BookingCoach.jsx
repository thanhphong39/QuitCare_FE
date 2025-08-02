import React, { useEffect, useState, useCallback } from "react";
import { message, notification, DatePicker } from "antd";
import { useNavigate } from "react-router-dom";
import api from "../../configs/axios";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import "./BookingCoach.css";
import { toast } from "react-toastify";

const Booking = () => {
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [coaches, setCoaches] = useState([]);
  const [availableSlots, setAvailableSlots] = useState({});
  const [selectedDates, setSelectedDates] = useState({});
  const [selectedSlots, setSelectedSlots] = useState({});
  const [disabledSlots, setDisabledSlots] = useState(() => {
    const saved = localStorage.getItem("disabledSlots");
    return saved ? JSON.parse(saved) : {};
  });
  const [loadingState, setLoadingState] = useState({}); // loading theo coachId
  const [initialLoad, setInitialLoad] = useState(true);
  const [defaultDatesSet, setDefaultDatesSet] = useState(false);
  const user = useSelector((state) => state.user);
  // const navigate = useNavigate();

  const from = currentMonth.startOf("month").format("YYYY-MM-DD");
  const to = currentMonth.endOf("month").format("YYYY-MM-DD");


  const fetchAvailableSlots = useCallback(
    async (coach) => {
      try {
        const res = await api.get("/session/available-slots", {
          params: { coachId: coach.id, from, to },
        });

        const rawSlots = res.data || [];
        const slotByDate = {};
        rawSlots.forEach((slot) => {
          if (!slotByDate[slot.date]) slotByDate[slot.date] = [];
          slotByDate[slot.date].push({
            label: slot.label,
            available: slot.available,
            start: slot.start,
            end: slot.end,
          });
        });

        setAvailableSlots((prev) => ({ ...prev, [coach.id]: slotByDate }));
        return slotByDate;
      } catch (err) {
        console.error("❌ Lỗi khi lấy slot:", err);
        return {};
      }
    },
    [from, to]
  );

  useEffect(() => {
    const fetchCoaches = async () => {
      if (!user?.role?.includes("CUSTOMER")) {
        toast.warning("Bạn cần nâng cấp gói Premium để đặt lịch tư vấn.");
        return;
      }
      try {
        const res = await api.get("/session/coaches");
        const coachesData = res.data || [];

        setCoaches(coachesData);
        await Promise.all(
          coachesData.map((coach) => fetchAvailableSlots(coach))
        );
        setInitialLoad(false);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách coach:", err);
        message.error("Không thể tải danh sách huấn luyện viên.");
      }
    };

    fetchCoaches();
  }, []);

  useEffect(() => {
    if (initialLoad || defaultDatesSet) return;

    coaches.forEach((coach) => {
      const coachSlots = availableSlots[coach.id] || {};
      const allDates = Object.keys(coachSlots).sort();
      const todayStr = dayjs().format("YYYY-MM-DD");
      let defaultDate = "";

      if (allDates.includes(todayStr)) {
        defaultDate = todayStr;
      } else if (allDates.length > 0) {
        defaultDate = allDates[0];
      }

      if (defaultDate && !selectedDates[coach.id]) {
        setSelectedDates((prev) => ({ ...prev, [coach.id]: defaultDate }));
        setSelectedSlots((prev) => ({ ...prev, [coach.id]: "" }));
      }
    });

    setDefaultDatesSet(true);
  }, [initialLoad, defaultDatesSet, coaches, availableSlots, selectedDates]);

  const handleDateChange = (coachId, value) => {
    setSelectedDates((prev) => ({ ...prev, [coachId]: value }));
    setSelectedSlots((prev) => ({ ...prev, [coachId]: "" }));
  };

  const handleSlotSelect = (coachId, slot) => {
    const slotLabel = typeof slot === "string" ? slot : slot.label;
    const selectedDate = selectedDates[coachId];
    const slotKey = `${coachId}-${selectedDate}-${slotLabel}`;
    if (disabledSlots[slotKey]) return;
    setSelectedSlots((prev) => ({ ...prev, [coachId]: slotLabel }));
  };

  const checkPremiumMembership = async () => {
    if (!user?.id) {
      console.log(" Không có accountId.");
      return false;
    }
  
    try {
      const historyRes = await api.get(
        `/v1/payments/history/account/${user.id}`
      );
      const transactions = historyRes.data || [];
  
      const successTransactions = transactions
        .filter((tx) => tx.status === "SUCCESS" && tx.userMembershipId)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
      if (successTransactions.length === 0) {
        console.log(" Không có giao dịch SUCCESS hợp lệ.");
        return false;
      }
  
      for (const tx of successTransactions) {
        const { userMembershipId } = tx;
  
        try {
          const membershipRes = await api.get(
            `/user-memberships/${userMembershipId}`
          );
          const membershipData = membershipRes.data;
          const { status, planId } = membershipData;
  
          if (status !== "ACTIVE") continue;
  
          const planRes = await api.get(`/membership-plans/${planId}`);
          const plan = planRes.data;
  
          if (plan?.name === "Premium") {
            console.log("✅ Gói Premium đang ACTIVE");
            return true;
          }
        } catch (innerErr) {
          console.warn("Lỗi xử lý userMembership/plan:", innerErr);
          continue;
        }
      }
  
      console.log(" Không tìm thấy gói Premium đang ACTIVE.");
      return false;
    } catch (err) {
      console.error(" Lỗi khi kiểm tra gói hội viên:", err);
      return false;
    }
  };

  const handleBooking = async (coach) => {
    const date = selectedDates[coach.id];
    const slot = selectedSlots[coach.id];
    const slotKey = `${coach.id}-${date}-${slot}`;
  
    // 1. Kiểm tra gói Premium trước
    const hasPremium = await checkPremiumMembership();
    if (!hasPremium) {
      toast.warning("Bạn cần đăng ký gói Premium để đặt lịch.");
      return;
    }
  
    // 2. Kiểm tra ngày và khung giờ
    if (!date || !slot) {
      message.warning("Vui lòng chọn ngày và khung giờ.");
      return;
    }
  
    if (disabledSlots[slotKey]) {
      message.warning("Slot này đã được đặt!");
      return;
    }
  
    // 3. Kiểm tra số lượng lịch PENDING
    try {
      const pendingRes = await api.get("/booking/customer", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
  
      const bookings = pendingRes.data || [];
      const pendingCount = bookings.filter(
        (booking) => booking.status === "PENDING"
      ).length;
  
      if (pendingCount >= 1) {
        toast.warning("Bạn đang có lịch tư vấn đang chờ .");
        return;
      }
    } catch (err) {
      console.error("Lỗi khi kiểm tra lịch pending:", err);
      message.error("Không thể kiểm tra lịch hẹn.");
      return;
    }
  
    // 4. Tiếp tục đặt lịch
    try {
      setLoadingState((prev) => ({ ...prev, [coach.id]: true }));
  
      const res = await api.post("/booking", {
        coachId: coach.id,
        appointmentDate: date,
        start: slot,
      });
      
  if(res.data || res.data.remainingAppointments) {

    const remaining = res.data?.remainingAppointments;
    if (remaining === 0) {
      toast.success("Đặt lịch thành công . Bạn đã sử dụng hết lượt tư vấn!");
    }

      toast.success(
        <div>
          <div>Đặt lịch thành công!</div>
          <div style={{ fontSize: "12px", marginTop: "4px", color: "#52c41a" }}>
            Còn lại:{" "}
            {res.data?.remainingAppointments || remainingAppointments - 1} lượt
            đặt lịch
          </div>
         
        </div>,
        { duration: 5000 }
      );
    }

      const newDisabled = { ...disabledSlots, [slotKey]: true };
      setDisabledSlots(newDisabled);
      localStorage.setItem("disabledSlots", JSON.stringify(newDisabled));
      setSelectedSlots((prev) => ({ ...prev, [coach.id]: "" }));
    } catch (err) {
      if (err.response?.status === 409) {
        toast.error("Lịch này đã được đặt bởi người khác.");
        const newDisabled = { ...disabledSlots, [slotKey]: true };
        setDisabledSlots(newDisabled);
        localStorage.setItem("disabledSlots", JSON.stringify(newDisabled));
      } else if (err.response?.status === 400) {
        toast.error("Bạn chỉ có thể đặt lịch 4 lần. Vui lòng đăng ký gói Premium.");
      } else {
        message.error("Đặt lịch thất bại. Vui lòng thử lại sau.");
      }
    } finally {
      setLoadingState((prev) => ({ ...prev, [coach.id]: false }));
    }
  };
  

  const isSlotDisabled = (coachId, slot, selectedDate) => {
    const slotLabel = typeof slot === "string" ? slot : slot.label;
    const slotKey = `${coachId}-${selectedDate}-${slotLabel}`;
    if (disabledSlots[slotKey]) return true;
    if (typeof slot === "object" && slot.available === false) return true;
    if (selectedDate === dayjs().format("YYYY-MM-DD")) {
      const now = dayjs();
      const slotStartTime = dayjs(`${selectedDate} ${slot.start}`);
      if (slotStartTime.isBefore(now)) return true;
    }
    return false;
  };

  return (
    <div className="booking-bg">
      <h1 className="booking-title">ĐẶT LỊCH TƯ VẤN</h1>
      {coaches.map((coach) => {
        const coachSlots = availableSlots[coach.id] || {};
        const datesWithSlots = Object.entries(coachSlots)
          .filter(([_, slots]) => slots.some((s) => s.available))
          .map(([date]) => date);
        const selectedDate = selectedDates[coach.id] || datesWithSlots[0] || "";
        const slotList = coachSlots[selectedDate] || [];

        return (
          <div className="booking-row" key={coach.id}>
            <div style={{ flex: 1 }}>
              <div className="booking-left">
                <img
                  src={coach.avatar || "/default-avatar.png"}
                  alt={coach.fullName}
                  className="booking-img"
                />

                <div className="booking-info">
                  <div className="booking-brand">QUITCARE</div>
                  <div className="booking-name">{coach.fullName}</div>
                </div>
              </div>
              <div className="booking-desc">{coach.description}</div>
            </div>

            <div className="booking-right">
              <div className="booking-date">
                Chọn ngày:
                <DatePicker
                  value={selectedDate ? dayjs(selectedDate) : null}
                  onChange={(date) =>
                    date &&
                    handleDateChange(coach.id, date.format("YYYY-MM-DD"))
                  }
                  disabledDate={(current) => {
                    const today = dayjs().startOf("day");
                    const currentStr = current.format("YYYY-MM-DD");
                    const validDatesSet = new Set(
                      Object.entries(coachSlots)
                        .filter(([, slots]) => slots.some((s) => s.available))
                        .map(([d]) => d)
                    );
                    return (
                      current.isBefore(today) || !validDatesSet.has(currentStr)
                    );
                  }}
                  format="YYYY-MM-DD"
                  popupClassName="custom-datepicker-popup"
                />
              </div>

              <div className="booking-times">
                {slotList.map((slot, i) => {
                  const slotLabel =
                    typeof slot === "string" ? slot : slot.label;
                  const isDisabled = isSlotDisabled(
                    coach.id,
                    slot,
                    selectedDate
                  );
                  const isSelected = selectedSlots[coach.id] === slotLabel;
                  return (
                    <button
                      key={i}
                      className={`booking-slot ${isSelected ? "active" : ""} ${
                        isDisabled ? "disabled" : ""
                      }`}
                      onClick={() =>
                        !isDisabled && handleSlotSelect(coach.id, slot)
                      }
                      disabled={isDisabled}
                      style={{
                        opacity: isDisabled ? 0.5 : 1,
                        cursor: isDisabled ? "not-allowed" : "pointer",
                        backgroundColor: isDisabled ? "#666" : undefined,
                      }}
                    >
                      {slotLabel}
                      {isDisabled && (
                        <span
                          style={{
                            fontSize: "10px",
                            display: "block",
                            marginTop: "2px",
                            color: "#ff6b6b",
                          }}
                        >
                          Đã đặt
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="booking-actions">
                <button
                  className={`booking-btn booking-btn-primary ${
                    loadingState[coach.id] ? "loading" : ""
                  }`}
                  onClick={() => handleBooking(coach)}
                  disabled={loadingState[coach.id]}
                >
                  {loadingState[coach.id] ? "Đang đặt..." : "Đặt Lịch"}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Booking;

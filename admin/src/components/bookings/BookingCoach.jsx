import React, { useEffect, useState, useCallback, useMemo } from "react";
import { message, notification } from "antd";
import { useNavigate } from "react-router-dom";
import api from "../../configs/axios";
import dayjs from "dayjs";
import { DatePicker } from "antd";
import { useSelector } from "react-redux";
import "./BookingCoach.css";
import { toast } from "react-toastify";

const Booking = () => {
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [coaches, setCoaches] = useState([]);
  const [availableSlots, setAvailableSlots] = useState({}); // key: coachId, value: list of slots
  const [selectedDates, setSelectedDates] = useState({});
  const [selectedSlots, setSelectedSlots] = useState({});
  const [disabledSlots, setDisabledSlots] = useState(() => {
    // Load disabled slots from localStorage
    const saved = localStorage.getItem("disabledSlots");
    return saved ? JSON.parse(saved) : {};
  }); // Track disabled slots per coach
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true); // Track initial load only
  const [defaultDatesSet, setDefaultDatesSet] = useState(false); // Track if default dates are set
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  const from = currentMonth.startOf("month").format("YYYY-MM-DD");
  const to = currentMonth.endOf("month").format("YYYY-MM-DD");

  // Load slot theo coach
  const fetchAvailableSlots = useCallback(
    async (coach) => {
      console.log("Đang fetch slot cho", coach.fullName);
      try {
        const res = await api.get("/session/available-slots", {
          params: {
            coachId: coach.id,
            from,
            to,
          },
        });

        // Format lại slot thành object theo từng ngày
        const rawSlots = res.data || [];
        const slotByDate = {};

        rawSlots.forEach((slot) => {
          // Lưu tất cả slot (cả available và unavailable)
          if (!slotByDate[slot.date]) {
            slotByDate[slot.date] = [];
          }
          slotByDate[slot.date].push({
            label: slot.label,
            available: slot.available,
            start: slot.start,
            end: slot.end,
          });
        });

        // Lưu vào state - sử dụng callback để tránh race condition
        setAvailableSlots((prev) => ({
          ...prev,
          [coach.id]: slotByDate,
        }));

        console.log("✅ Slot của", coach.fullName, ":", slotByDate);
        return slotByDate; // Return để có thể await
      } catch (err) {
        console.error("❌ Lỗi khi lấy slot của", coach.fullName, ":", err);
        return {};
      }
    },
    [from, to]
  ); // Only re-create when from/to changes

  // Load danh sách coach (chỉ chạy 1 lần)
  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const res = await api.get("/session/coaches");
        const coachesData = res.data || [];

        const descriptions = [
          "Huấn luyện viên tận tâm với kiến thức sâu rộng về hành vi nghiện và kỹ thuật cai thuốc hiệu quả.",
          "Chuyên gia đồng hành cùng bạn vượt qua quá trình cai thuốc bằng phương pháp cá nhân hóa và động lực tích cực.",
          "Giàu kinh nghiệm tư vấn cai nghiện nicotine với lộ trình phù hợp từng cá nhân và cam kết theo sát tiến trình của bạn.",
        ];

        const avatarMap = {
          1: "https://htmediagroup.vn/wp-content/uploads/2023/03/Anh-bac-si-nam-4-min.jpg",
          2: "https://suckhoedoisong.qltns.mediacdn.vn/324455921873985536/2023/12/25/1-17035025379211648167770.png",
          7: "https://hoanghamobile.com/tin-tuc/wp-content/uploads/2024/06/anh-bac-si-27.jpg",
        };

        const updatedCoaches = coachesData.map((coach, index) => ({
          ...coach,
          description: descriptions[index % descriptions.length], // Mỗi coach 1 description khác nhau
          fixedAvatar: avatarMap[coach.id] || "/default-avatar.png",
        }));

        setCoaches(updatedCoaches);

        const slotPromises = updatedCoaches.map((coach) =>
          fetchAvailableSlots(coach)
        );
        await Promise.all(slotPromises);

        setInitialLoad(false);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách coach:", err);
        message.error("Không thể tải danh sách huấn luyện viên.");
      }
    };

    fetchCoaches();
  }, []);

  // Set default dates (chỉ chạy sau khi initial load hoàn tất)
  // Set default dates (ưu tiên hôm nay nếu có slot)
  useEffect(() => {
    if (initialLoad || defaultDatesSet) return;

    const currentCoaches = coaches;
    const currentAvailableSlots = availableSlots;
    const currentSelectedDates = selectedDates;
    const todayStr = dayjs().format("YYYY-MM-DD");

    currentCoaches.forEach((coach) => {
      const coachSlots = currentAvailableSlots[coach.id] || {};
      const allDates = Object.keys(coachSlots).sort(); // đảm bảo đúng thứ tự

      let defaultDate = "";

      // Ưu tiên chọn hôm nay nếu có slot
      if (allDates.includes(todayStr)) {
        defaultDate = todayStr;
      } else if (allDates.length > 0) {
        defaultDate = allDates[0];
      }

      // Gán ngày mặc định nếu chưa có
      if (defaultDate && !currentSelectedDates[coach.id]) {
        setSelectedDates((prev) => ({ ...prev, [coach.id]: defaultDate }));
        setSelectedSlots((prev) => ({ ...prev, [coach.id]: "" }));
      }
    });

    setDefaultDatesSet(true);
  }, [initialLoad]);

  const handleDateChange = (coachId, value) => {
    setSelectedDates((prev) => ({
      ...prev,
      [coachId]: value,
    }));
    setSelectedSlots((prev) => ({
      ...prev,
      [coachId]: "",
    }));
  };

  const handleSlotSelect = (coachId, slot) => {
    const slotLabel = typeof slot === "string" ? slot : slot.label;
    const selectedDate = selectedDates[coachId];
    const slotKey = `${coachId}-${selectedDate}-${slotLabel}`;

    // Kiểm tra slot có bị disabled không
    if (disabledSlots[slotKey]) {
      return; // Không cho chọn slot đã disabled
    }

    setSelectedSlots((prev) => ({
      ...prev,
      [coachId]: slotLabel,
    }));
  };

  const handleBooking = async (coach, coachName) => {
    const date = selectedDates[coach.id];
    const slot = selectedSlots[coach.id];

    console.log("✅ Booking data:", { coachId: coach.id, date, slot });

    if (!date || !slot) {
      message.warning("Vui lòng chọn ngày và khung giờ.");
      return;
    }

    const slotKey = `${coach.id}-${date}-${slot}`;

    // Ngăn không cho đặt lịch nếu slot đã disabled
    if (disabledSlots[slotKey]) {
      message.warning("Slot này đã được đặt!");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/booking", {
        coachId: coach.id,
        appointmentDate:
          typeof date === "string" ? date : dayjs(date).format("YYYY-MM-DD"),
        start: slot,
      });
      toast.success(
        <div>
          <div> Đặt lịch thành công!</div>
          
          <button
            onClick={() => navigate("/viewadvise")}
            style={{
              marginTop: 8,
              backgroundColor: "#1890ff",
              color: "#fff",
              border: "none",
              padding: "5px 10px",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            Xem Lịch Tư Vấn
          </button>
        </div>,
        {
          duration:7000,
        }
      );
      console.log("Booking response:", res.data);
     
      console.log("✅ Hiển thị thông báo đặt lịch thành công");
      // Disable slot đã đặt - KHÔNG fetch lại slots
      const newDisabledSlots = {
        ...disabledSlots,
        [slotKey]: true,
      };
      setDisabledSlots(newDisabledSlots);

      // Save to localStorage
      localStorage.setItem("disabledSlots", JSON.stringify(newDisabledSlots));

      // Clear selection nhưng KHÔNG fetch lại slots
      setSelectedSlots((prev) => ({
        ...prev,
        [coach.id]: "",
      }));

      // // Redirect after 1.5 seconds
      // setTimeout(() => navigate("/viewadvise"), 1500);
    } catch (err) {
      console.log(err.response?.data);
      console.error("Lỗi đặt lịch:", err);

      if (err.response?.status === 400) {
        message.error(
          "❌ Dữ liệu đặt lịch không hợp lệ. Vui lòng kiểm tra lại."
        );
      } else if (err.response?.status === 409) {
        message.error("❌ Lịch này đã được đặt bởi người khác.");
        // Disable slot nếu đã được đặt - KHÔNG fetch lại slots
        const newDisabledSlots = {
          ...disabledSlots,
          [slotKey]: true,
        };
        setDisabledSlots(newDisabledSlots);

        // Save to localStorage
        localStorage.setItem("disabledSlots", JSON.stringify(newDisabledSlots));
      } else {
        message.error("❌ Đặt lịch thất bại. Vui lòng thử lại sau.");
      }
    } finally {
      setLoading(false);
    }
  };

  const isSlotDisabled = (coachId, slot, selectedDate) => {
    const slotLabel = typeof slot === "string" ? slot : slot.label;
    const slotKey = `${coachId}-${selectedDate}-${slotLabel}`;
  
    // Bị đánh dấu đã đặt
    if (disabledSlots[slotKey]) return true;
  
    // Không có available từ server
    if (typeof slot === "object" && slot.available === false) return true;
  
    // Nếu là hôm nay và slot đã trôi qua giờ hiện tại
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
  .filter(([date, slots]) => slots.some((s) => s.available)) // chỉ giữ ngày có slot khả dụng
  .map(([date]) => date);
        const selectedDate = selectedDates[coach.id] || datesWithSlots[0] || "";
        const slotList = coachSlots[selectedDate] || [];

        return (
          <div className="booking-row" key={coach.id}>
            <div style={{ flex: 1 }}>
              <div className="booking-left">
                <img
                  src={
                    coach.fixedAvatar || coach.avatar || "/default-avatar.png"
                  }
                  alt={coach.fullName}
                  className="booking-img"
                />
                <div className="booking-info">
                  <div className="booking-brand">QUITCARE</div>
                  <div className="booking-name">{coach.fullName}</div>
                  {/* <div className="booking-hotline">Email: {coach.email}</div> */}
                </div>
              </div>
              <div className="booking-desc">{coach.description}</div>
            </div>

            <div className="booking-right">
              <div className="booking-date">
                Chọn ngày:
                <DatePicker
  value={selectedDate ? dayjs(selectedDate) : null}
  onChange={(date) => {
    if (date)
      handleDateChange(coach.id, date.format("YYYY-MM-DD"));
  }}
  disabledDate={(current) => {
    const today = dayjs().startOf("day");
    const currentStr = current.format("YYYY-MM-DD");

    // Lấy các ngày có ít nhất 1 slot available
    const validDatesSet = new Set(
      Object.entries(coachSlots)
        .filter(([, slots]) => slots.some((s) => s.available))
        .map(([d]) => d)
    );

    // Disable nếu: ngày nằm trước hôm nay OR không nằm trong validDatesSet
    return current.isBefore(today) || !validDatesSet.has(currentStr);
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
                      loading ? "loading" : ""
                    }`}
                    style={{ width: "120%" }}
                    onClick={() => handleBooking(coach, coach.fullName)}
                    disabled={loading}
                  >
                    {loading ? "Đang đặt..." : "Đặt Lịch"}
                  </button>
                {/* <button
                  className="booking-btn booking-btn-secondary"
                  onClick={() => navigate("/viewadvise")}
                >
                  Xem Lịch Tư Vấn
                </button> */}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Booking;

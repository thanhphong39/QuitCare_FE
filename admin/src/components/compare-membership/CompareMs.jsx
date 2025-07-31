import React, { useEffect, useState } from "react";
import "./Compare.css";
import api from "../../configs/axios";
import { message } from "antd";

function MemberComparison() {
  const [plans, setPlans] = useState([]);
  useEffect(() => {
    async function fetchPlans() {
      try {
        const res = await api.get("/auth/api/membership-plans");
        setPlans(res.data);
      } catch (err) {
        message.error("Lỗi khi lấy danh sách gói hội viên. Vui lòng thử lại sau.");
        setPlans([]);
      }
    }
    fetchPlans();
  }, []);

  const basic =
  (Array.isArray(plans) &&
    plans.find((p) => p.name?.toLowerCase().includes("basic"))) ||
  (Array.isArray(plans) ? plans[0] : null);

const premium =
  (Array.isArray(plans) &&
    plans.find((p) => p.name?.toLowerCase().includes("premium"))) ||
  (Array.isArray(plans) ? plans[1] : null);
  console.log("Plans nhận được:", plans);
  console.log("Loại:", typeof plans);
  console.log("Có phải mảng không:", Array.isArray(plans));
  return (
    <div className="compare-container">
      <div className="compare-content">
        <h1 className="compare-title">So sánh quyền lợi hội viên</h1>
        <p
          style={{
            textAlign: "center",
            fontSize: "18px",
            marginBottom: "2rem",
          }}
        >
          Chọn gói thành viên phù hợp với bạn để bắt đầu hành trình cai thuốc
          hiệu quả và cá nhân hoá.
        </p>

        <div className="benefit-table">
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Phúc lợi</th>
                <th>{basic ? basic.name : "Basic"}</th>
                <th>{premium ? premium.name : "Premium"}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Quản lý kế hoạch cai thuốc cá nhân</td>
                <td>✅</td>
                <td>✅</td>
              </tr>
              <tr>
                <td>Thống kê tiến độ và nhắc nhở hằng ngày</td>
                <td>✅</td>
                <td>✅</td>
              </tr>
              <tr>
                <td>Tham gia cộng đồng người cai thuốc</td>
                <td>✅</td>
                <td>✅</td>
              </tr>
              <tr>
                <td>Cuộc gọi tư vấn định kỳ với huấn luyện viên</td>
                <td>❌</td>
                <td>✅ (4 lần/tháng)</td>
              </tr>
              <tr>
                <td>Chi phí</td>
                <td>
                  {basic ? basic.price.toLocaleString("vi-VN") + " VND" : "-"}
                </td>
                <td>
                  {premium
                    ? premium.price.toLocaleString("vi-VN") + " VND"
                    : "-"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default MemberComparison;

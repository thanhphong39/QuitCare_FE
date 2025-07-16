import React from "react";
import "./Compare.css";

function MemberComparison() {
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
                <th>Basic</th>
                <th>Premium</th>
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
                <td>Hỗ trợ từ chuyên gia qua tin nhắn</td>
                <td>❌</td>
                <td>✅</td>
              </tr>
              <tr>
                <td>Cuộc gọi tư vấn định kỳ với huấn luyện viên</td>
                <td>❌</td>
                <td>✅ (4 lần/tháng)</td>
              </tr>
              <tr>
                <td>Chi phí</td>
                <td>99.000 VND</td>
                <td>499.000 VND</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default MemberComparison;

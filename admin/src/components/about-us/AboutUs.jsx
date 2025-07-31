import React from "react";
import "./AboutUs.css";
import { Link, useNavigate } from "react-router-dom";
import CrossBanner from "../fitnessTape/CrossBanner";
import aboutVideo1 from "../../../public/videos/blog1.mp4";
import aboutVideo2 from "../../../public/videos/blog2.mp4";

function AboutUs() {
  const navigate = useNavigate();
  return (
    <>
      <div className="aboutus-container">
        <div className="aboutus-content">
          <div className="aboutus-text">
            <h1 className="aboutus-title">QUITCARE</h1>
            <h2 className="aboutus-subtitle">
              KHƠI NGUỒN SỨC KHỎE - VỮNG BƯỚC TƯƠNG LAI
            </h2>

            <div className="aboutus-highlight">
              <p>
                <strong>
                  <em>
                    Tạm biệt thuốc lá
                    <br />
                    chào đón
                    <br />
                    cuộc sống mới
                  </em>
                </strong>
              </p>
            </div>

            <p>
              Tại QUITCARE, bạn sẽ được trải nghiệm không gian hiện đại và đầy
              cảm hứng, nơi mỗi buổi tập không chỉ nâng cao thể lực mà còn cải
              thiện tinh thần.
            </p>

            <p>
              Dù bạn là người mới bắt đầu hay đã có chút kinh nghiệm, sự thay
              đổi mà bạn khao khát chỉ chờ đợi sự quyết tâm và nỗ lực từ bạn.
            </p>

            <p>
              <span role="img" aria-label="star">
                ⭐
              </span>{" "}
              Hãy bắt đầu hành trình chinh phục vóc dáng ngay hôm nay!
            </p>
            <Link to="/blog">
              <button className="aboutus-button">Tìm hiểu thêm</button>
            </Link>
          </div>

          <div className="aboutus-image">
            <video
              src={aboutVideo1}
              autoPlay
              loop
              muted
              playsInline
              className="aboutus-video"
              style={{
                width: "100%",
                borderRadius: "18px",
                objectFit: "cover",
              }}
            />
          </div>

          <div className="aboutus-section">
            <div className="aboutus-text">
              <div className="aboutus-highlight">
                <p>
                  Hành trình cá nhân hoá
                  <br />
                  Mỗi người một lộ trình riêng
                </p>
              </div>
              <p>
                Tại Quitcare, chúng tôi hiểu rằng mỗi người đều có câu chuyện,
                thói quen và thử thách riêng khi đối mặt với việc cai thuốc.
              </p>
              <p>
                Vì vậy, bạn sẽ được xây dựng một lộ trình cá nhân hoá, phù hợp
                với tình trạng sức khoẻ, lịch trình sinh hoạt và động lực cá
                nhân.
              </p>
              <p>
                Từ các buổi tư vấn trực tiếp, các bài tập rèn luyện tinh thần
                đến các thông báo nhắc nhở, mọi trải nghiệm tại Quitcare đều
                được thiết kế riêng cho bạn.
              </p>
              <p>
                <span role="img" aria-label="target">
                  👉
                </span>{" "}
                Cùng khám phá hành trình dành riêng cho bạn hôm nay!
              </p>
              <Link to="/blog">
                <button className="aboutus-button">Tìm hiểu thêm</button>
              </Link>
            </div>
            <div className="aboutus-image">
              <video
                src={aboutVideo2}
                autoPlay
                loop
                muted
                playsInline
                className="aboutus-video"
                style={{
                  width: "100%",
                  borderRadius: "18px",
                  objectFit: "cover",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="cross-banner-wrapper">
        <CrossBanner />
      </div>
      <div className="experience-section">
        <div className="experience-content">
          <div className="experience-text">
            <h2 className="experience-title">Trải nghiệm cùng chuyên gia 💬</h2>
            <p className="experience-description">
              Khám phá toàn bộ dịch vụ tại QuitCare với gói thành viên ưu đãi
              đặc biệt. Trong thời gian này, bạn sẽ có cơ hội:
            </p>
            <ul className="experience-list">
              <li>Trải nghiệm mọi tính năng cao cấp</li>
              <li>Đồng hành cùng chuyên gia tư vấn cai thuốc chuyên nghiệp</li>
              <li>Nhận sự hỗ trợ cá nhân hoá cho hành trình của riêng bạn</li>
            </ul>
            <p className="experience-callout">
              👉 Đừng bỏ lỡ cơ hội cải thiện sức khoẻ và thay đổi cuộc sống ngay
              hôm nay!
            </p>
          </div>

          <div className="experience-form">
            <input type="text" placeholder="Họ và tên" className="form-input" />
            <input type="email" placeholder="Email" className="form-input" />
            <input
              type="text"
              placeholder="Tình trạng hiện tại của bạn"
              className="form-input"
            />
            <button
              onClick={() => navigate("/booking")}
              className="form-button"
            >
              ĐẶT LỊCH NGAY
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default AboutUs;

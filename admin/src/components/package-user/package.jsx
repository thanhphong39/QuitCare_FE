import React, { useEffect, useState } from "react";
import "./package.css";
import freeCard from "../../assets/images/pack2.png";
import premiumCard from "../../assets/images/pack1.png";
import api from "../../configs/axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Package = () => {
  const [packages, setPackages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await api.get("/membership-plans");
        const allPlans = res.data;
  
        if (!Array.isArray(allPlans) || allPlans.length === 0) {
          console.warn("Không có gói hội viên nào");
          return;
        }
  
        // Bước 1: Sắp xếp theo ID giảm dần
        const sortedById = [...allPlans].sort((a, b) => b.id - a.id);
  
        // Bước 2: Lấy 2 phần tử đầu tiên có ID cao nhất
        const top2Plans = sortedById.slice(0, 2);
  
        // Bước 3: Tạo danh sách hiển thị với hình ảnh
        const packageList = top2Plans.map((plan) => {
          return {
            ...plan,
            image: plan.name.toLowerCase() === "basic" ? freeCard : premiumCard,
          };
        });
  
        setPackages(packageList);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách gói hội viên:", error);
      }
    };
  
    fetchPackages();
  }, []);

  return (
    <div className="package-section">
      <h2 className="title">
        Đặc Quyền <br /> Hội Viên
      </h2>
      <p className="desc">
        Chúng tôi cung cấp các gói hỗ trợ linh hoạt, phù hợp với nhu cầu của
        từng cá nhân trong hành trình cai thuốc. Bạn có thể lựa chọn nâng cấp
        gói sử dụng để được tư vấn sớm từ các chuyên gia.
        <br />
        Ngoài ra, chúng tôi thường xuyên triển khai các chương trình ưu đãi cho
        người dùng đăng ký sớm, người dùng quay lại, hoặc nhóm bạn đồng hành,
        giúp bạn tiết kiệm chi phí và tăng hiệu quả cai thuốc lâu dài.
      </p>

      <div className="card-wrapper">
        {packages.map((pkg) => (
          <div className="card" key={pkg.id}>
            <img src={pkg.image} alt={pkg.name} className="card-img" />
            <div className="info">
              <h3
                className={`package-name ${
                  pkg.price === 0 ? "basic" : "premium"
                }`}
              >
                {pkg.name.toUpperCase()}
              </h3>
              <p className="price">{`${pkg.price.toLocaleString()} VND`}</p>
              <p className="benefit">{pkg.description}</p>
              <button
                className={`btn ${
                  pkg.name.toLowerCase() === "basic"
                    ? "btn-basic"
                    : "btn-premium"
                }`}
                onClick={() => {
                  if (pkg.name.toLowerCase() === "basic") {
                    Swal.fire({
                      title: "Bạn đang chọn gói Basic ",
                      text: `Gói ${pkg.name.toUpperCase()}  sẽ có chức năng hạn chế. 
Chúng tôi khuyến khích bạn nâng cấp lên gói PREMIUM để được hỗ trợ tư vấn sớm từ chuyên gia.`,
                      icon: "info",
                      showCancelButton: true,
                      confirmButtonText: "Vẫn chọn gói BASIC",
                      cancelButtonText: "Xem gói PREMIUM",
                    }).then((result) => {
                      if (result.isConfirmed) {
                        navigate(`/payment?membershipPlanId=${pkg.id}`);
                      } else {
                        // Chuyển hướng sang gói Premium nếu người dùng muốn xem
                        const premium = packages.find(
                          (p) => p.name.toLowerCase() === "premium"
                        );
                        if (premium) {
                          navigate(`/payment?membershipPlanId=${premium.id}`);
                        }
                      }
                    });
                  } else {
                    Swal.fire({
                      title: "Xác nhận mua gói PREMIUM?",
                      text: `Bạn có chắc chắn muốn mua gói ${pkg.name.toUpperCase()} với giá ${pkg.price.toLocaleString()} VND không?`,
                      icon: "question",
                      showCancelButton: true,
                      confirmButtonText: "Xác nhận",
                      cancelButtonText: "Hủy",
                    }).then((result) => {
                      if (result.isConfirmed) {
                        navigate(`/payment?membershipPlanId=${pkg.id}`);
                      }
                    });
                  }
                }}
              >
                Mua gói
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Package;

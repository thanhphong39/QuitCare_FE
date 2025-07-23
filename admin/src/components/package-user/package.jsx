import React, { useEffect, useState, useContext } from "react";
import "./package.css";
import freeCard from "../../assets/images/pack2.png";
import premiumCard from "../../assets/images/pack1.png";
import api from "../../configs/axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
// Giả sử bạn có context để lấy user
import { useSelector } from "react-redux";

const Package = () => {
  const [packages, setPackages] = useState([]);
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await api.get("/auth/api/membership-plans");
        const allPlans = res.data;

        if (!Array.isArray(allPlans) || allPlans.length === 0) {
          console.warn("Không có gói hội viên nào");
          return;
        }

        const sortedById = [...allPlans].sort((a, b) => b.id - a.id);
        const top2Plans = sortedById.slice(0, 2);

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

  const handleBuyPackage = async (pkg) => {
    if (!user?.id) {
      Swal.fire("Chưa đăng nhập", "Vui lòng đăng nhập trước khi mua gói.", "warning");
      return;
    }
  
    try {
      const res = await api.get(`/v1/payments/history/account/${user.id}`);
      const transactions = res.data || [];
  
      const activeTransaction = transactions
        .filter((tx) => tx.status === "SUCCESS" && tx.userMembershipId)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
      for (const tx of activeTransaction) {
        const membershipRes = await api.get(`/user-memberships/${tx.userMembershipId}`);
        const membership = membershipRes.data;
  
        if (membership.status !== "ACTIVE") continue;
  
        const planRes = await api.get(`/membership-plans/${membership.planId}`);
        const currentPlan = planRes.data;
  
        const currentPlanName = currentPlan.name.toLowerCase();
        const selectedPlanName = pkg.name.toLowerCase();
  
        // ❌ Nếu đã có cùng gói
        if (currentPlan.id === pkg.id) {
          await Swal.fire({
            title: "Gói đã hoạt động",
            text: `Bạn đang sử dụng gói ${currentPlan.name}. Không cần mua lại.`,
            icon: "info",
            confirmButtonText: "Đã hiểu",
          });
          return;
        }
  
        // ❌ Nếu đang dùng Premium mà muốn mua Basic
        if (currentPlanName === "premium" && selectedPlanName === "basic") {
          await Swal.fire({
            title: "Không thể mua gói Basic",
            text: `Bạn đang sử dụng gói Premium, cao hơn gói Basic. Không thể hạ cấp.`,
            icon: "warning",
            confirmButtonText: "OK",
          });
          return;
        }
  
        // ✅ Nếu người dùng đang dùng Basic mà muốn mua Premium → cho phép
        break;
      }
  
      // ✅ Cho phép mua
      navigate(`/payment?membershipPlanId=${pkg.id}`);
    } catch (error) {
      console.error("❌ Lỗi khi kiểm tra gói đang hoạt động:", error);
      Swal.fire("Lỗi", "Không thể kiểm tra thông tin hội viên hiện tại.", "error");
    }
  };

  return (
    <div className="package-section">
      <h2 className="title">
        Đặc Quyền <br /> Hội Viên
      </h2>
      <p className="desc">
        Chúng tôi cung cấp các gói hỗ trợ linh hoạt, phù hợp với nhu cầu của từng cá nhân...
      </p>

      <div className="card-wrapper">
        {packages.map((pkg) => (
          <div className="card" key={pkg.id}>
            <img src={pkg.image} alt={pkg.name} className="card-img" />
            <div className="info">
              <h3 className={`package-name ${pkg.price === 0 ? "basic" : "premium"}`}>
                {pkg.name.toUpperCase()}
              </h3>
              <p className="price">{`${pkg.price.toLocaleString()} VND`}</p>
              <p className="benefit">{pkg.description}</p>
              <button
                className={`btn ${
                  pkg.name.toLowerCase() === "basic" ? "btn-basic" : "btn-premium"
                }`}
                onClick={() => handleBuyPackage(pkg)}
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

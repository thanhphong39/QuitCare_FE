// import React, { useState } from "react";
// import {
//   Card,
//   Input,
//   Button,
//   Select,
//   message,
//   Typography,
//   Row,
//   Col,
//   Avatar,
//   Space,
// } from "antd";
// import { UserOutlined, EditOutlined, SaveOutlined } from "@ant-design/icons";
// import { useDispatch, useSelector } from "react-redux";
// import Footer from "../footer/Footer";
// import Navbar from "../navbar/Navbar";
// import api from "../../configs/axios";
// import { login } from "../../redux/features/userSlice";
// import "./profile.css";
// import { toast } from "react-toastify";

// const { Title, Text } = Typography;
// const { Option } = Select;

// const Profile = () => {
//   const user = useSelector((state) => state.user);
//   const dispatch = useDispatch();

//   // State for profile editing
//   const [isEditing, setIsEditing] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [form, setForm] = useState({
//     fullname: user?.fullName || "",
//     gender: user?.gender || "MALE",
//   });

//   const handleChange = (field, value) => {
//     setForm({ ...form, [field]: value });
//   };

//   const handleSubmit = async () => {
//     setLoading(true);
//     try {
//       const response = await api.put(`user/${user.id}`, {
//         fullname: form.fullname,
//         gender: form.gender,
//       });

//       // dispatch(
//       //   login({
//       //     ...response.data,
//       //     avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
//       //       response.data.fullname
//       //     )}&background=4f46e5&color=ffffff&size=128&rounded=true`,
//       //   })
//       // );

//       toast.success("Cập nhật thông tin thành công!");
//       setIsEditing(false);
//     } catch (error) {
//       console.error("Lỗi khi cập nhật:", error);
//       toast.error("Cập nhật thất bại!");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const renderPersonalInfo = () => (
//     <Card className="profile-info-card" title="Thông tin cá nhân">
//       <Row gutter={[24, 24]}>
//         <Col xs={24} md={8}>
//           <div className="avatar-section">
//             <Avatar
//               size={120}
//               src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
//                 form.fullname || "User"
//               )}&background=4f46e5&color=ffffff&size=120&rounded=true`}
//               className="profile-avatar"
//             />
//             {/* <div className="avatar-info">
//               <Title level={4} className="mb-1">
//                 {user?.fullName || "Người dùng"}
//               </Title>
//               <Text type="secondary">{user?.email}</Text>
//             </div> */}
//           </div>
//         </Col>

//         <Col xs={24} md={16}>
//           <div className="info-form">
//             <Row gutter={[16, 16]}>
//               <Col xs={24} sm={12}>
//                 <div className="form-group">
//                   <label className="form-label">Email</label>
//                   <Input
//                     value={user?.email || ""}
//                     disabled
//                     className="readonly-input"
//                     prefix={<UserOutlined />}
//                   />
//                 </div>
//               </Col>

//               <Col xs={24} sm={12}>
//                 <div className="form-group">
//                   <label className="form-label">Tên đăng nhập</label>
//                   <Input
//                     value={user?.username || ""}
//                     disabled
//                     className="readonly-input"
//                     prefix={<UserOutlined />}
//                   />
//                 </div>
//               </Col>

//               <Col xs={24} sm={12}>
//                 <div className="form-group">
//                   <label className="form-label">Tên đầy đủ</label>
//                   <Input
//                     value={form.fullname}
//                     onChange={(e) => handleChange("fullname", e.target.value)}
//                     disabled={!isEditing}
//                     className={isEditing ? "editable-input" : "readonly-input"}
//                     placeholder="Nhập tên đầy đủ"
//                   />
//                 </div>
//               </Col>

//               <Col xs={24} sm={12}>
//                 <div className="form-group">
//                   <label className="form-label">Giới tính</label>
//                   <Select
//                     value={form.gender}
//                     onChange={(value) => handleChange("gender", value)}
//                     disabled={!isEditing}
//                     className={
//                       isEditing ? "editable-select" : "readonly-select"
//                     }
//                   >
//                     <Option value="MALE">Nam</Option>
//                     <Option value="FEMALE">Nữ</Option>
//                     <Option value="OTHER">Khác</Option>
//                   </Select>
//                 </div>
//               </Col>
//             </Row>

//             <div className="action-buttons">
//               {!isEditing ? (
//                 <Button
//                   type="primary"
//                   icon={<EditOutlined />}
//                   onClick={() => setIsEditing(true)}
//                   className="edit-btn"
//                 >
//                   Chỉnh sửa
//                 </Button>
//               ) : (
//                 <Space>
//                   <Button
//                     onClick={() => {
//                       setForm({
//                         fullname: user?.fullName || "",
//                         gender: user?.gender || "MALE",
//                       });
//                       setIsEditing(false);
//                     }}
//                   >
//                     Hủy
//                   </Button>
//                   <Button
//                     type="primary"
//                     icon={<SaveOutlined />}
//                     loading={loading}
//                     onClick={handleSubmit}
//                     className="save-btn"
//                   >
//                     Lưu thay đổi
//                   </Button>
//                 </Space>
//               )}
//             </div>
//           </div>
//         </Col>
//       </Row>
//     </Card>
//   );

//   return (
//     <>
//       <Navbar />
//       <div className="profile-page">
//         <div className="profile-container">
//           {/* Page Header */}
//           <div className="page-header">
//             <Title level={2} className="page-title">
//               <UserOutlined className="title-icon" />
//               Hồ sơ cá nhân
//             </Title>
//             <Text type="secondary" className="page-subtitle">
//               Quản lý thông tin cá nhân
//             </Text>
//           </div>

//           {/* Personal Information */}
//           <div className="personal-info-section">{renderPersonalInfo()}</div>
//         </div>
//       </div>

//       <Footer />
//     </>
//   );
// };

// export default Profile;


import React, { useState, useEffect } from "react";
import {
  Card,
  Input,
  Button,
  Select,
  Typography,
  Row,
  Col,
  Avatar,
  Space,
} from "antd";
import { UserOutlined, EditOutlined, SaveOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import Footer from "../footer/Footer";
import Navbar from "../navbar/Navbar";
import api from "../../configs/axios";
import { login } from "../../redux/features/userSlice";
import "./profile.css";
import { toast } from "react-toastify";

const { Title, Text } = Typography;
const { Option } = Select;

const Profile = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullname: "",
    gender: "MALE",
  });

  // 🧩 Lấy thông tin người dùng từ API sau khi login
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await api.get("/api/auth/oauth2/profile");

        const userData = {
          ...res.data,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
            res.data.fullName || "User"
          )}&background=4f46e5&color=ffffff&size=128&rounded=true`,
        };

        dispatch(login(userData)); // Cập nhật Redux store
        setForm({
          fullname: userData.fullName,
          gender: userData.gender,
        });
      } catch (err) {
        console.error("Lỗi lấy thông tin người dùng:", err);
        toast.error("Không thể tải thông tin người dùng!");
      }
    };

    if (!user?.email) {
      fetchUserProfile();
    } else {
      setForm({
        fullname: user.fullName,
        gender: user.gender,
      });
    }
  }, [dispatch, user]);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await api.put(`user/${user.id}`, {
        fullname: form.fullname,
        gender: form.gender,
      });

      const updatedUser = {
        ...response.data,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
          response.data.fullname
        )}&background=4f46e5&color=ffffff&size=128&rounded=true`,
      };

      dispatch(login(updatedUser)); // Cập nhật lại Redux store
      toast.success("Cập nhật thông tin thành công!");
      setIsEditing(false);
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
      toast.error("Cập nhật thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const renderPersonalInfo = () => (
    <Card className="profile-info-card" title="Thông tin cá nhân">
      <Row gutter={[24, 24]}>
        <Col xs={24} md={8}>
          <div className="avatar-section">
            <Avatar size={120} src={user?.avatar} className="profile-avatar" />
          </div>
        </Col>

        <Col xs={24} md={16}>
          <div className="info-form">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <Input
                    value={user?.email || ""}
                    disabled
                    className="readonly-input"
                    prefix={<UserOutlined />}
                  />
                </div>
              </Col>

              <Col xs={24} sm={12}>
                <div className="form-group">
                  <label className="form-label">Tên đăng nhập</label>
                  <Input
                    value={user?.username || ""}
                    disabled
                    className="readonly-input"
                    prefix={<UserOutlined />}
                  />
                </div>
              </Col>

              <Col xs={24} sm={12}>
                <div className="form-group">
                  <label className="form-label">Tên đầy đủ</label>
                  <Input
                    value={form.fullname}
                    onChange={(e) => handleChange("fullname", e.target.value)}
                    disabled={!isEditing}
                    className={isEditing ? "editable-input" : "readonly-input"}
                    placeholder="Nhập tên đầy đủ"
                  />
                </div>
              </Col>

              <Col xs={24} sm={12}>
                <div className="form-group">
                  <label className="form-label">Giới tính</label>
                  <Select
                    value={form.gender}
                    onChange={(value) => handleChange("gender", value)}
                    disabled={!isEditing}
                    className={
                      isEditing ? "editable-select" : "readonly-select"
                    }
                  >
                    <Option value="MALE">Nam</Option>
                    <Option value="FEMALE">Nữ</Option>
                    <Option value="OTHER">Khác</Option>
                  </Select>
                </div>
              </Col>
            </Row>

            <div className="action-buttons">
              {!isEditing ? (
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() => setIsEditing(true)}
                  className="edit-btn"
                >
                  Chỉnh sửa
                </Button>
              ) : (
                <Space>
                  <Button
                    onClick={() => {
                      setForm({
                        fullname: user?.fullName || "",
                        gender: user?.gender || "MALE",
                      });
                      setIsEditing(false);
                    }}
                  >
                    Hủy
                  </Button>
                  <Button
                    type="primary"
                    icon={<SaveOutlined />}
                    loading={loading}
                    onClick={handleSubmit}
                    className="save-btn"
                  >
                    Lưu thay đổi
                  </Button>
                </Space>
              )}
            </div>
          </div>
        </Col>
      </Row>
    </Card>
  );

  return (
    <>
      <Navbar />
      <div className="profile-page">
        <div className="profile-container">
          <div className="page-header">
            <Title level={2} className="page-title">
              <UserOutlined className="title-icon" />
              Hồ sơ cá nhân
            </Title>
            <Text type="secondary" className="page-subtitle">
              Quản lý thông tin cá nhân
            </Text>
          </div>

          <div className="personal-info-section">{renderPersonalInfo()}</div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Profile;

import React, { useEffect, useState } from "react";
import {
  Card,
  Input,
  Button,
  Select,
  message,
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
import { toast } from "react-toastify";
import "./profile.css";

const { Title, Text } = Typography;
const { Option } = Select;

const Profile = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: user?.fullName || "",
    username: "",
    gender: "MALE",
    avatar: "",
  });
  const [account, setAccount] = useState(null);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const [userRes] = await Promise.all([
        api.get(`/admin/user`),
      ]);
      const listUser = userRes.data;
      const matchedUser = listUser.find((u) => u.id === user.id);
  
      if (!matchedUser) {
        message.warning("Không tìm thấy thông tin người dùng.");
        return;
      }
  
      setAccount(matchedUser);
      setForm({
        fullName: matchedUser.fullName || "",
        username: matchedUser.username || "",
        gender: matchedUser.gender || "MALE",
        avatar: matchedUser.avatar || "",
      });
    } catch (err) {
      console.error("Lỗi khi lấy dữ liệu:", err);
      message.error("Đã xảy ra lỗi khi tải thông tin người dùng.");
    } finally {
      setLoading(false);
    }
  };
  
  
  useEffect(() => {
    if (user?.id) {
      fetchUserData();
    }
  }, [user]);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    const payload = {
      id: account.id,
      email: account.email,
      username: form.username || "",
      fullName: form.fullName,
      gender: form.gender,
      role: account.role || "COACH",
      status: account.status || "ACTIVE",
      avatar: form.avatar || "",
      description: account.description || "",
    };
    try {
      const response = await api.put(`/admin/user/${user.id}`, payload);

      toast.success("Cập nhật thông tin thành công!");
      setIsEditing(false);
      fetchUserData(); // reload lại dữ liệu mới
      setTimeout(() => {
        window.location.reload();
      }, 100); 
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
            <Avatar
              size={120}
              src={form.avatar || "/default-avatar.png"}
              className="profile-avatar"
            />
          </div>
        </Col>

        <Col xs={24} md={16}>
          <div className="info-form">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <Input
                    value={account?.email || ""}
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
                    value={form.username}
                    onChange={(e) => handleChange("username", e.target.value)}
                    disabled={!isEditing}
                    className={isEditing ? "editable-input" : "readonly-input"}
                    prefix={<UserOutlined />}
                  />
                </div>
              </Col>

              <Col xs={24} sm={12}>
                <div className="form-group">
                  <label className="form-label">Tên đầy đủ</label>
                  <Input
                    value={form.fullName}
                    onChange={(e) => handleChange("fullName", e.target.value)}
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

              <Col xs={24} sm={12}>
                <div className="form-group">
                  <label className="form-label">URL ảnh đại diện</label>
                  <Input
                    value={form.avatar}
                    onChange={(e) => handleChange("avatar", e.target.value)}
                    disabled={!isEditing}
                    className={isEditing ? "editable-input" : "readonly-input"}
                    placeholder="Nhập đường dẫn ảnh"
                  />
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
                        fullName: account.fullName || "",
                        username: account.username || "",
                        gender: account.gender || "MALE",
                        avatar: account.avatar || "",
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

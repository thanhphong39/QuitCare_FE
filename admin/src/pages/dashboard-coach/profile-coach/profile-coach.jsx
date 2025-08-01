import React, { useEffect, useState } from "react";
import { Form, Input, Select, Button, message, Card, Spin } from "antd";
import { useSelector } from "react-redux";
import api from "../../../configs/axios";
import { toast } from "react-toastify";

const { Option } = Select;

function ProfileCoach() {
  const [form] = Form.useForm();
  const [coachInfo, setCoachInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.user); // user đang đăng nhập

  const fetchCoachData = async () => {
    setLoading(true);
    try {
      const [coachRes] = await Promise.all([
        api.get("/admin/user"),
      ]);

      const coachList = coachRes.data;
      const matchedCoach = coachList.find((coach) => coach.id === user.id);

      if (!matchedCoach) {
        message.warning("Không tìm thấy thông tin coach.");
        return;
      }
      console.log("Thông tin coach:", matchedCoach);
      setCoachInfo(matchedCoach);
      form.setFieldsValue({
        ...matchedCoach,
        username: matchedCoach.username || "Không xác định",
      });
    } catch (err) {
      console.error("Lỗi khi lấy dữ liệu:", err);
      message.error("Đã xảy ra lỗi khi tải thông tin coach.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchCoachData();
    }
  }, [user]);

  const onFinish = async (values) => {
    if (!coachInfo) return;

    const payload = {
      id: coachInfo.id,
      email: coachInfo.email,
      username: coachInfo.username || "",
      fullName: values.fullName,
      gender: values.gender,
      role: coachInfo.role || "COACH",
      status: coachInfo.status || "ACTIVE",
      avatar: values.avatar || "",
      description: values.description || "",
    };

    try {
      await api.put(`/admin/user/${coachInfo.id}`, payload);
      toast.success("Cập nhật hồ sơ thành công!");
      fetchCoachData(); // Reload lại avatar mới
    } catch (err) {
      console.error("Lỗi cập nhật:", err);
      message.error("Cập nhật hồ sơ thất bại.");
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: 50 }}>
        <Spin tip="Đang tải dữ liệu..." />
      </div>
    );
  }

  if (!coachInfo) {
    return (
      <div style={{ textAlign: "center", marginTop: 50 }}>
        Không có thông tin coach để hiển thị.
      </div>
    );
  }

  return (
    <Card title="Thông tin Coach" style={{ maxWidth: 600, margin: "auto" }}>
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <img
          src={coachInfo.avatar || "/default-avatar.png"}
          alt="Avatar"
          style={{
            width: 120,
            height: 120,
            objectFit: "cover",
            borderRadius: "50%",
            border: "2px solid #eee",
          }}
        />
      </div>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item label="Email" name="email">
          <Input disabled />
        </Form.Item>

        
        <Form.Item label="Tên Người dùng" name="username">
          <Input disabled />
        </Form.Item>
        <Form.Item
          label="Họ và tên"
          name="fullName"
          rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Giới tính"
          name="gender"
          rules={[{ required: true, message: "Vui lòng chọn giới tính" }]}
        >
          <Select>
            <Option value="MALE">Nam</Option>
            <Option value="FEMALE">Nữ</Option>
            <Option value="OTHER">Khác</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Avatar URL" name="avatar">
          <Input />
        </Form.Item>

        <Form.Item label="Mô tả" name="description">
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Cập nhật
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}

export default ProfileCoach;

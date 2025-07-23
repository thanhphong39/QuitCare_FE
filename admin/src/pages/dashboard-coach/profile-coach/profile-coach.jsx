import React, { useEffect, useState } from "react";
import { Form, Input, Select, Button, message, Card, Spin } from "antd";
import api from "../../../configs/axios";

const { Option } = Select;

function ProfileCoach() {
  const [form] = Form.useForm();
  const [coachInfo, setCoachInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoachData = async () => {
      try {
        const [coachRes, usersRes] = await Promise.all([
          api.get("/session/coaches"),
          api.get("/admin/user"),
        ]);

        const coachList = coachRes.data; // danh sách coaches (id, email, avatar,...)
        const userList = usersRes.data; // danh sách users có role, status,...

        // tìm các user có role = 'COACH' và id có tồn tại trong danh sách coachList
        const matchedCoach = userList.find(
          (user) =>
            user.role === "COACH" &&
            coachList.some((coach) => coach.id === user.id)
        );

        if (matchedCoach) {
          // tìm thêm thông tin chi tiết từ coachList (avatar, description,...)
          const coachExtra = coachList.find((c) => c.id === matchedCoach.id);

          const fullCoach = {
            ...matchedCoach,
            avatar: coachExtra?.avatar || "",
            description: coachExtra?.description || "",
          };

          setCoachInfo(fullCoach);
          form.setFieldsValue(fullCoach);
        } else {
          message.warning("Không tìm thấy coach phù hợp.");
        }
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu:", err);
        message.error("Đã có lỗi xảy ra khi tải thông tin.");
      } finally {
        setLoading(false);
      }
    };

    fetchCoachData();
  }, [form]);

  const onFinish = async (values) => {
    if (!coachInfo) return;

    const payload = {
      id: coachInfo.id,
      email: coachInfo.email, // không cho sửa
      username: coachInfo.username || "",
      role: "COACH",
      status: coachInfo.status || "ACTIVE",
      fullName: values.fullName,
      gender: values.gender,
      avatar: values.avatar,
      description: values.description,
    };

    try {
      await api.put(`/admin/user/${coachInfo.id}`, payload);
      message.success("Cập nhật thành công!");
    } catch (err) {
      console.error("Lỗi cập nhật:", err);
      message.error("Cập nhật thất bại.");
    }
  };

  if (loading) {
    return <Spin tip="Đang tải dữ liệu..." />;
  }

  if (!coachInfo) {
    return <div>Không có thông tin coach để hiển thị.</div>;
  }

  return (
    <Card title="Thông tin Coach" style={{ maxWidth: 600, margin: "auto" }}>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item label="Email" name="email">
          <Input disabled />
        </Form.Item>

        <Form.Item
          label="Họ và tên"
          name="fullName"
          rules={[{ required: true, message: "Vui lòng nhập tên" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Giới tính"
          name="gender"
          rules={[{ required: true, message: "Chọn giới tính" }]}
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

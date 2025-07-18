import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Space,
  Popconfirm,
  Card,
  Typography,
} from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import api from "../../../configs/axios";

const { Title } = Typography;
const { TextArea } = Input;

const MembershipPlansPage = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();

  // Fetch packages
  const fetchPackages = async () => {
    try {
      setLoading(true);
      const res = await api.get("/membership-plans");
      console.log("Backend response:", res.data);
      setPackages(res.data || []);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
      toast.error("Không thể tải dữ liệu gói thành viên!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  // Convert days to months for display
  const daysToMonths = (days) => {
    return Math.round(days / 30);
  };

  // Convert months to days for API
  const monthsToDays = (months) => {
    return months * 30;
  };

  // Handle save (create/update)
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      console.log("Form values:", values);

      // Convert duration from months to days for API
      const apiData = {
        name: values.name,
        price: values.price,
        durationInDays: monthsToDays(values.durationInMonths), // Convert months to days
        description: values.description,
      };

      if (editing) {
        console.log("Updating package:", editing.id, apiData);
        await api.put(`/membership-plans/${editing.id}`, apiData);
        toast.success("Cập nhật gói thành công!");
      } else {
        console.log("Creating new package:", apiData);
        await api.post("/membership-plans", apiData);
        toast.success("Tạo gói mới thành công!");
      }
      
      setModalOpen(false);
      setEditing(null);
      form.resetFields();
      await fetchPackages();
    } catch (err) {
      console.error("Lỗi khi xử lý dữ liệu:", err);
      toast.error("Lỗi khi xử lý dữ liệu!");
    }
  };

  // Handle edit
  const handleEdit = (record) => {
    console.log("Editing record:", record);
    setEditing(record);
    setModalOpen(true);
    form.setFieldsValue({
      name: record.name,
      price: record.price,
      durationInMonths: daysToMonths(record.durationInDays), // Convert days to months for form
      description: record.description,
    });
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      await api.delete(`/membership-plans/${id}`);
      toast.success("Xóa gói thành công!");
      await fetchPackages();
    } catch (error) {
      console.error("Lỗi khi xóa:", error);
      toast.error("Xóa thất bại!");
    }
  };

  // Handle create new
  const handleCreate = () => {
    setEditing(null);
    setModalOpen(true);
    form.resetFields();
  };

  // Handle modal cancel
  const handleCancel = () => {
    setModalOpen(false);
    setEditing(null);
    form.resetFields();
  };

  // Table columns
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: "10%",
    },
    {
      title: "Tên gói",
      dataIndex: "name",
      key: "name",
      width: "20%",
    },
    {
      title: "Giá (VND)",
      dataIndex: "price",
      key: "price",
      width: "20%",
      render: (price) => formatCurrency(price),
    },
    {
      title: "Thời hạn",
      dataIndex: "durationInDays",
      key: "durationInDays",
      width: "15%",
      render: (durationInDays) => {
        const months = daysToMonths(durationInDays);
        return `${months} tháng (${durationInDays} ngày)`;
      },
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      width: "25%",
      ellipsis: true,
    },
    {
      title: "Thao tác",
      key: "action",
      width: "10%",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa gói này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              size="small"
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <Card>
        <div style={{ 
          marginBottom: "16px", 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center" 
        }}>
          <Title level={3}>Quản lý gói thành viên</Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreate}
          >
            Tạo gói mới
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={packages}
          loading={loading}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} gói`,
          }}
        />

        {/* Create/Edit Modal */}
        <Modal
          title={editing ? "Chỉnh sửa gói thành viên" : "Tạo gói thành viên mới"}
          open={modalOpen}
          onOk={handleSave}
          onCancel={handleCancel}
          okText={editing ? "Cập nhật" : "Tạo"}
          cancelText="Hủy"
          width={600}
        >
          <Form
            form={form}
            layout="vertical"
            style={{ marginTop: "20px" }}
          >
            <Form.Item
              label="Tên gói"
              name="name"
              rules={[{ required: true, message: "Vui lòng nhập tên gói!" }]}
            >
              <Input placeholder="Nhập tên gói..." />
            </Form.Item>

            <Form.Item
              label="Giá"
              name="price"
              rules={[{ required: true, message: "Vui lòng nhập giá!" }]}
            >
              <InputNumber
                style={{ width: "100%" }}
                min={0}
                step={1000}
                placeholder="Nhập giá..."
                formatter={(value) => `${value}₫`}
                parser={(value) => parseFloat(value?.replace(/[^\d]/g, "") || 0)}
              />
            </Form.Item>

            <Form.Item
              label="Thời hạn (tháng)"
              name="durationInMonths"
              rules={[{ required: true, message: "Vui lòng nhập thời hạn!" }]}
              extra="Sẽ được chuyển đổi thành ngày (1 tháng = 30 ngày)"
            >
              <InputNumber
                style={{ width: "100%" }}
                min={1}
                max={24}
                step={1}
                placeholder="Nhập thời hạn tính theo tháng..."
              />
            </Form.Item>

            <Form.Item
              label="Mô tả"
              name="description"
              rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
            >
              <TextArea
                rows={4}
                placeholder="Nhập mô tả gói..."
              />
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </div>
  );
};

export default MembershipPlansPage;
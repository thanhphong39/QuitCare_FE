import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Popconfirm,
  message,
  Modal,
  Form,
  Input,
  Select,
  Space,
  Card,
  Row,
  Col,
  Tooltip,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import api from "../../../configs/axios";
import { toast } from "react-toastify";

const { Search } = Input;
const { Option } = Select;

function PostsManagement() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();

  // Filter states
  const [searchText, setSearchText] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/community-posts");
      setPosts(res.data);
      setFilteredPosts(res.data);
    } catch (err) {
      toast.error("Lỗi khi tải bài viết!");
    } finally {
      setLoading(false);
    }
  };

  // Áp dụng filter và search
  const applyFilters = () => {
    let filtered = [...posts];

    // Search filter
    if (searchText) {
      filtered = filtered.filter(
        (post) =>
          post.title?.toLowerCase().includes(searchText.toLowerCase()) ||
          post.category?.toLowerCase().includes(searchText.toLowerCase()) ||
          post.description?.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Category filter
    if (filterCategory) {
      filtered = filtered.filter((post) => post.category === filterCategory);
    }

    // Status filter
    if (filterStatus) {
      filtered = filtered.filter((post) => post.status === filterStatus);
    }

    setFilteredPosts(filtered);
  };

  // Reset filters
  const resetFilters = () => {
    setSearchText("");
    setFilterCategory("");
    setFilterStatus("");
    setFilteredPosts(posts);
  };

  // Apply filters when any filter changes
  useEffect(() => {
    applyFilters();
  }, [searchText, filterCategory, filterStatus, posts]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/community-posts/${id}`);
      toast.success("Xoá bài viết thành công!");
      fetchPosts();
    } catch (err) {
      toast.error("Lỗi khi xoá bài viết!");
    }
  };

  const handleEdit = (record) => {
    setEditing(record);
    form.setFieldsValue(record);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editing) {
        await api.put(`/community-posts/${editing.id}`, {
          ...editing,
          ...values,
        });
        toast.success("Cập nhật bài viết thành công!");
      } else {
        await api.post("/community-posts", values);
        toast.success("Thêm bài viết mới thành công!");
      }
      setModalOpen(false);
      fetchPosts();
    } catch (err) {
      toast.error("Lỗi khi gửi dữ liệu!");
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      width: 350, // Tăng width lên 350px
      render: (text) => {
        if (!text) return "Không có";

        // Hiển thị 150 ký tự đầu thay vì 120
        const isLong = text.length > 150;
        const displayText = isLong ? `${text.substring(0, 150)}...` : text;

        return (
          <Tooltip
            title={isLong ? text : null}
            placement="topLeft"
            overlayStyle={{
              maxWidth: "600px", // Tăng lên 600px
              maxHeight: "400px", // Giới hạn chiều cao tooltip
              overflow: "auto", // Cho phép scroll nếu quá dài
              whiteSpace: "pre-wrap", // Giữ nguyên format text
              wordBreak: "break-word", // Xuống dòng tự động
            }}
          >
            <div
              style={{
                cursor: isLong ? "pointer" : "default",
                maxWidth: "330px", // Tăng lên 330px
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                lineHeight: "1.4", // Tăng line height cho dễ đọc
              }}
            >
              {displayText}
            </div>
          </Tooltip>
        );
      },
    },
    {
      title: "Chuyên mục",
      dataIndex: "category",
      render: (text) => text || "Không có",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
    },
    {
      title: "Ngày đăng",
      dataIndex: "date",
      render: (date) => date || "Chưa có",
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xoá bài viết này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xoá"
            cancelText="Huỷ"
          >
            <Button icon={<DeleteOutlined />} danger>
              Xoá
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <h2>Quản lý Bài viết cộng đồng</h2>
        <Space>
          <Button icon={<PlusOutlined />} onClick={handleAdd}>
            Thêm mới
          </Button>
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchPosts}
            loading={loading}
          >
            Tải lại
          </Button>
        </Space>
      </div>

      {/* Filter và Search Section */}
      <Card style={{ marginBottom: "16px" }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="Tìm kiếm theo tiêu đề, chuyên mục, mô tả..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
              prefix={<SearchOutlined />}
            />
          </Col>
          <Col xs={24} sm={12} md={5}>
            <Select
              placeholder="Lọc theo chuyên mục"
              value={filterCategory}
              onChange={setFilterCategory}
              allowClear
              style={{ width: "100%" }}
            >
              <Option value="Kiến Thức">Kiến Thức</Option>
              <Option value="Tập luyện & Sức khỏe">Tập luyện & Sức khỏe</Option>
              <Option value="Câu Chuyện">Câu Chuyện</Option>
              <Option value="Tư vấn">Tư vấn</Option>
              <Option value="Chia sẻ">Chia sẻ</Option>
              <Option value="Hỏi đáp">Hỏi đáp</Option>
              <Option value="Kinh nghiệm">Kinh nghiệm</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={5}>
            <Select
              placeholder="Lọc theo trạng thái"
              value={filterStatus}
              onChange={setFilterStatus}
              allowClear
              style={{ width: "100%" }}
            >
              <Option value="PENDING">PENDING</Option>
              <Option value="APPROVED">APPROVED</Option>
              <Option value="REJECTED">REJECTED</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Space>
              <Button
                icon={<FilterOutlined />}
                onClick={applyFilters}
                type="primary"
              >
                Áp dụng bộ lọc
              </Button>
              <Button onClick={resetFilters}>Xóa bộ lọc</Button>
            </Space>
          </Col>
        </Row>
      </Card>

      <Table
        columns={columns}
        dataSource={filteredPosts}
        rowKey="id"
        loading={loading}
      />

      <Modal
        open={modalOpen}
        title={editing ? "Cập nhật bài viết" : "Thêm bài viết mới"}
        onCancel={() => setModalOpen(false)}
        onOk={handleSubmit}
        okText="Lưu"
        cancelText="Huỷ"
        width={800}
        style={{ top: 20 }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Tiêu đề"
            name="title"
            rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Mô tả"
            name="description"
            rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
          >
            <Input.TextArea
              rows={8} // Tăng từ 6 lên 8 rows để viết thoải mái hơn
              placeholder="Nhập mô tả chi tiết cho bài viết (không giới hạn độ dài)..."
              showCount // Vẫn hiển thị số ký tự để theo dõi
              // Bỏ maxLength - không giới hạn độ dài
              style={{
                resize: "vertical", // Cho phép kéo dãn theo chiều dọc
                minHeight: "120px",
              }}
            />
          </Form.Item>

          <Form.Item
            label="Hình ảnh (URL)"
            name="image"
            rules={[
              { required: false },
              { type: "url", message: "Vui lòng nhập URL hợp lệ!" },
            ]}
          >
            <Input placeholder="https://example.com/image.jpg" />
          </Form.Item>

          <Form.Item
            label="Chuyên mục"
            name="category"
            rules={[{ required: true, message: "Vui lòng chọn chuyên mục!" }]}
          >
            <Select placeholder="Chọn chuyên mục">
              <Option value="Kiến Thức">Kiến Thức</Option>
              <Option value="Tập luyện & Sức khỏe">Tập luyện & Sức khỏe</Option>
              <Option value="Câu Chuyện">Câu Chuyện</Option>
              <Option value="Tư vấn">Tư vấn</Option>
              <Option value="Chia sẻ">Chia sẻ</Option>
              <Option value="Hỏi đáp">Hỏi đáp</Option>
              <Option value="Kinh nghiệm">Kinh nghiệm</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Trạng thái"
            name="status"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
          >
            <Select>
              <Option value="PENDING">PENDING</Option>
              <Option value="APPROVED">APPROVED</Option>
              <Option value="REJECTED">REJECTED</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Ngày đăng"
            name="date"
            rules={[{ required: true, message: "Vui lòng nhập ngày đăng!" }]}
          >
            <Input placeholder="YYYY-MM-DD hoặc DD/MM/YYYY" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default PostsManagement;

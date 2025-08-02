import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import "./BlogDetail.css";
import Footer from "../footer/Footer";
import Navbar from "../navbar/Navbar";
import api from "../../configs/axios";
import { toast } from "react-toastify";

function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentInput, setCommentInput] = useState("");

  const fetchPost = async () => {
    try {
      const res = await api.get(`/community-posts/${id}`);
      const post = res.data;

      // Kiểm tra nếu bài viết chưa được phê duyệt thì không hiển thị
      if (post.status !== "APPROVED") {
        setBlog(null);
        toast.error("Bài viết này chưa được phê duyệt hoặc không tồn tại!");
        return;
      }
      setBlog(post);
    } catch (err) {
      console.error("Lỗi khi tải bài viết:", err);
      setBlog(null);
      toast.error("Không thể tải bài viết!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const trimmed = commentInput.trim();
    if (!trimmed) return;

    const accountId = Number(localStorage.getItem("accountId"));
    // if (!accountId || isNaN(accountId)) {
    //   toast.error("Không xác định được người dùng. Vui lòng đăng nhập lại!");
    //   return;
    // }

    try {
      await api.post(
        `/comments/community-posts/${id}/comments/by-account/${accountId}`,
        {
          content: trimmed,
          commentStatus: "PENDING",
          createAt: new Date().toISOString(),
          communityPostId: Number(id),
          accountId: accountId,
        }
      );
      toast.success("Gửi bình luận thành công, chờ xét duyệt!");
      setCommentInput("");
      fetchPost(); // reload lại bài viết để cập nhật bình luận mới
    } catch (error) {
      toast.error("Gửi bình luận thất bại!");
    }
  };

  // const relatedBlogs = useMemo(() => {
  //   return [];
  // }, [id]);

  if (loading)
    return <div className="blog-detail-loading">Đang tải bài viết...</div>;

  if (!blog)
    return <div className="blog-detail-notfound">Không tìm thấy bài viết</div>;

  return (
    <>
      <Navbar />
      <div className="blog-detail-page">
        <Link to="/blog" className="back-to-blog">
          <i className="fa-solid fa-circle-chevron-left"></i> Quay lại
        </Link>

        <div className="blog-detail-wrapper">
          <div className="blog-detail-header">
            <img
              src={blog.image}
              alt={blog.title}
              className="blog-detail-img"
            />
            <div className="blog-detail-meta">
              <span className="blog-detail-date">{blog.date}</span>
              <span className="blog-detail-dot">•</span>
              <span className="blog-detail-category">{blog.category}</span>
            </div>
            <h1 className="blog-detail-title">{blog.title}</h1>
          </div>

          <div className="blog-detail-body">
            {blog.description?.split("\n").map((para, index) => (
              <p key={index} className="blog-detail-paragraph">
                {para.trim()}
              </p>
            ))}
          </div>

          {/* Phần bình luận */}
          <div className="blog-comments-section">
            <h2>Bình luận</h2>

            {/* Form gửi bình luận */}
            <form onSubmit={handleCommentSubmit} className="blog-comment-form">
              <textarea
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="Nhập bình luận của bạn..."
                rows={3}
                className="blog-comment-input"
              />
              <button type="submit" className="blog-comment-submit">
                Gửi bình luận
              </button>
            </form>

            <div className="blog-comments-list">
              {(!blog.comments || blog.comments.length === 0) && (
                <p className="blog-no-comments">Chưa có bình luận nào.</p>
              )}
              {blog.comments
                .sort((a, b) => a.id - b.id)
                .map((c, idx) => (
                  <div key={c.id || idx} className="blog-comment-item">
                    <div className="blog-comment-text">{c.content}</div>
                    <div className="blog-comment-date">
                      {new Date(c.createAt).toLocaleString()}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default BlogDetail;

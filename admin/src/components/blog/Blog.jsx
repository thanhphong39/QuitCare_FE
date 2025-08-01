import React, { useEffect, useState } from "react";
import "./Blog.css";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import BackToTopButton from "../back-to-top/BackToTopButton";
import { Link } from "react-router";
import api from "../../configs/axios";
import { toast } from "react-toastify";

function BlogSection({ id, title, posts, loading }) {
  if (loading) {
    return (
      <div id={id}>
        <div className="blog-grid">
          <div className="loading-message">Đang tải bài viết...</div>
        </div>
      </div>
    );
  }

  return (
    <div id={id}>
      <div className="blog-grid">
        {posts.map((post, index) => (
          <div key={post.id || index} className="blog-card">
            <div className="blog-img">
              <img
                src={post.image || "https://via.placeholder.com/250x250"}
                alt={post.title}
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/250x250";
                }}
              />
              <div className="blog-meta">
                {/* <span>
                  {post.date
                    ? new Date(post.date).toLocaleDateString("vi-VN")
                    : "N/A"}
                </span>{" "}
                ·  */}
                <span>{post.category || "Chưa phân loại"}</span>
              </div>
            </div>
            <div className="blog-content">
              <h3 className="blog-title">{post.title}</h3>
              <Link to={`/blog/${post.id}`} className="blog-readmore">
                Đọc Chi Tiết →
              </Link>
            </div>
          </div>
        ))}
        {posts.length === 0 && !loading && (
          <div className="no-posts-message">Chưa có bài viết nào</div>
        )}
      </div>
    </div>
  );
}

function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCommunityPosts = async () => {
    try {
      setLoading(true);
      const response = await api.get("/community-posts");

      if (response.data && Array.isArray(response.data)) {
        // Chỉ hiển thị những bài viết có status là APPROVED
        const approvedPosts = response.data.filter(
          (post) => post.status === "APPROVED"
        );
        setPosts(approvedPosts);
      }
    } catch (error) {
      console.error("Lỗi khi tải bài viết:", error);
      toast.error("Không thể tải danh sách bài viết. Vui lòng thử lại!");
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunityPosts();
  }, []);

  return (
    <>
      <Navbar />
      <div className="blog-container">
        <div className="blog-page">
          <div style={{ marginBottom: "40px", textAlign: "center" }}>
            <h1
              style={{
                fontSize: "2.5rem",
                color: "#1e293b",
                marginBottom: "16px",
              }}
            >
              Blog Cộng Đồng
            </h1>
            <p style={{ fontSize: "1.1rem", color: "#64748b" }}>
              Chia sẻ kiến thức và kinh nghiệm cai thuốc lá
            </p>
          </div>

          <BlogSection
            id="all-posts"
            title="Tất cả bài viết"
            posts={posts}
            loading={loading}
          />
        </div>
      </div>
      <Footer />
      <BackToTopButton />
    </>
  );
}

export default Blog;

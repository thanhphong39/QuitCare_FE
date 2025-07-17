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
        <h2 className="section-title">{title}</h2>
        <div className="blog-grid">
          <div className="loading-message">Đang tải bài viết...</div>
        </div>
      </div>
    );
  }

  return (
    <div id={id}>
      <h2 className="section-title">{title}</h2>
      <div className="blog-grid">
        {posts.map((post, index) => (
          <div key={post.id || index} className="blog-card">
            <div className="blog-img">
              <img
                src={post.image || "https://via.placeholder.com/300x200"}
                alt={post.title}
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/300x200";
                }}
              />
              <div className="blog-meta">
                <span>
                  {post.date
                    ? new Date(post.date).toLocaleDateString("vi-VN")
                    : "N/A"}
                </span>{" "}
                · <span>{post.category}</span>
              </div>
            </div>
            <div className="blog-content">
              <h3 className="blog-title">{post.title}</h3>
              <p className="blog-description">{post.description}</p>
              <Link to={`/blog/${post.id}`} className="blog-readmore">
                Đọc Thêm →
              </Link>
            </div>
          </div>
        ))}
        {posts.length === 0 && !loading && (
          <div className="no-posts-message">
            Chưa có bài viết nào trong danh mục này
          </div>
        )}
      </div>
    </div>
  );
}

function Blog() {
  const [activeSection, setActiveSection] = useState("");
  const [knowledgePosts, setKnowledgePosts] = useState([]);
  const [healthyPosts, setHealthyPosts] = useState([]);
  const [successPosts, setSuccessPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Phân loại bài viết theo nội dung
  const categorizePost = (post) => {
    const title = post.title?.toLowerCase() || "";
    const description = post.description?.toLowerCase() || "";
    const category = post.category?.toLowerCase() || "";

    // Kiến thức cai thuốc
    if (
      title.includes("cai thuốc") ||
      title.includes("bỏ thuốc") ||
      title.includes("mẹo") ||
      title.includes("phương pháp") ||
      title.includes("cách") ||
      title.includes("tác hại") ||
      title.includes("kiến thức") ||
      description.includes("cai thuốc") ||
      description.includes("bỏ thuốc") ||
      category.includes("kiến thức") ||
      category.includes("knowledge")
    ) {
      return "knowledge";
    }

    // Tập luyện & sức khỏe
    if (
      title.includes("tập") ||
      title.includes("yoga") ||
      title.includes("thể dục") ||
      title.includes("sức khỏe") ||
      title.includes("phổi") ||
      title.includes("thanh lọc") ||
      title.includes("dinh dưỡng") ||
      title.includes("thực phẩm") ||
      description.includes("tập luyện") ||
      description.includes("sức khỏe") ||
      category.includes("sức khỏe") ||
      category.includes("health") ||
      category.includes("exercise")
    ) {
      return "healthy";
    }

    // Câu chuyện thành công
    if (
      title.includes("thành công") ||
      title.includes("câu chuyện") ||
      title.includes("chia sẻ") ||
      title.includes("kinh nghiệm") ||
      title.includes("gương") ||
      description.includes("thành công") ||
      description.includes("câu chuyện") ||
      category.includes("câu chuyện") ||
      category.includes("story") ||
      category.includes("success")
    ) {
      return "success";
    }

    // Mặc định là kiến thức
    return "knowledge";
  };

  const fetchCommunityPosts = async () => {
    try {
      setLoading(true);
      const response = await api.get("/community-posts");

      if (response.data && Array.isArray(response.data)) {
        const posts = response.data;

        // Phân loại bài viết
        const knowledge = [];
        const healthy = [];
        const success = [];

        posts.forEach((post) => {
          const categoryType = categorizePost(post);
          const processedPost = {
            ...post,
            category:
              post.category ||
              (categoryType === "knowledge"
                ? "Kiến Thức"
                : categoryType === "healthy"
                ? "Tập luyện & Sức khỏe"
                : "Câu Chuyện"),
          };

          switch (categoryType) {
            case "knowledge":
              knowledge.push(processedPost);
              break;
            case "healthy":
              healthy.push(processedPost);
              break;
            case "success":
              success.push(processedPost);
              break;
            default:
              knowledge.push(processedPost);
          }
        });

        setKnowledgePosts(knowledge);
        setHealthyPosts(healthy);
        setSuccessPosts(success);
      }
    } catch (error) {
      console.error("Lỗi khi tải bài viết:", error);
      toast.error("Không thể tải danh sách bài viết. Vui lòng thử lại!");

      // Dữ liệu fallback nếu API lỗi
      setKnowledgePosts([]);
      setHealthyPosts([]);
      setSuccessPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunityPosts();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["knowledge", "healthy", "success"];
      for (let id of sections) {
        const element = document.getElementById(id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <Navbar />
      <div className="blog-container">
        <div className="blog-page">
          <div className="blog-nav">
            <a
              href="#knowledge"
              className={`blog-nav-link ${
                activeSection === "knowledge" ? "active" : ""
              }`}
            >
              📚 Kiến Thức Cai Thuốc
            </a>
            <a
              href="#healthy"
              className={`blog-nav-link ${
                activeSection === "healthy" ? "active" : ""
              }`}
            >
              💪 Tập luyện & sức khỏe
            </a>
            <a
              href="#success"
              className={`blog-nav-link ${
                activeSection === "success" ? "active" : ""
              }`}
            >
              💡 Câu Chuyện Thành Công
            </a>
          </div>

          <BlogSection
            id="knowledge"
            title="📚 Kiến Thức Cai Thuốc"
            posts={knowledgePosts}
            loading={loading}
          />
          <BlogSection
            id="healthy"
            title="💪 Tập luyện & sức khỏe"
            posts={healthyPosts}
            loading={loading}
          />
          <BlogSection
            id="success"
            title="💡 Câu Chuyện Thành Công"
            posts={successPosts}
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

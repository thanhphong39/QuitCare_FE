import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Blog.css";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import BackToTopButton from "../back-to-top/BackToTopButton";
import api from "../../configs/axios";
import { toast } from "react-toastify";

function BlogSection({ id, title, posts, loading }) {
  if (loading) {
    return (
      <div id={id}>
        <h2 className="section-title">{title}</h2>
        <div className="blog-grid">
          <div className="loading-message">Đang tải...</div>
        </div>
      </div>
    );
  }

  return (
    <div id={id}>
      <h2 className="section-title">{title}</h2>
      <div className="blog-grid">
        {posts.map((post, index) => (
          <div key={index} className="blog-card">
            <div className="blog-img">
              <img
                src={post.image || "https://via.placeholder.com/300x200"}
                alt={post.title}
              />
              <div className="blog-meta">
                <span>
                  {new Date(post.date || post.createdAt).toLocaleDateString(
                    "vi-VN"
                  )}
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

  // Phân loại bài viết theo category
  const categorizePost = (post) => {
    const title = post.title.toLowerCase();
    const description = post.description?.toLowerCase() || "";
    const category = post.category?.toLowerCase() || "";

    // Kiếm tra từ khóa cho kiến thức cai thuốc
    if (
      title.includes("cai thuốc") ||
      title.includes("bỏ thuốc") ||
      title.includes("mẹo") ||
      title.includes("phương pháp") ||
      title.includes("cách") ||
      title.includes("tác hại") ||
      description.includes("cai thuốc") ||
      description.includes("bỏ thuốc") ||
      category.includes("kiến thức") ||
      category.includes("knowledge")
    ) {
      return "knowledge";
    }

    // Kiếm tra từ khóa cho tập luyện & sức khỏe
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

    // Kiếm tra từ khóa cho câu chuyện thành công
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

    // Mặc định về kiến thức
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
          const category = categorizePost(post);
          switch (category) {
            case "knowledge":
              knowledge.push({ ...post, category: "Kiến Thức" });
              break;
            case "healthy":
              healthy.push({ ...post, category: "Tập luyện & Sức khỏe" });
              break;
            case "success":
              success.push({ ...post, category: "Câu Chuyện" });
              break;
            default:
              knowledge.push({ ...post, category: "Kiến Thức" });
          }
        });

        setKnowledgePosts(knowledge);
        setHealthyPosts(healthy);
        setSuccessPosts(success);
      }
    } catch (error) {
      console.error("Lỗi khi tải bài viết:", error);
      toast.error("Không thể tải danh sách bài viết");

      // Fallback về dữ liệu tĩnh nếu API lỗi
      const fallbackKnowledge = [
        {
          id: "1",
          title: "13 mẹo cai thuốc lá hiệu quả nhất",
          date: "2024-08-07",
          category: "Kiến Thức",
          image:
            "https://medlatec.vn/media/27799/content/20241204_cai-thuoc-la-the-nao-la-hieu-qua.jpg",
          description:
            "Khám phá các mẹo và chiến lược hiệu quả nhất để cai thuốc lá.",
        },
      ];

      const fallbackHealthy = [
        {
          id: "2",
          title: "Tập thể dục giúp ích cho việc cai nghiện thuốc lá",
          date: "2024-10-27",
          category: "Tập luyện & Sức khỏe",
          image:
            "https://medlatec.vn/media/3385/content/20221201_tap-the-duc-buoi-toi-1.jpg",
          description:
            "Bài viết nêu bật vai trò của tập thể dục trong việc giảm các triệu chứng cai nghiện nicotine.",
        },
      ];

      const fallbackSuccess = [
        {
          id: "3",
          title: "Bỏ thuốc lá thành công sau 15 năm nghiện thuốc",
          date: "2022-07-18",
          category: "Câu Chuyện",
          image:
            "https://medlatec.vn/media/2532/content/20230213_loi-ich-khi-bo-thuoc.jpg",
          description: "Hành trình vượt qua 15 năm nghiện thuốc lá.",
        },
      ];

      setKnowledgePosts(fallbackKnowledge);
      setHealthyPosts(fallbackHealthy);
      setSuccessPosts(fallbackSuccess);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunityPosts();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const section = ["knowledge", "healthy", "success"];
      for (let id of section) {
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

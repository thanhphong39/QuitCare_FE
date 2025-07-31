import React, { useEffect } from "react";
import Navbar from "../components/navbar/Navbar";
import BannerSlider from "../components/banner/BannerSlide";
import Footer from "../components/footer/Footer";
import AboutUs from "../components/about-us/AboutUs";
import MemberCommparision from "../components/compare-membership/CompareMs";
import Package from "../components/package-user/package";
import "./HomeAnimation.css";

function Home() {
  useEffect(() => {
    const sections = document.querySelectorAll(".section-animate");
    const onScroll = () => {
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight - 80 && rect.bottom > 80) {
          section.classList.add("visible");
        } else {
          section.classList.remove("visible");
        }
      });
    };
    window.addEventListener("scroll", onScroll);
    onScroll(); // chạy lần đầu
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="home-container">
      <Navbar />
      <section className="banner-section section-animate">
        <BannerSlider />
      </section>
      <section className="about-section section-animate">
        <AboutUs />
      </section>
      <section className="package-section section-animate">
        <Package />
      </section>
      <section className="compare-section section-animate">
        <MemberCommparision />
      </section>
      <section className="footer-section section-animate">
        <Footer />
      </section>
    </div>
  );
}

export default Home;

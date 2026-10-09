import { useState } from 'react';
import './About.css';

const faqs = [
  {
    q: 'What is the objective of this FoodNest college project?',
    a: 'FoodNest is designed and developed as a complete front-end web application project to demonstrate modern React component architecture, responsive UI/UX design, single-page navigation, and a simulated food ordering workflow for Indian food delivery environments.',
  },
  {
    q: 'How does FoodNest deliver so quickly?',
    a: 'Our delivery partners are mapped to specific neighborhoods and local zones to ensure fast 20-25 minute drops.',
  },
  {
    q: 'What payment modes are supported?',
    a: 'We support all major Indian payment methods: Google Pay, PhonePe, Paytm, UPI QR, Net Banking, and Cash on Delivery (COD).',
  },
  {
    q: 'How do I claim the 50% welcome bonus?',
    a: 'Use promo code WELCOME50 at checkout on any order to get a flat 50% discount on your meal.',
  },
];

export default function About({ onNavigate }) {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  return (
    <div className="about-page-universe">
      {/*  HERO STORY  */}
      <section className="about-hero-section">
        <div className="about-hero-badge">
          <span> EDUNET foundation - WEB DEVELOPMENT PROJECT</span>
        </div>

        <h1 className="about-hero-title">
          Bringing Delicious Indian Food <br />
          <span className="about-gradient-text">Closer to You.</span>
        </h1>

        <p className="about-hero-sub">
          FoodNest is an interactive project built using modern React, Vite, and CSS. It aims to solve real-world food cravings by connecting neighborhoods with verified local restaurants, dhabas, and authentic Ghar Ka Khana cloud kitchens.
        </p>
      </section>

      {/* ================= IMPACT STATS BAR ================= */}
      <section className="about-stats-grid">
        <div className="stat-box">
          <span className="stat-number">15,000+</span>
          <span className="stat-label">Meals Delivered</span>
        </div>
        <div className="stat-box">
          <span className="stat-number">50+</span>
          <span className="stat-label">Verified Partner Dhabas</span>
        </div>
        <div className="stat-box">
          <span className="stat-number">20 Min</span>
          <span className="stat-label">Average Hostel Drop Time</span>
        </div>
        <div className="stat-box">
          <span className="stat-number">4.9 ★</span>
          <span className="stat-label">Customer Satisfaction Rating</span>
        </div>
      </section>


      {/* ================= CORE VALUES GRID ================= */}
      <section className="about-values-section">
        <div className="values-header">
          <span className="section-eyebrow">KEY HIGHLIGHTS</span>
          <h2 className="section-title">Why FoodNest?</h2>
        </div>

        <div className="values-cards-grid">
          <div className="about-value-card">
            <div className="value-icon-circle">💰</div>
            <h3>Pocket-Friendly Prices</h3>
            <p>Meals starting at ₹80 with daily discounts and exclusive coupon codes like WELCOME50.</p>
          </div>

          <div className="about-value-card">
            <div className="value-icon-circle">⚡</div>
            <h3>Midnight Hostel Delivery</h3>
            <p>Hungry during late-night exam prep? FoodNest delivers hot snacks and biryanis directly to hostel gates.</p>
          </div>

          <div className="about-value-card">
            <div className="value-icon-circle">🍲</div>
            <h3>Ghar Ka Khana Kitchens</h3>
            <p>Nutritious, homestyle thalis, rotis, and dal prepared with pure ingredients by local home chefs.</p>
          </div>

          <div className="about-value-card">
            <div className="value-icon-circle">📱</div>
            <h3>UPI & user Friendly</h3>
            <p>Seamless 1-click checkout with Google Pay, PhonePe, Paytm, or Cash on Delivery.</p>
          </div>
        </div>
      </section>

      {/* ================= FAQ ACCORDION ================= */}
      <section className="faq-section">
        <div className="values-header">
          <span className="section-eyebrow">FREQUENTLY ASKED QUESTIONS</span>
          <h2 className="section-title">Common Questions</h2>
        </div>

        <div className="faq-accordion-list">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className={`faq-item-card ${isOpen ? 'open' : ''}`}
                onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
              >
                <div className="faq-question-row">
                  <span className="faq-q-text">{faq.q}</span>
                  <span className="faq-toggle-icon">{isOpen ? '−' : '+'}</span>
                </div>
                {isOpen && <p className="faq-a-text">{faq.a}</p>}
              </div>
            );
          })}
        </div>
      </section>

      {/* ================= CTA BOTTOM CARD ================= */}
      <section className="about-cta-card">
        <div className="cta-text-side">
          <h2>Ready for Your Feast?</h2>
          <p>Join the FoodNest community today and get 50% off on your first order!</p>
          <div className="cta-btn-row">
            <button
              type="button"
              className="about-signup-btn"
              onClick={() => onNavigate && onNavigate('signup')}
            >
              Get 50% Off & Sign Up 🚀
            </button>
            <button
              type="button"
              className="about-menu-btn"
              onClick={() => onNavigate && onNavigate('menu')}
            >
              Explore Indian Menu 🍛
            </button>
          </div>
        </div>
        <div className="cta-emoji-art">🍛✨</div>
      </section>

      {/* ================= PROJECT CREATOR SPOTLIGHT ================= */}
      <section className="project-author-section">
        <div className="values-header">
          <span className="section-eyebrow">PROJECT DEVELOPER & CREATOR</span>
          <h2 className="section-title">Developed by</h2>
        </div>

        <div className="developer-spotlight-card">
          <div className="developer-photo-side">
            <div className="developer-photo-frame">
              <img
                src="/image.png"
                alt="Project Lead & Developer"
                className="developer-img"
              />
              <span className="developer-status-badge">🟢 Project Lead</span>
            </div>
          </div>

          <div className="developer-details-side">
            <div className="dev-header">
              <span className="dev-eyebrow"> CAPSTONE PROJECT</span>
              <h3 className="dev-name">Project Developer</h3>
              <p className="dev-role"> Full Stack Web Developer</p>
            </div>

            <p className="dev-bio">
              Designed and built <strong>FoodNest</strong> — an intuitive, responsive, and customer-focused food delivery web application.
            </p>

            <div className="project-meta-points">
              <div className="meta-point">
                <strong>Project Domain:</strong> Full-Stack Web Development
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
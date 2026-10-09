import './Catering.css';

const Catering = ({ onNavigate }) => {
  return (
    <div className="catering-container">
      <div className="catering-hero">
        <div className="catering-hero-content">
          <span className="catering-badge">Premium Bulk Orders</span>
          <h1>Elevate Your Events with <span className="highlight-text">FoodNest Catering</span></h1>
          <p>
            Whether it's a grand wedding, a corporate gala, or a massive college fest,
            we deliver hot, delicious, and premium quality food in bulk.
          </p>
          <button className="cta-btn primary-cta" onClick={() => onNavigate('catering-menu')} style={{marginTop: '20px', padding: '15px 30px', fontSize: '1.2rem', borderRadius: '30px'}}>
            Explore the Catering Menu
          </button>
        </div>
      </div>

      <div className="catering-features">
        <h2>Why Choose FoodNest for Bulk Orders?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">👨‍🍳</div>
            <h3>Expert Chefs</h3>
            <p>Curated menus prepared by top-tier chefs ensuring every bite is memorable.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🚚</div>
            <h3>On-Time Delivery</h3>
            <p>Dedicated logistics team to ensure your food arrives hot and exactly on schedule.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🥘</div>
            <h3>Customizable Menus</h3>
            <p>From Desi feasts to Continental spreads, fully customize your event's menu.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🏷️</div>
            <h3>Bulk Discounts</h3>
            <p>Enjoy exclusive pricing and special discounts for large gatherings.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Catering;

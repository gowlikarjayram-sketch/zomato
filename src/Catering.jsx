import React, { useState } from 'react';
import './Catering.css';

const cateringProducts = [
  { id: 'c1', name: 'Hyderabadi Chicken Biryani (Bulk)', minQty: '50 plates', price: '₹12,000', icon: '🍗' },
  { id: 'c2', name: 'Paneer Butter Masala & Naan', minQty: '50 plates', price: '₹9,500', icon: '🥘' },
  { id: 'c3', name: 'Assorted Desi Desserts', minQty: '100 pcs', price: '₹3,000', icon: '🍧' },
  { id: 'c4', name: 'Premium Veg Thali Setup', minQty: '50 plates', price: '₹15,000', icon: '🍛' },
  { id: 'c5', name: 'Live Dosa Counter', minQty: '100 plates', price: '₹8,000', icon: '🥞' },
  { id: 'c6', name: 'Street Food Chaat Counter', minQty: '100 plates', price: '₹6,500', icon: '🥙' },
];

const Catering = ({ onNavigate }) => {
  const [selectedItems, setSelectedItems] = useState([]);

  const toggleItem = (id) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (selectedItems.length === 0) {
      alert("Please select at least one product for your bulk order!");
      return;
    }
    alert(`Inquiry submitted successfully with ${selectedItems.length} products selected! We will contact you soon.`);
    setSelectedItems([]);
    e.target.reset();
  };
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
          <button className="cta-btn primary-cta" onClick={() => onNavigate('menu')}>
            View Catering Menu
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

      <div className="catering-inquiry-section">
        <div className="inquiry-card">
          <h2>Request a Quote</h2>
          <p>Plan your next big event with us. Fill out the form below and our catering expert will contact you.</p>
          <form className="inquiry-form" onSubmit={handleFormSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Name</label>
                <input type="text" placeholder="Your Name" required />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input type="tel" placeholder="Your Phone Number" required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Event Type</label>
                <select required>
                  <option value="">Select Event Type</option>
                  <option value="wedding">Wedding / Reception</option>
                  <option value="corporate">Corporate Event</option>
                  <option value="party">Birthday / Private Party</option>
                  <option value="college">College Fest</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Estimated Guests</label>
                <input type="number" placeholder="Number of Guests" min="50" required />
              </div>
            </div>
            <div className="form-group">
              <label>Event Date</label>
              <input type="date" required />
            </div>

            <div className="form-group full-width">
              <label>Select Menu Items for Bulk Order <span className="required-star">*</span></label>
              <div className="catering-products-grid">
                {cateringProducts.map(product => (
                  <div 
                    key={product.id} 
                    className={`catering-product-card ${selectedItems.includes(product.id) ? 'selected' : ''}`}
                    onClick={() => toggleItem(product.id)}
                  >
                    <div className="product-check">
                      {selectedItems.includes(product.id) ? '✓' : '+'}
                    </div>
                    <div className="product-icon">{product.icon}</div>
                    <h4>{product.name}</h4>
                    <div className="product-meta">
                      <span className="product-min">Min: {product.minQty}</span>
                      <span className="product-price">{product.price}</span>
                    </div>
                  </div>
                ))}
              </div>
              {selectedItems.length === 0 && <p className="error-text">Please select items to proceed</p>}
            </div>
            <div className="form-group">
              <label>Additional Requirements</label>
              <textarea placeholder="Tell us about your menu preferences or special requests..." rows="4"></textarea>
            </div>
            <button type="submit" className="submit-inquiry-btn">Submit Inquiry</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Catering;

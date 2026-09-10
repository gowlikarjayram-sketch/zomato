import React, { useState } from 'react';
import './Home.css';

const categories = [
  { id: 'all', name: 'All Cravings', icon: '🍽️' },
  { id: 'biryani', name: 'Biryani', icon: '🍛' },
  { id: 'north_indian', name: 'North Indian', icon: '🥘' },
  { id: 'south_indian', name: 'South Indian', icon: '🥞' },
  { id: 'street_food', name: 'Street Food', icon: '🧆' },
  { id: 'chinese', name: 'Desi Chinese', icon: '🍜' },
  { id: 'desserts', name: 'Mithai & Desserts', icon: '🍨' },
];

const featuredRestaurants = [
  {
    id: 1,
    name: 'Paradise Biryani Mahal',
    cuisine: 'Hyderabadi Biryani • Mughlai • Kebabs',
    rating: '4.9',
    time: '20-25 min',
    deliveryFee: 'Free',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
    tag: 'Crowd Favorite 🔥',
  },
  {
    id: 2,
    name: 'Udupi Grand Tiffin Center',
    cuisine: 'Masala Dosa • Idli Vada • Filter Coffee',
    rating: '4.8',
    time: '15-20 min',
    deliveryFee: 'Free',
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80',
    tag: 'Pure Veg 🌱',
  },
  {
    id: 3,
    name: 'Punjab Dhaba Express',
    cuisine: 'Butter Chicken • Dal Makhani • Butter Naan',
    rating: '4.9',
    time: '20-30 min',
    deliveryFee: '₹25',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80',
    tag: 'Top Rated ⭐',
  },
  {
    id: 4,
    name: 'Chowringhee Desi Chinese',
    cuisine: 'Hakka Noodles • Chilli Paneer • Momos',
    rating: '4.7',
    time: '20-25 min',
    deliveryFee: '₹20',
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80',
    tag: 'Quick Bites 🥟',
  },
];

const topDishes = [
  {
    id: 101,
    name: 'Hyderabadi Chicken Dum Biryani',
    category: 'biryani',
    price: 249,
    rating: '4.9',
    restaurant: 'Paradise Biryani Mahal',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
    tag: 'Best Seller 🍛',
    diet: 'non_veg',
  },
  {
    id: 102,
    name: 'Special Paneer Butter Masala',
    category: 'north_indian',
    price: 199,
    rating: '4.8',
    restaurant: 'Punjab Dhaba Express',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80',
    tag: 'Creamy Rich',
    diet: 'veg',
  },
  {
    id: 103,
    name: 'Butter Masala Dosa + Sambar Combo',
    category: 'south_indian',
    price: 120,
    rating: '4.9',
    restaurant: 'Udupi Grand Tiffin',
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80',
    tag: 'Crispy Desi',
    diet: 'veg',
  },
  {
    id: 104,
    name: 'Delhi Style Butter Pav Bhaji (2 Pav)',
    category: 'street_food',
    price: 140,
    rating: '4.8',
    restaurant: 'Chaat Chowk',
    image: 'https://shwetainthekitchen.com/wp-content/uploads/2022/07/Pav-bhaji.jpg',
    tag: 'Street Special',
    diet: 'veg',
  },
  {
    id: 105,
    name: 'Veg Hakka Noodles & Manchurian',
    category: 'chinese',
    price: 160,
    rating: '4.7',
    restaurant: 'Chowringhee Chinese',
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=80',
    tag: 'Desi Tadka 🍜',
    diet: 'veg',
  },
  {
    id: 106,
    name: 'Warm Gulab Jamun with Rabdi (2 pcs)',
    category: 'desserts',
    price: 90,
    rating: '4.9',
    restaurant: 'Punjab Dhaba Express',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80',
    tag: 'Sweet Delight 🍨',
    diet: 'veg',
  },
];

export default function Home({ onNavigate, onAddToCart }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedVoucher, setCopiedVoucher] = useState(null);

  const filteredDishes = topDishes.filter((dish) => {
    const matchesCategory = selectedCategory === 'all' || dish.category === selectedCategory;
    const matchesSearch =
      dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dish.restaurant.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCopyVoucher = (code) => {
    navigator.clipboard?.writeText(code);
    setCopiedVoucher(code);
    setTimeout(() => setCopiedVoucher(null), 2500);
  };

  return (
    <div className="home-container">
      {/*  HERO SECTION  */}
      <section className="home-hero-section">
        <div className="hero-content-left">
          <div className="hero-live-badge">
            <span className="live-pulse-dot" />
            <span>Fast Delivery • Over 50+ Local Kitchens</span>
          </div>

          <h1 className="hero-main-title">
            Hungry? Order Desi Food <br />
            <span className="hero-gradient-text">Delivered Hot to Your Door.</span>
          </h1>

          <p className="hero-description">
            From spicy Hyderabadi Biryani to crispy Udupi Dosas and Ghar Ka Khana thalis, explore the best budget-friendly meals with super fast delivery.
          </p>

          {/* Interactive Search Bar */}
          <div className="hero-interactive-search">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search for Biryani, Paneer Butter Masala, Dosa, Thali..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => setSearchQuery('')}
              >
                x
              </button>
            )}
            <button
              type="button"
              className="search-action-btn"
              onClick={() => onNavigate && onNavigate('menu')}
            >
              Explore Menu
            </button>
          </div>

          {/* Quick Filter Tag Chips */}
          <div className="hero-quick-tags">
            <span className="quick-tags-label">Popular Searches:</span>
            {['Dum Biryani', 'Paneer Masala', 'Masala Dosa', 'Pav Bhaji', 'Gulab Jamun'].map((tag) => (
              <button
                key={tag}
                type="button"
                className="quick-tag-chip"
                onClick={() => setSearchQuery(tag)}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Quick Action CTAs */}
          <div className="hero-cta-buttons">
            <button
              type="button"
              className="hero-primary-cta"
              onClick={() => onNavigate && onNavigate('restaurants')}
            >
              🍛 Top Restaurants →
            </button>
            <button
              type="button"
              className="hero-secondary-cta"
              onClick={() => onNavigate && onNavigate('cloud-kitchen')}
            >
              🍳 Ghar Ka Khana
            </button>
          </div>
        </div>

        {/* Hero Right Visual Column */}
        <div className="hero-visual-right">
          <div className="hero-ambient-glow" />
          <div className="hero-main-card">
            <img
              src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80"
              alt="Authentic Indian Dum Biryani"
              className="hero-food-image"
            />

            {/* Floating Live Badge 1 */}
            <div className="hero-float-badge float-speed">
              <span className="float-icon">⚡</span>
              <div>
                <strong>20-25 Mins</strong>
                <small>Hostel Drop Time</small>
              </div>
            </div>

            {/* Floating Live Badge 2 */}
            <div className="hero-float-badge float-rating">
              <span className="float-icon">⭐</span>
              <div>
                <strong>4.9 / 5.0</strong>
                <small>150k+ Happy Foodies</small>
              </div>
            </div>

            {/* Floating Live Badge 3 */}
            <div className="hero-float-badge float-promo">
              <span className="float-icon">🎁</span>
              <div>
                <strong>50% OFF</strong>
                <small>Code: WELCOME50</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/*  CRAVINGS CATEGORIES BAR  */}
      <section className="categories-carousel-section">
        <div className="section-header-row">
          <div>
            <span className="section-eyebrow">POPULAR CATEGORIES</span>
            <h2 className="section-title">What are you craving today?</h2>
          </div>
          <button
            type="button"
            className="view-all-link-btn"
            onClick={() => onNavigate && onNavigate('menu')}
          >
            Full Indian Menu →
          </button>
        </div>

        <div className="categories-pills-container">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`category-pill-btn ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              <span className="category-pill-icon">{cat.icon}</span>
              <span className="category-pill-name">{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ================= TRENDING DISHES GRID ================= */}
      <section className="trending-dishes-section">
        <div className="section-header-row">
          <div>
            <span className="section-eyebrow">TOP PICKS</span>
            <h2 className="section-title">Trending Dishes Near You</h2>
          </div>
          <span className="dishes-count-badge">
            Showing {filteredDishes.length} Items
          </span>
        </div>

        <div className="dishes-modern-grid">
          {filteredDishes.map((dish) => (
            <div key={dish.id} className="dish-showcase-card">
              <div className="dish-image-wrapper">
                <img src={dish.image} alt={dish.name} className="dish-img" />
                <span className="dish-tag-badge">{dish.tag}</span>
                <span className="dish-rating-badge">★ {dish.rating}</span>
              </div>

              <div className="dish-card-body">
                <div className="dish-meta-row">
                  <span className="dish-restaurant-name">{dish.restaurant}</span>
                  <span className="dish-price-tag">₹{dish.price}</span>
                </div>
                <h3 className="dish-heading">{dish.name}</h3>

                <button
                  type="button"
                  className="add-dish-cart-btn"
                  onClick={() => onAddToCart && onAddToCart(dish)}
                >
                  <span>+ Add to Cart</span>
                  <span className="btn-dish-price">₹{dish.price}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= FEATURED RESTAURANTS SECTION ================= */}
      <section className="featured-restaurants-section">
        <div className="section-header-row">
          <div>
            <span className="section-eyebrow">POPULAR SPOTS</span>
            <h2 className="section-title">Top Rated Dining Spots</h2>
          </div>
          <button
            type="button"
            className="view-all-link-btn"
            onClick={() => onNavigate && onNavigate('restaurants')}
          >
            All Restaurants →
          </button>
        </div>

        <div className="restaurants-modern-grid">
          {featuredRestaurants.map((res) => (
            <div
              key={res.id}
              className="restaurant-spotlight-card"
              onClick={() => onNavigate && onNavigate('restaurants')}
            >
              <div className="restaurant-thumb-wrap">
                <img src={res.image} alt={res.name} className="res-img" />
                <span className="res-tag-badge">{res.tag}</span>
                <span className="res-time-badge">⏱️ {res.time}</span>
              </div>

              <div className="restaurant-card-content">
                <div className="res-title-row">
                  <h3 className="res-name">{res.name}</h3>
                  <span className="res-rating-chip">★ {res.rating}</span>
                </div>
                <p className="res-cuisines">{res.cuisine}</p>
                <div className="res-footer-bar">
                  <span className="res-delivery-fee">
                    🚴 Delivery: <strong>{res.deliveryFee}</strong>
                  </span>
                  <span className="res-action-arrow">Order Now →</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= EXCLUSIVE PROMO OFFERS ================= */}
      <section className="promo-vouchers-section">
        <div className="voucher-banner voucher-warm">
          <div className="voucher-content">
            <span className="voucher-eyebrow">SPECIAL DISCOUNT</span>
            <h3>Flat 50% OFF on First 3 Orders</h3>
            <p>Use code WELCOME50 at checkout to unlock savings on your delivery.</p>
            <div className="voucher-code-chip-row">
              <span className="voucher-code">WELCOME50</span>
              <button
                type="button"
                className="copy-chip-btn"
                onClick={() => handleCopyVoucher('WELCOME50')}
              >
                {copiedVoucher === 'WELCOME50' ? '✓ Copied' : 'Copy Code'}
              </button>
            </div>
          </div>
          <div className="voucher-art-emoji">🍛🔥</div>
        </div>

        <div className="voucher-banner voucher-emerald">
          <div className="voucher-content">
            <span className="voucher-eyebrow">FREE FAST DELIVERY</span>
            <h3>Free Delivery on Orders Above ₹199</h3>
            <p>No coupon code needed. Auto-applied for all delivery orders.</p>
            <button
              type="button"
              className="claim-voucher-btn"
              onClick={() => onNavigate && onNavigate('menu')}
            >
              Order Now & Save →
            </button>
          </div>
          <div className="voucher-art-emoji">🛵💨</div>
        </div>
      </section>

      {/* ================= VALUE PROPOSITIONS ================= */}
      <section className="foodnest-values-section">
        <div className="value-card">
          <div className="value-icon-box">⚡</div>
          <h3>20-Min Fast Drop</h3>
          <p>Quick doorstep delivery straight to your location.</p>
        </div>
        <div className="value-card">
          <div className="value-icon-box">💰</div>
          <h3>Pocket Friendly</h3>
          <p>Affordable meals starting at just ₹80 with verified clean kitchen hygiene.</p>
        </div>
        <div className="value-card">
          <div className="value-icon-box">🥘</div>
          <h3>Authentic Ghar Ka Khana</h3>
          <p>Homestyle thalis and daily mess meals cooked by verified home chefs.</p>
        </div>
        <div className="value-card">
          <div className="value-icon-box">📱</div>
          <h3>UPI & Cash on Delivery</h3>
          <p>Pay smoothly via Google Pay, PhonePe, Paytm or cash on delivery.</p>
        </div>
      </section>
    </div>
  );
}
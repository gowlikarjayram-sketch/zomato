import React, { useState, useEffect } from 'react';
import './App.css';
import Home from './Home';
import Restaurant from './Restaurant';
import Menu from './Menu';
import CloudKitchen from './Cloud_kitchen';
import About from './About';
import Signup from './Signup';
import Catering from './Catering';
import RestaurantDashboard from './RestaurantDashboard';
import CloudKitchenDashboard from './CloudKitchenDashboard';
import CateringDashboard from './CateringDashboard';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [cart, setCart] = useState([
    {
      id: 'demo-1',
      name: 'Special Hyderabadi Chicken Biryani',
      price: 249,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=300&q=80',
      restaurant: 'Paradise Biryani Mahal',
    },
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [user, setUser] = useState(null);

  // Sync hash routing
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (['signup', 'login', 'register', 'auth'].includes(hash)) setCurrentPage('signup');
      else if (['home', 'main'].includes(hash)) setCurrentPage('home');
      else if (['restaurants', 'restaurant'].includes(hash)) setCurrentPage('restaurants');
      else if (['menu', 'dishes'].includes(hash)) setCurrentPage('menu');
      else if (['cloud-kitchen', 'cloudkitchen'].includes(hash)) setCurrentPage('cloud-kitchen');
      else if (['about'].includes(hash)) setCurrentPage('about');
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const navigateTo = (pageName) => {
    setCurrentPage(pageName);
    window.location.hash = pageName;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart operations
  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id || i.name === item.name);
      if (existing) {
        return prev.map((i) =>
          (i.id === item.id || i.name === item.name) ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      const rawPrice = typeof item.price === 'string' ? parseFloat(item.price.replace(/[^0-9.]/g, '')) : item.price;
      return [...prev, { ...item, price: rawPrice || 199, quantity: 1 }];
    });
    showToast(`🍽️ Added "${item.name}" to cart!`);
  };

  const updateQuantity = (itemId, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === itemId || item.name === itemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (itemId) => {
    setCart((prev) => prev.filter((i) => i.id !== itemId && i.name !== itemId));
    showToast('🗑️ Item removed from cart');
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (['CAMPUS50', 'FEAST50', 'WELCOME50', 'FOODNEST50'].includes(code)) {
      setDiscountPercent(50);
      showToast('🎉 50% Welcome discount applied!');
    } else if (code === 'WELCOME20') {
      setDiscountPercent(20);
      showToast('🎉 20% discount applied!');
    } else {
      showToast('⚠️ Invalid coupon. Try WELCOME50');
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setOrderPlaced(true);
    setTimeout(() => {
      setCart([]);
      setOrderPlaced(false);
      setIsCartOpen(false);
      showToast('🚀 Order placed via UPI/Cash on Delivery! Delivering to your location in 25 mins.');
    }, 2000);
  };

  // Cart calculations in INR
  const totalItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const rawSubtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = Math.round((rawSubtotal * discountPercent) / 100);
  const deliveryFee = rawSubtotal >= 199 || rawSubtotal === 0 ? 0 : 35;
  const grandTotal = Math.max(0, rawSubtotal - discountAmount + (rawSubtotal > 0 ? deliveryFee : 0));

  if (user?.role === 'restaurant') {
    return <RestaurantDashboard user={user} onLogout={() => setUser(null)} />;
  }

  if (user?.role === 'cloud_kitchen') {
    return <CloudKitchenDashboard user={user} onLogout={() => setUser(null)} />;
  }

  if (user?.role === 'caterings') {
    return <CateringDashboard user={user} onLogout={() => setUser(null)} />;
  }

  return (
    <div className="foodnest-app-container">
      {/* Toast Notification */}
      {toastMessage && <div className="global-toast-pill">{toastMessage}</div>}

      {/* Global Unified Navigation Bar */}
      <header className="global-top-navbar">
        <div className="nav-inner-container">
          {/* Brand Logo */}
          <div className="nav-logo" onClick={() => navigateTo('home')}>
            <span className="nav-logo-icon">🍽️</span>
            <span className="nav-logo-text">FoodNest</span>
          </div>

          {/* Nav Links */}
          <nav className="nav-menu-links">
            <button
              type="button"
              className={`nav-link-item ${currentPage === 'home' ? 'active' : ''}`}
              onClick={() => navigateTo('home')}
            >
              Home
            </button>
            <button
              type="button"
              className={`nav-link-item ${currentPage === 'restaurants' ? 'active' : ''}`}
              onClick={() => navigateTo('restaurants')}
            >
              Restaurants
            </button>
            <button
              type="button"
              className={`nav-link-item ${currentPage === 'menu' ? 'active' : ''}`}
              onClick={() => navigateTo('menu')}
            >
              Menu
            </button>
            <button
              type="button"
              className={`nav-link-item ${currentPage === 'cloud-kitchen' ? 'active' : ''}`}
              onClick={() => navigateTo('cloud-kitchen')}
            >
              Cloud Kitchen
            </button>
            <button
              type="button"
              className={`nav-link-item ${currentPage === 'about' ? 'active' : ''}`}
              onClick={() => navigateTo('about')}
            >
              About
            </button>
            <button
              type="button"
              className={`nav-link-item ${currentPage === 'catering' ? 'active' : ''}`}
              onClick={() => navigateTo('catering')}
            >
              Catering
            </button>
          </nav>

          {/* Nav Right Controls */}
          <div className="nav-right-actions">
            {/* Interactive Cart Button */}
            <button
              type="button"
              className="nav-cart-btn"
              onClick={() => setIsCartOpen(true)}
              aria-label="View Cart"
            >
              <span className="cart-icon">🛒</span>
              <span className="cart-text">Cart</span>
              {totalItemsCount > 0 && <span className="cart-badge-count">{totalItemsCount}</span>}
            </button>

            {/* Auth Button */}
            {user ? (
              <button
                type="button"
                className="nav-auth-btn active"
                onClick={() => setUser(null)}
              >
                <span>👤</span>
                <span>Logout ({user.name})</span>
              </button>
            ) : (
              <button
                type="button"
                className={`nav-auth-btn ${currentPage === 'signup' ? 'active' : ''}`}
                onClick={() => navigateTo('signup')}
              >
                <span>👤</span>
                <span>Sign In / Sign Up</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Active Page Content */}
      <main className="global-page-main">
        {currentPage === 'home' && <Home onNavigate={navigateTo} onAddToCart={addToCart} />}
        {currentPage === 'restaurants' && <Restaurant onNavigate={navigateTo} onAddToCart={addToCart} />}
        {currentPage === 'menu' && <Menu onNavigate={navigateTo} onAddToCart={addToCart} />}
        {currentPage === 'cloud-kitchen' && <CloudKitchen onNavigate={navigateTo} onAddToCart={addToCart} />}
        {currentPage === 'about' && <About onNavigate={navigateTo} />}
        {currentPage === 'signup' && <Signup onNavigate={navigateTo} onLogin={(u) => setUser(u)} />}
        {currentPage === 'catering' && <Catering onNavigate={navigateTo} />}
      </main>

      {/* Global Interactive Cart Drawer */}
      {isCartOpen && (
        <div className="cart-drawer-backdrop" onClick={() => setIsCartOpen(false)}>
          <aside className="cart-drawer-panel" onClick={(e) => e.stopPropagation()}>
            <div className="cart-drawer-header">
              <div className="cart-title-row">
                <span className="cart-icon-lg">🛍️</span>
                <h2>Your Food Bag</h2>
                <span className="cart-items-chip">{totalItemsCount} items</span>
              </div>
              <button
                type="button"
                className="cart-close-btn"
                onClick={() => setIsCartOpen(false)}
              >
                ✕
              </button>
            </div>

            {/* Free Delivery Threshold Banner */}
            <div className="cart-delivery-banner">
              {rawSubtotal >= 199 ? (
                <div className="free-delivery-unlocked">
                  🎉 <strong>Free Delivery Unlocked!</strong> (Order above ₹199)
                </div>
              ) : (
                <div className="delivery-progress-wrap">
                  <div className="delivery-progress-text">
                    Add <strong>₹{199 - rawSubtotal}</strong> more for <strong>FREE Delivery</strong>
                  </div>
                  <div className="progress-bar-bg">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${Math.min(100, (rawSubtotal / 199) * 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Cart Items List */}
            <div className="cart-items-scroll">
              {cart.length === 0 ? (
                <div className="empty-cart-state">
                  <span className="empty-cart-emoji">🍽️</span>
                  <h3>Your Bag is Empty</h3>
                  <p>Order delicious Biryani, Dosas, Thalis & Snacks!</p>
                  <button
                    type="button"
                    className="browse-dishes-btn"
                    onClick={() => {
                      setIsCartOpen(false);
                      navigateTo('menu');
                    }}
                  >
                    Browse Menu 🍛
                  </button>
                </div>
              ) : (
                cart.map((item, index) => (
                  <div key={item.id || index} className="cart-item-row">
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=150'}
                      alt={item.name}
                      className="cart-item-thumb"
                    />
                    <div className="cart-item-details">
                      <div className="cart-item-name">{item.name}</div>
                      <div className="cart-item-restaurant">{item.restaurant || 'FoodNest Kitchen'}</div>
                      <div className="cart-item-price">₹{item.price * item.quantity}</div>
                    </div>

                    <div className="cart-qty-controls">
                      <button
                        type="button"
                        className="qty-btn minus"
                        onClick={() => updateQuantity(item.id || item.name, -1)}
                      >
                        -
                      </button>
                      <span className="qty-number">{item.quantity}</span>
                      <button
                        type="button"
                        className="qty-btn plus"
                        onClick={() => updateQuantity(item.id || item.name, 1)}
                      >
                        +
                      </button>
                      <button
                        type="button"
                        className="remove-item-btn"
                        onClick={() => removeFromCart(item.id || item.name)}
                        title="Remove item"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Cart Footer & Checkout */}
            {cart.length > 0 && (
              <div className="cart-drawer-footer">
                {/* Coupon Code Input */}
                <div className="cart-promo-row">
                  <input
                    type="text"
                    className="cart-promo-input"
                    placeholder="Coupon (e.g. WELCOME50)"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                  />
                  <button
                    type="button"
                    className="cart-promo-apply-btn"
                    onClick={handleApplyPromo}
                  >
                    Apply
                  </button>
                </div>

                {/* Subtotal & Totals Summary */}
                <div className="cart-receipt-breakdown">
                  <div className="receipt-line">
                    <span>Subtotal</span>
                    <span>₹{rawSubtotal}</span>
                  </div>
                  {discountPercent > 0 && (
                    <div className="receipt-line discount-line">
                      <span>Welcome Discount ({discountPercent}%)</span>
                      <span>-₹{discountAmount}</span>
                    </div>
                  )}
                  <div className="receipt-line">
                    <span>Delivery Fee</span>
                    <span>{deliveryFee === 0 ? <strong style={{ color: '#10b981' }}>FREE</strong> : `₹${deliveryFee}`}</span>
                  </div>
                  <div className="receipt-line grand-total-line">
                    <span>Total Amount</span>
                    <span className="grand-total-price">₹{grandTotal}</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  type="button"
                  className="cart-checkout-btn"
                  onClick={handleCheckout}
                  disabled={orderPlaced}
                >
                  {orderPlaced ? (
                    <span className="order-placing-spinner">
                      <span className="spin-dot" /> Confirming Order...
                    </span>
                  ) : (
                    <span>Pay via UPI / COD • ₹{grandTotal} 🚀</span>
                  )}
                </button>
              </div>
            )}
          </aside>
        </div>
      )}

      {/* Global Rich Footer */}
      {currentPage !== 'signup' && (
        <footer className="global-rich-footer">
          <div className="footer-top-grid">
            <div className="footer-brand-col">
              <div className="footer-brand-logo">
                <span>🍽️</span> FoodNest
              </div>
              <p className="footer-tagline">
                India's favorite food discovery and delivery web app. Connecting neighborhoods and foodies with verified local restaurants and homemade cloud kitchens.
              </p>
              <div className="footer-rating-pill">
                ⭐ <strong>4.9 / 5.0</strong> loved by 150,000+ Indian foodies
              </div>
            </div>

            <div className="footer-links-col">
              <h4>Quick Navigation</h4>
              <ul>
                <li><a href="#home" onClick={(e) => { e.preventDefault(); navigateTo('home'); }}>Home</a></li>
                <li><a href="#restaurants" onClick={(e) => { e.preventDefault(); navigateTo('restaurants'); }}>Top Restaurants</a></li>
                <li><a href="#menu" onClick={(e) => { e.preventDefault(); navigateTo('menu'); }}>Indian Dishes Menu</a></li>
                <li><a href="#cloud-kitchen" onClick={(e) => { e.preventDefault(); navigateTo('cloud-kitchen'); }}>Ghar Ka Khana Cloud</a></li>
                <li><a href="#about" onClick={(e) => { e.preventDefault(); navigateTo('about'); }}>About Project</a></li>
              </ul>
            </div>

            <div className="footer-links-col">
              <h4>Exclusive Offers</h4>
              <ul>
                <li><a href="#signup" onClick={(e) => { e.preventDefault(); navigateTo('signup'); }}>50% Welcome Bonus (WELCOME50)</a></li>
                <li><a href="#signup" onClick={(e) => { e.preventDefault(); navigateTo('signup'); }}>Midnight Delivery</a></li>
                <li><a href="#signup" onClick={(e) => { e.preventDefault(); navigateTo('signup'); }}>Partner Restaurant Login</a></li>
                <li><a href="#about" onClick={(e) => { e.preventDefault(); navigateTo('about'); }}>Hygiene & Safety Checks</a></li>
              </ul>
            </div>

            <div className="footer-newsletter-col">
              <h4>Foodie Club 🍕</h4>
              <p>Get secret midnight deals and weekend discount vouchers sent to your email.</p>
              <div className="footer-subscribe-box">
                <input type="email" placeholder="Enter your email..." />
                <button type="button" onClick={() => showToast('🎉 Subscribed to Foodie Club!')}>
                  Join
                </button>
              </div>
            </div>
          </div>

          <div className="footer-bottom-bar">
            <p>© 2026 FoodNest - Web Development Project. Built with React & Vite.</p>
            <div className="footer-legal-links">
              <a href="#privacy">Privacy</a>
              <span>•</span>
              <a href="#terms">Terms</a>
              <span>•</span>
              <a href="#about">Project Info</a>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

export default App;

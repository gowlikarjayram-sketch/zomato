import { useState, useEffect } from 'react';
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
import CateringMenu from './CateringMenu';
import PartnerSignup from './PartnerSignup';
import AdminDashboard from './AdminDashboard';

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
  const [showConfirm, setShowConfirm] = useState(false);
  const [user, setUser] = useState(null);
  
  // Delivery details & options
  const [deliveryDetails, setDeliveryDetails] = useState({
    address: '',
    instructions: ''
  });
  const [paymentMode, setPaymentMode] = useState('cod'); // 'cod' | 'upi'
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);

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
      else if (['catering'].includes(hash)) setCurrentPage('catering');
      else if (['catering-menu', 'cateringmenu'].includes(hash)) setCurrentPage('catering-menu');
      else if (['partner-signup', 'partnersignup'].includes(hash)) setCurrentPage('partner-signup');
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

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      showToast('⚠️ Geolocation is not supported by your browser');
      return;
    }

    setIsFetchingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=en`);
          const data = await response.json();
          
          if (data && data.display_name) {
            setDeliveryDetails({ ...deliveryDetails, address: data.display_name });
            showToast('📍 Location detected successfully!');
          } else {
            setDeliveryDetails({ ...deliveryDetails, address: `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}` });
            showToast('📍 Coordinates detected');
          }
        } catch (error) {
          setDeliveryDetails({ ...deliveryDetails, address: `Lat: ${position.coords.latitude.toFixed(4)}, Lng: ${position.coords.longitude.toFixed(4)}` });
          showToast('📍 Coordinates detected (Address lookup failed)');
        } finally {
          setIsFetchingLocation(false);
        }
      },
      (error) => {
        setIsFetchingLocation(false);
        showToast('⚠️ Location access denied or failed');
      },
      { timeout: 10000 }
    );
  };

  const handleCheckoutClick = () => {
    if (cart.length === 0) return;
    
    if (!deliveryDetails.address.trim()) {
      showToast('⚠️ Please enter your delivery address');
      return;
    }

    setShowConfirm(true);
  };

  const handleConfirmOrder = async () => {
    setShowConfirm(false);
    setOrderPlaced(true);

    try {
      // 1. Format the cart items into a readable string
      const itemsString = cart.map(item => `${item.quantity}x ${item.name}`).join(', ');

      // 2. We must calculate grandTotal here since it hasn't evaluated yet in the file
      const rawSub = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
      const discountAmt = Math.round((rawSub * discountPercent) / 100);
      const fee = rawSub >= 199 || rawSub === 0 ? 0 : 35;
      const computedTotal = Math.max(0, rawSub - discountAmt + (rawSub > 0 ? fee : 0));

      const response = await fetch('http://localhost:5000/api/restaurant/public/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: itemsString,
          amount: `₹${computedTotal}`
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create order on backend');
      }

      setCart([]);
      setIsCartOpen(false);
      showToast(`🚀 Order placed via ${paymentMode === 'cod' ? 'Cash on Delivery' : 'UPI'}! Delivering to your location in 25 mins.`);
    } catch (err) {
      showToast('⚠️ Failed to place order. Is a Restaurant Partner registered?');
      console.error(err);
    } finally {
      setOrderPlaced(false);
    }
  };

  // Cart calculations in INR
  const totalItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const rawSubtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = Math.round((rawSubtotal * discountPercent) / 100);
  const deliveryFee = rawSubtotal >= 199 || rawSubtotal === 0 ? 0 : 35;
  const grandTotal = Math.max(0, rawSubtotal - discountAmount + (rawSubtotal > 0 ? deliveryFee : 0));

  if (user?.role === 'admin') {
    return <AdminDashboard user={user} onLogout={() => setUser(null)} onNavigate={navigateTo} />;
  }

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
        {currentPage === 'partner-signup' && <PartnerSignup onLogin={(userData) => { setUser(userData); navigateTo('home'); }} onNavigate={navigateTo} />}
        {currentPage === 'home' && <Home onNavigate={navigateTo} onAddToCart={addToCart} />}
        {currentPage === 'restaurants' && <Restaurant onNavigate={navigateTo} onAddToCart={addToCart} />}
        {currentPage === 'menu' && <Menu onNavigate={navigateTo} onAddToCart={addToCart} />}
        {currentPage === 'cloud-kitchen' && <CloudKitchen onNavigate={navigateTo} onAddToCart={addToCart} />}
        {currentPage === 'about' && <About onNavigate={navigateTo} />}
        {currentPage === 'signup' && <Signup onNavigate={navigateTo} onLogin={(u) => { setUser(u); navigateTo('home'); }} />}
        {currentPage === 'catering' && <Catering onNavigate={navigateTo} />}
        {currentPage === 'catering-menu' && <CateringMenu onNavigate={navigateTo} />}
        {currentPage === 'admin-dashboard' && <AdminDashboard onNavigate={navigateTo} />}
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

              {/* Delivery Options & Receipt Breakdown (Now Scrollable) */}
              {cart.length > 0 && (
                <>
                  <div className="cart-delivery-options" style={{ marginTop: '20px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '10px 0 6px' }}>
                    <h4 style={{ margin: 0, fontSize: '0.95rem' }}>Delivery Details</h4>
                    <button 
                      type="button" 
                      onClick={handleGetLocation}
                      disabled={isFetchingLocation}
                      style={{ background: 'none', border: 'none', color: '#ff4757', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', padding: 0 }}
                    >
                      {isFetchingLocation ? 'Detecting...' : '📍 Use Current Location'}
                    </button>
                  </div>
                  <textarea 
                    className="delivery-input" 
                    placeholder="Full Delivery Address *"
                    value={deliveryDetails.address}
                    onChange={(e) => setDeliveryDetails({...deliveryDetails, address: e.target.value})}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1.5px solid #334155', marginBottom: '16px', minHeight: '80px', fontFamily: 'inherit', color: '#ffffff', backgroundColor: '#1e293b', fontSize: '0.95rem', resize: 'vertical' }}
                  ></textarea>
                  <h4 style={{ margin: '0 0 8px', fontSize: '0.95rem' }}>Payment Mode</h4>
                  <div className="delivery-cards-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                    <div 
                      onClick={() => setPaymentMode('cod')}
                      style={{ 
                        border: paymentMode === 'cod' ? '2px solid #ff4757' : '1px solid #e2e8f0', 
                        backgroundColor: paymentMode === 'cod' ? '#fff0f1' : '#fff',
                        padding: '12px 8px', borderRadius: '12px', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s ease' 
                      }}>
                      <div style={{ fontSize: '1.6rem', marginBottom: '4px' }}>💵</div>
                      <div style={{ fontWeight: '700', fontSize: '0.85rem', color: '#1e293b' }}>Cash on Delivery</div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Pay at door</div>
                    </div>

                    <div 
                      onClick={() => setPaymentMode('upi')}
                      style={{ 
                        border: paymentMode === 'upi' ? '2px solid #ff4757' : '1px solid #e2e8f0', 
                        backgroundColor: paymentMode === 'upi' ? '#fff0f1' : '#fff',
                        padding: '12px 8px', borderRadius: '12px', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s ease' 
                      }}>
                      <div style={{ fontSize: '1.6rem', marginBottom: '4px' }}>📱</div>
                      <div style={{ fontWeight: '700', fontSize: '0.85rem', color: '#1e293b' }}>Pay via UPI</div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>GPay, PhonePe, Paytm</div>
                    </div>
                  </div>
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
                </>
              )}
            </div>

            {/* Sticky Checkout Button Footer */}
            {cart.length > 0 && (
              <div className="cart-drawer-footer">
                {/* Checkout Button */}
                {showConfirm ? (
                  <div className="cart-confirm-box" style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                    <h4 style={{ margin: '0 0 10px', color: '#0f172a' }}>Confirm Delivery?</h4>
                    <p style={{ margin: '0 0 16px', fontSize: '0.85rem', color: '#64748b' }}>Deliver to: <strong>{deliveryDetails.address}</strong></p>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button 
                        type="button" 
                        onClick={() => setShowConfirm(false)}
                        style={{ flex: 1, padding: '12px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '30px', fontWeight: 'bold', cursor: 'pointer', color: '#64748b' }}
                      >
                        Cancel
                      </button>
                      <button 
                        type="button" 
                        onClick={handleConfirmOrder}
                        className="cart-checkout-btn"
                        style={{ flex: 1, margin: 0, padding: '12px' }}
                      >
                        Yes, Confirm!
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="cart-checkout-btn"
                    onClick={handleCheckoutClick}
                    disabled={orderPlaced}
                  >
                    {orderPlaced ? (
                      <span className="order-placing-spinner">
                        <span className="spin-dot" /> Confirming Order...
                      </span>
                    ) : (
                      <span>{paymentMode === 'cod' ? 'Buy' : 'Pay via UPI'} • ₹{grandTotal} 🚀</span>
                    )}
                  </button>
                )}
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

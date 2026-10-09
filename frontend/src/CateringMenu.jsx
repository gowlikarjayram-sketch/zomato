import { useState, useEffect } from 'react';
import './CateringMenu.css';

const dummyProducts = [
  { id: 'c1', name: 'Hyderabadi Chicken Biryani (Bulk)', minQty: '50 plates', price: '₹12,000', icon: '🍗' },
  { id: 'c2', name: 'Paneer Butter Masala & Naan', minQty: '50 plates', price: '₹9,500', icon: '🥘' },
  { id: 'c3', name: 'Assorted Desi Desserts', minQty: '100 pcs', price: '₹3,000', icon: '🍧' },
  { id: 'c4', name: 'Premium Veg Thali Setup', minQty: '50 plates', price: '₹15,000', icon: '🍛' },
  { id: 'c5', name: 'Live Dosa Counter', minQty: '100 plates', price: '₹8,000', icon: '🥞' },
  { id: 'c6', name: 'Street Food Chaat Counter', minQty: '100 plates', price: '₹6,500', icon: '🥙' },
];

const CateringMenu = () => {
  const [cateringProducts, setCateringProducts] = useState(dummyProducts);
  const [cart, setCart] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showInquiryForm, setShowInquiryForm] = useState(false);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/catering/public/packages');
        if (res.ok) {
          const pkgs = await res.json();
          if (pkgs.length > 0) {
            const mappedPkgs = pkgs.map(p => ({
              id: p._id,
              name: p.name,
              minQty: '50 plates',
              price: p.price,
              icon: p.image || '🍛',
              caterer: p.user?.businessDetails?.businessName || p.user?.name || 'Catering Partner'
            }));
            setCateringProducts([...dummyProducts, ...mappedPkgs]);
          }
        }
      } catch (err) {
        console.error('Failed to load packages:', err);
      }
    };
    fetchPackages();
  }, []);

  const getQuantity = (id) => {
    const item = cart.find(i => i.id === id);
    return item ? item.quantity : 0;
  };

  const updateQuantity = (product, delta) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        const newQty = existing.quantity + delta;
        if (newQty <= 0) return prev.filter(i => i.id !== product.id);
        return prev.map(i => i.id === product.id ? { ...i, quantity: newQty } : i);
      } else {
        if (delta > 0) return [...prev, { ...product, quantity: 1 }];
        return prev;
      }
    });
  };

  const calculateDisplayPrice = (product, qty) => {
    let basePriceNum = 0;
    if (typeof product.price === 'number') {
      basePriceNum = product.price;
    } else if (typeof product.price === 'string') {
      basePriceNum = parseFloat(product.price.replace(/[^0-9.]/g, '')) || 0;
    }
    const multiplier = qty > 0 ? qty : 1;
    const total = basePriceNum * multiplier;
    return '₹' + total.toLocaleString('en-IN');
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert("Please select at least one product for your bulk order!");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const selectedNames = cart.map(item => `${item.quantity}x ${item.name}`).join(', ');

      const inquiryData = {
        client: e.target.clientName.value,
        phone: e.target.phone.value,
        event: e.target.eventType.value,
        guests: Number(e.target.guests.value) || 50,
        items: selectedNames
      };

      const res = await fetch('http://localhost:5000/api/catering/public/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inquiryData)
      });

      if (!res.ok) throw new Error('Failed to submit inquiry');

      alert(`Inquiry submitted successfully! We will contact you soon with a custom quote.`);
      setCart([]);
      setShowInquiryForm(false);
      e.target.reset();
    } catch (err) {
      alert("Sorry, we couldn't process your request right now. Please ensure your details are correct.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="catering-menu-page">
      <header className="catering-menu-header">
        <h1>Catering Packages & Deals</h1>
        <p>Select your favorite bulk packages and build your custom inquiry</p>
      </header>

      <div className="catering-layout">
        {/* Main Menu Grid */}
        <div className="catering-products-grid">
          {cateringProducts.map(product => {
            const qty = getQuantity(product.id);
            return (
              <div key={product.id} className={`catering-product-card ${qty > 0 ? 'selected' : ''}`}>
                <div className="product-image-container">
                  {product.icon && product.icon.startsWith('http') ? (
                    <img src={product.icon} alt={product.name} />
                  ) : (
                    <div className="product-icon">{product.icon}</div>
                  )}
                </div>
                
                <div className="product-details">
                  <h4>{product.name}</h4>
                  {product.caterer && <p className="caterer-name">by {product.caterer}</p>}
                  
                  <div className="product-meta">
                    <span className="product-min">Min: {product.minQty}</span>
                    <span className="product-price">{calculateDisplayPrice(product, qty)}</span>
                  </div>

                  <div className="catering-qty-controls">
                    {qty > 0 ? (
                      <>
                        <button className="qty-btn" onClick={() => updateQuantity(product, -1)}>-</button>
                        <span className="qty-val">{qty}</span>
                        <button className="qty-btn" onClick={() => updateQuantity(product, 1)}>+</button>
                      </>
                    ) : (
                      <button className="add-pkg-btn" onClick={() => updateQuantity(product, 1)}>Add to Inquiry</button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Floating Cart / Checkout Button */}
        {cart.length > 0 && !showInquiryForm && (
          <div className="floating-catering-cart" onClick={() => setShowInquiryForm(true)}>
            <div className="floating-cart-info">
              <span className="badge">{cart.reduce((sum, i) => sum + i.quantity, 0)} items</span>
              <span className="label">Proceed to Inquiry</span>
            </div>
            <span className="arrow">➔</span>
          </div>
        )}
      </div>

      {/* Inquiry Modal */}
      {showInquiryForm && (
        <div className="custom-modal-backdrop" onClick={() => setShowInquiryForm(false)}>
          <div className="custom-modal-card inquiry-modal" onClick={e => e.stopPropagation()}>
            <div className="inquiry-modal-header">
              <h3>Submit Catering Inquiry</h3>
              <button className="close-btn" onClick={() => setShowInquiryForm(false)}>✕</button>
            </div>
            
            <div className="inquiry-cart-summary">
              <h4>Selected Packages:</h4>
              <ul>
                {cart.map(item => (
                  <li key={item.id}>
                    <span className="item-qty">{item.quantity}x</span>
                    <span className="item-name">{item.name}</span>
                  </li>
                ))}
              </ul>
            </div>

            <form className="inquiry-form" onSubmit={handleFormSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Name *</label>
                  <input type="text" name="clientName" placeholder="Your Name" required />
                </div>
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input type="tel" name="phone" placeholder="10-digit number" pattern="[0-9]{10}" title="10 digit phone number" required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Event Type *</label>
                  <select name="eventType" required>
                    <option value="">Select Event Type</option>
                    <option value="wedding">Wedding / Reception</option>
                    <option value="corporate">Corporate Event</option>
                    <option value="party">Birthday / Private Party</option>
                    <option value="college">College Fest</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Estimated Guests *</label>
                  <input type="number" name="guests" placeholder="e.g. 150" min="1" required />
                </div>
              </div>
              
              <button type="submit" className="submit-inquiry-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Inquiry Request'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CateringMenu;

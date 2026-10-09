import { useState, useEffect } from 'react';
import './Restaurant.css';

const restaurantData = [
  {
    id: 1,
    name: 'Paradise Biryani Mahal',
    rating: 4.9,
    reviewCount: 3420,
    deliveryTime: '20-30 mins',
    deliveryFee: 'Free',
    cuisines: 'Hyderabadi Biryani • Mughlai • Kebabs',
    address: 'Near City Center, Bangalore',
    phone: '+91 98765 43210',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1200&q=80',
    tag: 'Crowd Favorite 🔥',
    menuItems: [
      {
        id: 11,
        name: 'Special Chicken Dum Biryani',
        category: 'biryani',
        price: 249,
        rating: 4.9,
        description: 'Authentic Hyderabadi basmati dum biryani with marinated tender chicken, fried onions, and boiled egg.',
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=400&q=80',
      },
      {
        id: 12,
        name: 'Paneer Makhani Dum Biryani',
        category: 'biryani',
        price: 219,
        rating: 4.8,
        description: 'Fragrant saffron rice layered with tandoori spiced paneer cubes and caramelized onions.',
        image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvRjMqleneW3r9BRCIIHlgbT4Hx2vDcoQtC_EwyWM3TyQRf0eGfEDNMxM&s=10',
      },
      {
        id: 13,
        name: 'Murgh Malai Kebab (6 pcs)',
        category: 'starters',
        price: 220,
        rating: 4.8,
        description: 'Melt-in-mouth chicken chunks marinated in cream, cheese, and mild cardamom spice, roasted in tandoor.',
        image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=400&q=80',
      },
      {
        id: 14,
        name: 'Mirchi Ka Salan & Mixed Raita',
        category: 'sides',
        price: 49,
        rating: 4.7,
        description: 'Traditional peanut, sesame, and green chili gravy served with cooling spiced curd raita.',
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80',
      },
    ],
  },
  {
    id: 2,
    name: 'Udupi Grand Tiffin Center',
    rating: 4.8,
    reviewCount: 2890,
    deliveryTime: '15-20 mins',
    deliveryFee: 'Free',
    cuisines: 'South Indian • Pure Veg • Filter Coffee',
    address: 'Opposite Hostel Block 3, Bangalore',
    phone: '+91 91234 56789',
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=1200&q=80',
    tag: '100% Pure Veg 🌱',
    menuItems: [
      {
        id: 21,
        name: 'Special Ghee Masala Dosa',
        category: 'mains',
        price: 120,
        rating: 4.9,
        description: 'Crisp roasted dosa in pure desi ghee with potato masala, coconut chutney, and tangy sambar.',
        image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=400&q=80',
      },
      {
        id: 22,
        name: 'Steamed Idli & Medu Vada Combo',
        category: 'mains',
        price: 90,
        rating: 4.8,
        description: '2 soft button idlis and 1 crispy medu vada served with piping hot dal sambar and fresh tomato chutney.',
        image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=400&q=80',
      },
      {
        id: 23,
        name: 'puri bhaji',
        category: 'beverages',
        price: 40,
        rating: 4.9,
        description: 'Authentic frothy chicory filter coffee brewed fresh with full cream milk.',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMBp2i_myNxnL6VMzHRHEoEKEo71aPUdGW6YxLHOthVSGAQgKtH0ArASk2k-amdt7tMWfDVp7nIBVd6brpcOUnHPW0hPu8PWq-kbn_yY4&s=10',
      },
    ],
  },
  {
    id: 3,
    name: 'Punjab Dhaba Express',
    rating: 4.9,
    reviewCount: 4150,
    deliveryTime: '20-30 mins',
    deliveryFee: '₹25',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=1200&q=80',
    cuisines: 'North Indian • Punjabi Gravies • Thalis',
    address: 'Food Street, City Market, Bangalore',
    phone: '+91 99887 76655',
    tag: 'Budget Thalis 🍲',
    menuItems: [
      {
        id: 31,
        name: 'Butter Chicken & 2 Butter Naan',
        category: 'mains',
        price: 240,
        rating: 4.9,
        description: 'Classic tandoori shredded chicken in rich tomato, butter, and cream gravy with hot butter naan.',
        image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=400&q=80',
      },
      {
        id: 32,
        name: 'Punjabi Dal Makhani Thali',
        category: 'mains',
        price: 180,
        rating: 4.8,
        description: 'Black lentils slow cooked with butter, served with jeera rice, 2 rotis, salad, and gulab jamun.',
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80',
      },
      {
        id: 33,
        name: 'Amritsari Paneer Kulcha with Chole',
        category: 'starters',
        price: 150,
        rating: 4.8,
        description: 'Stuffed spiced paneer kulcha bread with spicy pindi chole and pickled onions.',
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80',
      },
    ],
  },
];

const menuCategories = [
  { id: 'all', name: 'All Dishes' },
  { id: 'biryani', name: 'Biryani' },
  { id: 'mains', name: 'Main Course & Thalis' },
  { id: 'starters', name: 'Tandoor & Starters' },
  { id: 'beverages', name: 'Beverages' },
  { id: 'sides', name: 'Breads & Accompaniments' },
];

export default function Restaurant({ onAddToCart }) {
  const [restaurants, setRestaurants] = useState(restaurantData);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(restaurantData[0].id);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [ratingFeedback, setRatingFeedback] = useState('');

  // Fetch real partners from the backend
  useEffect(() => {
    const fetchDynamicRestaurants = async () => {
      try {
        const [resUsers, resMenu] = await Promise.all([
          fetch('http://localhost:5000/api/restaurant/public/list'),
          fetch('http://localhost:5000/api/menu')
        ]);
        
        if (!resUsers.ok || !resMenu.ok) return;
        
        const data = await resUsers.json();
        const allMenuData = await resMenu.json();
        
        // Array of highly distinct fallback images to avoid them looking similar
        const fallbackImages = [
          'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80', // Interior
          'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1200&q=80', // Pizza flatlay
          'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80', // Healthy bowl
          'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=80'  // Burger
        ];

        // Transform the raw User documents into the rich UI format
        const dynamicRestaurants = data.map((user, index) => {
          // Find real menus for this specific restaurant
          const realMenus = allMenuData.filter(m => m.restaurant && m.restaurant._id === user._id);
          
          const mappedMenu = realMenus.length > 0 
            ? realMenus.map(m => {
                let defaultImg = 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80'; // general food
                if (!m.image) {
                  const cat = (m.category || '').toLowerCase();
                  if (cat.includes('biryani')) defaultImg = 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80';
                  else if (cat.includes('chinese') || cat.includes('noodles')) defaultImg = 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=80';
                  else if (cat.includes('south')) defaultImg = 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80';
                  else if (cat.includes('street') || cat.includes('chaat')) defaultImg = 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&w=600&q=80';
                  else if (cat.includes('dessert') || cat.includes('sweet')) defaultImg = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80';
                  else if (cat.includes('north') || cat.includes('paneer') || cat.includes('thali')) defaultImg = 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80';
                }
                return {
                  id: m._id,
                  name: m.name,
                  category: m.category,
                  price: m.price,
                  rating: m.rating || 4.5,
                  description: m.description || 'A delicious offering from this partner.',
                  image: m.image || defaultImg,
                };
              })
            : [
                // Generic Fallback Menu so the page isn't empty!
                {
                  id: `${user._id}-1`,
                  name: 'Chef Special Thali',
                  category: 'Main Course',
                  price: 199,
                  rating: 4.5,
                  description: 'A wholesome meal prepared fresh by our new partner.',
                  image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80',
                },
                {
                  id: `${user._id}-2`,
                  name: 'Signature Starter',
                  category: 'starters',
                  price: 120,
                  rating: 4.6,
                  description: 'Crispy, hot, and highly recommended.',
                  image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=400&q=80',
                }
              ];

          return {
            id: user._id, // Use MongoDB ID
            name: user.businessDetails?.businessName || user.name || 'New Restaurant',
            rating: 4.5, // Default Fallback
            reviewCount: Math.floor(Math.random() * 500) + 50,
            deliveryTime: '30-40 mins',
            deliveryFee: '₹40',
            cuisines: 'Mixed Cuisines • Fast Food', // Fallback
            address: user.businessDetails?.address || 'City Center',
            phone: user.phone || '+91 99999 00000',
            image: fallbackImages[index % fallbackImages.length], // Rotating beautiful fallback images
            tag: 'Newly Added 🌟',
            menuItems: mappedMenu
          };
        });

        // Merge static dummy data with dynamic backend data
        setRestaurants(prev => {
          // Prevent duplicate additions in React strict mode
          const existingIds = new Set(prev.map(r => r.id));
          const newOnes = dynamicRestaurants.filter(r => !existingIds.has(r.id));
          return [...prev, ...newOnes];
        });
      } catch (err) {
        console.error("Failed to load dynamic restaurants:", err);
      }
    };

    fetchDynamicRestaurants();
  }, []);

  const selectedRestaurant =
    restaurants.find((r) => r.id === selectedRestaurantId) || restaurants[0];

  const filteredMenuItems =
    selectedCategory === 'all'
      ? selectedRestaurant.menuItems
      : selectedRestaurant.menuItems.filter((item) => item.category === selectedCategory);

  const handleSelectRestaurant = (id) => {
    setSelectedRestaurantId(id);
    setSelectedCategory('all');
    setUserRating(0);
    setRatingFeedback('');
  };

  const handleRatingSubmit = (e) => {
    e.preventDefault();
    if (!userRating) {
      setRatingFeedback('⚠️ Please select 1 to 5 stars before submitting.');
      return;
    }

    setRestaurants((prev) =>
      prev.map((r) => {
        if (r.id !== selectedRestaurantId) return r;
        const newCount = r.reviewCount + 1;
        const newScore = (r.rating * r.reviewCount + userRating) / newCount;
        return {
          ...r,
          rating: Number(newScore.toFixed(1)),
          reviewCount: newCount,
        };
      })
    );

    setRatingFeedback('🎉 Thanks for rating this dining spot!');
    setTimeout(() => setRatingFeedback(''), 4000);
  };

  return (
    <div className="restaurant-universe" style={{ 
      backgroundImage: "linear-gradient(rgba(250, 250, 250, 0.7), rgba(250, 250, 250, 0.9)), url('/user_restaurant_bg.png')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      minHeight: '100vh'
    }}>
      <div className="restaurant-page-container">
      
      <section className="restaurant-picker-section">
        <div className="picker-header">
          <span className="picker-eyebrow">POPULAR DESTINATIONS</span>
          <h2 className="picker-title">Select Restaurant</h2>
        </div>

        <div className="restaurant-cards-carousel">
          {restaurants.map((res) => {
            const isSelected = res.id === selectedRestaurantId;
            return (
              <div
                key={res.id}
                className={`res-selector-chip ${isSelected ? 'selected' : ''}`}
                onClick={() => handleSelectRestaurant(res.id)}
              >
                <img src={res.image} alt={res.name} className="selector-thumb" />
                <div className="selector-info">
                  <div className="selector-name-row">
                    <span className="selector-name">{res.name}</span>
                    <span className="selector-rating">★ {res.rating}</span>
                  </div>
                  <span className="selector-cuisines">{res.cuisines}</span>
                </div>
                {isSelected && <span className="selector-active-check">✓ Selected</span>}
              </div>
            );
          })}
        </div>
      </section>

      <section className="restaurant-hero-banner">
        <div className="hero-banner-backdrop">
          <img src={selectedRestaurant.image} alt={selectedRestaurant.name} className="banner-bg-img" />
          <div className="banner-dark-overlay" />
        </div>

        <div className="banner-glass-details">
          <div className="banner-top-badges">
            <span className="banner-tag-pill">{selectedRestaurant.tag}</span>
            <span className="banner-open-pill">🟢 Delivering Now</span>
          </div>

          <h1 className="banner-restaurant-name">{selectedRestaurant.name}</h1>
          <p className="banner-restaurant-cuisines">{selectedRestaurant.cuisines}</p>

          <div className="banner-meta-grid">
            <div className="meta-box">
              <span className="meta-icon">⭐</span>
              <div>
                <strong>{selectedRestaurant.rating} / 5.0</strong>
                <small>({selectedRestaurant.reviewCount.toLocaleString()} reviews)</small>
              </div>
            </div>

            <div className="meta-box">
              <span className="meta-icon">⏱️</span>
              <div>
                <strong>{selectedRestaurant.deliveryTime}</strong>
                <small>Fast Drop</small>
              </div>
            </div>

            <div className="meta-box">
              <span className="meta-icon">🛵</span>
              <div>
                <strong>{selectedRestaurant.deliveryFee}</strong>
                <small>Delivery Charge</small>
              </div>
            </div>

            <div className="meta-box">
              <span className="meta-icon">📍</span>
              <div>
                <strong>{selectedRestaurant.address}</strong>
                <small>{selectedRestaurant.phone}</small>
              </div>
            </div>
          </div>

          {/* Interactive Rating Form */}
          <div className="banner-rating-widget">
            <span className="rating-prompt-text">Rate this restaurant:</span>
            <div className="interactive-stars-row">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`star-toggle-btn ${(hoverRating || userRating) >= star ? 'active' : ''}`}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setUserRating(star)}
                >
                  ★
                </button>
              ))}
            </div>
            <button
              type="button"
              className="submit-rating-action-btn"
              onClick={handleRatingSubmit}
            >
              Submit
            </button>
            {ratingFeedback && <span className="rating-toast-msg">{ratingFeedback}</span>}
          </div>
        </div>
      </section>

      {/* ================= MENU SECTION ================= */}
      <section className="restaurant-menu-section">
        <div className="menu-section-header">
          <div>
            <span className="section-eyebrow">RESTAURANT MENU</span>
            <h2 className="menu-heading">Dishes & Combos</h2>
          </div>

          {/* Category Filter Pills */}
          <div className="menu-filter-pills">
            {menuCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`category-tab-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Dishes Grid */}
        <div className="menu-items-grid">
          {filteredMenuItems.map((item) => (
            <div key={item.id} className="menu-dish-card">
              <div className="dish-thumb-box">
                <img src={item.image} alt={item.name} className="dish-img" />
                <span className="dish-star-pill">★ {item.rating}</span>
              </div>

              <div className="dish-info-content">
                <div className="dish-header-row">
                  <h3 className="dish-name">{item.name}</h3>
                  <span className="dish-price">₹{item.price}</span>
                </div>
                <p className="dish-desc">{item.description}</p>

                <div className="dish-action-row">
                  <button
                    type="button"
                    className="add-to-cart-btn-primary"
                    onClick={() =>
                      onAddToCart &&
                      onAddToCart({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        image: item.image,
                        restaurant: selectedRestaurant.name,
                      })
                    }
                  >
                    <span>+ Add to Cart</span>
                    <span>₹{item.price}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
    </div>
  );
}

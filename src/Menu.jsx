import React, { useState } from 'react';
import './menu.css';

const allMenuItems = [
  {
    id: 201,
    name: 'Hyderabadi Chicken Dum Biryani',
    price: 249,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
    category: 'Biryani',
    diet: 'non_veg',
    rating: '4.9',
    time: '20-25 min',
    spicy: true,
    calories: '620 kcal',
    description: 'Aromatic basmati rice cooked on slow dum with tender chicken pieces, saffron, fried onions, served with mirchi ka salan and raita.',
  },
  {
    id: 202,
    name: 'Special Paneer Butter Masala',
    price: 199,
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80',
    category: 'North Indian',
    diet: 'veg',
    rating: '4.8',
    time: '15-20 min',
    spicy: false,
    calories: '450 kcal',
    description: 'Fresh malai paneer cubes simmered in a silky tomato, cashew and butter gravy with a hint of dried kasuri methi.',
  },
  {
    id: 203,
    name: 'Butter Masala Dosa + Sambar',
    price: 120,
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80',
    category: 'South Indian',
    diet: 'veg',
    rating: '4.9',
    time: '10-15 min',
    spicy: false,
    calories: '340 kcal',
    description: 'Crispy golden crepe roasted in pure butter, stuffed with spiced potato masala, served with piping hot sambar and coconut chutney.',
  },
  {
    id: 204,
    name: 'Delhi Style Butter Pav Bhaji',
    price: 140,
    image: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&w=600&q=80',
    category: 'Street Food',
    diet: 'veg',
    rating: '4.8',
    time: '10-15 min',
    spicy: true,
    calories: '480 kcal',
    description: 'Mashed spiced seasonal vegetables cooked with special pav bhaji masala, topped with butter dollop and served with 2 toasted pavs.',
  },
  {
    id: 205,
    name: 'Veg Hakka Noodles & Manchurian',
    price: 160,
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=80',
    category: 'Desi Chinese',
    diet: 'veg',
    rating: '4.7',
    time: '15-20 min',
    spicy: true,
    calories: '510 kcal',
    description: 'Wok-tossed noodles with crunchy bell peppers, cabbage, spring onions and savory dark soy sauce, paired with vegetable manchurian balls.',
  },
  {
    id: 206,
    name: 'Dal Makhani with 2 Butter Naan',
    price: 180,
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
    category: 'North Indian',
    diet: 'veg',
    rating: '4.9',
    time: '20 min',
    spicy: false,
    calories: '560 kcal',
    description: 'Whole black lentils slow-cooked overnight with cream, butter, and mild spices, served with fresh clay oven tandoori butter naan.',
  },
  {
    id: 207,
    name: 'Warm Gulab Jamun with Rabdi (2 pcs)',
    price: 90,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80',
    category: 'Desserts',
    diet: 'veg',
    rating: '4.9',
    time: '5 min',
    spicy: false,
    calories: '320 kcal',
    description: 'Deep fried golden khoya balls soaked in warm rose and cardamom flavored sugar syrup, topped with thick saffron rabdi.',
  },
  {
    id: 208,
    name: 'Thick Mango Lassi & Masala Chai',
    price: 60,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJtq8uqCKKff28loPHF15RMFRq6k4yrNrOy9BZ8ojnLHyCcNF3Gwiz6h3P&s=10',
    category: 'Beverages',
    diet: 'veg',
    rating: '4.8',
    time: '5 min',
    spicy: false,
    calories: '180 kcal',
    description: 'Creamy yogurt churned with real Alphonso mango pulp, chilled and garnished with crushed pistachios and almonds.',
  },
];

const menuCategories = ['All', 'Biryani', 'North Indian', 'South Indian', 'Street Food', 'Desi Chinese', 'Desserts', 'Beverages'];

export default function Menu({ onNavigate, onAddToCart }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [dietFilter, setDietFilter] = useState('all'); // 'all' | 'veg' | 'non_veg' | 'spicy'
  const [sortBy, setSortBy] = useState('popular'); // 'popular' | 'price_low' | 'price_high' | 'rating'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [activeDishModal, setActiveDishModal] = useState(null);

  // Filter and sort items
  const filteredItems = allMenuItems
    .filter((item) => {
      const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDiet =
        dietFilter === 'all' ||
        (dietFilter === 'veg' && item.diet === 'veg') ||
        (dietFilter === 'non_veg' && item.diet === 'non_veg') ||
        (dietFilter === 'spicy' && item.spicy);
      return matchesCat && matchesSearch && matchesDiet;
    })
    .sort((a, b) => {
      if (sortBy === 'price_low') return a.price - b.price;
      if (sortBy === 'price_high') return b.price - a.price;
      if (sortBy === 'rating') return parseFloat(b.rating) - parseFloat(a.rating);
      return 0;
    });

  return (
    <div className="menu-page-universe">
      {/* ================= HERO HEADER ================= */}
      <section className="menu-hero-header">
        <div className="menu-header-text">
          <span className="menu-eyebrow">FOOD MENU</span>
          <h1 className="menu-main-title">Explore Indian Dishes & Delicacies</h1>
          <p className="menu-sub-desc">
            Freshly prepared, budget-friendly meals crafted by verified local restaurants and home kitchens.
          </p>
        </div>

        {/* Categories Bar */}
        <div className="menu-category-tabs-scroll">
          {menuCategories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`menu-cat-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Unified Search, Filters & View Mode Controls Bar */}
        <div className="menu-controls-card">
          {/* Search Box */}
          <div className="menu-search-wrapper">
            <span className="search-ico">🔍</span>
            <input
              type="text"
              placeholder="Search Biryani, Dosa, Paneer, Momos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="clear-ico"
                onClick={() => setSearchQuery('')}
              >
                ✕
              </button>
            )}
          </div>

          {/* Diet Filter Pills */}
          <div className="diet-filters-row">
            <button
              type="button"
              className={`diet-chip ${dietFilter === 'all' ? 'active' : ''}`}
              onClick={() => setDietFilter('all')}
            >
              All Items
            </button>
            <button
              type="button"
              className={`diet-chip ${dietFilter === 'veg' ? 'active' : ''}`}
              onClick={() => setDietFilter('veg')}
            >
              🌱 Pure Veg
            </button>
            <button
              type="button"
              className={`diet-chip ${dietFilter === 'non_veg' ? 'active' : ''}`}
              onClick={() => setDietFilter('non_veg')}
            >
              🍗 Non-Veg
            </button>
            <button
              type="button"
              className={`diet-chip ${dietFilter === 'spicy' ? 'active' : ''}`}
              onClick={() => setDietFilter('spicy')}
            >
              🌶️ Spicy Desi
            </button>
          </div>

          {/* Sort & View Mode Toggles */}
          <div className="menu-view-and-sort">
            <div className="sort-dropdown-wrap">
              <span>Sort:</span>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="popular">⭐ Most Popular</option>
                <option value="rating">★ Highest Rated</option>
                <option value="price_low">₹ Price: Low to High</option>
                <option value="price_high">₹ Price: High to Low</option>
              </select>
            </div>

            <div className="view-mode-toggle-group">
              <button
                type="button"
                className={`view-mode-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid View"
              >
                ⊞ Grid
              </button>
              <button
                type="button"
                className={`view-mode-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title="List View"
              >
                ☰ List
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= DISHES GRID / LIST ================= */}
      <section className="menu-grid-section">
        <div className="grid-header-meta">
          <span>
            Showing <strong>{filteredItems.length}</strong> delicious dishes
          </span>
          {(dietFilter !== 'all' || selectedCategory !== 'All' || searchQuery) && (
            <button
              type="button"
              className="reset-filter-btn"
              onClick={() => {
                setDietFilter('all');
                setSelectedCategory('All');
                setSearchQuery('');
              }}
            >
              Reset All Filters ✕
            </button>
          )}
        </div>

        <div className={`menu-cards-container ${viewMode === 'list' ? 'list-layout' : 'grid-layout'}`}>
          {filteredItems.map((item) => (
            <div key={item.id} className="menu-dish-item-card">
              {/* Dish Thumbnail */}
              <div
                className="dish-img-container"
                onClick={() => setActiveDishModal(item)}
              >
                <img src={item.image} alt={item.name} className="dish-photo" />
                <div className="dish-badges-overlay">
                  <span className="dish-category-tag">{item.category}</span>
                  <span className="dish-rating-tag">★ {item.rating}</span>
                </div>
                {item.spicy && <span className="dish-spicy-tag">🌶️ Spicy</span>}
              </div>

              {/* Dish Content Body */}
              <div className="dish-item-body">
                <div className="dish-main-info">
                  <div className="dish-top-title-row">
                    <h3
                      className="dish-title"
                      onClick={() => setActiveDishModal(item)}
                    >
                      {item.name}
                    </h3>
                    <span className="dish-price-text">₹{item.price}</span>
                  </div>

                  <p className="dish-description-text">{item.description}</p>
                </div>

                <div className="dish-bottom-wrapper">
                  <div className="dish-extra-meta">
                    <span className="meta-time">⏱️ {item.time}</span>
                    <span className="meta-cal">🔥 {item.calories}</span>
                    <span className={`meta-diet-tag ${item.diet}`}>
                      {item.diet === 'veg' ? '🌱 Pure Veg' : '🍗 Non-Veg'}
                    </span>
                  </div>

                  <div className="dish-item-actions">
                    <button
                      type="button"
                      className="menu-add-btn"
                      onClick={() =>
                        onAddToCart &&
                        onAddToCart({
                          id: item.id,
                          name: item.name,
                          price: item.price,
                          image: item.image,
                          restaurant: 'FoodNest Indian Kitchen',
                        })
                      }
                    >
                      <span>+ Add to Cart</span>
                      <span className="btn-price-preview">₹{item.price}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= DISH DETAIL MODAL ================= */}
      {activeDishModal && (
        <div className="dish-modal-backdrop" onClick={() => setActiveDishModal(null)}>
          <div className="dish-modal-card" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="modal-close-ico"
              onClick={() => setActiveDishModal(null)}
            >
              ✕
            </button>
            <div className="modal-img-wrap">
              <img src={activeDishModal.image} alt={activeDishModal.name} className="modal-dish-img" />
            </div>
            <div className="modal-dish-content">
              <div className="modal-badge-row">
                <span className="modal-cat-badge">{activeDishModal.category}</span>
                <span className="modal-rating-badge">★ {activeDishModal.rating} (500+ reviews)</span>
                {activeDishModal.spicy && <span className="modal-spicy-badge">🌶️ Spicy</span>}
              </div>
              <h2 className="modal-dish-name">{activeDishModal.name}</h2>
              <p className="modal-dish-desc">{activeDishModal.description}</p>
              <div className="modal-meta-grid">
                <div><strong>Prep Time:</strong> {activeDishModal.time}</div>
                <div><strong>Calories:</strong> {activeDishModal.calories}</div>
                <div><strong>Type:</strong> {activeDishModal.diet === 'veg' ? '🌱 100% Pure Vegetarian' : '🍗 Non-Vegetarian'}</div>
              </div>
              <button
                type="button"
                className="modal-add-cart-btn"
                onClick={() => {
                  onAddToCart &&
                    onAddToCart({
                      id: activeDishModal.id,
                      name: activeDishModal.name,
                      price: activeDishModal.price,
                      image: activeDishModal.image,
                      restaurant: 'FoodNest Indian Kitchen',
                    });
                  setActiveDishModal(null);
                }}
              >
                Add to Cart • ₹{activeDishModal.price} 🚀
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
import { useState, useEffect } from 'react';
import './Cloud_kitchen.css';

const dummyKitchens = [
  {
    id: 'ck-1',
    name: 'Ghar Ka Khana Kitchen',
    cuisine: 'North Indian Daily Thali • Dal Tadka • Phulkas',
    rating: 4.9,
    orders: '14.2k',
    time: '20-30 min',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6Jmo52hmsWYvQn_AFDX9hUPccS_dJIQATztwoq0y8I7ngEGVm5nNEEOZv&s=10',
    badge: 'Homestyle Mess 🍲',
  },
  {
    id: 'ck-2',
    name: 'Amma\'s Andhra Meals & Tiffin',
    cuisine: 'Pappu • Gunpowder Ghee Rice • Chicken Fry',
    rating: 4.8,
    orders: '11.8k',
    time: '25-35 min',
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80',
    badge: '100% Desi Taste 🔥',
  }
];

const dummyDishes = [
  {
    id: 301,
    kitchenId: 'ck-1',
    kitchenName: 'Ghar Ka Khana',
    name: 'Homestyle Thali (Dal, Sabzi, 4 Rotis, Rice)',
    price: 130,
    rating: '4.9',
    category: 'Thali',
    diet: 'veg',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKP44b-EqWZjjp4m9RPCeBku4C7Ra1jBjygBr-xLMjmmKg4ac-eBXn3oU&s=10',
    description: 'Freshly cooked yellow dal tadka, seasonal aloo sabzi, steamed rice, 4 whole wheat phulkas, and pickle.',
  },
  {
    id: 302,
    kitchenId: 'ck-2',
    kitchenName: 'Amma’s Andhra Meals',
    name: 'Andhra Ghee Podi Rice & Crispy Chicken Fry',
    price: 180,
    rating: '4.8',
    category: 'Meals',
    diet: 'non_veg',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=500&q=80',
    description: 'Hot steamed sona masoori rice with pure desi ghee and spicy gun powder, paired with authentic Andhra style pepper chicken fry.',
  }
];

export default function CloudKitchen({ onAddToCart }) {
  const [selectedKitchen, setSelectedKitchen] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [cloudKitchens, setCloudKitchens] = useState(dummyKitchens);
  const [cloudDishes, setCloudDishes] = useState(dummyDishes);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, menuRes] = await Promise.all([
          fetch('http://localhost:5000/api/cloudkitchen/public/list'),
          fetch('http://localhost:5000/api/menu')
        ]);
        if (!usersRes.ok || !menuRes.ok) return;

        const users = await usersRes.json();
        const allMenu = await menuRes.json();

        const fallbackImages = [
          'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80',
        ];

        const formattedKitchens = users.map((user, i) => ({
          id: user._id,
          name: user.businessDetails?.businessName || user.name || 'New Kitchen',
          cuisine: 'Homestyle Meals • Daily Specials',
          rating: 4.8,
          orders: `${Math.floor(Math.random() * 20 + 5)}k`,
          time: '30-40 min',
          image: fallbackImages[i % fallbackImages.length],
          badge: 'Verified ✅'
        }));

        const formattedDishes = allMenu
          .filter(m => m.restaurant && users.some(u => u._id === m.restaurant._id))
          .map(m => {
            let defaultImg = 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80'; // general food
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
              kitchenId: m.restaurant._id,
              kitchenName: m.restaurant.businessDetails?.businessName || m.restaurant.name,
              name: m.name,
              price: m.price,
              rating: m.rating || 4.5,
              category: m.category,
              diet: m.diet || 'veg',
              image: m.image || defaultImg,
              description: m.description || 'Freshly cooked home meal.',
            };
          });

        setCloudKitchens([...dummyKitchens, ...formattedKitchens]);
        setCloudDishes([...dummyDishes, ...formattedDishes]);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const toggleFavorite = (id) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));
  };

  const filteredDishes = cloudDishes.filter((dish) => {
    const matchesKitchen = selectedKitchen === 'all' || dish.kitchenId === selectedKitchen;
    const matchesSearch =
      dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dish.kitchenName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesKitchen && matchesSearch;
  });

  const filteredKitchens = cloudKitchens.filter((k) => {
    const matchesKitchenText =
      k.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      k.cuisine.toLowerCase().includes(searchQuery.toLowerCase());

    const hasMatchingDish = cloudDishes.some(
      (dish) =>
        dish.kitchenId === k.id &&
        (dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
         dish.kitchenName.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return matchesKitchenText || hasMatchingDish;
  });

  return (
    <div className="cloud-kitchen-universe">
      {/* ================= HERO SECTION ================= */}
      <section className="cloud-hero-section">
        <div className="cloud-hero-content">
          <div className="cloud-eyebrow-pill">
            <span>🍳 GHAR KA KHANA & HOME KITCHENS</span>
          </div>

          <h1 className="cloud-hero-title">
            Authentic Homestyle Food <br />
            <span className="cloud-gradient-text">Cooked by Verified Home Chefs.</span>
          </h1>

          <p className="cloud-hero-desc">
            Missing home food in your hostel? Order wholesome, hygienic dal-roti thalis, biryani pots, and comfort meals prepared with love and pure ingredients.
          </p>


        </div>
      </section>

      {/* ================= KITCHENS SHOWCASE ================= */}
      <section className="cloud-kitchens-spotlight">
        <div className="section-title-row">
          <div>
            <span className="section-eyebrow">VERIFIED HOME KITCHENS</span>
            <h2 className="section-heading">Featured Cloud Kitchens</h2>
          </div>
          <span className="kitchens-count-badge">{filteredKitchens.length} Active Kitchens Near You</span>
        </div>

        <div className="kitchens-cards-grid">
          {filteredKitchens.map((k) => {
            const isSelected = selectedKitchen === k.id;
            return (
              <div
                key={k.id}
                className={`kitchen-profile-card ${isSelected ? 'active' : ''}`}
                onClick={() => setSelectedKitchen(isSelected ? 'all' : k.id)}
              >
                <div className="kitchen-photo-wrap">
                  <img src={k.image} alt={k.name} className="kitchen-photo" />
                  <span className="kitchen-badge-pill">{k.badge}</span>
                  <span className="kitchen-time-pill">⏱️ {k.time}</span>
                </div>

                <div className="kitchen-card-body">
                  <div className="kitchen-title-row">
                    <h3 className="kitchen-name">{k.name}</h3>
                    <span className="kitchen-rating">★ {k.rating}</span>
                  </div>
                  <p className="kitchen-cuisine">{k.cuisine}</p>
                  <div className="kitchen-stats-row">
                    <span>🍲 {k.orders} orders served</span>
                    <span className="kitchen-filter-toggle">
                      {isSelected ? '✓ Showing Dishes' : 'Filter Dishes →'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ================= CLOUD DISHES SECTION ================= */}
      <section className="cloud-dishes-section">
        <div className="section-title-row">
          <div>
            <span className="section-eyebrow">FRESH & HOMEMADE</span>
            <h2 className="section-heading">
              {selectedKitchen === 'all'
                ? 'All Homestyle Dishes'
                : `Dishes from ${cloudKitchens.find((k) => k.id === selectedKitchen)?.name}`}
            </h2>
          </div>
          {selectedKitchen !== 'all' && (
            <button
              type="button"
              className="view-all-kitchens-btn"
              onClick={() => setSelectedKitchen('all')}
            >
              Show All Kitchens ✕
            </button>
          )}
        </div>

        <div className="cloud-dishes-grid">
          {filteredDishes.map((dish) => {
            const isFavorite = favorites.includes(dish.id);
            return (
              <div key={dish.id} className="cloud-dish-card">
                <div className="dish-img-wrap">
                  <img src={dish.image} alt={dish.name} className="dish-img" />
                  <span className="dish-kitchen-tag">{dish.kitchenName}</span>
                  <span className="dish-star-tag">★ {dish.rating}</span>
                  <button
                    type="button"
                    className={`favorite-heart-btn ${isFavorite ? 'active' : ''}`}
                    onClick={() => toggleFavorite(dish.id)}
                    aria-label="Save to favorites"
                  >
                    {isFavorite ? '❤️' : '🤍'}
                  </button>
                </div>

                <div className="dish-body">
                  <div className="dish-title-row">
                    <h3 className="dish-title">{dish.name}</h3>
                    <span className="dish-price">₹{dish.price}</span>
                  </div>
                  <p className="dish-desc">{dish.description}</p>

                  <div className="dish-footer-action">
                    <button
                      type="button"
                      className="add-to-cart-cloud-btn"
                      onClick={() =>
                        onAddToCart &&
                        onAddToCart({
                          id: dish.id,
                          name: dish.name,
                          price: dish.price,
                          image: dish.image,
                          restaurant: dish.kitchenName,
                        })
                      }
                    >
                      <span>+ Add to Cart</span>
                      <span>₹{dish.price}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
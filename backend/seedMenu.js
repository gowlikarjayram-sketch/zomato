const mongoose = require('mongoose');
require('dotenv').config();
const MenuItem = require('./models/MenuItem');

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

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/foodnest');
    console.log('Connected to DB for seeding');

    // Remove the Test Biryani from the test script so it doesn't look weird
    await MenuItem.deleteMany({});
    console.log('Cleared existing menu items');

    await MenuItem.insertMany(allMenuItems);
    console.log('Seeded actual menu items successfully');

    process.exit(0);
  } catch (err) {
    console.error('Error seeding DB:', err);
    process.exit(1);
  }
};

seedDB();

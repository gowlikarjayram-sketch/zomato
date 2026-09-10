# Cart Logic & Event Handling

This document covers how the Shopping Cart works, which is a critical piece of logic in the application.

## 1. How is Cart Data Stored?

**Code from `App.jsx`:**
```javascript
  const [cart, setCart] = useState([
    {
      id: 'demo-1',
      name: 'Special Hyderabadi Chicken Biryani',
      price: 249,
      quantity: 1,
      image: '...',
      restaurant: 'Paradise Biryani Mahal',
    },
  ]);
```
**Explanation:** The cart is an array of objects. Each object represents an item added to the cart, containing its details and the quantity ordered.

---

## 2. What happens when a user clicks "Add to Cart"?

**Manager Question:** "Walk me through the code when someone adds an item to the cart."
**Your Answer:**
1. The user clicks the button on a food item, triggering the `onAddToCart(item)` function passed down as a prop.
2. In `App.jsx`, this calls `addToCart(item)`:
```javascript
  const addToCart = (item) => {
    setCart((prev) => {
      // 1. Check if the item is already in the cart
      const existing = prev.find((i) => i.id === item.id || i.name === item.name);
      
      // 2. If it exists, map through the array and increase its quantity by 1
      if (existing) {
        return prev.map((i) =>
          (i.id === item.id || i.name === item.name) ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      
      // 3. If it's new, clean up the price string and add it to the cart array
      const rawPrice = typeof item.price === 'string' ? parseFloat(item.price.replace(/[^0-9.]/g, '')) : item.price;
      return [...prev, { ...item, price: rawPrice || 199, quantity: 1 }];
    });
    
    // 4. Show a success notification
    showToast(`🍽️ Added "${item.name}" to cart!`);
  };
```

---

## 3. How are cart totals calculated?

**Code from `App.jsx`:**
```javascript
  const totalItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const rawSubtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
```

**Manager Question:** "How do you calculate the total price of the items in the cart?"
**Your Answer:** "We use the JavaScript `Array.prototype.reduce()` method. It iterates over every item in the `cart` array, multiplies that item's `price` by its `quantity`, and adds it to a running accumulator (`acc`). This gives us the `rawSubtotal`. This calculation happens dynamically on every render, so it's always up to date."

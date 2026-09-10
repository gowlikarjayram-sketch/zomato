# React State & Custom Routing in FoodNest

This document will help you explain how the core navigation and state work in the project if your manager asks.

## 1. How is the current page tracked? (React State)

**Concept:** `useState` is a React Hook that lets you add state to a functional component.

**Code from `App.jsx`:**
```javascript
const [currentPage, setCurrentPage] = useState('home');
```
**Explanation:** 
- `currentPage` is the variable holding the current state (default is `'home'`).
- `setCurrentPage` is the function we call to update this state.
- When `setCurrentPage` is called, React re-renders the `App` component to show the new page.

---

## 2. How does Navigation work without React Router?

Even though `react-router-dom` is in `package.json`, the app currently uses a **custom hash-based router**.

**Code from `App.jsx`:**
```javascript
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (['signup', 'login', 'register', 'auth'].includes(hash)) setCurrentPage('signup');
      else if (['home', 'main'].includes(hash)) setCurrentPage('home');
      // ... other routes
    };

    handleHash(); // Run once on mount
    window.addEventListener('hashchange', handleHash); // Listen for URL changes
    return () => window.removeEventListener('hashchange', handleHash); // Cleanup
  }, []);
```

**Manager Question:** "What happens when a user clicks the browser's back button?"
**Your Answer:** "The `window.addEventListener('hashchange', handleHash)` triggers. The `handleHash` function reads the new URL hash (e.g., `#menu`), and calls `setCurrentPage('menu')`. React then re-renders the App and displays the Menu component instead of the previous one."

---

## 3. How do buttons trigger navigation?

**Code from `App.jsx`:**
```javascript
  const navigateTo = (pageName) => {
    setCurrentPage(pageName);
    window.location.hash = pageName;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
```

**Manager Question:** "Explain what happens when we click the 'Home' link in the Navigation bar."
**Your Answer:** 
1. The `onClick` handler fires: `onClick={() => navigateTo('home')}`.
2. `navigateTo` updates the React state: `setCurrentPage('home')`.
3. It updates the browser URL to `#home`.
4. It scrolls the window smoothly to the top of the page.
5. React re-renders, sees `currentPage === 'home'`, and renders the `<Home />` component.

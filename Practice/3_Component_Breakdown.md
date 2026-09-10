# Component Breakdown

If your manager asks you to show the code of a specific component and explain how it works, here is an example breakdown of the `<About />` component.

## How to Explain a Component (`About.jsx`)

**Manager Question:** "Can you open the About component and explain how the FAQ accordion works?"
**Your Answer:**

1. **The State:** "At the top of the component, we declare a piece of state using `useState`:
   ```javascript
   const [openFaqIndex, setOpenFaqIndex] = useState(0);
   ```
   This state simply stores a number representing the index of the currently open FAQ. It defaults to `0`, meaning the first FAQ is open by default."

2. **The Rendering Loop:** "Lower down in the return statement, we map over an array of FAQ objects:"
   ```javascript
   {faqs.map((faq, idx) => {
     const isOpen = openFaqIndex === idx;
     return (
       <div
         key={idx}
         className={`faq-item-card ${isOpen ? 'open' : ''}`}
         onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
       >
         <div className="faq-question-row">
           <span className="faq-q-text">{faq.q}</span>
           <span className="faq-toggle-icon">{isOpen ? '−' : '+'}</span>
         </div>
         {isOpen && <p className="faq-a-text">{faq.a}</p>}
       </div>
     );
   })}
   ```

3. **The Interaction:** "When a user clicks on an FAQ item (`onClick`), it checks if that item is already open.
   - If it is already open (`isOpen` is true), we set the state to `null`, which closes all FAQs.
   - If it is not open, we set the state to that item's `idx`.
   React then re-renders, updates the CSS classes to `open` for the matching index, and conditionally renders the answer (`{isOpen && <p>...` )."

---

## What is a Prop?

**Manager Question:** "I see `<About onNavigate={navigateTo} />` in App.jsx. What is `onNavigate`?"
**Your Answer:** "That is a **prop** (short for property). We are passing the `navigateTo` function from the parent `App` component down to the child `About` component. 

Inside `About.jsx`, we use it on buttons like this:
```javascript
<button onClick={() => onNavigate && onNavigate('signup')}>
  Get 50% Off & Sign Up 🚀
</button>
```
This allows the `About` component to trigger a page change, even though the routing state actually lives inside `App`."

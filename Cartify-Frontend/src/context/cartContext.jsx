import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the Cart Context
const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Load cart from local storage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // 1. ADD TO CART (Aur agar pehle se hai toh quantity badha do)
  const addToCart = (product) => {
    const productId = product._id || product.id;
    const existingItemIndex = cart.findIndex(item => (item._id || item.id) === productId);
    
    let updatedCart;
    if (existingItemIndex >= 0) {
      // Agar item pehle se cart mein hai, toh sirf uski quantity +1 kar do
      updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity = (updatedCart[existingItemIndex].quantity || 1) + 1;
    } else {
      // Agar naya item hai, toh usko quantity 1 ke sath add karo
      updatedCart = [...cart, { ...product, quantity: 1 }];
    }
    
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  // 2. REMOVE FROM CART (Fixed ID issue)
  const removeFromCart = (productId) => {
    // Check for both _id (MongoDB) and id (Dummy data)
    const updatedCart = cart.filter(item => (item._id || item.id) !== productId);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  // 3. 👈 NEW: UPDATE QUANTITY (+ / - Buttons ke liye)
  const updateQuantity = (productId, action) => {
    const updatedCart = cart.map(item => {
      if ((item._id || item.id) === productId) {
        let currentQuantity = item.quantity || 1;
        
        if (action === 'increase') {
          currentQuantity += 1;
        } else if (action === 'decrease' && currentQuantity > 1) {
          currentQuantity -= 1; // Quantity 1 se kam nahi honi chahiye
        }
        
        return { ...item, quantity: currentQuantity };
      }
      return item;
    });
    
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  // 4. CLEAR ENTIRE CART
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom Hook for easy access
export const useCart = () => useContext(CartContext);
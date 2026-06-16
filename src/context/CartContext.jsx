import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItem = state.items.find(
        (item) => item._id === action.payload._id
      );
      const items = existingItem
        ? state.items.map((item) => 
            item._id === action.payload._id
              ? { ...item, qty: item.qty + (action.payload.qty || 1) }
              : item
          )
        : [...state.items, { ...action.payload, qty: action.payload.qty || 1 }];
      return { ...state, items };
    }
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter((item) => item._id !== action.payload),
      };
    case 'UPDATE_QTY':
      return {
        ...state,
        items: state.items.map((item) =>
          item._id === action.payload.id
            ? { ...item, qty: action.payload.qty }
            : item
        ),
      };
    case 'CLEAR_CART':
      return { ...state, items: [] };
    case 'LOAD_CART':
      return { ...state, items: action.payload };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  // Persist cart to localStorage
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cartItems') || '[]');
    if (savedCart.length > 0) {
      dispatch({ type: 'LOAD_CART', payload: savedCart });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(state.items));
  }, [state.items]);

  const addToCart = (product, qty = 1) =>
    dispatch({ type: 'ADD_TO_CART', payload: { ...product, qty } });

  const removeFromCart = (id) =>
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });

  const updateQty = (id, qty) =>
    dispatch({ type: 'UPDATE_QTY', payload: { id, qty } });

  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

  const cartTotal = state.items.reduce(
    (total, item) => total + item.price * item.qty,
    0
  );

  const cartCount = state.items.reduce((total, item) => total + item.qty, 0);

  return (
    <CartContext.Provider
      value={{ cart: state.items, addToCart, removeFromCart, updateQty, clearCart, cartTotal, cartCount }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};

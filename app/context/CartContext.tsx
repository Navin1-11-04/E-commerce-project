"use client";

import React, { useState } from "react";
import type {
  CartContextType,
  CartItem,
  Product,
  Order,
  ShippingAddress,
} from "../../app/types";

// Cart Context
export const CartContext = React.createContext<CartContextType | undefined>(
  undefined,
);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [orders, setOrders] = useState([]);

  // Function to calculate GST rate based on product price and category
  const getGSTRate = (price, category) => {
    // For clothing items
    if (category === "Clothing") {
      // Clothes up to ₹2,500 per piece → 5% GST
      if (price <= 2500) {
        return 0.05; // 5%
      }
      // Clothes above ₹2,500 per piece → 18% GST
      else {
        return 0.18; // 18%
      }
    }
    // For accessories and other items
    else {
      // For accessories like watches and handbags, using 18% GST
      // This can be adjusted based on specific GST rules for accessories
      return 0.18; // 18%
    }
  };

  const addToCart = (product, selectedSize, selectedColor) => {
    const existingItem = cartItems.find(
      (item) =>
        item.id === product.id &&
        item.selectedSize === selectedSize &&
        item.selectedColor === selectedColor,
    );

    if (existingItem) {
      setCartItems(
        cartItems.map((item) =>
          item.id === product.id &&
          item.selectedSize === selectedSize &&
          item.selectedColor === selectedColor
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      );
    } else {
      setCartItems([
        ...cartItems,
        {
          ...product,
          quantity: 1,
          selectedSize,
          selectedColor,
        },
      ]);
    }
  };

  const removeFromCart = (productId, selectedSize, selectedColor) => {
    setCartItems(
      cartItems.filter(
        (item) =>
          !(
            item.id === productId &&
            item.selectedSize === selectedSize &&
            item.selectedColor === selectedColor
          ),
      ),
    );
  };

  const updateQuantity = (productId, selectedSize, selectedColor, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedSize, selectedColor);
    } else {
      setCartItems(
        cartItems.map((item) =>
          item.id === productId &&
          item.selectedSize === selectedSize &&
          item.selectedColor === selectedColor
            ? { ...item, quantity }
            : item,
        ),
      );
    }
  };

  const moveToWishlist = (productId, selectedSize, selectedColor) => {
    const item = cartItems.find(
      (item) =>
        item.id === productId &&
        item.selectedSize === selectedSize &&
        item.selectedColor === selectedColor,
    );

    if (item) {
      removeFromCart(productId, selectedSize, selectedColor);

      const existingWishlistItem = wishlistItems.find(
        (wItem) =>
          wItem.id === productId &&
          wItem.selectedSize === selectedSize &&
          wItem.selectedColor === selectedColor,
      );

      if (!existingWishlistItem) {
        setWishlistItems([...wishlistItems, item]);
      }
    }
  };

  const addToWishlist = (product, selectedSize, selectedColor) => {
    const existingWishlistItem = wishlistItems.find(
      (item) =>
        item.id === product.id &&
        item.selectedSize === selectedSize &&
        item.selectedColor === selectedColor,
    );

    if (!existingWishlistItem) {
      setWishlistItems([
        ...wishlistItems,
        {
          ...product,
          quantity: 1,
          selectedSize,
          selectedColor,
        },
      ]);
    }
  };

  const removeFromWishlist = (productId, selectedSize, selectedColor) => {
    setWishlistItems(
      wishlistItems.filter(
        (item) =>
          !(
            item.id === productId &&
            item.selectedSize === selectedSize &&
            item.selectedColor === selectedColor
          ),
      ),
    );
  };

  const moveToCart = (productId, selectedSize, selectedColor) => {
    const item = wishlistItems.find(
      (item) =>
        item.id === productId &&
        item.selectedSize === selectedSize &&
        item.selectedColor === selectedColor,
    );

    if (item) {
      removeFromWishlist(productId, selectedSize, selectedColor);

      const existingCartItem = cartItems.find(
        (cItem) =>
          cItem.id === productId &&
          cItem.selectedSize === selectedSize &&
          cItem.selectedColor === selectedColor,
      );

      if (!existingCartItem) {
        setCartItems([...cartItems, item]);
      }
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  };

  const calculateOriginalTotal = () => {
    return cartItems.reduce(
      (total, item) =>
        total + (item.originalPrice || item.price) * item.quantity,
      0,
    );
  };

  const calculateDiscount = () => {
    return calculateOriginalTotal() - calculateTotal();
  };

  // Updated GST calculation to apply different rates based on product price and category
  const calculateGST = () => {
    return cartItems.reduce((totalGST, item) => {
      const gstRate = getGSTRate(item.price, item.category);
      return totalGST + Math.round(item.price * item.quantity * gstRate);
    }, 0);
  };

  const calculateFinalTotal = () => {
    return calculateTotal() + calculateGST();
  };

  const placeOrder = (deliveryDetails, paymentMethod) => {
    const newOrder = {
      id: `ORD${Date.now()}`,
      date: new Date().toISOString(),
      status: "Processing",
      items: [...cartItems],
      deliveryDetails,
      paymentMethod,
      subtotal: calculateTotal(),
      discount: calculateDiscount(),
      gst: calculateGST(),
      total: calculateFinalTotal(),
      deliveryDate: new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000,
      ).toISOString(), // 7 days from now
    };

    setOrders([...orders, newOrder]);
    setCartItems([]);

    return newOrder;
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        wishlistItems,
        orders,
        addToCart,
        removeFromCart,
        updateQuantity,
        moveToWishlist,
        addToWishlist,
        removeFromWishlist,
        moveToCart,
        calculateTotal,
        calculateOriginalTotal,
        calculateDiscount,
        calculateGST,
        calculateFinalTotal,
        placeOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Share Product Modal Component

export default CartProvider;

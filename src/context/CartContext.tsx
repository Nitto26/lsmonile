'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '@/types';

interface Toast {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning';
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, selectedColor?: string, selectedStorage?: string, quantity?: number) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  toasts: Toast[];
  showToast: (title: string, message: string, type?: 'success' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage or initialize from SQLite DB (matches Figma's cart badge 2)
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('ls_mobile_cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      } else {
        fetch('/api/products')
          .then((r) => r.json())
          .then((prods: Product[]) => {
            if (Array.isArray(prods) && prods.length >= 2) {
              const item1 = prods[0];
              const item2 = prods[2] || prods[1];
              const initialItems: CartItem[] = [
                {
                  id: 'cart-init-1',
                  productId: item1.id,
                  product: item1,
                  quantity: 1,
                  selectedColor: item1.colors?.[0]?.name || 'Blue',
                  selectedStorage: item1.storageOptions?.[0] || '128GB',
                },
                {
                  id: 'cart-init-2',
                  productId: item2.id,
                  product: item2,
                  quantity: 1,
                  selectedColor: item2.colors?.[0]?.name || 'Black',
                },
              ];
              setCart(initialItems);
              localStorage.setItem('ls_mobile_cart', JSON.stringify(initialItems));
            }
          })
          .catch(() => {});
      }

      const savedWishlist = localStorage.getItem('ls_mobile_wishlist');
      if (savedWishlist) {
        setWishlist(JSON.parse(savedWishlist));
      } else {
        setWishlist(['samsung-galaxy-s24']);
      }
    } catch {
      // localStorage fallback
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('ls_mobile_cart', JSON.stringify(cart));
      } catch {
        // ignore
      }
    }
  }, [cart, isLoaded]);

  // Save wishlist to localStorage
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('ls_mobile_wishlist', JSON.stringify(wishlist));
      } catch {
        // ignore
      }
    }
  }, [wishlist, isLoaded]);

  const showToast = (title: string, message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addToCart = (
    product: Product,
    selectedColor = product.colors[0]?.name || 'Standard',
    selectedStorage = product.storageOptions ? product.storageOptions[0] : undefined,
    quantity = 1
  ) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) =>
          item.productId === product.id &&
          item.selectedColor === selectedColor &&
          item.selectedStorage === selectedStorage
      );

      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        const newItem: CartItem = {
          id: `${product.id}-${selectedColor}-${selectedStorage || 'none'}-${Date.now()}`,
          productId: product.id,
          product,
          quantity,
          selectedColor,
          selectedStorage,
        };
        return [...prevCart, newItem];
      }
    });

    showToast('Added to Cart', `${product.name} (${selectedColor}${selectedStorage ? ` · ${selectedStorage}` : ''}) added to your bag.`);
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item) {
        showToast('Item Removed', `${item.product.name} removed from cart.`, 'info');
      }
      return prev.filter((i) => i.id !== id);
    });
  };

  const clearCart = () => {
    setCart([]);
    showToast('Cart Cleared', 'All items have been removed from your cart.', 'info');
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Wishlist Updated', 'Item removed from your wishlist.', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Saved to Wishlist', 'Item added to your wishlist.', 'success');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItems,
        subtotal,
        isCartOpen,
        setIsCartOpen,
        wishlist,
        toggleWishlist,
        isInWishlist,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem("cart_items");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("cart_items", JSON.stringify(items));
  }, [items]);


  // Add item or increment quantity
  const addItem = (item) => {
    setItems((prev) => {
      const exists = prev.find((i) => i.id === item.id && i.type === item.type);
      if (exists) {
        return prev.map((i) =>
          i.id === item.id && i.type === item.type
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  // Decrement quantity or remove item
  const decrementItem = (id, type) => {
    setItems((prev) => {
      return prev
        .map((i) =>
          i.id === id && i.type === type
            ? { ...i, quantity: i.quantity - 1 }
            : i
        )
        .filter((i) => i.quantity > 0);
    });
  };

  const removeItem = (id, type) => {
    setItems((prev) => prev.filter((i) => !(i.id === id && i.type === type)));
  };

  const clearCart = () => setItems([]);

  const isInCart = (id, type) => items.some((i) => i.id === id && i.type === type);
  const getQuantity = (id, type) => {
    const found = items.find((i) => i.id === id && i.type === type);
    return found ? found.quantity : 0;
  };

  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const totalItems = items.length;

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      decrementItem,
      removeItem,
      clearCart,
      isInCart,
      getQuantity,
      totalPrice,
      totalItems
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

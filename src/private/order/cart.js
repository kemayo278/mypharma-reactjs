import React, { useEffect, useState } from 'react';

const useCart = () => {
  const [cartItems, setCartItems] = useState([]);

  const getProductId = (product) => product?.product_id ?? product?.id;

  useEffect(() => {
    const savedItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    setCartItems(savedItems);
  }, []);

  const saveCartItems = (items) => {
    localStorage.setItem('cartItems', JSON.stringify(items));
  };

  const addToCart = (product, saleQuantity, price) => {
    const targetId = getProductId(product);

    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => getProductId(item.product) === targetId);
      let updatedItems;

      if (existingItem) {
        updatedItems = prevItems.map((item) =>
          getProductId(item.product) === targetId
            ? { ...item, quantity: item.quantity + saleQuantity, price }
            : item
        );
      } else {
        updatedItems = [...prevItems, { product, quantity: saleQuantity, price }];
      }

      saveCartItems(updatedItems);
      return updatedItems;
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => {
      const updatedItems = prevItems.filter((item) => getProductId(item.product) !== productId);
      saveCartItems(updatedItems);
      return updatedItems;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    saveCartItems([]);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return {
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    getTotalPrice,
  };
};

export default useCart;

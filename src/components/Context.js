import React, { createContext, useCallback, useEffect, useState } from "react";
export const ProductContext = createContext();
export const APIURL = "https://henri-potier-proxy.herokuapp.com";

const Context = props => {
  const [cartItems, setCartItems] = useState(
    !localStorage.getItem("cartItems")
      ? []
      : JSON.parse(localStorage.getItem("cartItems"))
  );
  const [cartItemsCount, setCartItemsCount] = useState(0);

  const updateCartItemsCount = useCallback(() => {
    const count = cartItems.reduce((value, item) => value + item.quantity, 0);
    setCartItemsCount(count);
  }, [cartItems]);

  const updateCartItems = useCallback(
    items => {
      setCartItems(items);
      updateCartItemsCount();
    },
    [updateCartItemsCount]
  );

  useEffect(() => {
    const count = cartItems.reduce((value, item) => value + item.quantity, 0);
    setCartItemsCount(count);
  }, [cartItems]);

  return (
    <ProductContext.Provider
      value={{
        cartItems,
        cartItemsCount,
        updateCartItems,
        updateCartItemsCount
      }}
    >
      {props.children}
    </ProductContext.Provider>
  );
};

export default Context;

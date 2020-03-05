import axios from 'axios';
import cn from 'classnames';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import button from '../Button/Button.module.scss';
import { APIURL, ProductContext } from '../Context';
import styles from './Cart.module.scss';

const Cart = () => {
  const { cartItems, updateCartItems, updateCartItemsCount } = useContext(
    ProductContext
  );
  const [reduction, setReduction] = useState(0);
  const [subTotal, setSubTotal] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);

  const getReduction = useCallback(
    offer => {
      switch (offer.type) {
        case 'percentage': {
          return subTotal * (offer.value / 100);
        }
        case 'minus': {
          return offer.value;
        }
        case 'slice': {
          const nbSlice = Math.floor(subTotal / offer.sliceValue);
          return nbSlice * offer.value;
        }
        default: {
          return;
        }
      }
    },
    [subTotal]
  );

  const getBestReduction = useCallback(
    commercialOffers => {
      return commercialOffers
        .map(offer => ({ offer, amount: getReduction(offer) }))
        .sort((a, b) => (a.amount < b.amount ? 1 : -1))[0];
    },
    [getReduction]
  );

  const updateCart = useCallback(() => {
    console.log('updateCart');

    if (cartItems && cartItems.length > 0) {
      const productsIsbns = cartItems.map(item => item.isbn);
      const apiPath = `${APIURL}/books/${productsIsbns.join(
        ','
      )}/commercialOffers`;
      axios
        .get(apiPath)
        .then(response => {
          const dataOffers = response.data.offers;
          const bestOffer = getBestReduction(dataOffers);
          setReduction(bestOffer.amount);
          const total = cartItems.reduce(
            (value, item) => value + item.quantity * item.price,
            0
          );
          setSubTotal(total);
          setCartTotal(total - reduction);
        })
        .catch(function(error) {
          console.log(error);
        });
    } else {
      setReduction(0);
      setSubTotal(0);
      setCartTotal(0);
    }
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems, getBestReduction, reduction]);

  const changeQuantity = useCallback(
    (product, number) => {
      product.quantity += number;
      const productInCart = cartItems.find(item => item.isbn === product.isbn);
      if (productInCart) {
        updateCart();
        updateCartItemsCount();
      }
    },
    [cartItems, updateCart, updateCartItemsCount]
  );

  const deleteItemFromCart = useCallback(
    isbn => {
      const productInCart = cartItems.find(item => item.isbn === isbn);
      if (productInCart) {
        let cartList = cartItems;
        cartList.splice(cartList.indexOf(productInCart), 1);
        updateCartItems(cartList);
        updateCart();
      }
    },
    [cartItems, updateCartItems, updateCart]
  );

  useEffect(() => {
    updateCart();
  }, [updateCart]);

  return (
    <div className={styles.cart}>
      {cartItems && cartItems.length > 0 ? (
        <table className={styles.cart_table}>
          <thead>
            <tr>
              <th className={styles.col_title} scope='col'>
                Titre
              </th>
              <th scope='col'>Quantité</th>
              <th scope='col'>Prix unitaire</th>
              <th scope='col'>Prix total</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item, index) => (
              <tr className={styles.cart_item} key={index}>
                <td className={styles.col_title}>{item.title}</td>
                <td className={styles.col_quantity}>
                  <button
                    className={cn(button.btn, styles.btn)}
                    disabled={item.quantity < 2}
                    onClick={e => changeQuantity(item, -1)}
                  >
                    -
                  </button>
                  <span className={styles.quantity}>{item.quantity}</span>
                  <button
                    className={cn(button.btn, styles.btn)}
                    onClick={e => changeQuantity(item, 1)}
                  >
                    +
                  </button>
                </td>
                <td className={styles.col_price}>{item.price}&nbsp;€</td>
                <td className={styles.col_price}>
                  {item.quantity * item.price}&nbsp;€
                </td>
                <td>
                  <button
                    className={cn(button.btn, styles.btn, styles.btn_delete)}
                    onClick={e => deleteItemFromCart(item.isbn)}
                  >
                    X
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th></th>
              <th></th>
              <th>Sous-total</th>
              <td className={styles.col_price}>
                {subTotal.toFixed(2)}
                &nbsp;€
              </td>
              <th></th>
            </tr>
            <tr>
              <th></th>
              <th></th>
              <th>Réduction</th>
              <td className={cn(styles.col_price, styles.reduction)}>
                -{reduction.toFixed(2)}&nbsp;€
              </td>
              <th></th>
            </tr>
            <tr>
              <th></th>
              <th></th>
              <th>Total</th>
              <td className={styles.col_price}>
                {cartTotal.toFixed(2)}
                &nbsp;€
              </td>
              <th></th>
            </tr>
          </tfoot>
        </table>
      ) : (
        <p className={styles.cart_empty}>Votre panier est vide !</p>
      )}
    </div>
  );
};

export default Cart;

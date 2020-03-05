import axios from 'axios';
import cn from 'classnames';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import button from '../Button/Button.module.scss';
import { APIURL, ProductContext } from '../Context';
import styles from './Products.module.scss';

export default function Products() {
  const { cartItems, updateCartItems, updateCartItemsCount } = useContext(
    ProductContext
  );
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const root = '/books';
    axios
      .get(APIURL + root)
      .then(response => {
        setProducts(response.data);
        setIsLoading(false);
      })
      .catch(function(error) {
        console.log(error);
      });
  }, []);

  // useEffect(() => {
  //   setFilteredProducts(
  //     products.filter(
  //       product =>
  //         product.isbn.includes(search) ||
  //         product.title.toLowerCase().includes(search.toLowerCase()) ||
  //         product.synopsis.filter(synopsis =>
  //           synopsis.toLowerCase().includes(search.toLowerCase())
  //         ).length > 0
  //     )
  //   );
  // }, [search, products]);

  const handleSubmit = useCallback(
    event => {
      event.preventDefault();
      let searchWords = search.toLowerCase().split(' ');
      let searchExp = new RegExp('(' + searchWords.join(')|(') + ')', 'gi');

      setFilteredProducts(
        products.filter(
          product =>
            product.isbn.includes(search) ||
            (product.title.toLowerCase().match(searchExp) &&
              product.title.toLowerCase().match(searchExp).length ===
                searchWords.length) ||
            product.synopsis.filter(
              item =>
                item.toLowerCase().match(searchExp) &&
                item.toLowerCase().match(searchExp).length ===
                  searchWords.length
            ).length > 0
        )
      );
    },
    [products, search]
  );

  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  const addCartItem = useCallback(
    isbn => {
      const product = products.find(item => {
        return item.isbn === isbn;
      });

      if (product) {
        const productInCart = cartItems.find(
          cartItem => cartItem.isbn === product.isbn
        );

        if (productInCart) {
          productInCart.quantity++;
          updateCartItemsCount();
        } else {
          const newProduct = {
            isbn: product.isbn,
            title: product.title,
            price: product.price,
            quantity: 1
          };
          let cartList = cartItems;
          cartList.push(newProduct);
          updateCartItems(cartList);
        }
      }
    },
    [products, cartItems, updateCartItemsCount, updateCartItems]
  );

  return (
    <div>
      <form className={styles.search_form} onSubmit={e => handleSubmit(e)}>
        <input
          className={styles.search}
          placeholder='Chercher'
          type='text'
          onChange={e => {
            setSearch(e.target.value);
          }}
          value={search}
        />
        <button className={styles.btn_search} type='submit'>
          Chercher
        </button>
      </form>
      {isLoading || !filteredProducts ? (
        <div className={styles.loader}></div>
      ) : (
        <ul className={styles.products_list}>
          {filteredProducts.map((product, index) => (
            <li className={styles.product_item} key={index}>
              <div className={styles.col_img}>
                <img src={product.cover} alt='' />
                <span className={styles.price}>{product.price} €</span>
                <button
                  className={cn(button.btn, styles.btn)}
                  onClick={e => addCartItem(product.isbn)}
                >
                  Ajouter au panier
                </button>
              </div>
              <div className={styles.info}>
                <div className={styles.info_content}>
                  <h2 className={styles.title}>{product.title}</h2>
                  <p className={styles.synopsis}>{product.synopsis[0]}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

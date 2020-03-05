import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { ProductContext } from '../Context';
import styles from './Header.module.scss';

const Header = () => {
  const { cartItemsCount } = useContext(ProductContext);

  return (
    <header>
      <nav className={styles.nav}>
        <ul className={styles.nav_list}>
          <li className={styles.nav_item}>
            <NavLink
              exact
              activeClassName={styles.active}
              className={styles.nav_link}
              to='/'
            >
              Accueil
            </NavLink>
          </li>
          <li className={styles.nav_item}>
            <NavLink
              exact
              activeClassName={styles.active}
              className={styles.nav_link}
              to='/cart'
            >
              Panier
              {cartItemsCount > 0 && (
                <span className={styles.badge}>{cartItemsCount}</span>
              )}
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;

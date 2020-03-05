import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import styles from './App.module.scss';
import Cart from './components/Cart/Cart';
import ProductContextProvider from './components/Context';
import Header from './components/Header/Header';
import Products from './components/Products/Products';

const App = () => {
  return (
    <div className={styles.wrapper}>
      <ProductContextProvider>
        <Router>
          <Header />
          <Switch>
            <Route path='/' exact>
              <Products />
            </Route>
            <Route path='/cart'>
              <Cart />
            </Route>
          </Switch>
        </Router>
      </ProductContextProvider>
    </div>
  );
};

export default App;

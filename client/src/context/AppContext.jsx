import { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

const CURRENCY_RATES = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  INR: 83.5,
  CAD: 1.36
};

const CURRENCY_SYMBOLS = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  INR: '₹',
  CAD: 'C$'
};

export const AppProvider = ({ children }) => {
  const [stores, setStores] = useState([]);
  const [currency, setCurrency] = useState(localStorage.getItem('currency') || 'USD');

  useEffect(() => {
    // Fetch stores
    api.get('/deals/stores').then(res => setStores(res.data)).catch(console.error);
  }, []);

  const changeCurrency = (curr) => {
    setCurrency(curr);
    localStorage.setItem('currency', curr);
  };

  const formatPrice = (priceInUSD) => {
    const rate = CURRENCY_RATES[currency] || 1;
    const symbol = CURRENCY_SYMBOLS[currency] || '$';
    const converted = (parseFloat(priceInUSD) * rate).toFixed(2);
    return `${symbol}${converted}`;
  };

  const getStore = (storeID) => {
    return stores.find(s => s.storeID === storeID);
  };

  return (
    <AppContext.Provider value={{ stores, getStore, currency, changeCurrency, formatPrice, currencies: Object.keys(CURRENCY_RATES) }}>
      {children}
    </AppContext.Provider>
  );
};

import React, { createContext, useContext, useState } from 'react';

const RATES = { 'EN / USD': { symbol: '$', rate: 1 }, 'EN / GBP': { symbol: '£', rate: 0.79 }, 'EN / PKR': { symbol: '₨', rate: 278 } };

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const [selected, setSelected] = useState('EN / USD');
  
  const convert = (price) => (price * RATES[selected].rate).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const symbol = RATES[selected].symbol;

  return (
    <CurrencyContext.Provider value={{ selected, setSelected, convert, symbol, RATES }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
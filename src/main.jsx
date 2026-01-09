import React from 'react'
import { createRoot } from 'react-dom/client'
import { CartProvider } from './context/CartContext.jsx';
import { ProductProvider } from './context/ProductContext.jsx';
import './index.css'
import App from './App.jsx'
import '@fontsource/merriweather';
import '@fontsource/montserrat';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ProductProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </ProductProvider>
  </React.StrictMode>,
)

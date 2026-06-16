import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import ProductList from "./pages/ProductList";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Collections from "./pages/Collections";
import Sale from "./pages/Sale";
import NewArrivals from "./pages/NewArrivals";

import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { CurrencyProvider } from "./context/CurrencyContext";

import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CookiesSettings from "./pages/CookiesSettings";
import { CookieProvider } from "./context/CookieContext";
import CookieBanner from "./components/CookieBanner";
import Checkout from "./pages/Checkout";

import { Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Profile from './pages/Profile';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" state={{ from: '/checkout' }} replace />;
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <CurrencyProvider>
          <CookieProvider>
            <Router>
              <div className="min-h-screen flex flex-col">
                <div style={{ position: "sticky", top: 0, zIndex: 100 }}>
                  <Header />
                </div>
                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<ProductList />} />
                    <Route path="/product/:id" element={<ProductDetails />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/collections" element={<Collections />} />
                    <Route path="/sale" element={<Sale />} />
                    <Route path="/new-arrivals" element={<NewArrivals />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/terms-of-service" element={<TermsOfService />} />
                    <Route path="/cookies-settings" element={<CookiesSettings />} />
                    <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                  </Routes>
                </main>
                <Footer />
                <CookieBanner />
              </div>
            </Router>
          </CookieProvider>
        </CurrencyProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;

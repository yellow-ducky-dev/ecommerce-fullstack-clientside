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

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <CurrencyProvider>
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
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
        </CurrencyProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;

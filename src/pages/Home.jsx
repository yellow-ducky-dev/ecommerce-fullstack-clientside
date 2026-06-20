import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Send, Archive, ShoppingCart, Star, User, ChevronRight, Zap } from "lucide-react";
import { productService } from "../api/services";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useCurrency } from "../context/CurrencyContext";
import { showToast } from "../helper/toast";
import OptimizedImage from "../components/OptimizedImage"; // Adjust path based on where you saved the component

const CATEGORIES = [
  "Automobiles",
  "Clothes and wear",
  "Home interiors",
  "Computer and tech",
  "Tools, equipments",
  "Sports and outdoor",
  "Animal and pets",
  "Machinery",
];

const SERVICES = [
  {
    title: "Source from Industry Hubs",
    icon: Archive,
    img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d",
  },
  {
    title: "Customize Your Products",
    icon: ShoppingCart,
    img: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d",
  },
  {
    title: "Fast, reliable shipping",
    icon: Zap,
    img: "https://images.unsplash.com/photo-1566576721346-d4a3b4eaad5b",
  },
  {
    title: "Product monitoring",
    icon: ShieldCheck,
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
  },
];

/* ─── Skeleton ───────────────────────────────────────────────────────── */
const SkeletonCard = () => (
  <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #f0f0f0", padding: 12 }}>
    <div style={{ background: "#f3f4f6", borderRadius: 8, height: 140, marginBottom: 12, animation: "pulse 1.5s ease-in-out infinite" }} />
    <div style={{ background: "#f3f4f6", borderRadius: 4, height: 10, width: "75%", marginBottom: 8 }} />
    <div style={{ background: "#f3f4f6", borderRadius: 4, height: 10, width: "50%", marginBottom: 12 }} />
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ background: "#f3f4f6", borderRadius: 4, height: 18, width: 56 }} />
      <div style={{ background: "#f3f4f6", borderRadius: 8, height: 32, width: 32 }} />
    </div>
  </div>
);

/* ─── Product card ───────────────────────────────────────────────────── */
const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : null;
  const { convert, symbol } = useCurrency();

  return (
    <Link
      to={`/product/${product._id}`}
      style={{
        background: "#fff",
        borderRadius: 12,
        border: "1px solid #f0f0f0",
        padding: 12,
        display: "flex",
        flexDirection: "column",
        textDecoration: "none",
        transition: "box-shadow 0.2s, border-color 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.09)";
        e.currentTarget.style.borderColor = "#bfdbfe";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.borderColor = "#f0f0f0";
      }}
    >
      <div
        style={{
          position: "relative",
          marginBottom: 12,
          overflow: "hidden",
          borderRadius: 8,
          background: "#f9fafb",
          height: 140,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <OptimizedImage
          src={product.image}
          alt={product.name}
          optWidth={250}
          style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain", transition: "transform 0.4s" }}
          onMouseEnter={(e) => (e.target.style.transform = "scale(1.08)")}
          onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
        />
        {discount && (
          <span
            style={{
              position: "absolute",
              top: 8,
              left: 8,
              background: "#f97316",
              color: "#fff",
              fontSize: 10,
              fontWeight: 700,
              padding: "2px 8px",
              borderRadius: 99,
            }}
          >
            -{discount}%
          </span>
        )}
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 1, marginBottom: 4 }}>
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={10}
              style={{ fill: i < Math.floor(product.rating) ? "#facc15" : "none", color: i < Math.floor(product.rating) ? "#facc15" : "#e5e7eb" }}
            />
          ))}
          <span style={{ fontSize: 10, color: "#9ca3af", marginLeft: 4 }}>({product.numReviews})</span>
        </div>
        <p
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: "#1a1a1a",
            lineHeight: 1.4,
            marginBottom: 8,
            flex: 1,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {product.name}
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
          <span style={{ fontWeight: 700, color: "#111827", fontSize: 15 }}>
            {symbol} {convert(product.price)}
          </span>
          <button
            onClick={(e) => {
              e.preventDefault();
              addToCart(product, 1);
              showToast.success("Item Added to Cart");
            }}
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "#eff6ff",
              color: "#2563eb",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.15s, color 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#2563eb";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#eff6ff";
              e.currentTarget.style.color = "#2563eb";
            }}
          >
            <ShoppingCart size={14} />
          </button>
        </div>
      </div>
    </Link>
  );
};

/* ─── Main component ─────────────────────────────────────────────────── */
const Home = () => {
  const { user, logout } = useAuth();
  const { convert, symbol } = useCurrency();
  const [allProducts, setAllProducts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [homeItems, setHomeItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [countdown, setCountdown] = useState({ days: 4, hours: 13, mins: 34, secs: 56 });

  useEffect(() => {
    (async () => {
      try {
        const [main, featured, home] = await Promise.all([
          productService.getProducts({ limit: 12 }),
          productService.getProducts({ featured: 'true', limit: 5 }),
          productService.getProducts({ category: 'Home interiors', limit: 8 }),
        ]);
        setAllProducts(main.data.products || []);
        setDeals(featured.data.products || []);
        setHomeItems(home.data.products || []);
      } catch { setError(true); }
      finally  { setLoading(false); }
    })();
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setCountdown((p) => {
        let { days: d, hours: h, mins: m, secs: s } = p;
        s--;
        if (s < 0) {
          s = 59;
          m--;
        }
        if (m < 0) {
          m = 59;
          h--;
        }
        if (h < 0) {
          h = 23;
          d--;
        }
        if (d < 0) d = h = m = s = 0;
        return { days: d, hours: h, mins: m, secs: s };
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}`}</style>

      <main style={{ maxWidth: 1240, margin: "0 auto", padding: "24px 16px", display: "flex", flexDirection: "column", gap: 20 }}>
        {/* ═══ HERO ═══ */}
        <section
          style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
        >
          <div style={{ display: "flex", minHeight: 380 }}>
            {/* Sidebar */}
            <div style={{ width: 196, flexShrink: 0, borderRight: "1px solid #f0f0f0" }} className="hidden lg:block">
              <div style={{ padding: "8px 0" }}>
                {CATEGORIES.map((cat, i) => (
                  <Link
                    key={cat}
                    to={`/products?category=${encodeURIComponent(cat)}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "9px 16px",
                      fontSize: 13,
                      fontWeight: 500,
                      color: i === 1 ? "#2563eb" : "#555",
                      background: i === 1 ? "#eff6ff" : "transparent",
                      textDecoration: "none",
                      transition: "background 0.15s, color 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      if (i !== 1) {
                        e.currentTarget.style.background = "#f9fafb";
                        e.currentTarget.style.color = "#2563eb";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (i !== 1) {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = "#555";
                      }
                    }}
                  >
                    <span>{cat}</span>
                    <ChevronRight size={13} style={{ opacity: 0.4, flexShrink: 0 }} />
                  </Link>
                ))}
              </div>
            </div>

            {/* Banner */}
            <div style={{ flex: 1, position: "relative", overflow: "hidden", minHeight: 280 }}>
              <OptimizedImage
                src="https://images.unsplash.com/photo-1620799140408-edc6dcb6d633"
                alt="Hero banner"
                optWidth={1200}
                loading="eager"        // DO NOT lazy load the hero image
                fetchPriority="high"   // Tell browser to load this first
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to right, rgba(0,0,0,0.68) 0%, rgba(0,0,0,0.25) 55%, transparent 100%)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  padding: "0 40px",
                }}
              >
                <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, fontWeight: 500, marginBottom: 8 }}>Latest trending</p>
                <h1 style={{ color: "#fff", fontSize: "clamp(28px, 4vw, 52px)", fontWeight: 900, lineHeight: 1.1, marginBottom: 24 }}>
                  Electronic
                  <br />
                  items
                </h1>
                <Link
                  to="/products"
                  style={{
                    display: "inline-block",
                    background: "#fff",
                    color: "#111",
                    fontWeight: 600,
                    fontSize: 13,
                    padding: "10px 24px",
                    borderRadius: 8,
                    width: "fit-content",
                    textDecoration: "none",
                    transition: "background 0.2s, color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#f3f4f6";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#fff";
                  }}
                >
                  Learn more
                </Link>
              </div>
            </div>

            {/* User widget */}
            <div
              style={{ width: 204, flexShrink: 0, borderLeft: "1px solid #f0f0f0", padding: 16, display: "flex", flexDirection: "column", gap: 12 }}
              className="hidden xl:flex"
            >
              <div style={{ background: "#eff6ff", borderRadius: 12, padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      background: "#cbd5e1",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <User size={18} color="#fff" />
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 13, color: "#111", lineHeight: 1.3 }}>Hi, {user ? user.name : "user"}</p>
                    <p style={{ fontSize: 11, color: "#888" }}>{user ? user.email : "let's get started"}</p>
                  </div>
                </div>
                {user ? (
                  <button
                    onClick={logout}
                    style={{
                      background: "#ef4444",
                      color: "#fff",
                      textAlign: "center",
                      padding: "9px 8px",
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: 600,
                      border: "none",
                      cursor: "pointer",
                      width: "100%",
                    }}
                  >
                    Log out
                  </button>
                ) : (
                  <>
                    <Link
                      to="/register"
                      style={{
                        background: "#2563eb",
                        color: "#fff",
                        textAlign: "center",
                        padding: "9px 8px",
                        borderRadius: 8,
                        fontSize: 12,
                        fontWeight: 600,
                        display: "block",
                        textDecoration: "none",
                      }}
                    >
                      Join now
                    </Link>
                    <Link
                      to="/login"
                      style={{
                        background: "#fff",
                        color: "#444",
                        textAlign: "center",
                        padding: "9px 8px",
                        borderRadius: 8,
                        fontSize: 12,
                        fontWeight: 600,
                        border: "1px solid #e5e7eb",
                        display: "block",
                        textDecoration: "none",
                      }}
                    >
                      Log in
                    </Link>
                  </>
                )}
              </div>

              <div style={{ background: "#f97316", borderRadius: 12, padding: "12px 14px", color: "#fff" }}>
                <p style={{ fontSize: 12, fontWeight: 600, lineHeight: 1.4 }}>Get US $10 off with a new supplier</p>
              </div>
              <div style={{ background: "#3b82f6", borderRadius: 12, padding: "12px 14px", color: "#fff" }}>
                <p style={{ fontSize: 12, lineHeight: 1.4 }}>Send quotes with supplier preferences</p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ FLASH DEALS ═══ */}
        <section
          style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
        >
          <div style={{ display: "flex", minHeight: 160 }}>
            {/* Countdown */}
            <div
              style={{
                width: 200,
                flexShrink: 0,
                padding: "24px 20px",
                borderRight: "1px solid #f0f0f0",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: 14,
              }}
            >
              <div>
                <h3 style={{ fontWeight: 700, fontSize: 15, color: "#111" }}>Deals and offers</h3>
                <p style={{ fontSize: 12, color: "#aaa", marginTop: 3 }}>Hygiene equipments</p>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {[
                  { v: countdown.days, l: "DAYS" },
                  { v: countdown.hours, l: "HRS" },
                  { v: countdown.mins, l: "MIN" },
                  { v: countdown.secs, l: "SEC" },
                ].map((t, i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      background: "#1f2937",
                      borderRadius: 8,
                      padding: "8px 4px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ color: "#fff", fontWeight: 700, fontSize: 15, lineHeight: 1 }}>{String(t.v).padStart(2, "0")}</span>
                    <span style={{ color: "rgba(255,255,255,0.45)", fontSize: 8, fontWeight: 700, marginTop: 3, letterSpacing: "0.05em" }}>
                      {t.l}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Deal cards */}
            <div style={{ flex: 1, overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
              <div style={{ display: "flex", height: "100%" }}>
                {deals.map((item) => {
                  const discount = item.originalPrice
                    ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
                    : null;
                  return (
                    <Link key={item._id} to={`/product/${item._id}`}
                      style={{ minWidth: 148, padding: '20px 12px', display: 'flex', flexDirection: 'column',
                        alignItems: 'center', textAlign: 'center', borderRight: '1px solid #f0f0f0',
                        textDecoration: 'none', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <div style={{ width: 90, height: 90, borderRadius: 10, overflow: 'hidden',
                        marginBottom: 10, background: '#f3f4f6', flexShrink: 0 }}>
                        <OptimizedImage
                          src={item.image}
                          alt={item.name}
                          optWidth={180}
                          style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
                        />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#333', marginBottom: 8,
                        lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {item.name}
                      </span>
                      {discount && (
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#ef4444', background: '#fef2f2',
                          padding: '2px 10px', borderRadius: 99, border: '1px solid #fee2e2' }}>
                          -{discount}%
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ═══ HOME & INTERIORS ═══ */}
        <section
          style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
        >
          <div style={{ display: "flex", minHeight: 220 }}>
            {/* Left banner */}
            <div style={{ width: 200, flexShrink: 0, position: "relative" }} className="hidden sm:block">
              <OptimizedImage
                src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc"
                alt="Home interiors"
                optWidth={400}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(0,0,0,0.4)",
                  padding: 20,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <h3 style={{ color: "#fff", fontSize: 17, fontWeight: 800, lineHeight: 1.3 }}>
                  Home and
                  <br />
                  interiors
                </h3>
                <Link
                  to="/products"
                  style={{
                    background: "#fff",
                    color: "#222",
                    fontSize: 11,
                    fontWeight: 600,
                    padding: "6px 14px",
                    borderRadius: 6,
                    display: "inline-block",
                    textDecoration: "none",
                    width: "fit-content",
                  }}
                >
                  Source now
                </Link>
              </div>
            </div>

            {/* Items grid */}
            <div style={{ flex: 1, display: "grid", minWidth: 0, gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))" }}>
              {homeItems.map((item, i) => (
                <Link key={item._id} to={`/product/${item._id}`}
                  style={{ padding: '14px 16px', display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between', gap: 10,
                    borderBottom: i < homeItems.length - 4 ? '1px solid #f0f0f0' : 'none',
                    borderRight: '1px solid #f0f0f0',
                    textDecoration: 'none', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 500, color: '#333',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.name}
                    </p>
                    <p style={{ fontSize: 11, color: '#aaa', marginTop: 3 }}>
                      From {symbol}{convert(item.price)}
                    </p>
                  </div>
                  <div style={{ width: 52, height: 52, borderRadius: 8, overflow: 'hidden',
                    flexShrink: 0, background: '#f5f5f5' }}>
                    <OptimizedImage
                      src={item.image}
                      alt={item.name}
                      optWidth={120}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ RECOMMENDED PRODUCTS ═══ */}
        <section>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111" }}>Recommended items</h3>
            <Link
              to="/products"
              style={{ fontSize: 13, color: "#2563eb", fontWeight: 600, display: "flex", alignItems: "center", gap: 4, textDecoration: "none" }}
            >
              View all <ChevronRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 16 }}>
              {[...Array(12)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : error || allProducts.length === 0 ? (
            <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: "64px 24px", textAlign: "center" }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  background: "#f3f4f6",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                }}
              >
                <ShoppingCart size={28} color="#9ca3af" />
              </div>
              <h4 style={{ fontSize: 16, fontWeight: 700, color: "#374151", marginBottom: 8 }}>No products available</h4>
              <p style={{ color: "#6b7280", fontSize: 13, maxWidth: 280, margin: "0 auto" }}>
                {error ? "Could not connect to the server. Start the backend and refresh." : "Products will appear here once added."}
              </p>
              {error && (
                <button
                  onClick={() => window.location.reload()}
                  style={{
                    marginTop: 20,
                    background: "#2563eb",
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: 13,
                    padding: "10px 24px",
                    borderRadius: 8,
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Retry
                </button>
              )}
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 16 }}>
              {allProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
        </section>

        {/* ═══ CTA / INQUIRY ═══ */}
        <section
          style={{
            background: "linear-gradient(135deg, #1a7fff 0%, #0047d4 100%)",
            borderRadius: 16,
            padding: "clamp(32px, 5vw, 48px) clamp(20px, 5vw, 40px)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg,rgba(255,255,255,0.07) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          <div
            style={{
              position: "relative",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 36,
              alignItems: "center",
            }}
          >
            <div>
              <h2 style={{ color: "#fff", fontSize: "clamp(20px, 3vw, 34px)", fontWeight: 800, lineHeight: 1.2, marginBottom: 12 }}>
                An easy way to send requests
                <br />
                to all suppliers
              </h2>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, maxWidth: 380 }}>
                Connect with verified global suppliers. One request, multiple quotes, fast sourcing.
              </p>
            </div>
            <div style={{ background: "#fff", borderRadius: 16, padding: 28, boxShadow: "0 20px 60px rgba(0,0,0,0.18)" }}>
              <h4 style={{ fontWeight: 700, fontSize: 15, color: "#111", marginBottom: 16 }}>Send quote to suppliers</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <input
                  type="text"
                  placeholder="What item do you need?"
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    border: "1px solid #e5e7eb",
                    borderRadius: 10,
                    fontSize: 13,
                    outline: "none",
                    color: "#333",
                    boxSizing: "border-box",
                  }}
                />
                <textarea
                  placeholder="Type more details..."
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    border: "1px solid #e5e7eb",
                    borderRadius: 10,
                    fontSize: 13,
                    outline: "none",
                    height: 72,
                    resize: "none",
                    color: "#333",
                    boxSizing: "border-box",
                  }}
                />
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    type="text"
                    placeholder="Quantity"
                    style={{
                      flex: 1,
                      padding: "10px 14px",
                      border: "1px solid #e5e7eb",
                      borderRadius: 10,
                      fontSize: 13,
                      outline: "none",
                      minWidth: 0,
                    }}
                  />
                  <select
                    style={{
                      flex: 1,
                      padding: "10px 14px",
                      border: "1px solid #e5e7eb",
                      borderRadius: 10,
                      fontSize: 13,
                      background: "#fff",
                      outline: "none",
                      color: "#555",
                      minWidth: 0,
                    }}
                  >
                    <option>Pcs</option>
                    <option>Kg</option>
                    <option>Box</option>
                  </select>
                </div>
                <button
                  style={{
                    width: "100%",
                    background: "#2563eb",
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: 13,
                    padding: "12px",
                    borderRadius: 10,
                    cursor: "pointer",
                    border: "none",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#1d4ed8")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#2563eb")}
                >
                  Send inquiry
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ EXTRA SERVICES ═══ */}
        <section>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111", marginBottom: 16 }}>Our extra services</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
            {SERVICES.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.title}
                  style={{
                    background: "#fff",
                    borderRadius: 16,
                    border: "1px solid #f0f0f0",
                    overflow: "hidden",
                    cursor: "pointer",
                    transition: "box-shadow 0.2s, transform 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.1)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.transform = "none";
                  }}
                >
                  <div style={{ height: 140, overflow: "hidden" }}>
                    <OptimizedImage
                      src={s.img}
                      alt={s.title}
                      optWidth={400}
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.5s" }}
                      onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
                      onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
                    />
                  </div>
                  <div style={{ padding: "18px 16px 14px", position: "relative" }}>
                    <div
                      style={{
                        position: "absolute",
                        top: -18,
                        right: 16,
                        width: 36,
                        height: 36,
                        background: "#2563eb",
                        borderRadius: "50%",
                        border: "3px solid #fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 2px 8px rgba(37,99,235,0.35)",
                      }}
                    >
                      <Icon size={16} color="#fff" />
                    </div>
                    <p style={{ fontWeight: 700, fontSize: 13, color: "#111", paddingRight: 32 }}>{s.title}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ═══ NEWSLETTER ═══ */}
        <section
          style={{
            background: "linear-gradient(135deg, #f8faff 0%, #eef2ff 100%)",
            border: "1px solid #e0e7ff",
            borderRadius: 16,
            padding: "clamp(32px, 5vw, 48px) 24px",
            textAlign: "center",
          }}
        >
          <h3 style={{ fontSize: 20, fontWeight: 700, color: "#111", marginBottom: 8 }}>Subscribe to our newsletter</h3>
          <p style={{ color: "#888", fontSize: 13, maxWidth: 360, margin: "0 auto 24px" }}>
            Get daily news on upcoming offers from many suppliers all over the world
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 8, maxWidth: 420, margin: "0 auto", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
              <Send
                size={14}
                style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#aaa", pointerEvents: "none" }}
              />
              <input
                type="email"
                placeholder="Email address"
                style={{
                  width: "100%",
                  padding: "11px 14px 11px 34px",
                  border: "1px solid #ddd",
                  borderRadius: 10,
                  fontSize: 13,
                  outline: "none",
                  background: "#fff",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <button
              style={{
                background: "#2563eb",
                color: "#fff",
                fontWeight: 600,
                fontSize: 13,
                padding: "11px 28px",
                borderRadius: 10,
                border: "none",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#1d4ed8")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#2563eb")}
            >
              Subscribe
            </button>
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;
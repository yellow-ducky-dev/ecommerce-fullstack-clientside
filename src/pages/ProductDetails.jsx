import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Star,
  ShoppingCart,
  Heart,
  Share2,
  ChevronRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  ChevronLeft,
  Check,
  Info,
  Award,
  Clock,
  Zap,
} from "lucide-react";
import { productService } from "../api/services";
import { useCart } from "../context/CartContext";
import { useCurrency } from '../context/CurrencyContext';
import { showToast } from "../helper/toast";


/* ─── Fallback (matches Home.jsx) ───────────────────────────────────── */
const FALLBACK =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23f3f4f6' width='200' height='200'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='12' fill='%239ca3af'%3ENo image%3C/text%3E%3C/svg%3E";
const onImgError = (e) => {
  e.target.onerror = null;
  e.target.src = FALLBACK;
};

/* ─── Star row ───────────────────────────────────────────────────────── */
const Stars = ({ rating, size = 12 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
    {[1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        size={size}
        style={{ fill: s <= Math.floor(rating) ? "#facc15" : "none", color: s <= Math.floor(rating) ? "#facc15" : "#e5e7eb" }}
      />
    ))}
  </div>
);

/* ─── Skeleton ───────────────────────────────────────────────────────── */
const Skeleton = ({ h, w = "100%", r = 8, mb = 0 }) => (
  <div style={{ height: h, width: w, borderRadius: r, background: "#f3f4f6", marginBottom: mb, animation: "pulse 1.5s ease-in-out infinite" }} />
);

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState("description");
  const [added, setAdded] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);
  const [wished, setWished] = useState(false);
  const [showPolicy, setShowPolicy] = useState(false);
  const { convert, symbol } = useCurrency();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setActiveImg(0);
        const { data } = await productService.getProduct(id);
        setProduct(data);
        const { data: rel } = await productService.getProducts({ category: data.category, limit: 5 });
        setRelated((rel.products || []).filter((p) => p._id !== id).slice(0, 4));
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    })();
    window.scrollTo(0, 0);
  }, [id]);

  const handleAdd = () => {
    if (!product) return;
    addToCart(product, qty);
    setAdded(true);
    showToast.success("Item Added to Cart")
    setTimeout(() => setAdded(false), 2000);
  };

  /* ── Loading ── */
  if (loading)
    return (
      <>
        <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}`}</style>
        <main style={{ maxWidth: 1240, margin: "0 auto", padding: "24px 16px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
            <div>
              <Skeleton h={380} r={16} mb={12} />
              <div style={{ display: "flex", gap: 10 }}>
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} h={72} w={72} r={10} />
                ))}
              </div>
            </div>
            <div>
              <Skeleton h={32} w="75%" r={8} mb={12} />
              <Skeleton h={18} w="50%" r={6} mb={16} />
              <Skeleton h={80} r={8} mb={16} />
              <Skeleton h={48} w="40%" r={8} mb={20} />
              <Skeleton h={44} r={10} />
            </div>
          </div>
        </main>
      </>
    );

  /* ── Error ── */
  if (error || !product)
    return (
      <main style={{ maxWidth: 1240, margin: "0 auto", padding: "64px 16px", textAlign: "center" }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🔍</div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#111", marginBottom: 8 }}>Product not found</h2>
        <p style={{ color: "#6b7280", fontSize: 13, marginBottom: 24 }}>We couldn't find the product you're looking for.</p>
        <Link
          to="/products"
          style={{
            background: "#2563eb",
            color: "#fff",
            fontWeight: 600,
            fontSize: 13,
            padding: "10px 24px",
            borderRadius: 8,
            textDecoration: "none",
          }}
        >
          Back to Shop
        </Link>
      </main>
    );

  const images = product.images?.length > 0 ? product.images : [product.image];
  const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : null;

  const TABS = ["description", "specifications", "reviews", "shipping"];

  return (
    <>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}`}</style>

      <main style={{ maxWidth: 1240, margin: "0 auto", padding: "24px 16px", display: "flex", flexDirection: "column", gap: 20 }}>
        {/* ── Breadcrumb ── */}
        <nav style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#9ca3af", flexWrap: "wrap" }}>
          <Link
            to="/"
            style={{ color: "#9ca3af", textDecoration: "none" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#2563eb")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#9ca3af")}
          >
            Home
          </Link>
          <ChevronRight size={12} />
          <Link
            to="/products"
            style={{ color: "#9ca3af", textDecoration: "none" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#2563eb")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#9ca3af")}
          >
            Products
          </Link>
          <ChevronRight size={12} />
          <Link
            to={`/products?category=${encodeURIComponent(product.category)}`}
            style={{ color: "#9ca3af", textDecoration: "none" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#2563eb")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#9ca3af")}
          >
            {product.category}
          </Link>
          <ChevronRight size={12} />
          <span style={{ color: "#374151", fontWeight: 500, maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {product.name}
          </span>
        </nav>

        {/* ── Main grid ── */}
        <section
          style={{
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: 16,
            overflow: "hidden",
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            padding: 24,
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 32 }}>
            {/* ── Left: images ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {/* Main image */}
              <div
                style={{
                  position: "relative",
                  background: "#f9fafb",
                  borderRadius: 12,
                  border: "1px solid #f0f0f0",
                  overflow: "hidden",
                  aspectRatio: "1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: zoomed ? (isDragging ? "grabbing" : "zoom-out") : "zoom-in",
                }}
                onClick={() => {
                  if (!hasMoved) {
                    setZoomed((z) => !z);
                    setOffset({ x: 0, y: 0 });
                  }
                }}
                onMouseDown={(e) => {
                  setHasMoved(false);
                  if (zoomed) {
                    setIsDragging(true);
                    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
                  }
                }}
                onMouseMove={(e) => {
                  if (isDragging && zoomed) {
                    setHasMoved(true);
                    setOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
                  }
                }}
                onMouseUp={() => setIsDragging(false)}
                onMouseLeave={() => setIsDragging(false)}
                onDragStart={(e) => e.preventDefault()}
              >
                <img
                  src={images[activeImg]}
                  alt={product.name}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                    padding: 24,
                    transform: zoomed ? `scale(1.4) translate(${offset.x}px, ${offset.y}px)` : "scale(1)",
                  }}
                  onError={onImgError}
                  onDragStart={(e) => e.preventDefault()}
                />

                {/* Prev / Next */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setActiveImg((i) => (i - 1 + images.length) % images.length)}
                      style={{
                        position: "absolute",
                        left: 10,
                        top: "50%",
                        transform: "translateY(-50%)",
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        background: "#fff",
                        border: "1px solid #e5e7eb",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#eff6ff")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
                    >
                      <ChevronLeft size={16} color="#555" />
                    </button>
                    <button
                      onClick={() => setActiveImg((i) => (i + 1) % images.length)}
                      style={{
                        position: "absolute",
                        right: 10,
                        top: "50%",
                        transform: "translateY(-50%)",
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        background: "#fff",
                        border: "1px solid #e5e7eb",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#eff6ff")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
                    >
                      <ChevronRight size={16} color="#555" />
                    </button>
                  </>
                )}

                {/* Badges */}
                {discount && (
                  <span
                    style={{
                      position: "absolute",
                      top: 10,
                      left: 10,
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
                <button
                  onClick={() => setWished((w) => !w)}
                  style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: "#fff",
                    border: "1px solid #e5e7eb",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "border-color 0.15s",
                  }}
                >
                  <Heart size={15} style={{ fill: wished ? "#ef4444" : "none", color: wished ? "#ef4444" : "#aaa" }} />
                </button>
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImg(i)}
                      style={{
                        flexShrink: 0,
                        width: 64,
                        height: 64,
                        borderRadius: 10,
                        overflow: "hidden",
                        border: i === activeImg ? "2px solid #2563eb" : "2px solid #f0f0f0",
                        background: "#f9fafb",
                        padding: 6,
                        cursor: "pointer",
                        transition: "border-color 0.15s",
                        boxSizing: "border-box",
                      }}
                      onMouseEnter={(e) => {
                        if (i !== activeImg) e.currentTarget.style.borderColor = "#bfdbfe";
                      }}
                      onMouseLeave={(e) => {
                        if (i !== activeImg) e.currentTarget.style.borderColor = "#f0f0f0";
                      }}
                    >
                      <img src={img} alt="" onError={onImgError} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── Right: info ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {/* Category + stock */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#2563eb",
                    background: "#eff6ff",
                    padding: "3px 10px",
                    borderRadius: 99,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {product.category}
                </span>
                {product.stock > 0 ? (
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#16a34a",
                      background: "#f0fdf4",
                      padding: "3px 10px",
                      borderRadius: 99,
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <Zap size={11} /> In Stock
                  </span>
                ) : (
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#ef4444",
                      background: "#fef2f2",
                      padding: "3px 10px",
                      borderRadius: 99,
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <Clock size={11} /> Out of Stock
                  </span>
                )}
              </div>

              {/* Name */}
              <h1 style={{ fontSize: "clamp(18px, 2.5vw, 26px)", fontWeight: 800, color: "#111", lineHeight: 1.3, margin: 0 }}>{product.name}</h1>

              {/* Rating row */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <Stars rating={product.rating} size={14} />
                <span style={{ fontSize: 13, fontWeight: 700, color: "#111" }}>{product.rating.toFixed(1)}</span>
                <span style={{ color: "#e5e7eb" }}>|</span>
                <span style={{ fontSize: 12, color: "#9ca3af" }}>{product.numReviews} reviews</span>
                <span style={{ color: "#e5e7eb" }}>|</span>
                <span style={{ fontSize: 12, color: "#9ca3af" }}>{product.brand || "Premium Brand"}</span>
              </div>

              {/* Price card */}
              <div style={{ background: "#f9fafb", border: "1px solid #f0f0f0", borderRadius: 12, padding: 16 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 4 }}>
                  <span style={{ fontSize: 28, fontWeight: 900, color: "#111" }}>{symbol} {convert(product.price)}</span>
                  {product.originalPrice && (
                    <span style={{ fontSize: 16, color: "#aaa", textDecoration: "line-through", fontWeight: 500 }}>
                      {symbol} {convert(product.price)}
                    </span>
                  )}
                  {discount && (
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#f97316", background: "#fff7ed", padding: "2px 8px", borderRadius: 99 }}>
                      Save {discount}%
                    </span>
                  )}
                </div>
                <p style={{ fontSize: 11, color: "#aaa" }}>Tax and shipping calculated at checkout</p>
              </div>

              {/* Trust badges */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[
                  { icon: <Award size={14} color="#2563eb" />, text: "Top-rated Item" },
                  { icon: <ShieldCheck size={14} color="#3b82f6" />, text: "2-Year Warranty" },
                  { icon: <RotateCcw size={14} color="#f97316" />, text: "30-Day Returns" },
                  { icon: <Truck size={14} color="#16a34a" />, text: "Free Shipping" },
                ].map((b, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      background: "#fff",
                      border: "1px solid #f0f0f0",
                      borderRadius: 8,
                      padding: "8px 10px",
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#374151",
                    }}
                  >
                    {b.icon} {b.text}
                  </div>
                ))}
              </div>

              {/* Qty + buttons */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
                    Quantity
                  </p>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      width: "fit-content",
                      background: "#f9fafb",
                      border: "1px solid #e5e7eb",
                      borderRadius: 10,
                      overflow: "hidden",
                    }}
                  >
                    <button
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      style={{
                        width: 36,
                        height: 36,
                        border: "none",
                        background: "none",
                        fontSize: 18,
                        fontWeight: 700,
                        color: "#555",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#e5e7eb")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                    >
                      −
                    </button>
                    <span style={{ width: 40, textAlign: "center", fontWeight: 700, fontSize: 14, color: "#111" }}>{qty}</span>
                    <button
                      onClick={() => setQty((q) => Math.min(product.stock || 99, q + 1))}
                      style={{
                        width: 36,
                        height: 36,
                        border: "none",
                        background: "none",
                        fontSize: 18,
                        fontWeight: 700,
                        color: "#555",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#e5e7eb")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    onClick={handleAdd}
                    disabled={product.stock === 0}
                    style={{
                      flex: 2,
                      height: 44,
                      borderRadius: 10,
                      border: "none",
                      cursor: "pointer",
                      fontWeight: 700,
                      fontSize: 13,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      transition: "background 0.15s, transform 0.1s",
                      background: added ? "#16a34a" : "#1f2937",
                      color: "#fff",
                    }}
                    onMouseEnter={(e) => {
                      if (!added) e.currentTarget.style.background = "#111";
                    }}
                    onMouseLeave={(e) => {
                      if (!added) e.currentTarget.style.background = "#1f2937";
                    }}
                  >
                    {added ? <Check size={16} /> : <ShoppingCart size={16} />}
                    {added ? "Added to Cart!" : "Add to Cart"}
                  </button>
                  <button
                    onClick={() => {
                      handleAdd();
                      navigate("/cart");
                    }}
                    disabled={product.stock === 0}
                    style={{
                      flex: 1,
                      height: 44,
                      borderRadius: 10,
                      border: "none",
                      cursor: "pointer",
                      fontWeight: 700,
                      fontSize: 13,
                      background: "#2563eb",
                      color: "#fff",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#1d4ed8")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "#2563eb")}
                  >
                    Buy Now
                  </button>
                </div>

                {/* Share row */}
                <div
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 12, borderTop: "1px solid #f0f0f0" }}
                >
                  <div style={{ display: "flex", gap: 16 }}>
                    {[
                      { icon: <Share2 size={14} />, label: "Share" },
                      { icon: <Info size={14} />, label: "Ask" },
                    ].map((a, i) => (
                      <button
                        key={i}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          fontSize: 12,
                          fontWeight: 600,
                          color: "#9ca3af",
                          transition: "color 0.15s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "#111")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "#9ca3af")}
                      >
                        {a.icon} {a.label}
                      </button>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    {["fb", "tw", "wa", "ig"].map((s) => (
                      <div
                        key={s}
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          background: "#f3f4f6",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 9,
                          fontWeight: 800,
                          color: "#9ca3af",
                          cursor: "pointer",
                          textTransform: "uppercase",
                          transition: "background 0.15s, color 0.15s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#eff6ff";
                          e.currentTarget.style.color = "#2563eb";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "#f3f4f6";
                          e.currentTarget.style.color = "#9ca3af";
                        }}
                      >
                        {s}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Tabs ── */}
        <section
          style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
        >
          {/* Tab bar */}
          <div style={{ display: "flex", borderBottom: "1px solid #f0f0f0", overflowX: "auto" }}>
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  padding: "14px 20px",
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                  textTransform: "capitalize",
                  color: tab === t ? "#2563eb" : "#9ca3af",
                  borderBottom: tab === t ? "2px solid #2563eb" : "2px solid transparent",
                  transition: "color 0.15s, border-color 0.15s",
                }}
              >
                {t}
                {t === "reviews" ? ` (${product.numReviews})` : ""}
              </button>
            ))}
          </div>

          <div style={{ padding: 24 }}>
            {/* Description */}
            {tab === "description" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.7 }}>{product.description}</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
                  <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 12, padding: 20 }}>
                    <h4 style={{ fontSize: 14, fontWeight: 700, color: "#111", marginBottom: 12 }}>Why you'll love it</h4>
                    {["Premium quality materials", "Exceptional durability", "Ergonomic modern design"].map((pt, i) => (
                      <div
                        key={i}
                        style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#374151", fontWeight: 500, marginBottom: 8 }}
                      >
                        <Check size={14} color="#2563eb" /> {pt}
                      </div>
                    ))}
                  </div>
                  <div style={{ background: "#f9fafb", border: "1px solid #f0f0f0", borderRadius: 12, padding: 20 }}>
                    <h4 style={{ fontSize: 14, fontWeight: 700, color: "#111", marginBottom: 12 }}>Product Tags</h4>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {product.tags?.map((tag) => (
                        <span
                          key={tag}
                          style={{
                            background: "#fff",
                            border: "1px solid #e5e7eb",
                            borderRadius: 8,
                            padding: "4px 10px",
                            fontSize: 12,
                            fontWeight: 600,
                            color: "#555",
                          }}
                        >
                          # {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Specifications */}
            {tab === "specifications" && (
              <div style={{ border: "1px solid #f0f0f0", borderRadius: 12, overflow: "hidden" }}>
                {[
                  { label: "Category", value: product.category },
                  { label: "Brand", value: product.brand || "Premium" },
                  { label: "SKU", value: `PROD-${id.slice(-6).toUpperCase()}` },
                  { label: "Stock", value: product.stock > 0 ? `${product.stock} units` : "Out of Stock" },
                  { label: "Total Sold", value: `${product.sold || 0} units` },
                  { label: "Rating", value: `${product.rating.toFixed(1)} / 5.0` },
                ].map((row, i) => (
                  <div
                    key={i}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "160px 1fr",
                      padding: "12px 16px",
                      background: i % 2 === 0 ? "#fff" : "#f9fafb",
                      borderBottom: "1px solid #f0f0f0",
                    }}
                  >
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      {row.label}
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#111" }}>{row.value}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Reviews */}
            {tab === "reviews" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {/* Summary bar */}
                <div
                  style={{
                    background: "#f9fafb",
                    border: "1px solid #f0f0f0",
                    borderRadius: 12,
                    padding: 20,
                    display: "flex",
                    gap: 24,
                    flexWrap: "wrap",
                    alignItems: "center",
                  }}
                >
                  <div style={{ textAlign: "center", minWidth: 80 }}>
                    <div style={{ fontSize: 40, fontWeight: 900, color: "#111", lineHeight: 1 }}>{product.rating.toFixed(1)}</div>
                    <Stars rating={product.rating} size={16} />
                    <p style={{ fontSize: 11, color: "#aaa", marginTop: 6, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      Overall
                    </p>
                  </div>
                  <div style={{ flex: 1, minWidth: 200, display: "flex", flexDirection: "column", gap: 6 }}>
                    {[5, 4, 3, 2, 1].map((n) => {
                      const count = product.reviews?.filter((r) => r.rating === n).length || 0;
                      const pct = product.reviews?.length ? Math.round((count / product.reviews.length) * 100) : 0;
                      return (
                        <div key={n} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", width: 36 }}>{n} star</span>
                          <div style={{ flex: 1, height: 6, background: "#e5e7eb", borderRadius: 99, overflow: "hidden" }}>
                            <div style={{ height: "100%", background: "#facc15", borderRadius: 99, width: `${pct}%` }} />
                          </div>
                          <span style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", width: 32, textAlign: "right" }}>{pct}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Review cards */}
                {product.reviews?.length > 0 ? (
                  product.reviews.map((r, i) => (
                    <div
                      key={i}
                      style={{ background: "#fff", border: "1px solid #f0f0f0", borderRadius: 12, padding: 16, transition: "box-shadow 0.2s" }}
                      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)")}
                      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                        <div
                          style={{
                            width: 38,
                            height: 38,
                            borderRadius: "50%",
                            background: "#eff6ff",
                            color: "#2563eb",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 800,
                            fontSize: 15,
                            flexShrink: 0,
                          }}
                        >
                          {r.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 700, color: "#111", marginBottom: 3 }}>{r.name}</p>
                          <Stars rating={r.rating} size={12} />
                        </div>
                      </div>
                      <p style={{ fontSize: 13, color: "#555", lineHeight: 1.6 }}>{r.comment}</p>
                    </div>
                  ))
                ) : (
                  <p style={{ fontSize: 13, color: "#9ca3af", textAlign: "center", padding: "32px 0" }}>No reviews yet.</p>
                )}
              </div>
            )}

            {/* Shipping */}
            {tab === "shipping" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
                  {[
                    { icon: <Truck size={20} color="#16a34a" />, title: "Standard Courier", detail: "5–10 working days", price: "Free" },
                    { icon: <Zap size={20} color="#2563eb" />, title: "Express Flash", detail: "Next day delivery", price: "$12.99" },
                    { icon: <Award size={20} color="#f97316" />, title: "Local Pickup", detail: "1200+ locations", price: "Free" },
                    { icon: <ShieldCheck size={20} color="#3b82f6" />, title: "Global Air", detail: "150+ countries", price: "$24.99" },
                  ].map((s, i) => (
                    <div
                      key={i}
                      style={{
                        background: "#fff",
                        border: "1px solid #f0f0f0",
                        borderRadius: 12,
                        padding: 16,
                        display: "flex",
                        gap: 14,
                        alignItems: "flex-start",
                        transition: "box-shadow 0.2s, border-color 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)";
                        e.currentTarget.style.borderColor = "#bfdbfe";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = "none";
                        e.currentTarget.style.borderColor = "#f0f0f0";
                      }}
                    >
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          background: "#f9fafb",
                          borderRadius: 10,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        {s.icon}
                      </div>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 700, color: "#111", marginBottom: 4 }}>{s.title}</p>
                        <p style={{ fontSize: 12, color: "#9ca3af", marginBottom: 8 }}>{s.detail}</p>
                        <span
                          style={{ fontSize: 12, fontWeight: 700, color: "#2563eb", background: "#eff6ff", padding: "2px 10px", borderRadius: 99 }}
                        >
                          {s.price}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Returns banner */}
                <div
                  style={{
                    background: "#1f2937",
                    borderRadius: 12,
                    padding: "24px 20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 16,
                  }}
                >
                  <div>
                    <h4 style={{ color: "#fff", fontWeight: 700, fontSize: 16, marginBottom: 6 }}>Hassle-Free Returns</h4>
                    <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 13 }}>Return within 30 days for a full refund, no questions asked.</p>
                  </div>
                  <button
                    onClick={() => setShowPolicy((p) => !p)}
                    style={{
                      background: "#fff",
                      color: "#111",
                      fontWeight: 700,
                      fontSize: 13,
                      padding: "10px 20px",
                      borderRadius: 8,
                      border: "none",
                      cursor: "pointer",
                      transition: "background 0.15s",
                      whiteSpace: "nowrap",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#f3f4f6")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
                  >
                    View Return Policy
                  </button>
                  {showPolicy && (
                    <div
                      style={{
                        marginTop: 12,
                        padding: 16,
                        background: "rgba(255,255,255,0.08)",
                        borderRadius: 10,
                        color: "rgba(255,255,255,0.75)",
                        fontSize: 13,
                        lineHeight: 1.7,
                      }}
                    >
                      Items can be returned within 30 days of delivery. Products must be unused and in original packaging. Refunds are processed
                      within 5–7 business days. Contact support to initiate a return.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ── Related products ── */}
        {related.length > 0 && (
          <section>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111" }}>Customers Also Viewed</h3>
              <Link
                to="/products"
                style={{ fontSize: 13, color: "#2563eb", fontWeight: 600, display: "flex", alignItems: "center", gap: 4, textDecoration: "none" }}
              >
                View all <ChevronRight size={14} />
              </Link>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 16 }}>
              {related.map((p) => {
                const d = p.originalPrice ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : null;
                return (
                  <Link
                    key={p._id}
                    to={`/product/${p._id}`}
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
                        marginBottom: 10,
                        overflow: "hidden",
                        borderRadius: 8,
                        background: "#f9fafb",
                        height: 130,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <img
                        src={p.image}
                        alt={p.name}
                        onError={onImgError}
                        style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain", transition: "transform 0.4s" }}
                        onMouseEnter={(e) => (e.target.style.transform = "scale(1.08)")}
                        onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
                      />
                      {d && (
                        <span
                          style={{
                            position: "absolute",
                            top: 6,
                            left: 6,
                            background: "#f97316",
                            color: "#fff",
                            fontSize: 10,
                            fontWeight: 700,
                            padding: "2px 6px",
                            borderRadius: 99,
                          }}
                        >
                          -{d}%
                        </span>
                      )}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 2, marginBottom: 4 }}>
                      <Stars rating={p.rating} size={10} />
                      <span style={{ fontSize: 10, color: "#9ca3af", marginLeft: 4 }}>({p.numReviews})</span>
                    </div>
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: 500,
                        color: "#1a1a1a",
                        lineHeight: 1.4,
                        flex: 1,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        marginBottom: 8,
                      }}
                    >
                      {p.name}
                    </p>
                    <span style={{ fontWeight: 700, color: "#111827", fontSize: 14 }}>{symbol} {convert(product.price)}</span>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </main>
    </>
  );
};

export default ProductDetails;

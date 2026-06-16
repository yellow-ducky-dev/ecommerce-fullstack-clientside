import React, { useState, useEffect } from "react";
import { Search, User, ShoppingCart, Menu, X, Globe, Mail, Phone, ChevronDown, Zap, Package } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useCurrency } from "../context/CurrencyContext";
import { useAuth } from "../context/AuthContext";

const NAV_LINKS = [
  { label: "Home", path: "/" },
  { label: "Products", path: "/products" },
  { label: "Collections", path: "/collections" },
  { label: "Sale", path: "/sale" },
  { label: "New Arrivals", path: "/new-arrivals" },
];

const Header = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const { selected, setSelected, RATES } = useCurrency();

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled((prev) => {
        if (!prev && y > 50) return true; // hide top bar after 50px
        if (prev && y < 10) return false; // show top bar only when back near top
        return prev; // no change in between
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  const isActive = (path) => (path === "/" ? location.pathname === "/" : location.pathname.startsWith(path));

  return (
    <>
      <header
        style={{
          background: scrolled ? "rgba(255,255,255,0.95)" : "#ffffff",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,0.08)" : "0 1px 0 #f0f0f0",
          transition: "all 0.3s ease",
        }}
      >
        {/* ── Top bar ── */}
        <div
  style={{
  background: "#1a1a1a",
  color: "rgba(255,255,255,0.7)",
  fontWeight: 300,
  letterSpacing: "0.01em",
  maxHeight: scrolled ? 0 : 34,
  willChange: "max-height",
  transition: "max-height 0.3s ease",
  display: "block",
}}
className="block text-[7px] md:text-[10px]"
>
  <div
    style={{
      maxWidth: 1240,
      margin: "0 auto",
      padding: "0 16px",
      height: 36,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
    }}
  >
    {/* LEFT SIDE */}
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      <a
        href="mailto:support@brand.com"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          color: "rgba(255,255,255,0.6)",
          textDecoration: "none",
          transition: "color 0.15s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
        onMouseLeave={(e) =>
          (e.currentTarget.style.color = "rgba(255,255,255,0.6)")
        }
      >
        <Mail size={11} /> support@brand.com
      </a>

      <a
        href="tel:+12345678"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          color: "rgba(255,255,255,0.6)",
          textDecoration: "none",
          transition: "color 0.15s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
        onMouseLeave={(e) =>
          (e.currentTarget.style.color = "rgba(255,255,255,0.6)")
        }
      >
        <Phone size={11} /> +1 (234) 567-890
      </a>
    </div>

    {/* RIGHT SIDE */}
    <div
      style={{
        display: "flex",
        gap: 12,
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <Link
        to="/products"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 5,
          color: "rgba(255,255,255,0.6)",
          textDecoration: "none",
          transition: "color 0.15s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
        onMouseLeave={(e) =>
          (e.currentTarget.style.color = "rgba(255,255,255,0.6)")
        }
      >
        <Zap size={11} /> Flash Deals
      </Link>

      <Link
        to="/products"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 5,
          color: "rgba(255,255,255,0.6)",
          textDecoration: "none",
          transition: "color 0.15s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
        onMouseLeave={(e) =>
          (e.currentTarget.style.color = "rgba(255,255,255,0.6)")
        }
      >
        <Package size={11} /> Track Order
      </Link>

      {/* LANGUAGE DROPDOWN */}
      <div style={{ position: "relative" }}>
        <span
          onClick={() => setShowLangMenu((p) => !p)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            color: "rgba(255,255,255,0.6)",
            cursor: "pointer",
          }}
        >
          <Globe size={11} /> {selected} <ChevronDown size={9} />
        </span>

        {showLangMenu && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              right: 0,
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              padding: "4px 0",
              marginTop: 6,
              minWidth: 120,
              zIndex: 200,
              boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
            }}
          >
            {["EN / USD", "EN / GBP", "EN / PKR"].map((opt) => (
              <div
                key={opt}
                onClick={() => {
                  setSelected(opt);
                  setShowLangMenu(false);
                }}
                style={{
                  padding: "8px 14px",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  background:
                    selected === opt ? "#eff6ff" : "transparent",
                  color: selected === opt ? "#2563eb" : "#333",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#f9fafb")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background =
                    selected === opt ? "#eff6ff" : "transparent")
                }
              >
                {opt}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
</div>

        {/* ── Main header ── */}
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20, height: 64 }}>
            {/* Logo */}
            <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}>
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", inset: -4, background: "rgba(13,110,253,0.15)", borderRadius: "50%", filter: "blur(8px)" }} />
                <div
                  style={{
                    position: "relative",
                    background: "#1a1a1a",
                    padding: 9,
                    borderRadius: 12,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  }}
                >
                  <ShoppingCart size={20} color="#fff" strokeWidth={2.5} />
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
                <span style={{ fontSize: 20, fontWeight: 900, color: "#1a1a1a", letterSpacing: "-0.02em" }}>E-Commerce</span>
                <span style={{ fontSize: 9, fontWeight: 800, color: "#0D6EFD", letterSpacing: "0.22em", marginTop: 1 }}>PREMIUM</span>
              </div>
            </Link>

            {/* Search bar */}
            <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: 580, position: "relative" }} className="hidden lg:block">
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <Search size={16} style={{ position: "absolute", left: 16, color: "#aaa", pointerEvents: "none" }} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for premium products..."
                  style={{
                    width: "100%",
                    padding: "11px 100px 11px 44px",
                    background: "#f5f7fa",
                    border: "2px solid transparent",
                    borderRadius: 12,
                    fontSize: 13,
                    fontWeight: 500,
                    outline: "none",
                    transition: "border-color 0.2s, background 0.2s",
                    color: "#333",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#0D6EFD";
                    e.target.style.background = "#fff";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "transparent";
                    e.target.style.background = "#f5f7fa";
                  }}
                />
                <button
                  type="submit"
                  style={{
                    position: "absolute",
                    right: 6,
                    background: "#0D6EFD",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    padding: "7px 18px",
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                    letterSpacing: "0.04em",
                  }}
                >
                  SEARCH
                </button>
              </div>
            </form>

            {/* Actions */}
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginLeft: "auto" }}>
              {/* Account */}
              {user ? (
                <Link
                  to="/profile"
                  className="flex flex-col items-center sm:flex"
                  style={{
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 3,
                    padding: "6px 10px",
                    borderRadius: 10,
                    textDecoration: "none",
                    color: "#666",
                    transition: "background 0.15s, color 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#f5f7fa";
                    e.currentTarget.style.color = "#0D6EFD";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "#666";
                  }}
                >
                  <User size={22} strokeWidth={1.8} />
                  <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    {user.name?.split(" ")[0] || "Account"}
                  </span>
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="hidden sm:flex"
                  style={{
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 3,
                    padding: "6px 10px",
                    borderRadius: 10,
                    textDecoration: "none",
                    color: "#666",
                    transition: "background 0.15s, color 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#f5f7fa";
                    e.currentTarget.style.color = "#0D6EFD";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "#666";
                  }}
                >
                  <User size={22} strokeWidth={1.8} />
                  <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>Account</span>
                </Link>
              )}

              {/* Cart */}
              <Link
                to="/cart"
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 3,
                  padding: "6px 10px",
                  borderRadius: 10,
                  textDecoration: "none",
                  color: "#666",
                  position: "relative",
                  display: "flex",
                  transition: "background 0.15s, color 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#f5f7fa";
                  e.currentTarget.style.color = "#0D6EFD";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#666";
                }}
              >
                <div style={{ position: "relative" }}>
                  <ShoppingCart size={22} strokeWidth={1.8} />
                  {cartCount > 0 && (
                    <span
                      style={{
                        position: "absolute",
                        top: -8,
                        right: -8,
                        background: "#0D6EFD",
                        color: "#fff",
                        fontSize: 10,
                        fontWeight: 800,
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "2px solid #fff",
                        boxShadow: "0 2px 6px rgba(13,110,253,0.4)",
                      }}
                    >
                      {cartCount > 9 ? "9+" : cartCount}
                    </span>
                  )}
                </div>
                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>Cart</span>
              </Link>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden"
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: "#f5f7fa",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  marginLeft: 4,
                }}
              >
                <Menu size={20} color="#333" />
              </button>
            </div>
          </div>

          {/* ── Desktop nav ── */}
          <nav className="hidden lg:block" style={{ borderTop: "1px solid #f0f0f0", paddingBottom: 0 }}>
            <ul style={{ display: "flex", gap: 4, margin: 0, padding: 0, listStyle: "none" }}>
              {NAV_LINKS.map(({ label, path }) => (
                <li key={label}>
                  <Link
                    to={path}
                    style={{
                      display: "block",
                      padding: "10px 14px",
                      fontSize: 12,
                      fontWeight: 800,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      textDecoration: "none",
                      color: isActive(path) ? "#0D6EFD" : "#555",
                      borderBottom: isActive(path) ? "2px solid #0D6EFD" : "2px solid transparent",
                      transition: "color 0.15s, border-color 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive(path)) {
                        e.currentTarget.style.color = "#0D6EFD";
                        e.currentTarget.style.borderBottomColor = "#0D6EFD";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive(path)) {
                        e.currentTarget.style.color = "#555";
                        e.currentTarget.style.borderBottomColor = "transparent";
                      }
                    }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      {/* ── Mobile drawer ── */}
      {/* Backdrop */}
      <div
        onClick={() => setMobileOpen(false)}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
          zIndex: 200,
          opacity: mobileOpen ? 1 : 0,
          pointerEvents: mobileOpen ? "all" : "none",
          transition: "opacity 0.3s",
        }}
      />
      {/* Drawer */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: 300,
          zIndex: 201,
          background: "#fff",
          boxShadow: "-4px 0 30px rgba(0,0,0,0.12)",
          transform: mobileOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Drawer header */}
        <div
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid #f0f0f0" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ background: "#1a1a1a", padding: 7, borderRadius: 10 }}>
              <ShoppingCart size={18} color="#fff" strokeWidth={2.5} />
            </div>
            <span style={{ fontSize: 16, fontWeight: 900, color: "#1a1a1a", letterSpacing: "-0.02em" }}>E-Commerce</span>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: "#f5f7fa",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <X size={18} color="#555" />
          </button>
        </div>

        {/* Search in drawer */}
        <form onSubmit={handleSearch} style={{ padding: "12px 20px", borderBottom: "1px solid #f5f5f5" }}>
          <div style={{ position: "relative" }}>
            <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#aaa" }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              style={{
                width: "100%",
                padding: "9px 12px 9px 34px",
                background: "#f5f7fa",
                border: "1px solid #eee",
                borderRadius: 8,
                fontSize: 13,
                outline: "none",
              }}
            />
          </div>
        </form>

        {/* Nav links */}
        <nav style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
          {NAV_LINKS.map(({ label, path }) => (
            <Link
              key={label}
              to={path}
              onClick={() => setMobileOpen(false)}
              style={{
                display: "block",
                padding: "13px 24px",
                fontSize: 14,
                fontWeight: 700,
                color: isActive(path) ? "#0D6EFD" : "#333",
                background: isActive(path) ? "#EFF6FF" : "transparent",
                textDecoration: "none",
                borderLeft: isActive(path) ? "3px solid #0D6EFD" : "3px solid transparent",
                transition: "all 0.15s",
              }}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Drawer footer */}
        <div
          style={{
            padding: "16px 20px",
            borderTop: "1px solid #f0f0f0",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          {user ? (
            <button
              onClick={() => {
                logout();
                setMobileOpen(false);
              }}
              style={{
                display: "block",
                background: "#ef4444",
                color: "#fff",
                textAlign: "center",
                padding: "12px",
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
              }}
            >
              Sign Out
            </button>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                style={{
                  display: "block",
                  background: "#0D6EFD",
                  color: "#fff",
                  textAlign: "center",
                  padding: "12px",
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                Sign In
              </Link>

              <Link
                to="/register"
                onClick={() => setMobileOpen(false)}
                style={{
                  display: "block",
                  background: "#f5f7fa",
                  color: "#333",
                  textAlign: "center",
                  padding: "12px",
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 700,
                  textDecoration: "none",
                  border: "1px solid #eee",
                }}
              >
                Create Account
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;

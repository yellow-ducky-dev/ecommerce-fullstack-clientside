import React, { useState } from "react";
import {
  User, Mail, Phone, MapPin, ShoppingBag, Heart,
  Settings, LogOut, ChevronRight, Package, Clock,
  CheckCircle, Truck, Edit2, Camera, Shield, Bell,
  CreditCard, Star,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/* ── helpers ─────────────────────────────────────────────────────────── */
const FALLBACK_AVATAR =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Crect fill='%23e0e7ff' width='120' height='120'/%3E%3Ccircle cx='60' cy='45' r='22' fill='%236366f1'/%3E%3Cellipse cx='60' cy='95' rx='32' ry='20' fill='%236366f1'/%3E%3C/svg%3E";

const STATS = [
  { label: "Orders",    value: "12", icon: ShoppingBag, color: "#2563eb", bg: "#eff6ff" },
  { label: "Wishlist",  value: "5",  icon: Heart,       color: "#ef4444", bg: "#fef2f2" },
  { label: "Reviews",   value: "8",  icon: Star,        color: "#f59e0b", bg: "#fffbeb" },
  { label: "Addresses", value: "2",  icon: MapPin,      color: "#10b981", bg: "#ecfdf5" },
];

const MOCK_ORDERS = [
  { id: "#ORD-4821", date: "Jun 10, 2026", status: "Delivered",  statusColor: "#10b981", statusBg: "#ecfdf5", icon: CheckCircle, items: 3, total: "$129.00" },
  { id: "#ORD-4799", date: "Jun 4, 2026",  status: "Shipped",    statusColor: "#2563eb", statusBg: "#eff6ff", icon: Truck,       items: 1, total: "$49.00"  },
  { id: "#ORD-4761", date: "May 28, 2026", status: "Processing", statusColor: "#f59e0b", statusBg: "#fffbeb", icon: Clock,       items: 2, total: "$87.50"  },
];

const MENU_ITEMS = [
  { label: "My Orders",        icon: Package,    path: "/orders"    },
  { label: "Wishlist",         icon: Heart,      path: "/wishlist"  },
  { label: "Saved Addresses",  icon: MapPin,     path: "/addresses" },
  { label: "Payment Methods",  icon: CreditCard, path: "/payments"  },
  { label: "Notifications",    icon: Bell,       path: "/notifications" },
  { label: "Security",         icon: Shield,     path: "/security"  },
  { label: "Settings",         icon: Settings,   path: "/settings"  },
];

/* ── sub-components ──────────────────────────────────────────────────── */
const SectionTitle = ({ children }) => (
  <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111", marginBottom: 16 }}>{children}</h3>
);

const Card = ({ children, style = {} }) => (
  <div style={{
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 16,
    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
    ...style,
  }}>
    {children}
  </div>
);

/* ── main component ──────────────────────────────────────────────────── */
const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    name:  user?.name  || "John Doe",
    email: user?.email || "john@example.com",
    phone: user?.phone || "+1 (234) 567-890",
    city:  user?.city  || "New York, USA",
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // TODO: call your user update API here
    setSaved(true);
    setEditMode(false);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <main style={{ maxWidth: 1240, margin: "0 auto", padding: "24px 16px", display: "flex", flexDirection: "column", gap: 20 }}>

      {/* ══ PROFILE HERO ══ */}
      <Card>
        {/* Cover gradient */}
        <div style={{
          background: "linear-gradient(135deg, #1a7fff 0%, #0047d4 100%)",
          borderRadius: "16px 16px 0 0",
          height: 120,
          position: "relative",
          overflow: "hidden",
        }}>
          {/* grid watermark */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            backgroundImage: "linear-gradient(rgba(255,255,255,0.07) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.07) 1px,transparent 1px)",
            backgroundSize: "30px 30px",
          }} />
          {/* Edit cover hint */}
          <button style={{
            position: "absolute", top: 12, right: 14,
            background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.3)",
            borderRadius: 8, padding: "6px 12px", color: "#fff", fontSize: 11,
            fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 5,
            backdropFilter: "blur(4px)",
          }}>
            <Camera size={11} /> Edit Cover
          </button>
        </div>

        {/* Avatar + name row */}
        <div style={{ padding: "0 24px 24px", display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 16 }}>
            {/* Avatar */}
            <div style={{ position: "relative", marginTop: -40 }}>
              <div style={{
                width: 88, height: 88, borderRadius: "50%",
                border: "4px solid #fff", overflow: "hidden",
                background: "#e0e7ff", boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
              }}>
                <img
                  src={user?.avatar || FALLBACK_AVATAR}
                  alt="avatar"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_AVATAR; }}
                />
              </div>
              <button style={{
                position: "absolute", bottom: 2, right: 2,
                width: 26, height: 26, borderRadius: "50%",
                background: "#2563eb", border: "2px solid #fff",
                display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
              }}>
                <Camera size={12} color="#fff" />
              </button>
            </div>

            {/* Name & role */}
            <div style={{ paddingBottom: 4 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: "#111", margin: 0, lineHeight: 1.2 }}>
                {form.name}
              </h2>
              <p style={{ fontSize: 12, color: "#888", margin: "3px 0 0" }}>{form.email}</p>
              <span style={{
                display: "inline-block", marginTop: 6,
                background: "#eff6ff", color: "#2563eb",
                fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 99,
                letterSpacing: "0.06em",
              }}>
                PREMIUM MEMBER
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 8, paddingBottom: 4 }}>
            <button
              onClick={() => setEditMode(p => !p)}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "9px 18px", borderRadius: 10, border: "1px solid #e5e7eb",
                background: editMode ? "#eff6ff" : "#fff", color: editMode ? "#2563eb" : "#555",
                fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.15s",
              }}>
              <Edit2 size={14} /> {editMode ? "Cancel" : "Edit Profile"}
            </button>
            <button
              onClick={handleLogout}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "9px 18px", borderRadius: 10, border: "none",
                background: "#fef2f2", color: "#ef4444",
                fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "background 0.15s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "#fee2e2"}
              onMouseLeave={e => e.currentTarget.style.background = "#fef2f2"}>
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        </div>
      </Card>

      {/* ══ STATS ROW ══ */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 16 }}>
        {STATS.map((s, i) => {
          const Icon = s.icon;
          return (
            <Card key={i} style={{ padding: "20px 16px", display: "flex", alignItems: "center", gap: 14,
              cursor: "pointer", transition: "box-shadow 0.2s, transform 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.08)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.05)"; e.currentTarget.style.transform = "none"; }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: s.bg,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon size={20} color={s.color} />
              </div>
              <div>
                <p style={{ fontSize: 22, fontWeight: 800, color: "#111", margin: 0, lineHeight: 1 }}>{s.value}</p>
                <p style={{ fontSize: 12, color: "#888", margin: "3px 0 0" }}>{s.label}</p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* ══ MAIN CONTENT: two-column ══ */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20, alignItems: "start" }}>

        {/* LEFT — Personal info + Quick menu */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Personal info card */}
          <Card style={{ padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <SectionTitle>Personal Information</SectionTitle>
              {saved && (
                <span style={{ fontSize: 11, fontWeight: 700, color: "#10b981", background: "#ecfdf5",
                  padding: "4px 10px", borderRadius: 99 }}>
                  ✓ Saved
                </span>
              )}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { label: "Full Name",    icon: User,  key: "name",  type: "text",  placeholder: "Your name"  },
                { label: "Email",        icon: Mail,  key: "email", type: "email", placeholder: "Your email" },
                { label: "Phone",        icon: Phone, key: "phone", type: "tel",   placeholder: "Your phone" },
                { label: "City / Region",icon: MapPin,key: "city",  type: "text",  placeholder: "Your city"  },
              ].map(({ label, icon: Icon, key, type, placeholder }) => (
                <div key={key}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "#888", letterSpacing: "0.06em",
                    textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                    {label}
                  </label>
                  {editMode ? (
                    <div style={{ position: "relative" }}>
                      <Icon size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#aaa" }} />
                      <input
                        type={type}
                        value={form[key]}
                        onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                        placeholder={placeholder}
                        style={{
                          width: "100%", padding: "10px 12px 10px 34px",
                          border: "1.5px solid #e5e7eb", borderRadius: 10, fontSize: 13,
                          color: "#333", outline: "none", boxSizing: "border-box",
                          transition: "border-color 0.15s",
                        }}
                        onFocus={e => e.target.style.borderColor = "#2563eb"}
                        onBlur={e => e.target.style.borderColor = "#e5e7eb"}
                      />
                    </div>
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", gap: 10,
                      padding: "10px 12px", background: "#f9fafb", borderRadius: 10 }}>
                      <Icon size={14} color="#aaa" />
                      <span style={{ fontSize: 13, color: "#333", fontWeight: 500 }}>{form[key]}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {editMode && (
              <button
                onClick={handleSave}
                style={{
                  marginTop: 20, width: "100%", background: "#2563eb", color: "#fff",
                  fontWeight: 700, fontSize: 13, padding: "12px", borderRadius: 10,
                  border: "none", cursor: "pointer", transition: "background 0.15s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "#1d4ed8"}
                onMouseLeave={e => e.currentTarget.style.background = "#2563eb"}>
                Save Changes
              </button>
            )}
          </Card>

          {/* Quick menu card */}
          <Card style={{ overflow: "hidden" }}>
            <div style={{ padding: "20px 20px 8px" }}>
              <SectionTitle>Quick Menu</SectionTitle>
            </div>
            {MENU_ITEMS.map(({ label, icon: Icon, path }, i) => (
              <Link key={i} to={path}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "13px 20px", textDecoration: "none",
                  borderTop: i === 0 ? "none" : "1px solid #f5f5f5",
                  transition: "background 0.15s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "#f9fafb"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 9, background: "#f3f4f6",
                    display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon size={16} color="#555" />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#333" }}>{label}</span>
                </div>
                <ChevronRight size={15} color="#ccc" />
              </Link>
            ))}
          </Card>
        </div>

        {/* RIGHT — Recent orders + newsletter */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Recent orders */}
          <Card style={{ overflow: "hidden" }}>
            <div style={{ padding: "20px 20px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <SectionTitle>Recent Orders</SectionTitle>
              <Link to="/orders" style={{ fontSize: 12, fontWeight: 600, color: "#2563eb",
                textDecoration: "none", display: "flex", alignItems: "center", gap: 3 }}>
                View all <ChevronRight size={13} />
              </Link>
            </div>

            <div style={{ padding: "0 0 8px" }}>
              {MOCK_ORDERS.map((order, i) => {
                const Icon = order.icon;
                return (
                  <div key={i}
                    style={{
                      display: "flex", alignItems: "center", gap: 14,
                      padding: "14px 20px",
                      borderTop: i === 0 ? "none" : "1px solid #f5f5f5",
                      cursor: "pointer", transition: "background 0.15s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "#f9fafb"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    {/* Status icon */}
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: order.statusBg,
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Icon size={18} color={order.statusColor} />
                    </div>
                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "#111" }}>{order.id}</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "#111", flexShrink: 0 }}>{order.total}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 4 }}>
                        <span style={{ fontSize: 11, color: "#aaa" }}>{order.date} · {order.items} item{order.items > 1 ? "s" : ""}</span>
                        <span style={{
                          fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99,
                          color: order.statusColor, background: order.statusBg,
                        }}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Empty state — shown if no orders */}
            {MOCK_ORDERS.length === 0 && (
              <div style={{ padding: "48px 24px", textAlign: "center" }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#f3f4f6",
                  display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                  <Package size={24} color="#9ca3af" />
                </div>
                <p style={{ fontSize: 14, fontWeight: 600, color: "#555" }}>No orders yet</p>
                <p style={{ fontSize: 12, color: "#aaa", marginTop: 4 }}>Your orders will appear here</p>
                <Link to="/products" style={{
                  display: "inline-block", marginTop: 16, background: "#2563eb", color: "#fff",
                  fontSize: 12, fontWeight: 700, padding: "9px 20px", borderRadius: 8, textDecoration: "none",
                }}>
                  Start Shopping
                </Link>
              </div>
            )}
          </Card>

          {/* Newsletter promo — mirrors Home.jsx newsletter section style */}
          <section style={{
            background: "linear-gradient(135deg, #f8faff 0%, #eef2ff 100%)",
            border: "1px solid #e0e7ff", borderRadius: 16, padding: "32px 24px", textAlign: "center",
          }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111", marginBottom: 6 }}>
              Subscribe to our newsletter
            </h3>
            <p style={{ color: "#888", fontSize: 12, maxWidth: 300, margin: "0 auto 20px" }}>
              Get daily deals and exclusive offers delivered to your inbox
            </p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
              <div style={{ flex: 1, minWidth: 180, position: "relative" }}>
                <Mail size={13} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "#aaa", pointerEvents: "none" }} />
                <input type="email" placeholder="Email address"
                  style={{ width: "100%", padding: "10px 12px 10px 30px", border: "1px solid #ddd",
                    borderRadius: 10, fontSize: 12, outline: "none", background: "#fff", boxSizing: "border-box" }}
                />
              </div>
              <button style={{
                background: "#2563eb", color: "#fff", fontWeight: 700, fontSize: 12,
                padding: "10px 22px", borderRadius: 10, border: "none", cursor: "pointer",
                whiteSpace: "nowrap", transition: "background 0.15s",
              }}
                onMouseEnter={e => e.currentTarget.style.background = "#1d4ed8"}
                onMouseLeave={e => e.currentTarget.style.background = "#2563eb"}>
                Subscribe
              </button>
            </div>
          </section>

        </div>
      </div>
    </main>
  );
};

export default Profile;
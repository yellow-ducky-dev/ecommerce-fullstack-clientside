import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Package,
  Users,
  ShoppingBag,
  TrendingUp,
  ChevronRight,
  Search,
  Trash2,
  Edit3,
  Check,
  X,
  Clock,
  Truck,
  RefreshCw,
  Eye,
  AlertTriangle,
  DollarSign,
  BarChart2,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCurrency } from "../context/CurrencyContext";
import { adminService, productService } from "../api/services";
import { showToast } from "../helper/toast";

/* ── Fallback ───────────────────────────────────────────────── */
const FALLBACK =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23f3f4f6' width='200' height='200'/%3E%3C/svg%3E";
const onImgError = (e) => {
  e.target.onerror = null;
  e.target.src = FALLBACK;
};

/* ── Status config ──────────────────────────────────────────── */
const STATUS = {
  pending: { label: "Pending", color: "#f97316", bg: "#fff7ed", border: "#fed7aa", Icon: Clock },
  processing: { label: "Processing", color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe", Icon: RefreshCw },
  shipped: { label: "Shipped", color: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe", Icon: Truck },
  delivered: { label: "Delivered", color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0", Icon: Check },
  cancelled: { label: "Cancelled", color: "#ef4444", bg: "#fef2f2", border: "#fecaca", Icon: X },
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS[status] || STATUS.pending;
  const { Icon } = cfg;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        fontSize: 11,
        fontWeight: 700,
        color: cfg.color,
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        padding: "3px 10px",
        borderRadius: 99,
      }}
    >
      <Icon size={11} /> {cfg.label}
    </span>
  );
};

/* ── Stat card ──────────────────────────────────────────────── */
const StatCard = ({ icon: Icon, label, value, sub, color = "#2563eb", bg = "#eff6ff" }) => (
  <div
    style={{
      background: "#fff",
      border: "1px solid #e5e7eb",
      borderRadius: 16,
      padding: "20px 24px",
      boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      display: "flex",
      alignItems: "center",
      gap: 16,
    }}
  >
    <div
      style={{
        width: 52,
        height: 52,
        background: bg,
        borderRadius: 14,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <Icon size={24} color={color} />
    </div>
    <div>
      <p style={{ fontSize: 28, fontWeight: 900, color: "#111", lineHeight: 1 , overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 180 }}>{value}</p>
      <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 4, fontWeight: 600 }}>{label}</p>
      {sub && <p style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>{sub}</p>}
    </div>
  </div>
);

/* ── Skeleton ───────────────────────────────────────────────── */
const SkeletonRow = () => (
  <tr style={{ animation: "pulse 1.5s ease-in-out infinite" }}>
    {[...Array(5)].map((_, i) => (
      <td key={i} style={{ padding: "14px 16px" }}>
        <div style={{ height: 12, background: "#f3f4f6", borderRadius: 4, width: i === 0 ? "60%" : "80%" }} />
      </td>
    ))}
  </tr>
);


/* ── Main Admin Panel ───────────────────────────────────────── */
const AdminPanel = () => {
  const navigate = useNavigate();
  const { user, authLoaded } = useAuth();
  const { convert, symbol } = useCurrency();

  const [tab, setTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  /* ── Guard ── */
  useEffect(() => {
    if (!authLoaded) return;
    if (!user || !user.isAdmin) navigate("/");
  }, [user, authLoaded]);

  /* ── Fetch ── */
  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [ordRes, prodRes, userRes] = await Promise.all([
        adminService.getAllOrders(),
        productService.getProducts({ limit: 100 }),
        adminService.getAllUsers(),
      ]);
      setOrders(ordRes.data || []);
      setProducts(prodRes.data?.products || []);
      setUsers(userRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?.isAdmin) fetchAll();
  }, [user]);

  /* ── Actions ── */
  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await adminService.updateStatus(orderId, newStatus);
      setOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o)));
    } catch (err) {
      showToast.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await adminService.deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
      setConfirmDelete(null);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete user");
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await productService.deleteProduct(productId);
      setProducts((prev) => prev.filter((p) => p._id !== productId));
      setConfirmDelete(null);
    } catch (err) {
      showToast.error("Failed to delete product");
    }
  };

  /* ── Computed stats ── */
  const revenue = orders.reduce((s, o) => s + (o.totalPrice || 0), 0);
  const delivered = orders.filter((o) => o.status === "delivered").length;
  const pending = orders.filter((o) => (o.status || "pending") === "pending").length;

  /* ── Filtered lists ── */
  const filteredOrders = orders.filter((o) => {
    const matchSearch =
      !search ||
      o._id.toLowerCase().includes(search.toLowerCase()) ||
      o.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      o.user?.email?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || (o.status || "pending") === statusFilter;
    return matchSearch && matchStatus;
  });

  const filteredProducts = products.filter(
    (p) => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.category?.toLowerCase().includes(search.toLowerCase()),
  );

  const filteredUsers = users.filter(
    (u) => !search || u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()),
  );

  const TABS = [
    { id: "orders", label: "Orders", Icon: Package, count: orders.length },
    { id: "products", label: "Products", Icon: ShoppingBag, count: products.length },
    { id: "users", label: "Users", Icon: Users, count: users.length },
  ];

  const thStyle = {
    padding: "10px 16px",
    fontSize: 11,
    fontWeight: 700,
    color: "#9ca3af",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    textAlign: "left",
    background: "#f9fafb",
    borderBottom: "1px solid #f0f0f0",
    whiteSpace: "nowrap",
  };
  const tdStyle = {
    padding: "14px 16px",
    fontSize: 13,
    color: "#374151",
    borderBottom: "1px solid #f9fafb",
    verticalAlign: "middle",
  };

  if (!authLoaded || !user?.isAdmin) return null;

  return (
    <>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}`}</style>

      <main style={{ maxWidth: 1240, margin: "0 auto", padding: "24px 16px", display: "flex", flexDirection: "column", gap: 20 }}>
        {/* Breadcrumb */}
        <nav style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#9ca3af" }}>
          <Link
            to="/"
            style={{ color: "#9ca3af", textDecoration: "none" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#2563eb")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#9ca3af")}
          >
            Home
          </Link>
          <ChevronRight size={12} />
          <span style={{ color: "#374151", fontWeight: 500 }}>Admin Panel</span>
        </nav>

        {/* Hero */}
        <div
          style={{
            background: "linear-gradient(135deg, #1f2937 0%, #111827 100%)",
            borderRadius: 16,
            padding: "24px 28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
            boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
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
                "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
          <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 48,
                height: 48,
                background: "rgba(37,99,235,0.2)",
                borderRadius: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid rgba(37,99,235,0.4)",
              }}
            >
              <ShieldCheck size={24} color="#60a5fa" />
            </div>
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 900, color: "#fff", margin: 0 }}>Admin Panel</h1>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>Welcome back, {user?.name}</p>
            </div>
          </div>
          <div style={{ position: "relative", display: "flex", gap: 20, flexWrap: "wrap" }}>
            {[
              { label: "Revenue", value: `${symbol}${convert(revenue)}` },
              { label: "Orders", value: orders.length },
              { label: "Delivered", value: delivered },
              { label: "Pending", value: pending },
            ].map((s) => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <p style={{ fontSize: 20, fontWeight: 900, color: "#fff", lineHeight: 1 }}>{s.value}</p>
                <p
                  style={{
                    fontSize: 10,
                    color: "rgba(255,255,255,0.4)",
                    marginTop: 3,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Stat cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
          <StatCard icon={DollarSign} label="Total Revenue" value={`${symbol}${convert(revenue)}`} color="#16a34a" bg="#f0fdf4" />
          <StatCard icon={Package} label="Total Orders" value={orders.length} color="#2563eb" bg="#eff6ff" />
          <StatCard icon={ShoppingBag} label="Products" value={products.length} color="#7c3aed" bg="#f5f3ff" />
          <StatCard icon={Users} label="Customers" value={users.filter((u) => !u.isAdmin).length} color="#f97316" bg="#fff7ed" />
        </div>

        {/* Main panel */}
        <div
          style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
        >
          {/* Toolbar */}
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #f0f0f0", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            {/* Tabs */}
            <div style={{ display: "flex", background: "#f3f4f6", borderRadius: 10, padding: 3 }}>
              {TABS.map(({ id, label, Icon, count }) => (
                <button
                  key={id}
                  onClick={() => {
                    setTab(id);
                    setSearch("");
                    setStatusFilter("all");
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "7px 14px",
                    borderRadius: 8,
                    border: "none",
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: 700,
                    background: tab === id ? "#fff" : "transparent",
                    color: tab === id ? "#2563eb" : "#9ca3af",
                    boxShadow: tab === id ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
                    transition: "all 0.15s",
                  }}
                >
                  <Icon size={14} /> {label}
                  <span
                    style={{
                      background: tab === id ? "#eff6ff" : "#e5e7eb",
                      color: tab === id ? "#2563eb" : "#9ca3af",
                      fontSize: 10,
                      fontWeight: 800,
                      padding: "1px 6px",
                      borderRadius: 99,
                    }}
                  >
                    {count}
                  </span>
                </button>
              ))}
            </div>

            {/* Search */}
            <div style={{ position: "relative", flex: 1, minWidth: 200, maxWidth: 360 }}>
              <Search
                size={14}
                style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#aaa", pointerEvents: "none" }}
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={`Search ${tab}…`}
                style={{
                  width: "100%",
                  padding: "8px 12px 8px 34px",
                  border: "1px solid #e5e7eb",
                  borderRadius: 9,
                  fontSize: 13,
                  outline: "none",
                  color: "#333",
                  boxSizing: "border-box",
                  transition: "border-color 0.15s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#2563eb")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
              />
            </div>

            {/* Status filter for orders */}
            {tab === "orders" && (
              <div style={{ position: "relative" }}>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{
                    padding: "8px 32px 8px 12px",
                    border: "1px solid #e5e7eb",
                    borderRadius: 9,
                    fontSize: 12,
                    fontWeight: 600,
                    background: "#fff",
                    outline: "none",
                    color: "#555",
                    cursor: "pointer",
                    appearance: "none",
                  }}
                >
                  <option value="all">All Status</option>
                  {Object.keys(STATUS).map((s) => (
                    <option key={s} value={s}>
                      {STATUS[s].label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={13}
                  style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: "#aaa", pointerEvents: "none" }}
                />
              </div>
            )}

            <button
              onClick={fetchAll}
              style={{
                marginLeft: "auto",
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 14px",
                borderRadius: 9,
                border: "1px solid #e5e7eb",
                background: "#fff",
                fontSize: 12,
                fontWeight: 600,
                color: "#555",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#2563eb";
                e.currentTarget.style.color = "#2563eb";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#e5e7eb";
                e.currentTarget.style.color = "#555";
              }}
            >
              <RefreshCw size={13} /> Refresh
            </button>
            <Link
              to="/admin/product/new"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 14px",
                borderRadius: 9,
                border: "none",
                background: "#2563eb",
                color: "#fff",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                textDecoration: "none",
              }}
            >
              + Add Product
            </Link>
          </div>

          {/* ── ORDERS TABLE ── */}
          {tab === "orders" && (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
                <thead>
                  <tr>
                    {["Order ID", "Customer", "Date", "Total", "Status", "Actions"].map((h) => (
                      <th key={h} style={thStyle}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    [...Array(6)].map((_, i) => <SkeletonRow key={i} />)
                  ) : filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ padding: "48px 24px", textAlign: "center", color: "#9ca3af", fontSize: 13 }}>
                        No orders found
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr
                        key={order._id}
                        style={{ transition: "background 0.15s" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#f9fafb")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        <td style={tdStyle}>
                          <span style={{ fontFamily: "monospace", fontWeight: 700, color: "#111" }}>#{order._id.slice(-8).toUpperCase()}</span>
                        </td>
                        <td style={tdStyle}>
                          <p style={{ fontWeight: 600, color: "#111", marginBottom: 2 }}>{order.user?.name || "Unknown"}</p>
                          <p style={{ fontSize: 11, color: "#9ca3af" }}>{order.user?.email}</p>
                        </td>
                        <td style={tdStyle}>
                          <p style={{ color: "#555" }}>
                            {new Date(order.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                          <p style={{ fontSize: 11, color: "#9ca3af" }}>
                            {order.orderItems?.length} item{order.orderItems?.length !== 1 ? "s" : ""}
                          </p>
                        </td>
                        <td style={tdStyle}>
                          <span style={{ fontWeight: 700, color: "#111" }}>
                            {symbol}
                            {convert(order.totalPrice)}
                          </span>
                        </td>
                        <td style={tdStyle}>
                          <StatusBadge status={order.status || "pending"} />
                        </td>
                        <td style={tdStyle}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            {/* Status change dropdown */}
                            <div style={{ position: "relative" }}>
                              <select
                                disabled={updatingId === order._id}
                                value={order.status || "pending"}
                                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                style={{
                                  padding: "5px 24px 5px 8px",
                                  border: "1px solid #e5e7eb",
                                  borderRadius: 7,
                                  fontSize: 11,
                                  fontWeight: 700,
                                  background: "#fff",
                                  outline: "none",
                                  cursor: "pointer",
                                  color: "#555",
                                  appearance: "none",
                                  opacity: updatingId === order._id ? 0.5 : 1,
                                }}
                              >
                                {Object.keys(STATUS).map((s) => (
                                  <option key={s} value={s}>
                                    {STATUS[s].label}
                                  </option>
                                ))}
                              </select>
                              <ChevronDown
                                size={11}
                                style={{
                                  position: "absolute",
                                  right: 6,
                                  top: "50%",
                                  transform: "translateY(-50%)",
                                  color: "#aaa",
                                  pointerEvents: "none",
                                }}
                              />
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* ── PRODUCTS TABLE ── */}
          {tab === "products" && (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
                <thead>
                  <tr>
                    {["Product", "Category", "Price", "Stock", "Rating", "Actions"].map((h) => (
                      <th key={h} style={thStyle}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    [...Array(6)].map((_, i) => <SkeletonRow key={i} />)
                  ) : filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ padding: "48px 24px", textAlign: "center", color: "#9ca3af", fontSize: 13 }}>
                        No products found
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((product) => (
                      <tr
                        key={product._id}
                        style={{ transition: "background 0.15s" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#f9fafb")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        <td style={tdStyle}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div
                              style={{
                                width: 44,
                                height: 44,
                                background: "#f9fafb",
                                borderRadius: 8,
                                border: "1px solid #f0f0f0",
                                overflow: "hidden",
                                flexShrink: 0,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <img
                                src={product.image}
                                alt={product.name}
                                onError={onImgError}
                                style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", padding: 4 }}
                              />
                            </div>
                            <div style={{ minWidth: 0 }}>
                              <p
                                style={{
                                  fontSize: 13,
                                  fontWeight: 600,
                                  color: "#111",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                  maxWidth: 200,
                                }}
                              >
                                {product.name}
                              </p>
                              <p style={{ fontSize: 11, color: "#9ca3af" }}>{product.brand}</p>
                            </div>
                          </div>
                        </td>
                        <td style={tdStyle}>
                          <span
                            style={{ fontSize: 11, fontWeight: 700, color: "#2563eb", background: "#eff6ff", padding: "2px 8px", borderRadius: 99 }}
                          >
                            {product.category}
                          </span>
                        </td>
                        <td style={tdStyle}>
                          <p style={{ fontWeight: 700, color: "#111" }}>
                            {symbol}
                            {convert(product.price)}
                          </p>
                          {product.originalPrice && (
                            <p style={{ fontSize: 11, color: "#aaa", textDecoration: "line-through" }}>
                              {symbol}
                              {convert(product.originalPrice)}
                            </p>
                          )}
                        </td>
                        <td style={tdStyle}>
                          <span style={{ fontWeight: 700, color: product.stock === 0 ? "#ef4444" : product.stock < 10 ? "#f97316" : "#16a34a" }}>
                            {product.stock === 0 ? "Out of stock" : `${product.stock} units`}
                          </span>
                        </td>
                        <td style={tdStyle}>
                          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                            <span style={{ color: "#facc15", fontSize: 13 }}>★</span>
                            <span style={{ fontWeight: 600 }}>{product.rating?.toFixed(1)}</span>
                            <span style={{ fontSize: 11, color: "#9ca3af" }}>({product.numReviews})</span>
                          </div>
                        </td>
                        <td style={tdStyle}>
                          <div style={{ display: "flex", gap: 6 }}>
                            <Link
                              to={`/product/${product._id}`}
                              style={{
                                width: 30,
                                height: 30,
                                borderRadius: 7,
                                border: "1px solid #e5e7eb",
                                background: "#fff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                transition: "all 0.15s",
                                textDecoration: "none",
                                color: "#9ca3af",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = "#2563eb";
                                e.currentTarget.style.color = "#2563eb";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = "#e5e7eb";
                                e.currentTarget.style.color = "#9ca3af";
                              }}
                            >
                              <Eye size={13} />
                            </Link>
                            <button
                              onClick={() => setConfirmDelete({ type: "product", id: product._id, name: product.name })}
                              style={{
                                width: 30,
                                height: 30,
                                borderRadius: 7,
                                border: "1px solid #e5e7eb",
                                background: "#fff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                transition: "all 0.15s",
                                color: "#9ca3af",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = "#ef4444";
                                e.currentTarget.style.color = "#ef4444";
                                e.currentTarget.style.background = "#fef2f2";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = "#e5e7eb";
                                e.currentTarget.style.color = "#9ca3af";
                                e.currentTarget.style.background = "#fff";
                              }}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* ── USERS TABLE ── */}
          {tab === "users" && (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
                <thead>
                  <tr>
                    {["User", "Role", "Joined", "Location", "Actions"].map((h) => (
                      <th key={h} style={thStyle}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    [...Array(6)].map((_, i) => <SkeletonRow key={i} />)
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ padding: "48px 24px", textAlign: "center", color: "#9ca3af", fontSize: 13 }}>
                        No users found
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => (
                      <tr
                        key={u._id}
                        style={{ transition: "background 0.15s" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#f9fafb")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        <td style={tdStyle}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div
                              style={{
                                width: 36,
                                height: 36,
                                borderRadius: "50%",
                                background: "#eff6ff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                                fontWeight: 800,
                                fontSize: 14,
                                color: "#2563eb",
                              }}
                            >
                              {u.name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p style={{ fontWeight: 600, color: "#111" }}>{u.name}</p>
                              <p style={{ fontSize: 11, color: "#9ca3af" }}>{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td style={tdStyle}>
                          <span
                            style={{
                              fontSize: 11,
                              fontWeight: 700,
                              color: u.isAdmin ? "#7c3aed" : "#16a34a",
                              background: u.isAdmin ? "#f5f3ff" : "#f0fdf4",
                              border: `1px solid ${u.isAdmin ? "#ddd6fe" : "#bbf7d0"}`,
                              padding: "2px 8px",
                              borderRadius: 99,
                            }}
                          >
                            {u.isAdmin ? "Admin" : "Customer"}
                          </span>
                        </td>
                        <td style={tdStyle}>
                          {new Date(u.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </td>
                        <td style={tdStyle}>
                          <span style={{ color: "#555" }}>{u.city || "—"}</span>
                        </td>
                        <td style={tdStyle}>
                          {!u.isAdmin && (
                            <button
                              onClick={() => setConfirmDelete({ type: "user", id: u._id, name: u.name })}
                              style={{
                                width: 30,
                                height: 30,
                                borderRadius: 7,
                                border: "1px solid #e5e7eb",
                                background: "#fff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                transition: "all 0.15s",
                                color: "#9ca3af",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = "#ef4444";
                                e.currentTarget.style.color = "#ef4444";
                                e.currentTarget.style.background = "#fef2f2";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = "#e5e7eb";
                                e.currentTarget.style.color = "#9ca3af";
                                e.currentTarget.style.background = "#fff";
                              }}
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* ── Confirm delete modal ── */}
      {confirmDelete && (
        <>
          <div
            onClick={() => setConfirmDelete(null)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 200, backdropFilter: "blur(2px)" }}
          />
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 201,
              background: "#fff",
              borderRadius: 16,
              padding: 28,
              maxWidth: 400,
              width: "90%",
              boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                background: "#fef2f2",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <AlertTriangle size={24} color="#ef4444" />
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111", textAlign: "center", marginBottom: 8 }}>Confirm Delete</h3>
            <p style={{ fontSize: 13, color: "#555", textAlign: "center", marginBottom: 24, lineHeight: 1.6 }}>
              Are you sure you want to delete <strong>{confirmDelete.name}</strong>? This action cannot be undone.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setConfirmDelete(null)}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: 10,
                  border: "1px solid #e5e7eb",
                  background: "#fff",
                  color: "#555",
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#f9fafb")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
              >
                Cancel
              </button>
              <button
                onClick={() => (confirmDelete.type === "user" ? handleDeleteUser(confirmDelete.id) : handleDeleteProduct(confirmDelete.id))}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: 10,
                  border: "none",
                  background: "#ef4444",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: "pointer",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#dc2626")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#ef4444")}
              >
                Delete
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default AdminPanel;

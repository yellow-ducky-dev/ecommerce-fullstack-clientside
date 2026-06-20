import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package, ChevronRight, ShoppingBag, Truck,
  Check, Clock, X, MapPin, CreditCard, RefreshCw,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { showToast } from '../helper/toast';
import OptimizedImage from '../components/OptimizedImage';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const STATUS_CONFIG = {
  pending:    { label: 'Pending',    color: '#f97316', bg: '#fff7ed', border: '#fed7aa', icon: Clock },
  processing: { label: 'Processing', color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe', icon: RefreshCw },
  shipped:    { label: 'Shipped',    color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe', icon: Truck },
  delivered:  { label: 'Delivered',  color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', icon: Check },
  cancelled:  { label: 'Cancelled',  color: '#ef4444', bg: '#fef2f2', border: '#fecaca', icon: X },
};

/* ── Memoized Status Badge ── */
const StatusBadge = React.memo(({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const Icon = cfg.icon;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11,
      fontWeight: 700, color: cfg.color, background: cfg.bg,
      border: `1px solid ${cfg.border}`, padding: '3px 10px', borderRadius: 99 }}>
      <Icon size={11} /> {cfg.label}
    </span>
  );
});

/* ── Memoized Skeleton ── */
const SkeletonOrder = React.memo(() => (
  <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16,
    padding: 20, animation: 'pulse 1.5s ease-in-out infinite' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
      <div style={{ height: 14, width: 140, background: '#f3f4f6', borderRadius: 6 }} />
      <div style={{ height: 22, width: 80, background: '#f3f4f6', borderRadius: 99 }} />
    </div>
    <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
      {[...Array(3)].map((_, i) => (
        <div key={i} style={{ width: 52, height: 52, background: '#f3f4f6', borderRadius: 8 }} />
      ))}
    </div>
    <div style={{ height: 10, width: '40%', background: '#f3f4f6', borderRadius: 4 }} />
  </div>
));

const Orders = () => {
  const { user } = useAuth();
  const { convert, symbol } = useCurrency();
  const [orders, setOrders]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [expanded, setExpanded]     = useState(null);
  const [filter, setFilter]         = useState('all');

  useEffect(() => {
    if (!user?.token) return;
    (async () => {
      try {
        const res = await fetch(`${API}/api/orders/mine`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setOrders(data);
      } catch (err) {
        setError(err.message || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  const filtered = filter === 'all' ? orders : orders.filter(o => (o.status || 'pending') === filter);

  const FILTERS = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'];

  /* ── Not logged in ── */
  if (!user) return (
    <main style={{ minHeight: 'calc(100vh - 160px)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: '40px 16px' }}>
      <div style={{ maxWidth: 400, width: '100%', background: '#fff', border: '1px solid #e5e7eb',
        borderRadius: 16, padding: 40, textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <div style={{ width: 64, height: 64, background: '#f3f4f6', borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <ShoppingBag size={28} color="#9ca3af" />
        </div>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111', marginBottom: 8 }}>Sign in to view orders</h2>
        <p style={{ fontSize: 13, color: '#9ca3af', marginBottom: 24 }}>You need to be logged in to see your order history.</p>
        <Link to="/login" style={{ background: '#2563eb', color: '#fff', fontWeight: 700,
          fontSize: 13, padding: '11px 24px', borderRadius: 10, textDecoration: 'none' }}>
          Sign In
        </Link>
      </div>
    </main>
  );

  return (
    <>
      <style>{`
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
        .bc-link:hover { color: #2563eb !important; }
        .btn-primary:hover { background: #1d4ed8 !important; }
        .order-card { transition: box-shadow 0.2s, border-color 0.2s; }
        .order-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.08) !important; border-color: #bfdbfe !important; }
        .btn-cancel:hover { background: #dc2626 !important; }
        .btn-details:hover { background: #f9fafb !important; }
      `}</style>

      <main style={{ maxWidth: 1240, margin: '0 auto', padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Breadcrumb */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#9ca3af', flexWrap: 'wrap' }}>
          <Link to="/" className="bc-link" style={{ color: '#9ca3af', textDecoration: 'none', transition: 'color 0.15s' }}>Home</Link>
          <ChevronRight size={12} />
          <span style={{ color: '#374151', fontWeight: 500 }}>My Orders</span>
        </nav>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: '#111', margin: 0 }}>My Orders</h1>
            {!loading && (
              <p style={{ fontSize: 12, color: '#aaa', marginTop: 4 }}>
                {orders.length} {orders.length === 1 ? 'order' : 'orders'} total
              </p>
            )}
          </div>
          <Link to="/products"
            className="btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#2563eb',
              color: '#fff', fontWeight: 600, fontSize: 13, padding: '9px 18px',
              borderRadius: 10, textDecoration: 'none', transition: 'background 0.15s' }}>
            <ShoppingBag size={14} /> Continue Shopping
          </Link>
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding: '6px 14px', borderRadius: 99, fontSize: 12, fontWeight: 700,
                cursor: 'pointer', border: '1px solid', textTransform: 'capitalize',
                transition: 'all 0.15s',
                borderColor: filter === f ? '#2563eb' : '#e5e7eb',
                background: filter === f ? '#2563eb' : '#fff',
                color: filter === f ? '#fff' : '#555' }}>
              {f === 'all' ? `All (${orders.length})` : f}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626',
            fontSize: 13, borderRadius: 12, padding: '12px 16px', fontWeight: 600 }}>
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[...Array(3)].map((_, i) => <SkeletonOrder key={i} />)}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && filtered.length === 0 && (
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16,
            padding: '64px 24px', textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ width: 64, height: 64, background: '#f3f4f6', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Package size={28} color="#9ca3af" />
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#374151', marginBottom: 8 }}>
              {filter === 'all' ? 'No orders yet' : `No ${filter} orders`}
            </h3>
            <p style={{ color: '#9ca3af', fontSize: 13, marginBottom: 20 }}>
              {filter === 'all' ? 'Your order history will appear here.' : `You have no ${filter} orders.`}
            </p>
            <Link to="/products"
              className="btn-primary"
              style={{ background: '#2563eb', color: '#fff', fontWeight: 600, fontSize: 13,
                padding: '10px 24px', borderRadius: 8, textDecoration: 'none', transition: 'background 0.15s' }}>
              Start Shopping
            </Link>
          </div>
        )}

        {/* Orders list */}
        {!loading && !error && filtered.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.map(order => {
              const isOpen = expanded === order._id;
              const status = order.status || 'pending';
              const date   = new Date(order.createdAt).toLocaleDateString('en-US', {
                year: 'numeric', month: 'short', day: 'numeric'
              });

              return (
                <div key={order._id}
                  className="order-card"
                  style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16,
                    overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>

                  {/* Order header */}
                  <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
                    borderBottom: isOpen ? '1px solid #f0f0f0' : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                      <div>
                        <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af',
                          textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>
                          Order ID
                        </p>
                        <p style={{ fontSize: 13, fontWeight: 700, color: '#111', fontFamily: 'monospace' }}>
                          #{order._id.slice(-8).toUpperCase()}
                        </p>
                      </div>
                      <div style={{ width: 1, height: 32, background: '#f0f0f0' }} />
                      <div>
                        <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af',
                          textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>
                          Date
                        </p>
                        <p style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>{date}</p>
                      </div>
                      <div style={{ width: 1, height: 32, background: '#f0f0f0' }} />
                      <div>
                        <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af',
                          textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>
                          Total
                        </p>
                        <p style={{ fontSize: 13, fontWeight: 800, color: '#111' }}>
                          {symbol}{convert(order.totalPrice)}
                        </p>
                      </div>
                      <div style={{ width: 1, height: 32, background: '#f0f0f0' }} />
                      <div>
                        <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af',
                          textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>
                          Payment
                        </p>
                        <p style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>
                          {order.paymentMethod}
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>

                      <StatusBadge status={status} />

                      {status === "pending" && (
                        <button
                          className="btn-cancel"
                          onClick={async () => {
                            if (!window.confirm("Cancel this order?")) return;
                            try {
                              const res = await fetch(`${API}/api/orders/${order._id}/cancel`, {
                                method: "PUT",
                                headers: { Authorization: `Bearer ${user.token}` },
                              });
                              const data = await res.json();
                              if (!res.ok) throw new Error(data.message);

                              setOrders(prev => prev.map(o => o._id === order._id ? { ...o, status: "cancelled" } : o));
                            } catch (err) {
                              showToast.error(err.message);
                            }
                          }}
                          style={{ background: "#ef4444", color: "#fff", border: "none", borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "background 0.15s" }}
                        >
                          Cancel
                        </button>
                      )}

                      <button
                        className="btn-details"
                        onClick={() => setExpanded(isOpen ? null : order._id)}
                        style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px', borderRadius: 8, border: '1px solid #e5e7eb', background: '#fff', fontSize: 12, fontWeight: 600, color: '#555', cursor: 'pointer', transition: 'background 0.15s' }}
                      >
                        {isOpen ? 'Hide' : 'Details'}
                        <ChevronRight size={13} style={{ transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
                      </button>

                    </div>
                  </div>

                  {/* Items preview (always visible) */}
                  {!isOpen && (
                    <div style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {order.orderItems.slice(0, 4).map((item, i) => (
                          <div key={i} style={{ width: 40, height: 40, background: '#f9fafb',
                            borderRadius: 8, border: '1px solid #f0f0f0', overflow: 'hidden',
                            display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <OptimizedImage 
                              src={item.image} 
                              alt={item.name} 
                              optWidth={80} // Heavily compress tiny thumbnails
                              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', padding: 4 }} 
                            />
                          </div>
                        ))}
                        {order.orderItems.length > 4 && (
                          <div style={{ width: 40, height: 40, background: '#f3f4f6',
                            borderRadius: 8, display: 'flex', alignItems: 'center',
                            justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#9ca3af' }}>
                            +{order.orderItems.length - 4}
                          </div>
                        )}
                      </div>
                      <p style={{ fontSize: 12, color: '#9ca3af', marginLeft: 4 }}>
                        {order.orderItems.length} {order.orderItems.length === 1 ? 'item' : 'items'}
                      </p>
                    </div>
                  )}

                  {/* Expanded details */}
                  {isOpen && (
                    <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 20 }}>

                      {/* Tracking bar */}
                      <div>
                        <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
                          Order Progress
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                          {['pending', 'processing', 'shipped', 'delivered'].map((s, i) => {
                            const cfg = STATUS_CONFIG[s];
                            const Icon = cfg.icon;
                            const steps = ['pending', 'processing', 'shipped', 'delivered'];
                            const currentIdx = steps.indexOf(status);
                            const isDone = i <= currentIdx && status !== 'cancelled';
                            return (
                              <React.Fragment key={s}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                                  <div style={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: isDone ? cfg.color : '#f3f4f6', border: `2px solid ${isDone ? cfg.color : '#e5e7eb'}`, transition: 'all 0.3s' }}>
                                    <Icon size={14} color={isDone ? '#fff' : '#9ca3af'} />
                                  </div>
                                  <span style={{ fontSize: 10, fontWeight: 700, color: isDone ? cfg.color : '#9ca3af', textTransform: 'capitalize', whiteSpace: 'nowrap' }}>{s}</span>
                                </div>
                                {i < 3 && (
                                  <div style={{ flex: 1, height: 2, marginBottom: 18, background: i < currentIdx && status !== 'cancelled' ? '#16a34a' : '#e5e7eb', transition: 'background 0.3s' }} />
                                )}
                              </React.Fragment>
                            );
                          })}
                        </div>
                        {status === 'cancelled' && (
                          <div style={{ marginTop: 8, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: '#dc2626', fontWeight: 600 }}>
                            This order was cancelled.
                          </div>
                        )}
                      </div>

                      {/* Items list */}
                      <div>
                        <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
                          Items Ordered
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                          {order.orderItems.map((item, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', background: '#f9fafb', borderRadius: 10, border: '1px solid #f0f0f0' }}>
                              <div style={{ width: 48, height: 48, background: '#fff', borderRadius: 8, border: '1px solid #f0f0f0', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <OptimizedImage 
                                  src={item.image} 
                                  alt={item.name} 
                                  optWidth={120} // Slightly larger for expanded view
                                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', padding: 4 }} 
                                />
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{ fontSize: 13, fontWeight: 600, color: '#111', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {item.name}
                                </p>
                                <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>
                                  Qty: {item.qty} × {symbol}{convert(item.price)}
                                </p>
                              </div>
                              <span style={{ fontSize: 14, fontWeight: 700, color: '#111', flexShrink: 0 }}>
                                {symbol}{convert(item.price * item.qty)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Bottom grid */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>

                        {/* Shipping address */}
                        <div style={{ background: '#f9fafb', border: '1px solid #f0f0f0', borderRadius: 12, padding: 16 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                            <MapPin size={13} color="#2563eb" />
                            <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Shipping To</p>
                          </div>
                          <p style={{ fontSize: 13, fontWeight: 600, color: '#374151', lineHeight: 1.6 }}>
                            {order.shippingAddress?.address}<br />
                            {order.shippingAddress?.city}, {order.shippingAddress?.state}<br />
                            {order.shippingAddress?.zip} {order.shippingAddress?.country}
                          </p>
                        </div>

                        {/* Order totals */}
                        <div style={{ background: '#1f2937', borderRadius: 12, padding: 16 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                            <CreditCard size={13} color="#60a5fa" />
                            <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Order Total</p>
                          </div>
                          {[
                            { label: 'Subtotal',  value: `${symbol}${convert(order.itemsPrice)}` },
                            { label: 'Shipping',  value: order.shippingPrice === 0 ? 'FREE' : `${symbol}${convert(order.shippingPrice)}`, green: order.shippingPrice === 0 },
                            { label: 'Tax',       value: `${symbol}${convert(order.taxPrice)}` },
                          ].map(row => (
                            <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>{row.label}</span>
                              <span style={{ fontSize: 12, fontWeight: 700, color: row.green ? '#4ade80' : 'rgba(255,255,255,0.7)' }}>{row.value}</span>
                            </div>
                          ))}
                          <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '8px 0' }} />
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total</span>
                            <span style={{ fontSize: 16, fontWeight: 900, color: '#fff' }}>
                              {symbol}{convert(order.totalPrice)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
};

export default Orders;
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  User, Mail, MapPin, Phone, ShoppingBag, LogOut,
  Save, Package, Lock, ChevronRight, Check,
  Edit3, Shield, Clock, Truck, X, RefreshCw,
} from "lucide-react";
import { useCurrency } from "../context/CurrencyContext";
import { useAuth } from "../context/AuthContext";
import { orderService } from "../api/services";

/* ── Status config ─────────────────────────────────────────── */
const STATUS = {
  pending:    { label: 'Pending',    color: '#f97316', bg: '#fff7ed', border: '#fed7aa', Icon: Clock },
  processing: { label: 'Processing', color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe', Icon: RefreshCw },
  shipped:    { label: 'Shipped',    color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe', Icon: Truck },
  delivered:  { label: 'Delivered',  color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', Icon: Check },
  cancelled:  { label: 'Cancelled',  color: '#ef4444', bg: '#fef2f2', border: '#fecaca', Icon: X },
};

const FALLBACK = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23f3f4f6' width='200' height='200'/%3E%3C/svg%3E";
const onImgError = e => { e.target.onerror = null; e.target.src = FALLBACK; };

/* ── Input field ────────────────────────────────────────────── */
const Field = ({ icon: Icon, label, type = "text", value, onChange, placeholder }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    <label style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af',
      textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</label>
    <div style={{ position: 'relative' }}>
      {Icon && <Icon size={15} style={{ position: 'absolute', left: 14, top: '50%',
        transform: 'translateY(-50%)', color: '#aaa', pointerEvents: 'none' }} />}
      <input type={type} value={value} onChange={onChange} placeholder={placeholder}
        style={{ width: '100%', padding: `11px 14px 11px ${Icon ? '40px' : '14px'}`,
          border: '1px solid #e5e7eb', borderRadius: 10, fontSize: 13,
          outline: 'none', color: '#333', boxSizing: 'border-box',
          transition: 'border-color 0.15s', background: '#fff' }}
        onFocus={e => e.target.style.borderColor = '#2563eb'}
        onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
    </div>
  </div>
);

/* ── Stat card ──────────────────────────────────────────────── */
const StatCard = ({ icon: Icon, label, value, color = '#2563eb', bg = '#eff6ff' }) => (
  <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16,
    padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16,
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
    <div style={{ width: 48, height: 48, background: bg, borderRadius: 12,
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Icon size={22} color={color} />
    </div>
    <div>
      <p style={{ fontSize: 26, fontWeight: 900, color: '#111', lineHeight: 1 }}>{value}</p>
      <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 4, fontWeight: 600 }}>{label}</p>
    </div>
  </div>
);

/* ── Status badge ───────────────────────────────────────────── */
const StatusBadge = ({ status }) => {
  const cfg = STATUS[status] || STATUS.pending;
  const { Icon } = cfg;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11,
      fontWeight: 700, color: cfg.color, background: cfg.bg,
      border: `1px solid ${cfg.border}`, padding: '3px 10px', borderRadius: 99 }}>
      <Icon size={11} /> {cfg.label}
    </span>
  );
};

/* ── Main component ─────────────────────────────────────────── */
const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, updateProfile, loading, authLoaded } = useAuth();
  const { convert, symbol } = useCurrency();

  const [orders, setOrders]       = useState([]);
  const [saving, setSaving]       = useState(false);
  const [message, setMessage]     = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  const [expanded, setExpanded]   = useState(null);

  const [form, setForm] = useState({
    name: '', email: '', phone: '', city: '',
    password: '', confirmPassword: '',
  });

  useEffect(() => {
    if (!authLoaded) return;
    if (!user) { navigate('/login'); return; }
    setForm(p => ({
      ...p,
      name:  user.name  || '',
      email: user.email || '',
      phone: user.phone || '',
      city:  user.city  || '',
    }));
    loadOrders();
  }, [user, authLoaded]);

  const loadOrders = async () => {
    try {
      const res = await orderService.getMyOrders();
      setOrders(res.data || []);
    } catch (err) { console.error(err); }
  };

  const handleSave = async () => {
    setMessage('');
    if (form.password && form.password !== form.confirmPassword)
      return showToast.warning('Passwords do not match');
    try {
      setSaving(true);
      const payload = { name: form.name, email: form.email, phone: form.phone, city: form.city };
      if (form.password) payload.password = form.password;
      await updateProfile(payload);
      setMessage('Profile updated successfully');
      setForm(p => ({ ...p, password: '', confirmPassword: '' }));
    } catch (err) { showToast.error(err.message); }
    finally { setSaving(false); }
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  if (!authLoaded) return null;

  const TABS = [
    { id: 'profile', label: 'Profile',  Icon: User },
    { id: 'orders',  label: 'Orders',   Icon: Package },
    { id: 'security',label: 'Security', Icon: Shield },
  ];

  return (
    <main style={{ maxWidth: 1240, margin: '0 auto', padding: '24px 16px',
      display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Breadcrumb */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: 6,
        fontSize: 12, color: '#9ca3af' }}>
        <Link to="/" style={{ color: '#9ca3af', textDecoration: 'none' }}
          onMouseEnter={e => e.currentTarget.style.color = '#2563eb'}
          onMouseLeave={e => e.currentTarget.style.color = '#9ca3af'}>Home</Link>
        <ChevronRight size={12} />
        <span style={{ color: '#374151', fontWeight: 500 }}>My Account</span>
      </nav>

      {/* Profile hero card */}
      <div style={{ background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
        borderRadius: 16, padding: '28px 28px', boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
        display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap',
        position: 'relative', overflow: 'hidden' }}>
        {/* grid watermark */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)',
          backgroundSize: '32px 32px' }} />

        <div style={{ position: 'relative', width: 80, height: 80, borderRadius: '50%',
          background: '#2563eb', display: 'flex', alignItems: 'center',
          justifyContent: 'center', flexShrink: 0,
          boxShadow: '0 0 0 4px rgba(37,99,235,0.3)' }}>
          <User size={36} color="#fff" />
        </div>

        <div style={{ flex: 1, minWidth: 0, position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <h1 style={{ fontSize: 22, fontWeight: 900, color: '#fff', margin: 0 }}>
              {user?.name}
            </h1>
            {user?.isAdmin && (
              <span style={{ fontSize: 10, fontWeight: 700, color: '#2563eb',
                background: 'rgba(37,99,235,0.2)', border: '1px solid rgba(37,99,235,0.4)',
                padding: '2px 8px', borderRadius: 99, textTransform: 'uppercase',
                letterSpacing: '0.08em' }}>Admin</span>
            )}
          </div>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', margin: 0 }}>{user?.email}</p>
          {user?.city && (
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 4,
              display: 'flex', alignItems: 'center', gap: 4 }}>
              <MapPin size={11} /> {user.city}
            </p>
          )}
        </div>

        <button onClick={handleLogout}
          style={{ position: 'relative', background: 'rgba(239,68,68,0.15)', color: '#ef4444',
            border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '10px 16px',
            cursor: 'pointer', display: 'flex', gap: 8, alignItems: 'center',
            fontWeight: 700, fontSize: 13, transition: 'all 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; e.currentTarget.style.color = '#ef4444'; }}>
          <LogOut size={15} /> Logout
        </button>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
        <StatCard icon={ShoppingBag} label="Total Orders"   value={orders.length} color="#2563eb" bg="#eff6ff" />
        <StatCard icon={Clock}       label="Pending"        value={orders.filter(o => (o.status||'pending')==='pending').length}    color="#f97316" bg="#fff7ed" />
        <StatCard icon={Truck}       label="Shipped"        value={orders.filter(o => o.status==='shipped').length}   color="#7c3aed" bg="#f5f3ff" />
        <StatCard icon={Check}       label="Delivered"      value={orders.filter(o => o.status==='delivered').length} color="#16a34a" bg="#f0fdf4" />
      </div>

      {/* Tabs */}
      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16,
        overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>

        {/* Tab bar */}
        <div style={{ display: 'flex', borderBottom: '1px solid #f0f0f0' }}>
          {TABS.map(({ id, label, Icon }) => (
            <button key={id} onClick={() => setActiveTab(id)}
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 8, padding: '14px 16px', border: 'none', background: 'none',
                cursor: 'pointer', fontSize: 13, fontWeight: 700,
                color: activeTab === id ? '#2563eb' : '#9ca3af',
                borderBottom: activeTab === id ? '2px solid #2563eb' : '2px solid transparent',
                transition: 'color 0.15s, border-color 0.15s' }}>
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>

        <div style={{ padding: 24 }}>

          {/* ── Profile tab ── */}
          {activeTab === 'profile' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Edit3 size={16} color="#2563eb" />
                <h2 style={{ fontSize: 15, fontWeight: 700, color: '#111', margin: 0 }}>
                  Personal Information
                </h2>
              </div>

              {message && (
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0',
                  color: '#15803d', padding: '10px 14px', borderRadius: 10,
                  fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Check size={14} /> {message}
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
                <Field icon={User}  label="Full Name" value={form.name}  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}  placeholder="Your name" />
                <Field icon={Mail}  label="Email"     value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="Email address" type="email" />
                <Field icon={Phone} label="Phone"     value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="+1 234 567 890" />
                <Field icon={MapPin}label="City"      value={form.city}  onChange={e => setForm(p => ({ ...p, city: e.target.value }))}  placeholder="Your city" />
              </div>

              <button onClick={handleSave} disabled={saving || loading}
                style={{ alignSelf: 'flex-start', background: saving ? '#93c5fd' : '#2563eb',
                  color: '#fff', border: 'none', borderRadius: 10, padding: '11px 24px',
                  cursor: saving ? 'not-allowed' : 'pointer', display: 'flex',
                  alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 13,
                  transition: 'background 0.15s' }}
                onMouseEnter={e => { if (!saving) e.currentTarget.style.background = '#1d4ed8'; }}
                onMouseLeave={e => { if (!saving) e.currentTarget.style.background = '#2563eb'; }}>
                <Save size={15} />
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          )}

          {/* ── Orders tab ── */}
          {activeTab === 'orders' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px 24px' }}>
                  <div style={{ width: 56, height: 56, background: '#f3f4f6', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                    <Package size={24} color="#9ca3af" />
                  </div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 6 }}>No orders yet</p>
                  <p style={{ fontSize: 13, color: '#9ca3af', marginBottom: 20 }}>Your order history will appear here.</p>
                  <Link to="/products"
                    style={{ background: '#2563eb', color: '#fff', fontWeight: 700, fontSize: 13,
                      padding: '10px 24px', borderRadius: 10, textDecoration: 'none' }}>
                    Start Shopping
                  </Link>
                </div>
              ) : (
                orders.map(order => {
                  const isOpen = expanded === order._id;
                  const status = order.status || 'pending';
                  const date = new Date(order.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'short', day: 'numeric'
                  });
                  return (
                    <div key={order._id}
                      style={{ border: '1px solid #f0f0f0', borderRadius: 12, overflow: 'hidden',
                        transition: 'border-color 0.2s, box-shadow 0.2s' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = '#bfdbfe'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = '#f0f0f0'; e.currentTarget.style.boxShadow = 'none'; }}>

                      {/* Order row */}
                      <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center',
                        justifyContent: 'space-between', flexWrap: 'wrap', gap: 10,
                        background: isOpen ? '#f9fafb' : '#fff' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                          <div>
                            <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af',
                              textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Order</p>
                            <p style={{ fontSize: 13, fontWeight: 700, color: '#111', fontFamily: 'monospace' }}>
                              #{order._id.slice(-8).toUpperCase()}
                            </p>
                          </div>
                          <div>
                            <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af',
                              textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Date</p>
                            <p style={{ fontSize: 13, color: '#555', fontWeight: 500 }}>{date}</p>
                          </div>
                          <div>
                            <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af',
                              textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Total</p>
                            <p style={{ fontSize: 14, fontWeight: 800, color: '#111' }}>
                              {symbol}{convert(order.totalPrice)}
                            </p>
                          </div>
                          <StatusBadge status={status} />
                        </div>

                        <button onClick={() => setExpanded(isOpen ? null : order._id)}
                          style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px',
                            borderRadius: 8, border: '1px solid #e5e7eb', background: '#fff',
                            fontSize: 12, fontWeight: 600, color: '#555', cursor: 'pointer',
                            transition: 'all 0.15s' }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = '#2563eb'; e.currentTarget.style.color = '#2563eb'; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.color = '#555'; }}>
                          {isOpen ? 'Hide' : 'Details'}
                          <ChevronRight size={13} style={{ transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
                        </button>
                      </div>

                      {/* Items preview */}
                      {!isOpen && (
                        <div style={{ padding: '10px 16px', borderTop: '1px solid #f9fafb',
                          display: 'flex', alignItems: 'center', gap: 6 }}>
                          {order.orderItems?.slice(0, 4).map((item, i) => (
                            <div key={i} style={{ width: 36, height: 36, background: '#f9fafb',
                              borderRadius: 6, border: '1px solid #f0f0f0', overflow: 'hidden',
                              display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <img src={item.image} alt={item.name} onError={onImgError}
                                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', padding: 3 }} />
                            </div>
                          ))}
                          {order.orderItems?.length > 4 && (
                            <span style={{ fontSize: 11, color: '#9ca3af', fontWeight: 600 }}>
                              +{order.orderItems.length - 4} more
                            </span>
                          )}
                          <span style={{ fontSize: 12, color: '#9ca3af', marginLeft: 4 }}>
                            {order.orderItems?.length} item{order.orderItems?.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                      )}

                      {/* Expanded */}
                      {isOpen && (
                        <div style={{ padding: 16, borderTop: '1px solid #f0f0f0',
                          display: 'flex', flexDirection: 'column', gap: 14 }}>
                          {/* Items */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {order.orderItems?.map((item, i) => (
                              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12,
                                padding: '10px 12px', background: '#f9fafb', borderRadius: 10,
                                border: '1px solid #f0f0f0' }}>
                                <div style={{ width: 44, height: 44, background: '#fff', borderRadius: 8,
                                  border: '1px solid #f0f0f0', overflow: 'hidden', flexShrink: 0,
                                  display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <img src={item.image} alt={item.name} onError={onImgError}
                                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', padding: 4 }} />
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <p style={{ fontSize: 13, fontWeight: 600, color: '#111',
                                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {item.name}
                                  </p>
                                  <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>
                                    Qty: {item.qty} × {symbol}{convert(item.price)}
                                  </p>
                                </div>
                                <span style={{ fontSize: 13, fontWeight: 700, color: '#111', flexShrink: 0 }}>
                                  {symbol}{convert(item.price * item.qty)}
                                </span>
                              </div>
                            ))}
                          </div>

                          {/* Address + totals */}
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
                            <div style={{ background: '#f9fafb', border: '1px solid #f0f0f0', borderRadius: 10, padding: 14 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                                <MapPin size={13} color="#2563eb" />
                                <span style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af',
                                  textTransform: 'uppercase', letterSpacing: '0.05em' }}>Shipping To</span>
                              </div>
                              <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.6 }}>
                                {order.shippingAddress?.address}<br />
                                {order.shippingAddress?.city} {order.shippingAddress?.postalCode}<br />
                                {order.shippingAddress?.country}
                              </p>
                            </div>

                            <div style={{ background: '#1f2937', borderRadius: 10, padding: 14 }}>
                              <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)',
                                textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
                                Order Summary
                              </p>
                              {[
                                { label: 'Subtotal',  value: `${symbol}${convert(order.itemsPrice)}` },
                                { label: 'Shipping',  value: order.shippingPrice === 0 ? 'FREE' : `${symbol}${convert(order.shippingPrice)}`, green: order.shippingPrice === 0 },
                                { label: 'Tax',       value: `${symbol}${convert(order.taxPrice)}` },
                              ].map(row => (
                                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>{row.label}</span>
                                  <span style={{ fontSize: 12, fontWeight: 700, color: row.green ? '#4ade80' : 'rgba(255,255,255,0.7)' }}>{row.value}</span>
                                </div>
                              ))}
                              <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '8px 0' }} />
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 700 }}>Total</span>
                                <span style={{ fontSize: 15, fontWeight: 900, color: '#fff' }}>{symbol}{convert(order.totalPrice)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* ── Security tab ── */}
          {activeTab === 'security' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Shield size={16} color="#2563eb" />
                <h2 style={{ fontSize: 15, fontWeight: 700, color: '#111', margin: 0 }}>Change Password</h2>
              </div>

              {message && (
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0',
                  color: '#15803d', padding: '10px 14px', borderRadius: 10,
                  fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Check size={14} /> {message}
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14, maxWidth: 600 }}>
                <Field icon={Lock} label="New Password"     type="password" value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  placeholder="Min 6 characters" />
                <Field icon={Lock} label="Confirm Password" type="password" value={form.confirmPassword}
                  onChange={e => setForm(p => ({ ...p, confirmPassword: e.target.value }))}
                  placeholder="Repeat new password" />
              </div>

              <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10,
                padding: '10px 14px', fontSize: 12, color: '#92400e', maxWidth: 500 }}>
                Password must be at least 6 characters. You'll be logged out after changing it.
              </div>

              <button onClick={handleSave} disabled={saving || !form.password}
                style={{ alignSelf: 'flex-start', background: saving || !form.password ? '#93c5fd' : '#2563eb',
                  color: '#fff', border: 'none', borderRadius: 10, padding: '11px 24px',
                  cursor: saving || !form.password ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 13 }}>
                <Lock size={15} />
                {saving ? 'Updating…' : 'Update Password'}
              </button>
            </div>
          )}

        </div>
      </div>
    </main>
  );
};

export default Profile;
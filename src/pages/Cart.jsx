import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart, Trash2, ChevronRight, ShieldCheck,
  Truck, RotateCcw, CreditCard, ArrowLeft, Box,
  Zap, Info,
} from 'lucide-react';
import { useCart } from '../context/CartContext';

const FALLBACK = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23f3f4f6' width='200' height='200'/%3E%3C/svg%3E";
const onImgError = e => { e.target.onerror = null; e.target.src = FALLBACK; };

const Cart = () => {
  const { cart, removeFromCart, updateQty, clearCart, cartTotal, cartCount } = useCart();
  const navigate = useNavigate();

  const subtotal = cartTotal;
  const shipping = subtotal > 100 ? 0 : (subtotal > 0 ? 15.00 : 0);
  const tax      = subtotal * 0.08;
  const total    = subtotal + shipping + tax;

  /* ── Empty state ───────────────────────────────────────────── */
  if (cart.length === 0) {
    return (
      <main style={{ maxWidth: 1240, margin: '0 auto', padding: '48px 16px' }}>
        <div style={{ maxWidth: 520, margin: '0 auto', background: '#fff',
          border: '1px solid #e5e7eb', borderRadius: 20, padding: 48, textAlign: 'center',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>

          <div style={{ width: 96, height: 96, background: '#eff6ff', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <ShoppingCart size={40} color="#2563eb" strokeWidth={1.5} />
          </div>

          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#111', marginBottom: 8 }}>
            Your cart is empty
          </h2>
          <p style={{ fontSize: 13, color: '#9ca3af', maxWidth: 320, margin: '0 auto 28px', lineHeight: 1.6 }}>
            Looks like you haven't added anything yet. Browse our store and find something you'll love!
          </p>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 32 }}>
            <Link to="/products"
              style={{ background: '#2563eb', color: '#fff', fontWeight: 700, fontSize: 13,
                padding: '11px 24px', borderRadius: 10, textDecoration: 'none',
                transition: 'background 0.15s', display: 'inline-block' }}
              onMouseEnter={e => e.currentTarget.style.background = '#1d4ed8'}
              onMouseLeave={e => e.currentTarget.style.background = '#2563eb'}>
              Explore products
            </Link>
            <Link to="/"
              style={{ background: '#fff', color: '#555', fontWeight: 600, fontSize: 13,
                padding: '11px 24px', borderRadius: 10, border: '1px solid #e5e7eb',
                textDecoration: 'none', transition: 'background 0.15s', display: 'inline-block' }}
              onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
              onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
              Go to home
            </Link>
          </div>

          <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 24,
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
            {['Electronics', 'Fashion', 'Home Decor', 'Beauty'].map(cat => (
              <Link key={cat} to={`/products?category=${cat}`}
                style={{ padding: '10px 4px', borderRadius: 10, background: '#f9fafb',
                  textDecoration: 'none', fontSize: 10, fontWeight: 700, color: '#9ca3af',
                  textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.06em',
                  transition: 'background 0.15s, color 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#eff6ff'; e.currentTarget.style.color = '#2563eb'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#f9fafb'; e.currentTarget.style.color = '#9ca3af'; }}>
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </main>
    );
  }

  /* ── Cart ──────────────────────────────────────────────────── */
  return (
    <>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}`}</style>

      <main style={{ maxWidth: 1240, margin: '0 auto', padding: '24px 16px',
        display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 12 }}>
          <div>
            <nav style={{ display: 'flex', alignItems: 'center', gap: 6,
              fontSize: 11, fontWeight: 600, color: '#aaa', textTransform: 'uppercase',
              letterSpacing: '0.07em', marginBottom: 8 }}>
              <Link to="/" style={{ textDecoration: 'none', color: '#aaa',
                transition: 'color 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#2563eb'}
                onMouseLeave={e => e.currentTarget.style.color = '#aaa'}>
                Home
              </Link>
              <ChevronRight size={11} />
              <span style={{ color: '#111' }}>Shopping Cart</span>
            </nav>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: '#111', margin: 0 }}>Shopping Cart</h1>
              <span style={{ background: '#2563eb', color: '#fff', fontSize: 11, fontWeight: 700,
                padding: '3px 12px', borderRadius: 99 }}>
                {cartCount} {cartCount === 1 ? 'item' : 'items'}
              </span>
            </div>
          </div>
          <button onClick={clearCart}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none',
              cursor: 'pointer', fontSize: 12, fontWeight: 700, color: '#aaa',
              textTransform: 'uppercase', letterSpacing: '0.05em', transition: 'color 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
            onMouseLeave={e => e.currentTarget.style.color = '#aaa'}>
            <Trash2 size={14} /> Empty cart
          </button>
        </div>

        {/* Body */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20 }}
             className="lg:cart-grid">
          <style>{`.lg\\:cart-grid { grid-template-columns: 1fr; } @media(min-width:1024px){ .lg\\:cart-grid{ grid-template-columns: 1fr 340px; } }`}</style>

          {/* ── Left: items ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {cart.map(item => (
              <div key={item._id}
                style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: 16, padding: 16,
                  display: 'flex', flexDirection: 'column', gap: 16,
                  transition: 'box-shadow 0.2s, border-color 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'; e.currentTarget.style.borderColor = '#bfdbfe'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#f0f0f0'; }}
                className="sm-row">
                <style>{`.sm-row{ flex-direction:column; } @media(min-width:480px){ .sm-row{ flex-direction:row !important; } }`}</style>

                {/* Image */}
                <Link to={`/product/${item._id}`}
                  style={{ width: '100%', height: 130, flexShrink: 0, borderRadius: 10,
                    background: '#f9fafb', overflow: 'hidden',
                    display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  className="sm-img">
                  <style>{`@media(min-width:480px){ .sm-img{ width:120px !important; height:120px !important; } }`}</style>
                  <img src={item.image} alt={item.name} onError={onImgError}
                    style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain',
                      padding: 12, transition: 'transform 0.3s' }}
                    onMouseEnter={e => e.target.style.transform = 'scale(1.06)'}
                    onMouseLeave={e => e.target.style.transform = 'scale(1)'} />
                </Link>

                {/* Details */}
                <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column',
                  justifyContent: 'space-between', gap: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                    <div style={{ minWidth: 0 }}>
                      <Link to={`/product/${item._id}`} style={{ textDecoration: 'none' }}>
                        <p style={{ fontSize: 15, fontWeight: 700, color: '#111', lineHeight: 1.4,
                          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                          overflow: 'hidden', marginBottom: 6, transition: 'color 0.15s' }}
                          onMouseEnter={e => e.currentTarget.style.color = '#2563eb'}
                          onMouseLeave={e => e.currentTarget.style.color = '#111'}>
                          {item.name}
                        </p>
                      </Link>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8,
                        fontSize: 10, fontWeight: 700, color: '#aaa',
                        textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Box size={11} /> {item.brand || 'Premium'}
                        </span>
                        <span style={{ width: 3, height: 3, borderRadius: '50%', background: '#e5e7eb' }} />
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#16a34a' }}>
                          <Zap size={11} /> In Stock
                        </span>
                      </div>
                    </div>
                    <button onClick={() => removeFromCart(item._id)}
                      style={{ width: 34, height: 34, borderRadius: '50%', border: 'none',
                        background: '#f9fafb', color: '#aaa', cursor: 'pointer', flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'background 0.15s, color 0.15s' }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.color = '#ef4444'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = '#f9fafb'; e.currentTarget.style.color = '#aaa'; }}>
                      <Trash2 size={15} />
                    </button>
                  </div>

                  {/* Qty + price row */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    borderTop: '1px solid #f0f0f0', paddingTop: 12, flexWrap: 'wrap', gap: 10 }}>
                    <div>
                      <p style={{ fontSize: 9, fontWeight: 700, color: '#aaa', textTransform: 'uppercase',
                        letterSpacing: '0.1em', marginBottom: 6 }}>Quantity</p>
                      <div style={{ display: 'flex', alignItems: 'center', background: '#f9fafb',
                        borderRadius: 10, border: '1px solid #f0f0f0', overflow: 'hidden' }}>
                        <button
                          onClick={() => updateQty(item._id, Math.max(1, item.qty - 1))}
                          style={{ width: 34, height: 34, border: 'none', background: 'none',
                            cursor: 'pointer', fontSize: 16, fontWeight: 700, color: '#555',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'background 0.15s' }}
                          onMouseEnter={e => e.currentTarget.style.background = '#e5e7eb'}
                          onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                          −
                        </button>
                        <span style={{ width: 36, textAlign: 'center', fontWeight: 700,
                          fontSize: 14, color: '#111' }}>{item.qty}</span>
                        <button
                          onClick={() => updateQty(item._id, item.qty + 1)}
                          style={{ width: 34, height: 34, border: 'none', background: 'none',
                            cursor: 'pointer', fontSize: 16, fontWeight: 700, color: '#555',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'background 0.15s' }}
                          onMouseEnter={e => e.currentTarget.style.background = '#e5e7eb'}
                          onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                          +
                        </button>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: 9, fontWeight: 700, color: '#aaa',
                        textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>
                        Total
                      </p>
                      <p style={{ fontSize: 18, fontWeight: 800, color: '#111' }}>
                        ${(item.price * item.qty).toFixed(2)}
                      </p>
                      {item.qty > 1 && (
                        <p style={{ fontSize: 11, color: '#aaa', marginTop: 2 }}>
                          ${item.price.toFixed(2)} each
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Trust badges */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12, marginTop: 4 }}>
              {[
                { icon: <ShieldCheck size={18} color="#2563eb" />, title: 'Secure Checkout', desc: 'Bank-level encryption' },
                { icon: <Truck size={18} color="#16a34a" />,       title: 'Express Delivery', desc: 'Free over $100 orders' },
                { icon: <RotateCcw size={18} color="#f97316" />,   title: 'Easy Returns', desc: '30-day money back' },
              ].map((b, i) => (
                <div key={i}
                  style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: 12, padding: 14,
                    display: 'flex', alignItems: 'center', gap: 12,
                    transition: 'box-shadow 0.2s, border-color 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'; e.currentTarget.style.borderColor = '#bfdbfe'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#f0f0f0'; }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: '#f9fafb',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {b.icon}
                  </div>
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 700, color: '#111', marginBottom: 2 }}>{b.title}</p>
                    <p style={{ fontSize: 10, color: '#aaa', fontWeight: 600,
                      textTransform: 'uppercase', letterSpacing: '0.05em' }}>{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: order summary ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Summary card */}
            <div style={{ background: '#1f2937', borderRadius: 16, padding: 28, color: '#fff',
              position: 'sticky', top: 20, boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
              overflow: 'hidden' }}>
              {/* subtle bg circle */}
              <div style={{ position: 'absolute', top: -40, right: -40, width: 120, height: 120,
                background: 'rgba(255,255,255,0.04)', borderRadius: '50%', pointerEvents: 'none' }} />

              <h3 style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginBottom: 24 }}>
                Order Summary
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                {[
                  { label: 'Subtotal', value: `$${subtotal.toFixed(2)}`, highlight: false },
                  { label: 'Shipping', value: shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`, highlight: shipping === 0 },
                  { label: 'Sales tax (8%)', value: `$${tax.toFixed(2)}`, highlight: false },
                ].map(row => (
                  <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)',
                      textTransform: 'uppercase', letterSpacing: '0.06em' }}>{row.label}</span>
                    <span style={{ fontSize: 13, fontWeight: 700,
                      color: row.highlight ? '#4ade80' : '#fff' }}>{row.value}</span>
                  </div>
                ))}
              </div>

              <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '20px 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)',
                  textTransform: 'uppercase', letterSpacing: '0.08em' }}>Grand Total</span>
                <span style={{ fontSize: 26, fontWeight: 900, color: '#fff' }}>${total.toFixed(2)}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <button onClick={() => navigate('/checkout')}
                  style={{ width: '100%', background: '#2563eb', color: '#fff', fontWeight: 700,
                    fontSize: 14, padding: '13px', borderRadius: 10, border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    transition: 'background 0.15s, transform 0.15s',
                    boxShadow: '0 4px 16px rgba(37,99,235,0.4)' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#1d4ed8'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#2563eb'; e.currentTarget.style.transform = 'none'; }}>
                  <CreditCard size={17} /> Checkout now
                </button>
                <Link to="/products"
                  style={{ width: '100%', background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)',
                    fontWeight: 600, fontSize: 13, padding: '11px', borderRadius: 10,
                    textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    gap: 6, transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.10)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}>
                  <ArrowLeft size={15} /> Continue shopping
                </Link>
              </div>

              {/* Payment icons */}
              <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <p style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.3)',
                  textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'center', marginBottom: 10 }}>
                  Accepted payment methods
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
                  {['VISA', 'MC', 'AMEX', 'PAYPAL'].map(p => (
                    <span key={p}
                      style={{ background: 'rgba(255,255,255,0.08)', padding: '4px 10px',
                        borderRadius: 6, fontSize: 9, fontWeight: 800, color: 'rgba(255,255,255,0.5)',
                        letterSpacing: '0.05em' }}>
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Free shipping alert */}
            {subtotal < 100 && subtotal > 0 && (
              <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 12,
                padding: 16, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ flexShrink: 0, marginTop: 2 }}>
                  <Info size={18} color="#d97706" />
                </div>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 700, color: '#92400e', marginBottom: 4 }}>
                    Free shipping alert!
                  </p>
                  <p style={{ fontSize: 12, color: '#b45309', lineHeight: 1.5 }}>
                    Add <strong>${(100 - subtotal).toFixed(2)}</strong> more to qualify for free express shipping.
                  </p>
                  {/* progress bar */}
                  <div style={{ marginTop: 10, height: 4, background: '#fde68a', borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{ height: '100%', borderRadius: 99, background: '#f59e0b',
                      width: `${Math.min(100, (subtotal / 100) * 100)}%`,
                      transition: 'width 0.4s ease' }} />
                  </div>
                  <p style={{ fontSize: 10, color: '#b45309', marginTop: 5, fontWeight: 600 }}>
                    ${subtotal.toFixed(2)} / $100.00
                  </p>
                </div>
              </div>
            )}

            {shipping === 0 && subtotal > 0 && (
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12,
                padding: 14, display: 'flex', gap: 10, alignItems: 'center' }}>
                <Truck size={18} color="#16a34a" style={{ flexShrink: 0 }} />
                <p style={{ fontSize: 12, fontWeight: 600, color: '#15803d' }}>
                  You qualify for <strong>free express shipping!</strong>
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default Cart;
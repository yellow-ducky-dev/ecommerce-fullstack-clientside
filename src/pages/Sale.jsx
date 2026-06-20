import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ChevronRight, Star, ShoppingCart, Tag,
  ChevronDown, ArrowUpDown, PackageSearch, Zap,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { showToast } from '../helper/toast';

const FALLBACK = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23f3f4f6' width='200' height='200'/%3E%3C/svg%3E";
const onImgError = e => { e.target.onerror = null; e.target.src = FALLBACK; };

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const SORT_OPTIONS = [
  { value: 'discount',   label: 'Biggest discount' },
  { value: 'price-asc',  label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating',     label: 'Top Rated' },
  { value: 'newest',     label: 'Newest first' },
];

/* ── Skeleton ─────────────────────────────────────────────────── */
const Skeleton = () => (
  <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #f0f0f0',
    padding: 12, animation: 'pulse 1.5s ease-in-out infinite' }}>
    <div style={{ height: 150, background: '#f3f4f6', borderRadius: 8, marginBottom: 12 }} />
    <div style={{ height: 10, background: '#f3f4f6', borderRadius: 4, width: '75%', marginBottom: 8 }} />
    <div style={{ height: 10, background: '#f3f4f6', borderRadius: 4, width: '50%', marginBottom: 12 }} />
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div style={{ height: 18, background: '#f3f4f6', borderRadius: 4, width: 56 }} />
      <div style={{ height: 32, width: 32, background: '#f3f4f6', borderRadius: 8 }} />
    </div>
  </div>
);

/* ── Product card ─────────────────────────────────────────────── */
const SaleCard = ({ product }) => {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const { convert, symbol } = useCurrency();
  const discount = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  const handleAdd = e => {
    e.preventDefault();
    addToCart(product, 1);
    setAdded(true);
    showToast.success("Item Added to Cart");
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <Link to={`/product/${product._id}`}
      style={{ background: '#fff', borderRadius: 12, border: '1px solid #f0f0f0', padding: 12,
        display: 'flex', flexDirection: 'column', textDecoration: 'none', position: 'relative',
        transition: 'box-shadow 0.2s, border-color 0.2s' }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.09)'; e.currentTarget.style.borderColor = '#bfdbfe'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#f0f0f0'; }}
    >
      {/* Discount badge */}
      <span style={{ position: 'absolute', top: 10, left: 10, zIndex: 1,
        background: '#ef4444', color: '#fff', fontSize: 10, fontWeight: 800,
        padding: '3px 8px', borderRadius: 99 }}>
        -{discount}%
      </span>

      {/* Image */}
      <div style={{ height: 150, background: '#f9fafb', borderRadius: 8, overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
        <img src={product.image} alt={product.name} onError={onImgError}
          style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain',
            transition: 'transform 0.4s' }}
          onMouseEnter={e => e.target.style.transform = 'scale(1.08)'}
          onMouseLeave={e => e.target.style.transform = 'scale(1)'} />
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {/* Stars */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={10}
              style={{ fill: i < Math.floor(product.rating) ? '#facc15' : 'none',
                color: i < Math.floor(product.rating) ? '#facc15' : '#e5e7eb' }} />
          ))}
          <span style={{ fontSize: 10, color: '#9ca3af', marginLeft: 4 }}>({product.numReviews})</span>
        </div>

        {/* Name */}
        <p style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a', lineHeight: 1.4,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          overflow: 'hidden', flex: 1 }}>
          {product.name}
        </p>

        {/* Price row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
          <div>
            <span style={{ fontWeight: 800, color: '#ef4444', fontSize: 15 }}>
              {symbol} {convert(product.price)}
            </span>
            <span style={{ fontSize: 11, color: '#aaa', textDecoration: 'line-through', marginLeft: 6 }}>
              ${product.originalPrice.toFixed(2)}
            </span>
          </div>
          <button onClick={handleAdd}
            style={{ width: 32, height: 32, borderRadius: 8, border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: added ? '#16a34a' : '#eff6ff', color: added ? '#fff' : '#2563eb',
              transition: 'background 0.15s, color 0.15s' }}
            onMouseEnter={e => { if (!added) { e.currentTarget.style.background = '#2563eb'; e.currentTarget.style.color = '#fff'; } }}
            onMouseLeave={e => { if (!added) { e.currentTarget.style.background = '#eff6ff'; e.currentTarget.style.color = '#2563eb'; } }}>
            <ShoppingCart size={14} />
          </button>
        </div>
      </div>
    </Link>
  );
};

/* ── Main ─────────────────────────────────────────────────────── */
const Sale = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [total,    setTotal]    = useState(0);
  const [pages,    setPages]    = useState(1);
  const [loading,  setLoading]  = useState(true);

  const sort = searchParams.get('sort') || 'discount';
  const page = Number(searchParams.get('page') || 1);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value); else next.delete(key);
    if (key !== 'page') next.set('page', '1');
    setSearchParams(next);
  };

  const fetchSale = useCallback(async () => {
    setLoading(true);
    try {
      /* fetch all products then filter client-side for originalPrice > price
         (backend doesn't have a dedicated "on-sale" filter yet) */
      const res  = await fetch(`${API}/api/products?limit=200`);
      const data = await res.json();
      const sale = (data.products || []).filter(
        p => p.originalPrice && p.originalPrice > p.price
      );

      /* sort */
      const sorted = [...sale].sort((a, b) => {
        if (sort === 'discount') {
          const da = ((a.originalPrice - a.price) / a.originalPrice);
          const db = ((b.originalPrice - b.price) / b.originalPrice);
          return db - da;
        }
        if (sort === 'price-asc')  return a.price - b.price;
        if (sort === 'price-desc') return b.price - a.price;
        if (sort === 'rating')     return b.rating - a.rating;
        return new Date(b.createdAt) - new Date(a.createdAt); // newest
      });

      const perPage = 20;
      const start   = (page - 1) * perPage;
      setProducts(sorted.slice(start, start + perPage));
      setTotal(sorted.length);
      setPages(Math.ceil(sorted.length / perPage));
    } catch (err) {
      console.error('Failed to fetch sale products:', err);
    } finally {
      setLoading(false);
      window.scrollTo(0, 0);
    }
  }, [sort, page]);

  useEffect(() => { fetchSale(); }, [fetchSale]);

  /* max discount among all sale items */
  const topDiscount = products.length
    ? Math.max(...products.map(p =>
        Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)))
    : 0;

  /* pagination window */
  const pageNums = () => {
    if (pages <= 6) return [...Array(pages)].map((_, i) => i + 1);
    const s = Math.max(1, page - 2), e = Math.min(pages, page + 2);
    const arr = [];
    if (s > 1) { arr.push(1); if (s > 2) arr.push('…'); }
    for (let i = s; i <= e; i++) arr.push(i);
    if (e < pages) { if (e < pages - 1) arr.push('…'); arr.push(pages); }
    return arr;
  };

  return (
    <>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}`}</style>

      <main style={{ maxWidth: 1240, margin: '0 auto', padding: '24px 16px',
        display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Breadcrumb */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11,
          fontWeight: 600, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
          <Link to="/" style={{ textDecoration: 'none', color: '#aaa', transition: 'color 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.color = '#2563eb'}
            onMouseLeave={e => e.currentTarget.style.color = '#aaa'}>Home</Link>
          <ChevronRight size={11} />
          <span style={{ color: '#111' }}>Sale</span>
        </nav>

        {/* Hero banner */}
        <section style={{ background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
          borderRadius: 16, padding: '32px 28px', position: 'relative', overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(239,68,68,0.25)' }}>
          {/* grid watermark */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg,rgba(255,255,255,0.06) 1px, transparent 1px)',
            backgroundSize: '36px 36px' }} />
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <Zap size={18} color="#fff" fill="#fff" />
                <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Limited time offers
                </span>
              </div>
              <h1 style={{ color: '#fff', fontWeight: 900, fontSize: 'clamp(24px, 4vw, 40px)',
                lineHeight: 1.1, margin: '0 0 8px' }}>
                Sale — up to {topDiscount || '??'}% off
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, margin: 0, maxWidth: 380 }}>
                Grab the best deals before they're gone. New items added daily.
              </p>
            </div>
            {!loading && (
              <div style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 14,
                padding: '16px 24px', textAlign: 'center', backdropFilter: 'blur(4px)' }}>
                <p style={{ color: '#fff', fontWeight: 900, fontSize: 32, margin: 0,
                  lineHeight: 1 }}>{total}</p>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: '0.08em', margin: '4px 0 0' }}>
                  items on sale
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Toolbar */}
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12,
          padding: '10px 14px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Tag size={14} color="#ef4444" />
            <span style={{ fontSize: 13, fontWeight: 700, color: '#111' }}>
              {loading ? '—' : total} sale {total === 1 ? 'item' : 'items'}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <ArrowUpDown size={13} color="#aaa" />
            <span style={{ fontSize: 12, color: '#aaa' }}>Sort:</span>
            <select value={sort} onChange={e => updateParam('sort', e.target.value)}
              style={{ padding: '6px 10px', border: '1px solid #e5e7eb', borderRadius: 8,
                fontSize: 12, background: '#fff', outline: 'none', color: '#333', cursor: 'pointer' }}>
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16 }}>
            {[...Array(8)].map((_, i) => <Skeleton key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16,
            padding: '80px 24px', textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ width: 56, height: 56, background: '#fef2f2', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <PackageSearch size={26} color="#ef4444" />
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#374151', marginBottom: 8 }}>
              No sale items right now
            </h3>
            <p style={{ color: '#9ca3af', fontSize: 13, maxWidth: 280, margin: '0 auto 20px' }}>
              Check back soon — new deals are added daily.
            </p>
            <Link to="/products"
              style={{ background: '#2563eb', color: '#fff', fontWeight: 600, fontSize: 13,
                padding: '10px 24px', borderRadius: 8, textDecoration: 'none',
                display: 'inline-block', transition: 'background 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#1d4ed8'}
              onMouseLeave={e => e.currentTarget.style.background = '#2563eb'}>
              Browse all products
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16 }}>
            {products.map(p => <SaleCard key={p._id} product={p} />)}
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && !loading && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginTop: 16 }}>
            <button disabled={page === 1} onClick={() => updateParam('page', page - 1)}
              style={{ width: 36, height: 36, borderRadius: 8, border: '1px solid #e5e7eb',
                background: '#fff', cursor: page === 1 ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                opacity: page === 1 ? 0.4 : 1 }}
              onMouseEnter={e => { if (page !== 1) e.currentTarget.style.background = '#f9fafb'; }}
              onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
              <ChevronDown className="rotate-90" size={16} color="#555" style={{ transform: 'rotate(90deg)' }} />
            </button>

            {pageNums().map((p, i) =>
              p === '…'
                ? <span key={`e${i}`} style={{ width: 36, height: 36, display: 'flex',
                    alignItems: 'center', justifyContent: 'center', color: '#aaa', fontSize: 13 }}>…</span>
                : <button key={p} onClick={() => updateParam('page', p)}
                    style={{ width: 36, height: 36, borderRadius: 8, fontWeight: 700, fontSize: 13,
                      border: '1px solid', cursor: 'pointer',
                      borderColor: page === p ? '#ef4444' : '#e5e7eb',
                      background: page === p ? '#ef4444' : '#fff',
                      color: page === p ? '#fff' : '#555',
                      transition: 'background 0.15s, color 0.15s, border-color 0.15s' }}
                    onMouseEnter={e => { if (page !== p) { e.currentTarget.style.background = '#f9fafb'; e.currentTarget.style.borderColor = '#fca5a5'; } }}
                    onMouseLeave={e => { if (page !== p) { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#e5e7eb'; } }}>
                    {p}
                  </button>
            )}

            <button disabled={page === pages} onClick={() => updateParam('page', page + 1)}
              style={{ width: 36, height: 36, borderRadius: 8, border: '1px solid #e5e7eb',
                background: '#fff', cursor: page === pages ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                opacity: page === pages ? 0.4 : 1 }}
              onMouseEnter={e => { if (page !== pages) e.currentTarget.style.background = '#f9fafb'; }}
              onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
              <ChevronDown size={16} color="#555" style={{ transform: 'rotate(-90deg)' }} />
            </button>
          </div>
        )}
      </main>
    </>
  );
};

export default Sale;
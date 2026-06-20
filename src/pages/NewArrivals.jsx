import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ChevronRight, Star, ShoppingCart, Sparkles,
  ArrowUpDown, PackageSearch, ChevronDown, Clock,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { showToast } from '../helper/toast';

const FALLBACK = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23f3f4f6' width='200' height='200'/%3E%3C/svg%3E";
const onImgError = e => { e.target.onerror = null; e.target.src = FALLBACK; };

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const SORT_OPTIONS = [
  { value: 'newest',     label: 'Newest first' },
  { value: 'rating',     label: 'Top Rated' },
  { value: 'price-asc',  label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
];

/* how many days back counts as "new" */
const NEW_DAYS = 30;

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

/* ── "Days ago" label ─────────────────────────────────────────── */
const daysAgo = dateStr => {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  return `${diff}d ago`;
};

/* ── Product card ─────────────────────────────────────────────── */
const NewCard = ({ product }) => {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const { convert, symbol } = useCurrency();
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const handleAdd = e => {
    e.preventDefault();
    addToCart(product, 1);
    setAdded(true);
    showToast.success("Item Added to Cart")
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <Link to={`/product/${product._id}`}
      style={{ background: '#fff', borderRadius: 12, border: '1px solid #f0f0f0',
        padding: 12, display: 'flex', flexDirection: 'column', textDecoration: 'none',
        position: 'relative', transition: 'box-shadow 0.2s, border-color 0.2s' }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.09)'; e.currentTarget.style.borderColor = '#bfdbfe'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#f0f0f0'; }}
    >
      {/* NEW badge */}
      <span style={{ position: 'absolute', top: 10, left: 10, zIndex: 1,
        background: '#7c3aed', color: '#fff', fontSize: 9, fontWeight: 800,
        padding: '3px 8px', borderRadius: 99, letterSpacing: '0.05em',
        textTransform: 'uppercase' }}>
        New
      </span>

      {/* Discount badge */}
      {discount && (
        <span style={{ position: 'absolute', top: 10, right: 10, zIndex: 1,
          background: '#ef4444', color: '#fff', fontSize: 9, fontWeight: 800,
          padding: '3px 8px', borderRadius: 99 }}>
          -{discount}%
        </span>
      )}

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

        {/* Added date */}
        {product.createdAt && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Clock size={10} color="#9ca3af" />
            <span style={{ fontSize: 10, color: '#9ca3af', fontWeight: 600 }}>
              Added {daysAgo(product.createdAt)}
            </span>
          </div>
        )}

        {/* Price row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 4 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontWeight: 800, color: '#111', fontSize: 15 }}>
              {symbol} {convert(product.price)}
            </span>
            {product.originalPrice && (
              <span style={{ fontSize: 11, color: '#aaa', textDecoration: 'line-through' }}>
                {symbol} {convert(product.originalPrice)}
              </span>
            )}
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
const NewArrivals = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [total,    setTotal]    = useState(0);
  const [pages,    setPages]    = useState(1);
  const [loading,  setLoading]  = useState(true);

  const sort = searchParams.get('sort') || 'newest';
  const page = Number(searchParams.get('page') || 1);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value); else next.delete(key);
    if (key !== 'page') next.set('page', '1');
    setSearchParams(next);
  };

  const fetchNew = useCallback(async () => {
    setLoading(true);
    try {
      /* sort=newest gives us createdAt desc — perfect for new arrivals */
      const apiSort = sort === 'newest' ? 'newest' : sort;
      const res  = await fetch(`${API}/api/products?sort=${apiSort}&limit=200`);
      const data = await res.json();

      /* filter: only products created within NEW_DAYS days */
      const cutoff = Date.now() - NEW_DAYS * 86400000;
      let filtered = (data.products || []).filter(
        p => new Date(p.createdAt).getTime() >= cutoff
      );

      /* if nothing is that recent (e.g. dev/seed data), fall back to newest 40 */
      if (filtered.length === 0) {
        filtered = (data.products || []).slice(0, 40);
      }

      const perPage = 20;
      const start   = (page - 1) * perPage;
      setProducts(filtered.slice(start, start + perPage));
      setTotal(filtered.length);
      setPages(Math.ceil(filtered.length / perPage));
    } catch (err) {
      console.error('Failed to fetch new arrivals:', err);
    } finally {
      setLoading(false);
      window.scrollTo(0, 0);
    }
  }, [sort, page]);

  useEffect(() => { fetchNew(); }, [fetchNew]);

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
          <span style={{ color: '#111' }}>New Arrivals</span>
        </nav>

        {/* Hero banner */}
        <section style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
          borderRadius: 16, padding: '32px 28px', position: 'relative', overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(124,58,237,0.25)' }}>
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg,rgba(255,255,255,0.06) 1px, transparent 1px)',
            backgroundSize: '36px 36px' }} />
          {/* decorative circles */}
          <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180,
            borderRadius: '50%', background: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -30, right: 80, width: 100, height: 100,
            borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />

          <div style={{ position: 'relative', display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <Sparkles size={18} color="#fff" fill="#fff" />
                <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Just dropped
                </span>
              </div>
              <h1 style={{ color: '#fff', fontWeight: 900, fontSize: 'clamp(24px, 4vw, 40px)',
                lineHeight: 1.1, margin: '0 0 8px' }}>
                New Arrivals
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, margin: 0, maxWidth: 380 }}>
                Fresh products added in the last {NEW_DAYS} days. Be the first to own them.
              </p>
            </div>
            {!loading && (
              <div style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 14,
                padding: '16px 24px', textAlign: 'center', backdropFilter: 'blur(4px)' }}>
                <p style={{ color: '#fff', fontWeight: 900, fontSize: 32, margin: 0, lineHeight: 1 }}>
                  {total}
                </p>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: '0.08em', margin: '4px 0 0' }}>
                  new items
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
            <Sparkles size={14} color="#7c3aed" />
            <span style={{ fontSize: 13, fontWeight: 700, color: '#111' }}>
              {loading ? '—' : total} new {total === 1 ? 'product' : 'products'}
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
            <div style={{ width: 56, height: 56, background: '#f5f3ff', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <PackageSearch size={26} color="#7c3aed" />
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#374151', marginBottom: 8 }}>
              No new arrivals yet
            </h3>
            <p style={{ color: '#9ca3af', fontSize: 13, maxWidth: 280, margin: '0 auto 20px' }}>
              Check back soon — new products are added regularly.
            </p>
            <Link to="/products"
              style={{ background: '#7c3aed', color: '#fff', fontWeight: 600, fontSize: 13,
                padding: '10px 24px', borderRadius: 8, textDecoration: 'none',
                display: 'inline-block', transition: 'background 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#6d28d9'}
              onMouseLeave={e => e.currentTarget.style.background = '#7c3aed'}>
              Browse all products
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16 }}>
            {products.map(p => <NewCard key={p._id} product={p} />)}
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
              <ChevronDown size={16} color="#555" style={{ transform: 'rotate(90deg)' }} />
            </button>

            {pageNums().map((p, i) =>
              p === '…'
                ? <span key={`e${i}`} style={{ width: 36, height: 36, display: 'flex',
                    alignItems: 'center', justifyContent: 'center', color: '#aaa', fontSize: 13 }}>…</span>
                : <button key={p} onClick={() => updateParam('page', p)}
                    style={{ width: 36, height: 36, borderRadius: 8, fontWeight: 700, fontSize: 13,
                      border: '1px solid', cursor: 'pointer',
                      borderColor: page === p ? '#7c3aed' : '#e5e7eb',
                      background: page === p ? '#7c3aed' : '#fff',
                      color: page === p ? '#fff' : '#555',
                      transition: 'background 0.15s, color 0.15s, border-color 0.15s' }}
                    onMouseEnter={e => { if (page !== p) { e.currentTarget.style.background = '#f9fafb'; e.currentTarget.style.borderColor = '#c4b5fd'; } }}
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

export default NewArrivals;
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  SlidersHorizontal, Star, ShoppingCart,
  LayoutGrid, List, X, ChevronDown, ChevronUp,
  ChevronRight, ChevronLeft, PackageSearch,
} from 'lucide-react';
import { productService } from '../api/services';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { showToast } from '../helper/toast';

/* ─── Static data ─────────────────────────────────────────────── */
const CATEGORIES = [
  'All', 'Automobiles', 'Clothes and wear', 'Home interiors',
  'Computer and tech', 'Tools, equipments', 'Sports and outdoor',
  'Animal and pets', 'Machinery',
];

const SORT_OPTIONS = [
  { value: 'newest',      label: 'Newest first' },
  { value: 'price-asc',  label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating',     label: 'Top Rated' },
];

/* ─── Fallback image ──────────────────────────────────────────── */
const FALLBACK = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23f3f4f6' width='200' height='200'/%3E%3C/svg%3E";
const onImgError = e => { e.target.onerror = null; e.target.src = FALLBACK; };

/* ─── Collapsible filter section ─────────────────────────────── */
const FilterSection = ({ title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ borderBottom: '1px solid #f0f0f0', padding: '14px 0' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'none', border: 'none', cursor: 'pointer', padding: 0,
          fontSize: 13, fontWeight: 700, color: '#111' }}
      >
        {title}
        {open ? <ChevronUp size={15} color="#aaa" /> : <ChevronDown size={15} color="#aaa" />}
      </button>
      {open && <div style={{ marginTop: 12 }}>{children}</div>}
    </div>
  );
};

/* ─── Skeleton card ──────────────────────────────────────────── */
const SkeletonCard = ({ list }) => (
  list
    ? <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #f0f0f0', padding: 16,
        display: 'flex', gap: 16, animation: 'pulse 1.5s ease-in-out infinite' }}>
        <div style={{ width: 120, height: 120, background: '#f3f4f6', borderRadius: 10, flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div style={{ height: 12, background: '#f3f4f6', borderRadius: 4, width: '70%', marginBottom: 10 }} />
          <div style={{ height: 10, background: '#f3f4f6', borderRadius: 4, width: '45%', marginBottom: 10 }} />
          <div style={{ height: 10, background: '#f3f4f6', borderRadius: 4, width: '60%', marginBottom: 16 }} />
          <div style={{ height: 32, background: '#f3f4f6', borderRadius: 8, width: 100 }} />
        </div>
      </div>
    : <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #f0f0f0', padding: 12,
        animation: 'pulse 1.5s ease-in-out infinite' }}>
        <div style={{ height: 140, background: '#f3f4f6', borderRadius: 8, marginBottom: 12 }} />
        <div style={{ height: 10, background: '#f3f4f6', borderRadius: 4, width: '75%', marginBottom: 8 }} />
        <div style={{ height: 10, background: '#f3f4f6', borderRadius: 4, width: '50%', marginBottom: 12 }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ height: 18, background: '#f3f4f6', borderRadius: 4, width: 56 }} />
          <div style={{ height: 32, width: 32, background: '#f3f4f6', borderRadius: 8 }} />
        </div>
      </div>
);

/* ─── Product card ───────────────────────────────────────────── */
const ProductCard = ({ product, view = 'grid' }) => {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const { convert, symbol } = useCurrency();
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const handleAdd = e => {
    e?.preventDefault?.();
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  if (view === 'list') {
    return (
      <div
        style={{ background: '#fff', borderRadius: 12, border: '1px solid #f0f0f0', padding: 16,
          display: 'flex', gap: 16, transition: 'box-shadow 0.2s, border-color 0.2s' }}
        onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.09)'; e.currentTarget.style.borderColor = '#bfdbfe'; }}
        onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#f0f0f0'; }}
      >
        <Link to={`/product/${product._id}`}
          style={{ width: 120, height: 120, flexShrink: 0, borderRadius: 10, overflow: 'hidden',
            background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src={product.image} alt={product.name} onError={onImgError}
            style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain', transition: 'transform 0.4s' }}
            onMouseEnter={e => e.target.style.transform = 'scale(1.08)'}
            onMouseLeave={e => e.target.style.transform = 'scale(1)'} />
        </Link>

        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <Link to={`/product/${product._id}`} style={{ textDecoration: 'none' }}>
              <p style={{ fontSize: 15, fontWeight: 700, color: '#111', lineHeight: 1.4, marginBottom: 6,
                overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                {product.name}
              </p>
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: 8 }}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={11}
                  style={{ fill: i < Math.floor(product.rating) ? '#facc15' : 'none',
                    color: i < Math.floor(product.rating) ? '#facc15' : '#e5e7eb' }} />
              ))}
              <span style={{ fontSize: 11, color: '#9ca3af', marginLeft: 4 }}>({product.numReviews} reviews)</span>
            </div>
            <p style={{ fontSize: 12, color: '#9ca3af', lineHeight: 1.5,
              overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
              {product.description}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginTop: 12, flexWrap: 'wrap', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontWeight: 700, fontSize: 18, color: '#111' }}>{symbol} {convert(product.price)}</span>
              {product.originalPrice && (
                <span style={{ fontSize: 12, color: '#aaa', textDecoration: 'line-through' }}>
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
              {discount && (
                <span style={{ fontSize: 10, fontWeight: 700, color: '#16a34a', background: '#f0fdf4',
                  border: '1px solid #bbf7d0', padding: '2px 8px', borderRadius: 99 }}>
                  -{discount}%
                </span>
              )}
            </div>
            <button
              onClick={handleAdd}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 8,
                border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 12,
                background: added ? '#16a34a' : '#2563eb', color: '#fff',
                transition: 'background 0.15s' }}
              onMouseEnter={e => { if (!added) e.currentTarget.style.background = '#1d4ed8'; }}
              onMouseLeave={e => { if (!added) e.currentTarget.style.background = added ? '#16a34a' : '#2563eb'; }}
            >
              <ShoppingCart size={13} />
              {added ? 'Added!' : 'Add to cart'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* grid card */
  return (
    <Link to={`/product/${product._id}`}
      style={{ background: '#fff', borderRadius: 12, border: '1px solid #f0f0f0', padding: 12,
        display: 'flex', flexDirection: 'column', textDecoration: 'none', position: 'relative',
        transition: 'box-shadow 0.2s, border-color 0.2s' }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.09)'; e.currentTarget.style.borderColor = '#bfdbfe'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#f0f0f0'; }}
    >
      {discount && (
        <span style={{ position: 'absolute', top: 10, left: 10, zIndex: 1, background: '#ef4444',
          color: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99 }}>
          -{discount}%
        </span>
      )}
      <div style={{ position: 'relative', marginBottom: 12, overflow: 'hidden', borderRadius: 8,
        background: '#f9fafb', height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img src={product.image} alt={product.name} onError={onImgError}
          style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain', transition: 'transform 0.4s' }}
          onMouseEnter={e => e.target.style.transform = 'scale(1.08)'}
          onMouseLeave={e => e.target.style.transform = 'scale(1)'} />
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 1, marginBottom: 4 }}>
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={10}
              style={{ fill: i < Math.floor(product.rating) ? '#facc15' : 'none',
                color: i < Math.floor(product.rating) ? '#facc15' : '#e5e7eb' }} />
          ))}
          <span style={{ fontSize: 10, color: '#9ca3af', marginLeft: 4 }}>({product.numReviews})</span>
        </div>
        <p style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a', lineHeight: 1.4, marginBottom: 8, flex: 1,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {product.name}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
          <span style={{ fontWeight: 700, color: '#111827', fontSize: 15 }}>{symbol} {convert(product.price)}</span>
          <button
            onClick={e => { e.preventDefault(); handleAdd(); showToast.success("Item Added to Cart") }}
            style={{ width: 32, height: 32, borderRadius: 8, border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: added ? '#16a34a' : '#eff6ff', color: added ? '#fff' : '#2563eb',
              transition: 'background 0.15s, color 0.15s' }}
            onMouseEnter={e => { if (!added) { e.currentTarget.style.background = '#2563eb'; e.currentTarget.style.color = '#fff'; } }}
            onMouseLeave={e => { if (!added) { e.currentTarget.style.background = '#eff6ff'; e.currentTarget.style.color = '#2563eb'; } }}
          >
            <ShoppingCart size={14} />
          </button>
        </div>
      </div>
    </Link>
  );
};

/* shared sidebar content */
  
const SidebarContent = ({ onClose, category, updateParam, priceMin, setPriceMin, priceMax, setPriceMax, applyPrice, hasFilters, setSearchParams }) => (
    <div>
      <FilterSection title="Category">
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {CATEGORIES.map(cat => {
            const active = category === cat || (cat === 'All' && !category);
            return (
              <li key={cat}>
                <button
                  onClick={() => { updateParam('category', cat === 'All' ? '' : cat); onClose?.(); }}
                  style={{ width: '100%', textAlign: 'left', padding: '8px 10px', borderRadius: 8,
                    border: 'none', cursor: 'pointer', fontSize: 13,
                    fontWeight: active ? 700 : 400,
                    color: active ? '#2563eb' : '#555',
                    background: active ? '#eff6ff' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    transition: 'background 0.15s, color 0.15s' }}
                  onMouseEnter={e => { if (!active) { e.currentTarget.style.background = '#f9fafb'; e.currentTarget.style.color = '#2563eb'; } }}
                  onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#555'; } }}
                >
                  <span>{cat}</span>
                  {active && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#2563eb' }} />}
                </button>
              </li>
            );
          })}
        </ul>
      </FilterSection>

      <FilterSection title="Price range">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 10, fontWeight: 600, color: '#aaa', textTransform: 'uppercase',
                letterSpacing: '0.05em', marginBottom: 5, margin: '0 0 5px' }}>Min ($)</p>
              <input type="number" placeholder="0" value={priceMin}
                onChange={e => setPriceMin(e.target.value)}
                style={{ width: '100%', padding: '8px 10px', border: '1px solid #e5e7eb',
                  borderRadius: 8, fontSize: 13, outline: 'none', boxSizing: 'border-box', color: '#333' }} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 10, fontWeight: 600, color: '#aaa', textTransform: 'uppercase',
                letterSpacing: '0.05em', margin: '0 0 5px' }}>Max ($)</p>
              <input type="number" placeholder="∞" value={priceMax}
                onChange={e => setPriceMax(e.target.value)}
                style={{ width: '100%', padding: '8px 10px', border: '1px solid #e5e7eb',
                  borderRadius: 8, fontSize: 13, outline: 'none', boxSizing: 'border-box', color: '#333' }} />
            </div>
          </div>
          <button onClick={applyPrice}
            style={{ width: '100%', padding: '9px', borderRadius: 8, border: '1px solid #e5e7eb',
              background: '#fff', color: '#2563eb', fontWeight: 700, fontSize: 12, cursor: 'pointer',
              transition: 'background 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.background = '#eff6ff'}
            onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
            Apply range
          </button>
        </div>
      </FilterSection>

      <FilterSection title="Condition">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {['Any', 'Brand new', 'Refurbished', 'Old items'].map(c => (
            <label key={c} style={{ display: 'flex', alignItems: 'center', gap: 8,
              fontSize: 13, color: '#555', cursor: 'pointer' }}>
              <input type="radio" name="condition" value={c}
                style={{ accentColor: '#2563eb', width: 14, height: 14 }} />
              {c}
            </label>
          ))}
        </div>
      </FilterSection>

      {hasFilters && (
        <button
          onClick={() => { setSearchParams({}); onClose?.(); }}
          style={{ width: '100%', marginTop: 8, padding: '9px', borderRadius: 8,
            border: '1px solid #fee2e2', background: '#fff', color: '#ef4444',
            fontWeight: 600, fontSize: 12, cursor: 'pointer', transition: 'background 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
          onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
          Clear all filters
        </button>
      )}
    </div>
  );

/* ─── Main page ──────────────────────────────────────────────── */
const ProductList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [total,    setTotal]    = useState(0);
  const [pages,    setPages]    = useState(1);
  const [loading,  setLoading]  = useState(true);
  const [view,     setView]     = useState('grid');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const search   = searchParams.get('search')   || '';
  const category = searchParams.get('category') || 'All';
  const sort     = searchParams.get('sort')     || 'newest';
  const page     = Number(searchParams.get('page') || 1);
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  const [priceMin, setPriceMin] = useState(minPrice);
  const [priceMax, setPriceMax] = useState(maxPrice);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value); else next.delete(key);
    if (key !== 'page') next.set('page', '1');
    setSearchParams(next);
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 20, sort };
      if (search)   params.search   = search;
      if (category && category !== 'All') params.category = category;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      const { data } = await productService.getProducts(params);
      setProducts(data.products || []);
      setTotal(data.total || 0);
      setPages(data.pages  || 1);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
      window.scrollTo(0, 0);
    }
  }, [search, category, sort, page, minPrice, maxPrice]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  const applyPrice = () => {
    const next = new URLSearchParams(searchParams);
    if (priceMin) next.set('minPrice', priceMin); else next.delete('minPrice');
    if (priceMax) next.set('maxPrice', priceMax); else next.delete('maxPrice');
    next.set('page', '1');
    setSearchParams(next);
    setDrawerOpen(false);
  };

  const hasFilters = (category && category !== 'All') || minPrice || maxPrice || search;

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

        {/* Page title row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: '#111', margin: 0 }}>
              {search ? `Results for "${search}"` : category === 'All' ? 'All Products' : category}
            </h1>
            {!loading && (
              <p style={{ fontSize: 12, color: '#aaa', marginTop: 4 }}>
                {total.toLocaleString()} {total === 1 ? 'item' : 'items'} found
              </p>
            )}
          </div>
        </div>

        {/* Layout */}
        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>

          {/* Desktop sidebar */}
          <aside className="hidden lg:block"
            style={{ width: 210, flexShrink: 0, background: '#fff',
              border: '1px solid #e5e7eb', borderRadius: 16, padding: '16px 16px 8px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)', position: 'sticky', top: 20 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#111', margin: '0 0 4px' }}>Filters</p>
            <SidebarContent
              category={category}
              updateParam={updateParam}
              priceMin={priceMin}
              setPriceMin={setPriceMin}
              priceMax={priceMax}
              setPriceMax={setPriceMax}
              applyPrice={applyPrice}
              hasFilters={hasFilters}
              setSearchParams={setSearchParams}
            />
          </aside>

          {/* Main content */}
          <div style={{ flex: 1, minWidth: 0 }}>

            {/* Toolbar */}
            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12,
              padding: '10px 14px', marginBottom: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>

              {/* Mobile filter button */}
              <button
                className="lg:hidden"
                onClick={() => setDrawerOpen(true)}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px',
                  borderRadius: 8, border: '1px solid #e5e7eb', background: '#fff',
                  fontSize: 12, fontWeight: 600, color: '#555', cursor: 'pointer',
                  transition: 'border-color 0.15s, color 0.15s', position: 'relative' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#2563eb'; e.currentTarget.style.color = '#2563eb'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.color = '#555'; }}
              >
                <SlidersHorizontal size={13} /> Filters
                {hasFilters && (
                  <span style={{ position: 'absolute', top: 5, right: 5, width: 6, height: 6,
                    borderRadius: '50%', background: '#2563eb' }} />
                )}
              </button>

              {/* Active filter chips */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', flex: 1 }}>
                {category && category !== 'All' && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11,
                    fontWeight: 600, color: '#2563eb', background: '#eff6ff',
                    border: '1px solid #bfdbfe', padding: '3px 10px', borderRadius: 99 }}>
                    {category}
                    <button onClick={() => updateParam('category', '')}
                      style={{ background: 'none', border: 'none', cursor: 'pointer',
                        color: '#2563eb', display: 'flex', padding: 0, marginLeft: 2 }}>
                      <X size={10} />
                    </button>
                  </span>
                )}
                {(minPrice || maxPrice) && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11,
                    fontWeight: 600, color: '#2563eb', background: '#eff6ff',
                    border: '1px solid #bfdbfe', padding: '3px 10px', borderRadius: 99 }}>
                    ${minPrice || '0'} – ${maxPrice || '∞'}
                    <button onClick={() => {
                      setPriceMin(''); setPriceMax('');
                      const n = new URLSearchParams(searchParams);
                      n.delete('minPrice'); n.delete('maxPrice'); setSearchParams(n);
                    }} style={{ background: 'none', border: 'none', cursor: 'pointer',
                      color: '#2563eb', display: 'flex', padding: 0, marginLeft: 2 }}>
                      <X size={10} />
                    </button>
                  </span>
                )}
              </div>

              {/* Sort + view — pushed right */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 12, color: '#aaa', whiteSpace: 'nowrap' }}>Sort:</span>
                  <select value={sort} onChange={e => updateParam('sort', e.target.value)}
                    style={{ padding: '6px 10px', border: '1px solid #e5e7eb', borderRadius: 8,
                      fontSize: 12, background: '#fff', outline: 'none', color: '#333', cursor: 'pointer' }}>
                    {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div style={{ display: 'flex', background: '#f3f4f6', borderRadius: 8, padding: 3 }}>
                  {[{ v: 'grid', Icon: LayoutGrid }, { v: 'list', Icon: List }].map(({ v, Icon }) => (
                    <button key={v} onClick={() => setView(v)}
                      style={{ width: 30, height: 30, borderRadius: 6, border: 'none', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: view === v ? '#fff' : 'transparent',
                        color: view === v ? '#2563eb' : '#9ca3af',
                        boxShadow: view === v ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                        transition: 'background 0.15s, color 0.15s' }}>
                      <Icon size={15} />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Products */}
            {loading ? (
              <div style={view === 'grid'
                ? { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16 }
                : { display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[...Array(8)].map((_, i) => <SkeletonCard key={i} list={view === 'list'} />)}
              </div>
            ) : products.length === 0 ? (
              <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16,
                padding: '80px 24px', textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <div style={{ width: 64, height: 64, background: '#f3f4f6', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <PackageSearch size={28} color="#9ca3af" />
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#374151', marginBottom: 8 }}>No products found</h3>
                <p style={{ color: '#9ca3af', fontSize: 13, maxWidth: 280, margin: '0 auto 20px' }}>
                  Try adjusting or clearing your filters.
                </p>
                <button onClick={() => setSearchParams({})}
                  style={{ background: '#2563eb', color: '#fff', fontWeight: 600, fontSize: 13,
                    padding: '10px 24px', borderRadius: 8, border: 'none', cursor: 'pointer',
                    transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#1d4ed8'}
                  onMouseLeave={e => e.currentTarget.style.background = '#2563eb'}>
                  Clear all filters
                </button>
              </div>
            ) : (
              <div style={view === 'grid'
                ? { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16 }
                : { display: 'flex', flexDirection: 'column', gap: 12 }}>
                {products.map(p => <ProductCard key={p._id} product={p} view={view} />)}
              </div>
            )}

            {/* Pagination */}
            {pages > 1 && !loading && (
              <div style={{ marginTop: 36, display: 'flex', justifyContent: 'center', gap: 4 }}>
                <button disabled={page === 1} onClick={() => updateParam('page', page - 1)}
                  style={{ width: 36, height: 36, borderRadius: 8, border: '1px solid #e5e7eb',
                    background: '#fff', cursor: page === 1 ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    opacity: page === 1 ? 0.4 : 1, transition: 'background 0.15s' }}
                  onMouseEnter={e => { if (page !== 1) e.currentTarget.style.background = '#f9fafb'; }}
                  onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                  <ChevronLeft size={16} color="#555" />
                </button>

                {pageNums().map((p, i) =>
                  p === '…'
                    ? <span key={`e${i}`} style={{ width: 36, height: 36, display: 'flex',
                        alignItems: 'center', justifyContent: 'center', color: '#aaa', fontSize: 13 }}>…</span>
                    : <button key={p} onClick={() => updateParam('page', p)}
                        style={{ width: 36, height: 36, borderRadius: 8, fontWeight: 700, fontSize: 13,
                          border: '1px solid', cursor: 'pointer',
                          borderColor: page === p ? '#2563eb' : '#e5e7eb',
                          background: page === p ? '#2563eb' : '#fff',
                          color: page === p ? '#fff' : '#555',
                          transition: 'background 0.15s, color 0.15s, border-color 0.15s' }}
                        onMouseEnter={e => { if (page !== p) { e.currentTarget.style.background = '#f9fafb'; e.currentTarget.style.borderColor = '#bfdbfe'; } }}
                        onMouseLeave={e => { if (page !== p) { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#e5e7eb'; } }}>
                        {p}
                      </button>
                )}

                <button disabled={page === pages} onClick={() => updateParam('page', page + 1)}
                  style={{ width: 36, height: 36, borderRadius: 8, border: '1px solid #e5e7eb',
                    background: '#fff', cursor: page === pages ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    opacity: page === pages ? 0.4 : 1, transition: 'background 0.15s' }}
                  onMouseEnter={e => { if (page !== pages) e.currentTarget.style.background = '#f9fafb'; }}
                  onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                  <ChevronRight size={16} color="#555" />
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Mobile filter drawer */}
      {drawerOpen && (
        <>
          <div onClick={() => setDrawerOpen(false)}
            style={{ position: 'fixed', inset: 0, zIndex: 40, background: 'rgba(0,0,0,0.4)',
              backdropFilter: 'blur(2px)' }} />
          <div style={{ position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 50,
            background: '#fff', borderRadius: '20px 20px 0 0',
            boxShadow: '0 -8px 40px rgba(0,0,0,0.15)',
            maxHeight: '85dvh', display: 'flex', flexDirection: 'column' }}>
            {/* drag handle */}
            <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}>
              <div style={{ width: 40, height: 4, borderRadius: 99, background: '#e5e7eb' }} />
            </div>
            {/* header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '8px 20px 12px', borderBottom: '1px solid #f0f0f0', flexShrink: 0 }}>
              <p style={{ fontWeight: 700, fontSize: 15, color: '#111', margin: 0 }}>Filters</p>
              <button onClick={() => setDrawerOpen(false)}
                style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid #e5e7eb',
                  background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', transition: 'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#f3f4f6'}
                onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                <X size={15} color="#555" />
              </button>
            </div>
            {/* scrollable body */}
            <div style={{ overflowY: 'auto', padding: '4px 20px 32px', WebkitOverflowScrolling: 'touch' }}>
              <SidebarContent
                onClose={() => setDrawerOpen(false)}
                category={category}
                updateParam={updateParam}
                priceMin={priceMin}
                setPriceMin={setPriceMin}
                priceMax={priceMax}
                setPriceMax={setPriceMax}
                applyPrice={applyPrice}
                hasFilters={hasFilters}
                setSearchParams={setSearchParams}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ProductList;
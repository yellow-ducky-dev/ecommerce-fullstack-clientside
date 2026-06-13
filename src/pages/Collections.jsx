import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Grid3X3, PackageSearch } from 'lucide-react';
import { productService } from '../api/services';

const FALLBACK = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23f3f4f6' width='400' height='300'/%3E%3C/svg%3E";
const onImgError = e => { e.target.onerror = null; e.target.src = FALLBACK; };

/* Hero images per category — Unsplash */
const CAT_META = {
  'Automobiles':       { img: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80&fit=crop&auto=format', color: '#1e3a5f' },
  'Clothes and wear':  { img: 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=600&q=80&fit=crop&auto=format', color: '#3b1f5e' },
  'Home interiors':    { img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80&fit=crop&auto=format', color: '#1a3a2f' },
  'Computer and tech': { img: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80&fit=crop&auto=format', color: '#1a2e4a' },
  'Tools, equipments': { img: 'https://images.unsplash.com/photo-1581147036324-c47a03a81d48?w=600&q=80&fit=crop&auto=format', color: '#2d1f0e' },
  'Sports and outdoor':{ img: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&q=80&fit=crop&auto=format', color: '#1a3d1a' },
  'Animal and pets':   { img: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&q=80&fit=crop&auto=format', color: '#3d2b1a' },
  'Machinery':         { img: 'https://images.unsplash.com/photo-1565514020179-026b92b84bb6?w=600&q=80&fit=crop&auto=format', color: '#1f2937' },
};

const DEFAULT_META = { img: FALLBACK, color: '#1f2937' };

/* ── Category card ────────────────────────────────────────────── */
const CategoryCard = ({ name, count, featured }) => {
  const meta = CAT_META[name] || DEFAULT_META;
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      to={`/products?category=${encodeURIComponent(name)}`}
      style={{ textDecoration: 'none', display: 'block', borderRadius: 16,
        overflow: 'hidden', border: '1px solid #f0f0f0',
        boxShadow: hovered ? '0 12px 32px rgba(0,0,0,0.13)' : '0 1px 4px rgba(0,0,0,0.06)',
        transform: hovered ? 'translateY(-3px)' : 'none',
        transition: 'box-shadow 0.2s, transform 0.2s' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div style={{ height: featured ? 220 : 160, position: 'relative', overflow: 'hidden',
        background: meta.color }}>
        <img src={meta.img} alt={name} onError={onImgError}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block',
            transform: hovered ? 'scale(1.06)' : 'scale(1)', transition: 'transform 0.5s',
            opacity: 0.85 }} />
        {/* dark gradient */}
        <div style={{ position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)' }} />
        {/* name overlay */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px 18px' }}>
          <h3 style={{ color: '#fff', fontWeight: 800, fontSize: featured ? 18 : 15,
            margin: 0, lineHeight: 1.2, textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>
            {name}
          </h3>
          {count !== null && (
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: 600,
              margin: '4px 0 0', letterSpacing: '0.04em' }}>
              {count} {count === 1 ? 'product' : 'products'}
            </p>
          )}
        </div>
      </div>

      {/* Footer row */}
      <div style={{ background: '#fff', padding: '12px 18px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#555' }}>Browse collection</span>
        <div style={{ width: 28, height: 28, borderRadius: '50%',
          background: hovered ? '#2563eb' : '#eff6ff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background 0.2s' }}>
          <ChevronRight size={14} color={hovered ? '#fff' : '#2563eb'} />
        </div>
      </div>
    </Link>
  );
};

/* ── Main page ────────────────────────────────────────────────── */
const Collections = () => {
  const [categories, setCategories] = useState([]);
  const [counts, setCounts]         = useState({});
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    (async () => {
      try {
        /* fetch categories list */
        const catRes = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products/categories`);
        const cats   = await catRes.json();
        setCategories(cats);

        /* fetch product counts per category in parallel */
        const countResults = await Promise.all(
          cats.map(cat =>
            fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products?category=${encodeURIComponent(cat)}&limit=1`)
              .then(r => r.json())
              .then(d => ({ cat, count: d.total || 0 }))
              .catch(() => ({ cat, count: null }))
          )
        );
        const map = {};
        countResults.forEach(({ cat, count }) => { map[cat] = count; });
        setCounts(map);
      } catch (err) {
        console.error('Failed to load categories:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* skeleton */
  const Skeleton = ({ h = 200 }) => (
    <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid #f0f0f0',
      animation: 'pulse 1.5s ease-in-out infinite' }}>
      <div style={{ height: h, background: '#f3f4f6' }} />
      <div style={{ background: '#fff', padding: '12px 18px', display: 'flex',
        alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ height: 12, width: 100, background: '#f3f4f6', borderRadius: 4 }} />
        <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#f3f4f6' }} />
      </div>
    </div>
  );

  /* split: first 2 = featured (larger), rest = regular grid */
  const featured = categories.slice(0, 2);
  const rest      = categories.slice(2);

  return (
    <>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}`}</style>

      <main style={{ maxWidth: 1240, margin: '0 auto', padding: '24px 16px',
        display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* Breadcrumb */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 6,
          fontSize: 11, fontWeight: 600, color: '#aaa',
          textTransform: 'uppercase', letterSpacing: '0.07em' }}>
          <Link to="/" style={{ textDecoration: 'none', color: '#aaa', transition: 'color 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.color = '#2563eb'}
            onMouseLeave={e => e.currentTarget.style.color = '#aaa'}>Home</Link>
          <ChevronRight size={11} />
          <span style={{ color: '#111' }}>Collections</span>
        </nav>

        {/* Header */}
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16,
          padding: '28px 28px 24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, background: '#eff6ff', borderRadius: 12,
              display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Grid3X3 size={22} color="#2563eb" />
            </div>
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 800, color: '#111', margin: 0 }}>
                All Collections
              </h1>
              <p style={{ fontSize: 12, color: '#aaa', margin: '3px 0 0' }}>
                Browse products by category
              </p>
            </div>
          </div>
          {!loading && (
            <span style={{ background: '#eff6ff', color: '#2563eb', fontSize: 12,
              fontWeight: 700, padding: '4px 14px', borderRadius: 99,
              border: '1px solid #bfdbfe' }}>
              {categories.length} categories
            </span>
          )}
        </div>

        {loading ? (
          <>
            {/* featured skeleton */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
              <Skeleton h={220} /><Skeleton h={220} />
            </div>
            {/* regular skeleton */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
              {[...Array(6)].map((_, i) => <Skeleton key={i} h={160} />)}
            </div>
          </>
        ) : categories.length === 0 ? (
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16,
            padding: '80px 24px', textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ width: 56, height: 56, background: '#f3f4f6', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <PackageSearch size={26} color="#9ca3af" />
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#374151', marginBottom: 8 }}>
              No collections found
            </h3>
            <p style={{ color: '#9ca3af', fontSize: 13, maxWidth: 280, margin: '0 auto' }}>
              Add some products to see categories appear here.
            </p>
          </div>
        ) : (
          <>
            {/* Featured row (first 2 — larger cards) */}
            {featured.length > 0 && (
              <div style={{ display: 'grid',
                gridTemplateColumns: `repeat(${Math.min(featured.length, 2)}, 1fr)`, gap: 16 }}>
                {featured.map(cat => (
                  <CategoryCard key={cat} name={cat} count={counts[cat] ?? null} featured />
                ))}
              </div>
            )}

            {/* Rest grid */}
            {rest.length > 0 && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#111', margin: 0 }}>
                    More categories
                  </p>
                  <div style={{ flex: 1, height: 1, background: '#f0f0f0' }} />
                </div>
                <div style={{ display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
                  {rest.map(cat => (
                    <CategoryCard key={cat} name={cat} count={counts[cat] ?? null} />
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {/* CTA strip */}
        {!loading && categories.length > 0 && (
          <div style={{ background: '#1f2937', borderRadius: 16, padding: '24px 28px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}>
            <div>
              <h3 style={{ color: '#fff', fontWeight: 800, fontSize: 16, margin: '0 0 4px' }}>
                Can't find what you're looking for?
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, margin: 0 }}>
                Browse all products or use the search bar above.
              </p>
            </div>
            <Link to="/products"
              style={{ background: '#2563eb', color: '#fff', fontWeight: 700, fontSize: 13,
                padding: '11px 24px', borderRadius: 10, textDecoration: 'none',
                display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap',
                transition: 'background 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#1d4ed8'}
              onMouseLeave={e => e.currentTarget.style.background = '#2563eb'}>
              View all products <ChevronRight size={15} />
            </Link>
          </div>
        )}
      </main>
    </>
  );
};

export default Collections;
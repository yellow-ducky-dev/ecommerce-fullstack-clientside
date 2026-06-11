import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Send, Archive, ShoppingCart, Star, User, ChevronRight, Clock, Zap } from 'lucide-react';
import { productService } from '../api/services';
import { useCart } from '../context/CartContext';

const CATEGORIES = [
  'Automobiles', 'Clothes and wear', 'Home interiors', 'Computer and tech',
  'Tools, equipments', 'Sports and outdoor', 'Animal and pets', 'Machinery',
];

const DEALS = [
  { name: 'Smart watches', discount: '-25%', img: 'https://images.unsplash.com/photo-1546868891-fb45942470c6?w=300&q=80&fit=crop' },
  { name: 'Laptops',       discount: '-15%', img: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&q=80&fit=crop' },
  { name: 'GoPro cameras', discount: '-40%', img: 'https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?w=300&q=80&fit=crop' },
  { name: 'Headphones',    discount: '-25%', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80&fit=crop' },
  { name: 'Canon cameras', discount: '-25%', img: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300&q=80&fit=crop' },
];

const HOME_ITEMS = [
  { name: 'Soft chairs',    price: '19',  img: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=200&q=80&fit=crop' },
  { name: 'Kitchen dishes', price: '19',  img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&q=80&fit=crop' },
  { name: 'Home interior',  price: '19',  img: 'https://images.unsplash.com/photo-1560440021-33f9b867899d?w=200&q=80&fit=crop' },
  { name: 'Kitchen mixer',  price: '100', img: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&q=80&fit=crop' },
  { name: 'Blenders',       price: '39',  img: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=200&q=80&fit=crop' },
  { name: 'Home appliance', price: '19',  img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80&fit=crop' },
  { name: 'Coffee maker',   price: '10',  img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200&q=80&fit=crop' },
  { name: 'Luxury sofa',    price: '19',  img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&q=80&fit=crop' },
];

const SERVICES = [
  { title: 'Source from Industry Hubs',  icon: Archive,    img: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&q=80&fit=crop' },
  { title: 'Customize Your Products',    icon: ShoppingCart, img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80&fit=crop' },
  { title: 'Fast, reliable shipping',    icon: Zap,        img: 'https://images.unsplash.com/photo-1566576721346-d4a3b4eaad5b?w=400&q=80&fit=crop' },
  { title: 'Product monitoring',         icon: ShieldCheck, img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80&fit=crop' },
];

const SkeletonCard = () => (
  <div className="bg-white rounded-xl border border-gray-100 p-3 space-y-3 animate-pulse">
    <div className="bg-gray-100 rounded-lg h-36 w-full" />
    <div className="bg-gray-100 rounded h-3 w-3/4" />
    <div className="bg-gray-100 rounded h-3 w-1/2" />
    <div className="flex justify-between items-center pt-1">
      <div className="bg-gray-100 rounded h-5 w-16" />
      <div className="bg-gray-100 rounded-lg h-8 w-8" />
    </div>
  </div>
);

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <Link to={`/product/${product._id}`}
      className="bg-white rounded-xl border border-gray-100 p-3 flex flex-col group hover:shadow-lg hover:border-blue-100 transition-all duration-200">
      <div className="relative mb-3 overflow-hidden rounded-lg bg-gray-50 h-36 flex items-center justify-center">
        <img src={product.image} alt={product.name}
          className="max-h-full w-auto object-contain transition-transform duration-500 group-hover:scale-110"
          onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80&fit=crop'; }} />
        {discount && (
          <span className="absolute top-2 left-2 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            -{discount}%
          </span>
        )}
      </div>
      <div className="flex-1 flex flex-col">
        <div className="flex items-center gap-0.5 mb-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={10} className={i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'} />
          ))}
          <span className="text-[10px] text-gray-400 ml-1">({product.numReviews})</span>
        </div>
        <p className="text-gray-800 text-sm font-medium line-clamp-2 mb-2 flex-1 leading-snug">{product.name}</p>
        <div className="flex items-center justify-between mt-auto">
          <span className="font-bold text-gray-900">${product.price.toFixed(2)}</span>
          <button onClick={(e) => { e.preventDefault(); addToCart(product, 1); }}
            className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors">
            <ShoppingCart size={14} />
          </button>
        </div>
      </div>
    </Link>
  );
};

const Home = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(false);
  const [countdown, setCountdown]     = useState({ days: 4, hours: 13, mins: 34, secs: 56 });

  useEffect(() => {
    (async () => {
      try {
        const res = await productService.getProducts({ limit: 12 });
        setAllProducts(res.data.products || []);
      } catch { setError(true); }
      finally  { setLoading(false); }
    })();
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setCountdown(p => {
        let { days: d, hours: h, mins: m, secs: s } = p;
        s--; if (s < 0) { s = 59; m--; } if (m < 0) { m = 59; h--; } if (h < 0) { h = 23; d--; } if (d < 0) d = h = m = s = 0;
        return { days: d, hours: h, mins: m, secs: s };
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <main style={{ maxWidth: 1370, margin: '0 auto', padding: '24px 16px' }} className="space-y-5">

      {/* ═══ HERO ═══ */}
      <section className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div style={{ display: 'flex', minHeight: 380 }}>

          {/* Sidebar */}
          <div style={{ width: 240, flexShrink: 0, borderRight: '1px solid #f0f0f0' }}
               className="hidden lg:block py-2">
            {CATEGORIES.map((cat, i) => (
              <Link key={i} to={`/products?category=${encodeURIComponent(cat)}`}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 16px', fontSize: 13, fontWeight: 500, color: i === 1 ? '#0D6EFD' : '#555', background: i === 1 ? '#EFF6FF' : 'transparent', transition: 'background 0.15s' }}
                onMouseEnter={e => { if (i !== 1) e.currentTarget.style.background = '#f9fafb'; e.currentTarget.style.color = '#0D6EFD'; }}
                onMouseLeave={e => { if (i !== 1) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#555'; } }}>
                <span>{cat}</span>
                <ChevronRight size={13} style={{ opacity: 0.4 }} />
              </Link>
            ))}
          </div>

          {/* Banner */}
          <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
            <img src="https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=1200&q=85&fit=crop"
              alt="Hero" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)',
              display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 48px' }}>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, fontWeight: 500, marginBottom: 8 }}>Latest trending</p>
              <h1 style={{ color: '#fff', fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 900, lineHeight: 1.1, marginBottom: 24 }}>
                Electronic<br />items
              </h1>
              <Link to="/products" style={{ display: 'inline-block', background: '#fff', color: '#1a1a1a', fontWeight: 600,
                fontSize: 13, padding: '10px 24px', borderRadius: 8, width: 'fit-content', transition: 'background 0.2s' }}>
                Learn more
              </Link>
            </div>
          </div>

          {/* User widget */}
          <div style={{ width: 240, flexShrink: 0, borderLeft: '1px solid #f0f0f0', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}
               className="hidden xl:flex">
            <div style={{ background: '#EFF6FF', borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 40, height: 40, background: '#CBD5E1', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <User size={18} color="#fff" />
                </div>
                <div>
                  <p style={{ fontWeight: 600, fontSize: 13, color: '#1a1a1a', lineHeight: 1.3 }}>Hi, user</p>
                  <p style={{ fontSize: 11, color: '#888' }}>let's get started</p>
                </div>
              </div>
              <Link to="/register" style={{ background: '#0D6EFD', color: '#fff', textAlign: 'center', padding: '8px', borderRadius: 8, fontSize: 12, fontWeight: 600, display: 'block' }}>
                Join now
              </Link>
              <Link to="/login" style={{ background: '#fff', color: '#444', textAlign: 'center', padding: '8px', borderRadius: 8, fontSize: 12, fontWeight: 600, border: '1px solid #e5e7eb', display: 'block' }}>
                Log in
              </Link>
            </div>
            <div style={{ background: '#F97316', borderRadius: 12, padding: '12px 14px', color: '#fff' }}>
              <p style={{ fontSize: 12, fontWeight: 600, lineHeight: 1.4 }}>Get US $10 off with a new supplier</p>
            </div>
            <div style={{ background: '#3B82F6', borderRadius: 12, padding: '12px 14px', color: '#fff' }}>
              <p style={{ fontSize: 12, lineHeight: 1.4 }}>Send quotes with supplier preferences</p>
            </div>
          </div>

        </div>
      </section>

      {/* ═══ FLASH DEALS ═══ */}
      <section className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div style={{ display: 'flex' }}>

          {/* Countdown */}
          <div style={{ width: 200, flexShrink: 0, padding: '24px 20px', borderRight: '1px solid #f0f0f0', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 12 }}>
            <div>
              <h3 style={{ fontWeight: 700, fontSize: 15, color: '#1a1a1a' }}>Deals and offers</h3>
              <p style={{ fontSize: 12, color: '#aaa', marginTop: 2 }}>Hygiene equipments</p>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {[{ v: countdown.days, l: 'DAYS' }, { v: countdown.hours, l: 'HRS' }, { v: countdown.mins, l: 'MIN' }, { v: countdown.secs, l: 'SEC' }].map((t, i) => (
                <div key={i} style={{ flex: 1, background: '#1f2937', borderRadius: 8, padding: '8px 4px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ color: '#fff', fontWeight: 700, fontSize: 15, lineHeight: 1 }}>{String(t.v).padStart(2, '0')}</span>
                  <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 8, fontWeight: 700, marginTop: 3, letterSpacing: '0.05em' }}>{t.l}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Deal cards */}
          <div style={{ flex: 1, overflowX: 'auto' }}>
            <div style={{ display: 'flex', minWidth: 'max-content', height: '100%' }}>
              {DEALS.map((item, i) => (
                <Link key={i} to="/products"
                  style={{ width: 148, padding: '20px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
                    borderRight: '1px solid #f0f0f0', textDecoration: 'none', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <div style={{ width: 90, height: 90, borderRadius: 10, overflow: 'hidden', marginBottom: 10, background: '#f8f8f8' }}>
                    <img src={item.img} alt={item.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&q=80'; }} />
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#333', marginBottom: 6, lineHeight: 1.3 }}>{item.name}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#ef4444', background: '#fef2f2', padding: '2px 10px', borderRadius: 99, border: '1px solid #fee2e2' }}>
                    {item.discount}
                  </span>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ═══ HOME & INTERIORS ═══ */}
      <section className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div style={{ display: 'flex' }}>

          {/* Banner */}
          <div style={{ width: 200, flexShrink: 0, position: 'relative', minHeight: 220 }}>
            <img src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80&fit=crop"
              alt="Interiors" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.38)', padding: 20, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <h3 style={{ color: '#fff', fontSize: 17, fontWeight: 800, lineHeight: 1.3 }}>Home and<br />interiors</h3>
              <Link to="/products" style={{ background: '#fff', color: '#222', fontSize: 11, fontWeight: 600, padding: '6px 14px', borderRadius: 6, display: 'inline-block', width: 'fit-content' }}>
                Source now
              </Link>
            </div>
          </div>

          {/* Grid */}
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', minWidth: 0 }}>
            {HOME_ITEMS.map((item, i) => (
              <Link key={i} to="/products"
                style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
                  borderBottom: i < 4 ? '1px solid #f0f0f0' : 'none',
                  borderRight: (i + 1) % 4 !== 0 ? '1px solid #f0f0f0' : 'none',
                  textDecoration: 'none', transition: 'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 500, color: '#333', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</p>
                  <p style={{ fontSize: 11, color: '#aaa', marginTop: 2 }}>From USD {item.price}</p>
                </div>
                <div style={{ width: 52, height: 52, borderRadius: 8, overflow: 'hidden', flexShrink: 0, background: '#f5f5f5' }}>
                  <img src={item.img} alt={item.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=100&q=80'; }} />
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* ═══ RECOMMENDED ═══ */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a' }}>Recommended items</h3>
          <Link to="/products" style={{ fontSize: 13, color: '#0D6EFD', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
            View all <ChevronRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {[...Array(12)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : error || allProducts.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl py-16 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart size={28} className="text-gray-400" />
            </div>
            <h4 className="text-lg font-bold text-gray-700 mb-2">No products available</h4>
            <p className="text-gray-500 text-sm max-w-xs mx-auto px-4">
              {error ? 'Could not connect to the server. Start the backend and refresh.' : 'Products will appear here once added.'}
            </p>
            {error && (
              <button onClick={() => window.location.reload()}
                className="mt-5 bg-blue-600 text-white text-sm font-semibold px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors">
                Retry
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {allProducts.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </section>

      {/* ═══ CTA / INQUIRY ═══ */}
      <section style={{ background: 'linear-gradient(135deg, #1a7fff 0%, #0047d4 100%)', borderRadius: 16, padding: '48px 40px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg,rgba(255,255,255,0.08) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center' }} className="max-lg:grid-cols-1">
          <div>
            <h2 style={{ color: '#fff', fontSize: 'clamp(22px, 3vw, 36px)', fontWeight: 800, lineHeight: 1.2, marginBottom: 12 }}>
              An easy way to send requests<br />to all suppliers
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, maxWidth: 380 }}>
              Connect with verified global suppliers. One request, multiple quotes, fast sourcing.
            </p>
          </div>
          <div style={{ background: '#fff', borderRadius: 16, padding: 28, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <h4 style={{ fontWeight: 700, fontSize: 15, color: '#1a1a1a', marginBottom: 16 }}>Send quote to suppliers</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input type="text" placeholder="What item do you need?"
                style={{ width: '100%', padding: '10px 14px', border: '1px solid #e5e7eb', borderRadius: 10, fontSize: 13, outline: 'none', color: '#333' }} />
              <textarea placeholder="Type more details..."
                style={{ width: '100%', padding: '10px 14px', border: '1px solid #e5e7eb', borderRadius: 10, fontSize: 13, outline: 'none', height: 72, resize: 'none', color: '#333' }} />
              <div style={{ display: 'flex', gap: 8 }}>
                <input type="text" placeholder="Quantity"
                  style={{ flex: 1, padding: '10px 14px', border: '1px solid #e5e7eb', borderRadius: 10, fontSize: 13, outline: 'none' }} />
                <select style={{ flex: 1, padding: '10px 14px', border: '1px solid #e5e7eb', borderRadius: 10, fontSize: 13, background: '#fff', outline: 'none', color: '#555' }}>
                  <option>Pcs</option><option>Kg</option><option>Box</option>
                </select>
              </div>
              <button style={{ width: '100%', background: '#0D6EFD', color: '#fff', fontWeight: 600, fontSize: 13, padding: '12px', borderRadius: 10, cursor: 'pointer', border: 'none' }}>
                Send inquiry
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ EXTRA SERVICES ═══ */}
      <section>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a', marginBottom: 16 }}>Our extra services</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SERVICES.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="group" style={{ background: '#fff', borderRadius: 16, border: '1px solid #f0f0f0', overflow: 'hidden', transition: 'box-shadow 0.2s, transform 0.2s', cursor: 'pointer' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}>
                <div style={{ height: 140, overflow: 'hidden' }}>
                  <img src={s.img} alt={s.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                    onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                    onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&q=80'; }} />
                </div>
                <div style={{ padding: '14px 16px', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: -18, right: 16, width: 36, height: 36, background: '#0D6EFD', borderRadius: '50%', border: '3px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(13,110,253,0.3)' }}>
                    <Icon size={16} color="#fff" />
                  </div>
                  <p style={{ fontWeight: 700, fontSize: 13, color: '#1a1a1a', paddingRight: 32 }}>{s.title}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══ NEWSLETTER ═══ */}
      <section style={{ background: 'linear-gradient(135deg, #f8faff 0%, #eef2ff 100%)', border: '1px solid #e0e7ff', borderRadius: 16, padding: '48px 24px', textAlign: 'center' }}>
        <h3 style={{ fontSize: 20, fontWeight: 700, color: '#1a1a1a', marginBottom: 8 }}>Subscribe to our newsletter</h3>
        <p style={{ color: '#888', fontSize: 13, maxWidth: 360, margin: '0 auto 24px' }}>
          Get daily news on upcoming offers from many suppliers all over the world
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, maxWidth: 420, margin: '0 auto', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 220, position: 'relative' }}>
            <Send size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} />
            <input type="email" placeholder="Email address"
              style={{ width: '100%', padding: '11px 14px 11px 34px', border: '1px solid #ddd', borderRadius: 10, fontSize: 13, outline: 'none', background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }} />
          </div>
          <button style={{ background: '#0D6EFD', color: '#fff', fontWeight: 600, fontSize: 13, padding: '11px 28px', borderRadius: 10, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            Subscribe
          </button>
        </div>
      </section>

    </main>
  );
};

export default Home;
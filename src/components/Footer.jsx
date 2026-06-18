import React from 'react';
import { ShoppingCart, Send, MapPin, Globe, Mail, Phone, ChevronRight, Heart } from 'lucide-react';
import { FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { Link } from 'react-router-dom';

const COLLECTIONS = ['Electronics', 'Fashion & Apparel', 'Home & Living', 'Beauty & Health'];
const COMPANY     = ['Our Story', 'Sustainability', 'Press Office', 'Careers'];
const SOCIALS     = [
  { Icon: FaInstagram, label: 'Instagram', color: '#E1306C' },
  { Icon: FaFacebook,  label: 'Facebook',  color: '#1877F2' },
  { Icon: FaXTwitter,  label: 'Twitter',   color: '#000' },
  { Icon: FaYoutube,   label: 'YouTube',   color: '#FF0000' },
];

const Footer = () => {
  return (
    <footer style={{ background: '#111827', color: '#fff', marginTop: 48, position: 'relative', overflow: 'hidden' }}>

      {/* Top accent line */}
      <div style={{ height: 3, background: 'linear-gradient(to right, #0D6EFD, #6366f1, #FF9017)' }} />

      {/* Glow blobs */}
      <div style={{ position: 'absolute', top: -80, right: -80, width: 360, height: 360, background: 'rgba(13,110,253,0.06)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -60, left: -60, width: 280, height: 280, background: 'rgba(255,144,23,0.05)', borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '64px 16px 0', position: 'relative', zIndex: 1 }}>

        {/* ── Main grid ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '48px 32px', paddingBottom: 48 }}>

          {/* Brand column */}
          <div style={{ gridColumn: 'span 2', minWidth: 0 }} className="sm:col-span-1">
            {/* Logo */}
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 20 }}>
              <div style={{ background: '#fff', padding: 8, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(0,0,0,0.3)' }}>
                <ShoppingCart size={20} color="#1a1a1a" strokeWidth={2.5} />
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1 }}>E-Commerce</div>
                <div style={{ fontSize: 9, fontWeight: 800, color: '#0D6EFD', letterSpacing: '0.22em', marginTop: 2 }}>PREMIUM</div>
              </div>
            </Link>

            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, maxWidth: 260, marginBottom: 28 }}>
              Redefining the premium shopping experience with curated collections from the world's most innovative brands.
            </p>

            {/* Socials */}
            <div>
              <p style={{ fontSize: 10, fontWeight: 800, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 14 }}>Follow the Journey</p>
              <div style={{ display: 'flex', gap: 10 }}>
                {SOCIALS.map(({ Icon, label, color }) => (
                  <a key={label} href="#" aria-label={label}
                    style={{ width: 38, height: 38, background: 'rgba(255,255,255,0.06)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.08)', textDecoration: 'none', transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = color; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = color; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'none'; }}>
                    <Icon size={15} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Collections */}
          <div>
            <h4 style={{ fontSize: 11, fontWeight: 800, color: '#0D6EFD', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 20 }}>Collections</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {COLLECTIONS.map(item => (
                <li key={item}>
                  <Link to="/products"
                    style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 500, transition: 'color 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.querySelector('span')?.style && (e.currentTarget.querySelector('span').style.opacity = '1'); }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; }}>
                    <ChevronRight size={12} style={{ color: '#0D6EFD', flexShrink: 0 }} />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 style={{ fontSize: 11, fontWeight: 800, color: '#0D6EFD', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 20 }}>Company</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {COMPANY.map(item => (
                <li key={item}>
                  <Link to="/"
                    style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 500, transition: 'color 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.45)'}>
                    <ChevronRight size={12} style={{ color: '#0D6EFD', flexShrink: 0 }} />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h4 style={{ fontSize: 11, fontWeight: 800, color: '#0D6EFD', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 20 }}>Newsletter</h4>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginBottom: 16, lineHeight: 1.6, fontStyle: 'italic' }}>
              Join for 10% off your first luxury purchase.
            </p>

            {/* Email input */}
            <div style={{ position: 'relative', marginBottom: 20 }}>
              <input type="email" placeholder="Your Email"
                style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '11px 48px 11px 14px', fontSize: 13, color: '#fff', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = 'rgba(13,110,253,0.6)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
              <button style={{ position: 'absolute', right: 6, top: 6, bottom: 6, background: '#0D6EFD', color: '#fff', border: 'none', borderRadius: 7, padding: '0 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Send size={13} />
              </button>
            </div>

            {/* Contact info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <a href="mailto:support@brand.com" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'rgba(255,255,255,0.35)', textDecoration: 'none', transition: 'color 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}>
                <Mail size={12} style={{ color: '#0D6EFD', flexShrink: 0 }} /> support@brand.com
              </a>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'rgba(255,255,255,0.35)', cursor: 'pointer', transition: 'color 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}>
                <MapPin size={12} style={{ color: '#0D6EFD', flexShrink: 0 }} /> Find a Boutique
              </span>
            </div>
          </div>

        </div>

        {/* ── Divider ── */}
        <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', margin: '0 0 24px' }} />

        {/* ── Bottom bar ── */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16, paddingBottom: 28 }}>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 24px', alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', fontWeight: 600 }}>© 2026 E-Commerce Premium. All rights reserved.</span>
            {[
  { label: 'Privacy Policy',    path: '/privacy-policy' },
  { label: 'Terms of Service',  path: '/terms-of-service' },
  { label: 'Cookies Settings',  path: '/cookies-settings' },
].map(({ label, path }) => (
  <Link key={label} to={path}
    style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', textDecoration: 'none', fontWeight: 600, transition: 'color 0.15s' }}
    onMouseEnter={e => e.currentTarget.style.color = '#fff'}
    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.25)'}>
    {label}
  </Link>
))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* Made with love */}
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }}>
              Made with <Heart size={10} style={{ color: '#0d5eaf', fill: '#0d5eaf' }} /> Raja Sikandar Team
            </span>

            {/* Region pill */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '5px 12px' }}>
              <Globe size={11} style={{ color: '#0D6EFD' }} />
              <span style={{ fontSize: 10, fontWeight: 800, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Global Shop</span>
            </div>

            {/* Payment badges */}
            <div style={{ display: 'flex', gap: 6 }}>
              {['VISA', 'MC', 'AMEX', 'PP'].map(p => (
                <span key={p} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, padding: '4px 8px', fontSize: 9, fontWeight: 800, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.05em' }}>
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
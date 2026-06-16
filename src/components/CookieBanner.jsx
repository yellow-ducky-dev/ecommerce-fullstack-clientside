import React, { useState } from 'react';
import { useCookies } from '../context/CookieContext';
import { Cookie, X, ChevronDown, ChevronUp } from 'lucide-react';

const CookieBanner = () => {
  const { shown, acceptAll, rejectAll, prefs, savePrefs } = useCookies();
  const [expanded, setExpanded] = useState(false);
  const [local, setLocal]       = useState(prefs);

  if (!shown) return null;

  const COOKIES = [
    { id: 'essential',  label: 'Essential',  desc: 'Required for core site functionality. Always active.', locked: true },
    { id: 'analytics',  label: 'Analytics',  desc: 'Helps us understand how you use the site (e.g. Google Analytics).', locked: false },
    { id: 'marketing',  label: 'Marketing',  desc: 'Used for targeted ads and campaign tracking.', locked: false },
    { id: 'functional', label: 'Functional', desc: 'Enables features like live chat and saved preferences.', locked: false },
  ];

  return (
    <div style={{ position: 'fixed', bottom: 24, left: 24, right: 24, zIndex: 9999,
      maxWidth: 520, margin: '0 auto', background: '#1f2937', borderRadius: 16,
      boxShadow: '0 20px 60px rgba(0,0,0,0.4)', overflow: 'hidden',
      border: '1px solid rgba(255,255,255,0.08)' }}>

      {/* Header */}
      <div style={{ padding: '20px 20px 0', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ width: 36, height: 36, background: '#2563eb', borderRadius: 10, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Cookie size={18} color="#fff" />
        </div>
        <div>
          <p style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 4 }}>We use cookies</p>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>
            We use cookies to enhance your experience, analyze traffic, and personalize content.
            You can manage your preferences below.
          </p>
        </div>
      </div>

      {/* Expandable preferences */}
      {expanded && (
        <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {COOKIES.map(c => (
            <div key={c.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              gap: 12, background: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: '10px 14px' }}>
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#fff', marginBottom: 2 }}>{c.label}</p>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{c.desc}</p>
              </div>
              <div
                onClick={() => !c.locked && setLocal(p => ({ ...p, [c.id]: !p[c.id] }))}
                style={{ width: 40, height: 22, borderRadius: 99, flexShrink: 0,
                  background: local[c.id] ? '#2563eb' : 'rgba(255,255,255,0.15)',
                  cursor: c.locked ? 'not-allowed' : 'pointer',
                  position: 'relative', transition: 'background 0.2s',
                  opacity: c.locked ? 0.5 : 1 }}>
                <div style={{ position: 'absolute', top: 3, left: local[c.id] ? 21 : 3,
                  width: 16, height: 16, borderRadius: '50%', background: '#fff',
                  transition: 'left 0.2s' }} />
              </div>
            </div>
          ))}
          <button
            onClick={() => savePrefs(local)}
            style={{ width: '100%', padding: '10px', borderRadius: 8, border: 'none',
              background: '#2563eb', color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
            Save My Preferences
          </button>
        </div>
      )}

      {/* Actions */}
      <div style={{ padding: '12px 20px 20px', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button onClick={acceptAll}
          style={{ flex: 1, padding: '10px', borderRadius: 8, border: 'none',
            background: '#2563eb', color: '#fff', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
          Accept All
        </button>
        <button onClick={rejectAll}
          style={{ flex: 1, padding: '10px', borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.15)', background: 'transparent',
            color: 'rgba(255,255,255,0.7)', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
          Reject All
        </button>
        <button onClick={() => setExpanded(e => !e)}
          style={{ padding: '10px 14px', borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.15)', background: 'transparent',
            color: 'rgba(255,255,255,0.7)', fontWeight: 700, fontSize: 12, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 4 }}>
          {expanded ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          Manage
        </button>
      </div>
    </div>
  );
};

export default CookieBanner;
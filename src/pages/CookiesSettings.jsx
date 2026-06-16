import React, { useState } from 'react';
import { useCookies } from '../context/CookieContext';

const COOKIES = [
  { id: 'essential',  label: 'Essential Cookies',  desc: 'Required for the website to function. Cannot be disabled.', locked: true },
  { id: 'analytics',  label: 'Analytics Cookies',  desc: 'Help us understand how visitors interact with our website.', locked: false },
  { id: 'marketing',  label: 'Marketing Cookies',  desc: 'Used to deliver relevant advertisements and track campaigns.', locked: false },
  { id: 'functional', label: 'Functional Cookies', desc: 'Enable enhanced functionality like live chat and preferences.', locked: false },
];

const CookiesSettings = () => {
  const { prefs, savePrefs, acceptAll, rejectAll, resetPrefs } = useCookies();
  const [local, setLocal] = useState(prefs);
  const [saved, setSaved] = useState(false);

  const save = () => {
    savePrefs(local);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <main style={{ maxWidth: 800, margin: '0 auto', padding: '48px 24px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, color: '#111', marginBottom: 8 }}>Cookie Settings</h1>
      <p style={{ fontSize: 14, color: '#555', marginBottom: 40, lineHeight: 1.7 }}>
        Manage your cookie preferences below. Essential cookies are always active.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
        {COOKIES.map(c => (
          <div key={c.id} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12,
            padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#111', marginBottom: 4 }}>{c.label}</p>
              <p style={{ fontSize: 13, color: '#9ca3af' }}>{c.desc}</p>
              <span style={{ fontSize: 11, fontWeight: 700, marginTop: 6, display: 'inline-block',
                color: local[c.id] ? '#16a34a' : '#9ca3af' }}>
                {local[c.id] ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div
              onClick={() => !c.locked && setLocal(p => ({ ...p, [c.id]: !p[c.id] }))}
              style={{ width: 44, height: 24, borderRadius: 99, flexShrink: 0,
                background: local[c.id] ? '#2563eb' : '#e5e7eb',
                cursor: c.locked ? 'not-allowed' : 'pointer',
                position: 'relative', transition: 'background 0.2s',
                opacity: c.locked ? 0.6 : 1 }}>
              <div style={{ position: 'absolute', top: 3, left: local[c.id] ? 23 : 3,
                width: 18, height: 18, borderRadius: '50%', background: '#fff',
                transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button onClick={save}
          style={{ background: saved ? '#16a34a' : '#2563eb', color: '#fff', fontWeight: 700,
            fontSize: 13, padding: '11px 28px', borderRadius: 10, border: 'none', cursor: 'pointer' }}>
          {saved ? '✓ Saved!' : 'Save Preferences'}
        </button>
        <button onClick={acceptAll}
          style={{ background: '#f9fafb', color: '#111', fontWeight: 700, fontSize: 13,
            padding: '11px 28px', borderRadius: 10, border: '1px solid #e5e7eb', cursor: 'pointer' }}>
          Accept All
        </button>
        <button onClick={rejectAll}
          style={{ background: '#fff', color: '#ef4444', fontWeight: 700, fontSize: 13,
            padding: '11px 28px', borderRadius: 10, border: '1px solid #fee2e2', cursor: 'pointer' }}>
          Reject All
        </button>
        <button onClick={resetPrefs}
          style={{ background: '#fff', color: '#9ca3af', fontWeight: 700, fontSize: 13,
            padding: '11px 28px', borderRadius: 10, border: '1px solid #e5e7eb', cursor: 'pointer' }}>
          Reset & Show Banner
        </button>
      </div>
    </main>
  );
};

export default CookiesSettings;
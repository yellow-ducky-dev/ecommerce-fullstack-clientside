import React, { createContext, useContext, useState, useEffect } from 'react';

const CookieContext = createContext();

const DEFAULTS = { essential: true, analytics: false, marketing: false, functional: false };

export const CookieProvider = ({ children }) => {
  const [prefs, setPrefs]       = useState(DEFAULTS);
  const [shown, setShown]       = useState(false); // banner shown
  const [loaded, setLoaded]     = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('cookie_prefs');
    if (saved) {
      setPrefs(JSON.parse(saved));
      setShown(false);
    } else {
      setShown(true); // first visit — show banner
    }
    setLoaded(true);
  }, []);

  const savePrefs = (newPrefs) => {
    const merged = { ...newPrefs, essential: true };
    localStorage.setItem('cookie_prefs', JSON.stringify(merged));
    setPrefs(merged);
    setShown(false);
    applyPrefs(merged);
  };

  const acceptAll  = () => savePrefs({ essential: true, analytics: true, marketing: true, functional: true });
  const rejectAll  = () => savePrefs(DEFAULTS);
  const resetPrefs = () => { localStorage.removeItem('cookie_prefs'); setPrefs(DEFAULTS); setShown(true); };

  const applyPrefs = (p) => {
    // Analytics — inject/remove Google Analytics
    if (p.analytics) {
      if (!document.getElementById('ga-script')) {
        const s = document.createElement('script');
        s.id  = 'ga-script';
        s.src = 'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID';
        s.async = true;
        document.head.appendChild(s);
      }
    } else {
      document.getElementById('ga-script')?.remove();
      window['ga-disable-GA_MEASUREMENT_ID'] = true;
    }

    // Functional — inject/remove live chat or other tools
    if (p.functional) {
      // add functional scripts here
    }

    // Marketing — inject/remove Facebook Pixel etc
    if (p.marketing) {
      // add marketing scripts here
    }
  };

  // Apply on mount if prefs already saved
  useEffect(() => { if (loaded) applyPrefs(prefs); }, [loaded]);

  return (
    <CookieContext.Provider value={{ prefs, savePrefs, acceptAll, rejectAll, resetPrefs, shown, setShown }}>
      {children}
    </CookieContext.Provider>
  );
};

export const useCookies = () => useContext(CookieContext);
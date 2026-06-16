import React from 'react';

const SECTIONS = [
  { title: 'Information We Collect', content: 'We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support. This includes name, email address, shipping address, and payment information.' },
  { title: 'How We Use Your Information', content: 'We use the information we collect to process transactions, send order confirmations, respond to your requests, send promotional communications (with your consent), and improve our services.' },
  { title: 'Information Sharing', content: 'We do not sell, trade, or rent your personal information to third parties. We may share your information with trusted service providers who assist us in operating our website and conducting our business.' },
  { title: 'Data Security', content: 'We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.' },
  { title: 'Cookies', content: 'We use cookies to enhance your experience, analyze site traffic, and personalize content. You can control cookie settings through your browser preferences.' },
  { title: 'Contact Us', content: 'If you have questions about this Privacy Policy, please contact us at support@brand.com.' },
];

const PrivacyPolicy = () => (
  <main style={{ maxWidth: 800, margin: '0 auto', padding: '48px 24px' }}>
    <h1 style={{ fontSize: 28, fontWeight: 800, color: '#111', marginBottom: 8 }}>Privacy Policy</h1>
    <p style={{ fontSize: 13, color: '#aaa', marginBottom: 40 }}>Last updated: January 1, 2026</p>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {SECTIONS.map((s, i) => (
        <div key={i} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111', marginBottom: 12 }}>{s.title}</h2>
          <p style={{ fontSize: 14, color: '#555', lineHeight: 1.7 }}>{s.content}</p>
        </div>
      ))}
    </div>
  </main>
);

export default PrivacyPolicy;
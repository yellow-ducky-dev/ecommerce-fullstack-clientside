import React from 'react';

const SECTIONS = [
  { title: 'Acceptance of Terms', content: 'By accessing and using E-Commerce Premium, you accept and agree to be bound by the terms and provision of this agreement.' },
  { title: 'Use License', content: 'Permission is granted to temporarily access the materials on our website for personal, non-commercial transitory viewing only.' },
  { title: 'Purchase Terms', content: 'All purchases are subject to product availability. We reserve the right to refuse service, terminate accounts, or cancel orders at our discretion.' },
  { title: 'Returns & Refunds', content: 'Items may be returned within 30 days of delivery in original condition. Refunds are processed within 5-7 business days to the original payment method.' },
  { title: 'Disclaimer', content: 'The materials on our website are provided on an "as is" basis. We make no warranties, expressed or implied, and hereby disclaim all other warranties.' },
  { title: 'Governing Law', content: 'These terms shall be governed by and construed in accordance with applicable laws, without regard to conflict of law provisions.' },
];

const TermsOfService = () => (
  <main style={{ maxWidth: 800, margin: '0 auto', padding: '48px 24px' }}>
    <h1 style={{ fontSize: 28, fontWeight: 800, color: '#111', marginBottom: 8 }}>Terms of Service</h1>
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

export default TermsOfService;
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Mail, Lock, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const FALLBACK_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23f3f4f6' width='200' height='200'/%3E%3C/svg%3E";

const InputField = ({ icon: Icon, type, placeholder, value, onChange, required, right }) => (
  <div style={{ position: 'relative' }}>
    <Icon size={15} style={{ position: 'absolute', left: 14, top: '50%',
      transform: 'translateY(-50%)', color: '#aaa', pointerEvents: 'none' }} />
    <input
      type={type} placeholder={placeholder} value={value}
      onChange={onChange} required={required}
      style={{ width: '100%', paddingLeft: 40, paddingRight: right ? 42 : 14,
        paddingTop: 11, paddingBottom: 11,
        border: '1px solid #e5e7eb', borderRadius: 10, fontSize: 13,
        outline: 'none', color: '#333', boxSizing: 'border-box',
        transition: 'border-color 0.15s' }}
      onFocus={e => e.target.style.borderColor = '#2563eb'}
      onBlur={e => e.target.style.borderColor = '#e5e7eb'}
    />
    {right}
  </div>
);

const Register = () => {
  const navigate = useNavigate();
  const { register, loading, error } = useAuth();
  const [form, setForm]           = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPass, setShowPass]   = useState(false);
  const [formError, setFormError] = useState('');

  const set = key => e => setForm(f => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (form.password !== form.confirm) { setFormError('Passwords do not match'); return; }
    if (form.password.length < 6)       { setFormError('Password must be at least 6 characters'); return; }
    try {
      await register(form.name, form.email, form.password);
      navigate('/');
    } catch (err) { setFormError(err.message); }
  };

  const eyeBtn = (
    <button type="button" onClick={() => setShowPass(v => !v)}
      style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
        background: 'none', border: 'none', cursor: 'pointer', color: '#aaa',
        display: 'flex', alignItems: 'center', padding: 0,
        transition: 'color 0.15s' }}
      onMouseEnter={e => e.currentTarget.style.color = '#555'}
      onMouseLeave={e => e.currentTarget.style.color = '#aaa'}>
      {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
    </button>
  );

  return (
    <main style={{ minHeight: 'calc(100vh - 160px)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: '40px 16px' }}>

      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16,
          padding: 32, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ width: 52, height: 52, background: '#eff6ff', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px' }}>
              <ShieldCheck size={24} color="#2563eb" />
            </div>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: '#111', marginBottom: 4 }}>
              Create account
            </h1>
            <p style={{ fontSize: 13, color: '#9ca3af' }}>
              Join thousands of happy customers
            </p>
          </div>

          {/* Error */}
          {(formError || error) && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626',
              fontSize: 12, borderRadius: 10, padding: '10px 14px', marginBottom: 18,
              fontWeight: 600 }}>
              {formError || error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

            <InputField icon={User}  type="text"     placeholder="Full name"
              value={form.name}     onChange={set('name')}     required />

            <InputField icon={Mail}  type="email"    placeholder="Email address"
              value={form.email}    onChange={set('email')}    required />

            <InputField icon={Lock}  type={showPass ? 'text' : 'password'} placeholder="Password"
              value={form.password} onChange={set('password')} required right={eyeBtn} />

            <InputField icon={Lock}  type={showPass ? 'text' : 'password'} placeholder="Confirm password"
              value={form.confirm}  onChange={set('confirm')}  required />

            <button type="submit" disabled={loading}
              style={{ width: '100%', background: loading ? '#93c5fd' : '#2563eb', color: '#fff',
                fontWeight: 700, fontSize: 14, padding: '12px', borderRadius: 10,
                border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                marginTop: 4, transition: 'background 0.15s' }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#1d4ed8'; }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#2563eb'; }}>
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          {/* Footer */}
          <p style={{ textAlign: 'center', fontSize: 13, color: '#9ca3af', marginTop: 20 }}>
            Already have an account?{' '}
            <Link to="/login"
              style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none',
                transition: 'color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#1d4ed8'}
              onMouseLeave={e => e.currentTarget.style.color = '#2563eb'}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default Register;
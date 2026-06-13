import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();
  const [form, setForm]           = useState({ email: '', password: '' });
  const [showPass, setShowPass]   = useState(false);
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) { setFormError(err.message); }
  };

  const inputStyle = {
    width: '100%', paddingLeft: 40, paddingRight: 14,
    paddingTop: 11, paddingBottom: 11,
    border: '1px solid #e5e7eb', borderRadius: 10, fontSize: 13,
    outline: 'none', color: '#333', boxSizing: 'border-box',
    transition: 'border-color 0.15s',
  };

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
              <LogIn size={24} color="#2563eb" />
            </div>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: '#111', marginBottom: 4 }}>
              Welcome back
            </h1>
            <p style={{ fontSize: 13, color: '#9ca3af' }}>
              Sign in to your account to continue
            </p>
          </div>

          {/* Error */}
          {(formError || error) && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626',
              fontSize: 12, borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontWeight: 600 }}>
              {formError || error}
            </div>
          )}

          {/* Demo credentials */}
          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', color: '#2563eb',
            fontSize: 12, borderRadius: 10, padding: '10px 14px', marginBottom: 20,
            lineHeight: 1.7 }}>
            <strong>Demo accounts:</strong><br />
            Admin: admin@ecommerce.com / Admin@1234<br />
            User: john@example.com / John@1234
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

            {/* Email */}
            <div style={{ position: 'relative' }}>
              <Mail size={15} style={{ position: 'absolute', left: 14, top: '50%',
                transform: 'translateY(-50%)', color: '#aaa', pointerEvents: 'none' }} />
              <input type="email" placeholder="Email address" value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                required style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#2563eb'}
                onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
            </div>

            {/* Password */}
            <div style={{ position: 'relative' }}>
              <Lock size={15} style={{ position: 'absolute', left: 14, top: '50%',
                transform: 'translateY(-50%)', color: '#aaa', pointerEvents: 'none' }} />
              <input type={showPass ? 'text' : 'password'} placeholder="Password" value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                required style={{ ...inputStyle, paddingRight: 42 }}
                onFocus={e => e.target.style.borderColor = '#2563eb'}
                onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
              <button type="button" onClick={() => setShowPass(v => !v)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: '#aaa',
                  display: 'flex', alignItems: 'center', padding: 0, transition: 'color 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#555'}
                onMouseLeave={e => e.currentTarget.style.color = '#aaa'}>
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>

            {/* Forgot password */}
            <div style={{ textAlign: 'right', marginTop: -4 }}>
              <button type="button"
                style={{ background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 12, color: '#2563eb', fontWeight: 600, padding: 0,
                  transition: 'color 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#1d4ed8'}
                onMouseLeave={e => e.currentTarget.style.color = '#2563eb'}>
                Forgot password?
              </button>
            </div>

            <button type="submit" disabled={loading}
              style={{ width: '100%', background: loading ? '#93c5fd' : '#2563eb', color: '#fff',
                fontWeight: 700, fontSize: 14, padding: '12px', borderRadius: 10,
                border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                marginTop: 4, transition: 'background 0.15s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#1d4ed8'; }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#2563eb'; }}>
              <LogIn size={15} />
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          {/* Footer */}
          <p style={{ textAlign: 'center', fontSize: 13, color: '#9ca3af', marginTop: 20 }}>
            Don't have an account?{' '}
            <Link to="/register"
              style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none',
                transition: 'color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#1d4ed8'}
              onMouseLeave={e => e.currentTarget.style.color = '#2563eb'}>
              Create one
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default Login;
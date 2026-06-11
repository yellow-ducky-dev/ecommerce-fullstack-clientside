import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setFormError(err.message);
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
              <LogIn size={28} className="text-primary" />
            </div>
            <h1 className="text-2xl font-black text-dark">Welcome back</h1>
            <p className="text-gray-500 text-sm mt-1">Sign in to your account to continue</p>
          </div>

          {(formError || error) && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl p-3 mb-5">
              {formError || error}
            </div>
          )}

          {/* Demo credentials hint */}
          <div className="bg-blue-50 border border-blue-200 text-blue-600 text-xs rounded-xl p-3 mb-5">
            <strong>Demo accounts:</strong><br />
            Admin: admin@ecommerce.com / Admin@1234<br />
            User: john@example.com / John@1234
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="email" placeholder="Email address" value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-primary transition-colors text-sm"
                required />
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type={showPass ? 'text' : 'password'} placeholder="Password" value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                className="w-full pl-11 pr-12 py-3 border border-gray-200 rounded-xl outline-none focus:border-primary transition-colors text-sm"
                required />
              <button type="button" onClick={() => setShowPass(v => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <div className="text-right">
              <button type="button" className="text-xs text-primary hover:underline">Forgot password?</button>
            </div>
            <button type="submit" disabled={loading}
              className="btn btn-primary w-full py-4 font-bold disabled:opacity-50">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary font-semibold hover:underline">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

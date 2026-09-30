import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogIn, Key, Mail, ShieldAlert, Sparkles } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await login(email, password);
      if (res.user.role === 'ADMIN') navigate('/admin-dashboard');
      else if (res.user.role === 'STAFF') navigate('/staff-dashboard');
      else navigate('/my-token');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemoAccount = (roleEmail) => {
    setEmail(roleEmail);
    setPassword('Password123!');
  };

  return (
    <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="container" style={{ maxWidth: '440px' }}>
        <div className="glass-panel" style={{ padding: '36px' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>Welcome Back</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Sign in to manage your virtual tokens</p>
          </div>

          {error && (
            <div style={{ background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.3)', color: 'var(--accent-rose)', padding: '12px', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldAlert size={16} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label"><Mail size={14} style={{ display: 'inline', marginRight: '6px' }} /> Email Address</label>
              <input
                type="email"
                className="form-control"
                placeholder="user@queueless.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label"><Key size={14} style={{ display: 'inline', marginRight: '6px' }} /> Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }} disabled={submitting}>
              <LogIn size={18} /> {submitting ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          {/* Quick Demo Login Fill Buttons */}
          <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border-light)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Sparkles size={12} color="var(--accent-cyan)" /> Quick Demo One-Click Fill:
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button onClick={() => fillDemoAccount('user1@queueless.com')} className="btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>User Demo</button>
              <button onClick={() => fillDemoAccount('staff1@queueless.com')} className="btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem', borderColor: 'var(--accent-amber)' }}>Staff Demo</button>
              <button onClick={() => fillDemoAccount('admin@queueless.com')} className="btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem', borderColor: 'var(--accent-indigo)' }}>Admin Demo</button>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Don't have an account? <Link to="/register" style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>Register now</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

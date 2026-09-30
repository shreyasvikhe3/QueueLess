import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useQueue } from '../context/QueueContext';
import { Layers, Ticket, User, LogOut, Shield, Activity, Clock } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { activeToken } = useQueue();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      background: 'rgba(11, 15, 25, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-light)',
      padding: '14px 0'
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'var(--gradient-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff'
          }}>
            <Layers size={24} />
          </div>
          <div>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }} className="gradient-text">
              QueueLess
            </span>
            <span style={{ fontSize: '0.65rem', display: 'block', color: 'var(--accent-cyan)', fontWeight: 700, letterSpacing: '0.1em' }}>
              SMART AI QUEUE
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Link to="/" style={{ color: location.pathname === '/' ? 'var(--accent-cyan)' : 'var(--text-secondary)', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>
            Home
          </Link>
          <Link to="/about" style={{ color: location.pathname === '/about' ? 'var(--accent-cyan)' : 'var(--text-secondary)', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>
            About AI
          </Link>

          {user ? (
            <>
              {user.role === 'USER' && (
                <>
                  <Link to="/select-service" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>
                    Get Token
                  </Link>
                  <Link to="/my-token" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Ticket size={16} />
                    My Token
                    {activeToken && (
                      <span style={{ background: 'var(--accent-cyan)', color: '#000', padding: '2px 6px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 800 }}>
                        {activeToken.tokenNumber}
                      </span>
                    )}
                  </Link>
                  <Link to="/token-history" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>
                    History
                  </Link>
                </>
              )}

              {user.role === 'STAFF' && (
                <Link to="/staff-dashboard" style={{ color: 'var(--accent-amber)', textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Activity size={16} /> Staff Console
                </Link>
              )}

              {user.role === 'ADMIN' && (
                <Link to="/admin-dashboard" style={{ color: 'var(--accent-indigo)', textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Shield size={16} /> Admin Command
                </Link>
              )}

              {/* User Avatar & Logout */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '12px', borderLeft: '1px solid var(--border-light)' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                  {user.name} <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>({user.role})</span>
                </span>
                <button onClick={handleLogout} className="btn-secondary" style={{ padding: '8px 12px', fontSize: '0.8rem' }}>
                  <LogOut size={14} /> Exit
                </button>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '10px' }}>
              <Link to="/login" className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>Login</Link>
              <Link to="/register" className="btn-primary" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>Get Started</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

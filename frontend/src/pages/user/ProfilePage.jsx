import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Phone, Shield, Bell } from 'lucide-react';

export const ProfilePage = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: '600px' }}>
        <div className="glass-panel" style={{ padding: '36px' }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'var(--gradient-primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.8rem', fontWeight: 800, marginBottom: '12px' }}>
              {user.name.charAt(0)}
            </div>
            <h2 style={{ fontSize: '1.6rem' }}>{user.name}</h2>
            <div className="badge badge-low" style={{ marginTop: '6px' }}>{user.role} ACCOUNT</div>
          </div>

          <div style={{ display: 'grid', gap: '16px' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Mail color="var(--accent-cyan)" size={20} />
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Email Address</span>
                <div style={{ fontWeight: 600, color: '#fff' }}>{user.email}</div>
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Phone color="var(--accent-blue)" size={20} />
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Phone Number</span>
                <div style={{ fontWeight: 600, color: '#fff' }}>{user.phone || 'Not configured'}</div>
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Bell color="var(--accent-emerald)" size={20} />
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Web Push Notifications</span>
                <div style={{ fontWeight: 600, color: 'var(--accent-emerald)' }}>Active & Subscribed</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

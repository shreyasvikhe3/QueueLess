import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { AnalyticsCharts } from '../../components/AnalyticsCharts';
import { Shield, Users, Building, Layers, Cpu, Activity, Clock, CheckCircle2, UserCheck } from 'lucide-react';

export const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [counters, setCounters] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('analytics'); // analytics | counters | users
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAdminData = async () => {
      try {
        const [aRes, cRes, uRes] = await Promise.all([
          api.get('/admin/analytics'),
          api.get('/admin/counters'),
          api.get('/admin/users')
        ]);

        if (aRes.success) setAnalytics(aRes.data);
        if (cRes.success) setCounters(cRes.data);
        if (uRes.success) setUsers(uRes.data);
      } catch (err) {
        console.error('Admin data fetch failed:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAdminData();
  }, []);

  const handleAssignStaff = async (counterId, staffId) => {
    try {
      const res = await api.post('/admin/counters/assign-staff', { counterId, staffId });
      if (res.success) {
        setCounters(counters.map(c => c.counterId === counterId ? { ...c, staffId } : c));
        alert('Staff assigned to counter successfully!');
      }
    } catch (err) {
      alert(`Assignment failed: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="container" style={{ textAlign: 'center', padding: '80px', color: 'var(--text-secondary)' }}>
          Loading Admin Control System...
        </div>
      </div>
    );
  }

  const { summary } = analytics || {};

  return (
    <div className="page-wrapper">
      <div className="container">
        {/* Header & Tab Selector */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <h1 style={{ fontSize: '2.2rem', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Shield color="var(--accent-indigo)" /> Admin Command Center
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>System analytics, crowd monitoring, counters, and user controls</p>
          </div>

          <div style={{ display: 'flex', gap: '10px', background: 'var(--bg-secondary)', padding: '6px', borderRadius: '12px' }}>
            <button
              onClick={() => setActiveTab('analytics')}
              className={activeTab === 'analytics' ? 'btn-primary' : 'btn-secondary'}
              style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            >
              Analytics & ML
            </button>
            <button
              onClick={() => setActiveTab('counters')}
              className={activeTab === 'counters' ? 'btn-primary' : 'btn-secondary'}
              style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            >
              Counters & Staff
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={activeTab === 'users' ? 'btn-primary' : 'btn-secondary'}
              style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            >
              User Management
            </button>
          </div>
        </div>

        {/* Top Summary Stats Bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          <div className="glass-panel" style={{ padding: '20px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Tokens Issued</span>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
              {summary?.totalTokens || 0}
            </div>
          </div>
          <div className="glass-panel" style={{ padding: '20px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Completed Tokens</span>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
              {summary?.completedTokens || 0}
            </div>
          </div>
          <div className="glass-panel" style={{ padding: '20px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Skipped (No-Shows)</span>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-rose)' }}>
              {summary?.skippedTokens || 0}
            </div>
          </div>
          <div className="glass-panel" style={{ padding: '20px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Average Wait Time</span>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-amber)' }}>
              {summary?.avgWaitMinutes || 0} <span style={{ fontSize: '0.9rem' }}>mins</span>
            </div>
          </div>
        </div>

        {/* TAB 1: Analytics & ML Charts */}
        {activeTab === 'analytics' && (
          <div>
            <AnalyticsCharts analyticsData={analytics} />
          </div>
        )}

        {/* TAB 2: Counters & Staff Assignment */}
        {activeTab === 'counters' && (
          <div className="glass-panel" style={{ padding: '30px' }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '20px' }}>Active Counters & Staff Mapping</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text-primary)', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-light)', textAlign: 'left' }}>
                  <th style={{ padding: '12px' }}>Counter #</th>
                  <th style={{ padding: '12px' }}>Department</th>
                  <th style={{ padding: '12px' }}>Status</th>
                  <th style={{ padding: '12px' }}>Assigned Staff</th>
                  <th style={{ padding: '12px' }}>Re-Assign Staff</th>
                </tr>
              </thead>
              <tbody>
                {counters.map((c) => (
                  <tr key={c.counterId} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '12px', fontWeight: 800, color: 'var(--accent-cyan)' }}>Counter #{c.counterNumber}</td>
                    <td style={{ padding: '12px' }}>{c.departmentName}</td>
                    <td style={{ padding: '12px' }}>
                      <span className="badge badge-low">{c.status}</span>
                    </td>
                    <td style={{ padding: '12px', fontWeight: 600 }}>{c.staffName}</td>
                    <td style={{ padding: '12px' }}>
                      <select
                        onChange={(e) => handleAssignStaff(c.counterId, e.target.value)}
                        defaultValue={c.staffId || ''}
                        className="form-control"
                        style={{ width: 'auto', padding: '4px 10px', fontSize: '0.8rem' }}
                      >
                        <option value="">Unassigned</option>
                        {users.filter(u => u.role === 'STAFF').map(s => (
                          <option key={s.userId} value={s.userId}>{s.name}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 3: User Accounts List */}
        {activeTab === 'users' && (
          <div className="glass-panel" style={{ padding: '30px' }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '20px' }}>System Registered Users ({users.length})</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text-primary)', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-light)', textAlign: 'left' }}>
                  <th style={{ padding: '12px' }}>Name</th>
                  <th style={{ padding: '12px' }}>Email</th>
                  <th style={{ padding: '12px' }}>Role</th>
                  <th style={{ padding: '12px' }}>Joined Date</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.userId} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '12px', fontWeight: 600 }}>{u.name}</td>
                    <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{u.email}</td>
                    <td style={{ padding: '12px' }}>
                      <span className={`badge ${u.role === 'ADMIN' ? 'badge-high' : u.role === 'STAFF' ? 'badge-medium' : 'badge-low'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: '12px', color: 'var(--text-muted)' }}>
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

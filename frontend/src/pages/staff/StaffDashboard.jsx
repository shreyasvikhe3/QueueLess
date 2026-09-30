import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../../services/api';
import { CrowdDensityBadge } from '../../components/CrowdDensityBadge';
import { Activity, PhoneCall, CheckCircle, SkipForward, RotateCcw, Clock, Users, ShieldAlert } from 'lucide-react';

export const StaffDashboard = () => {
  const [counters, setCounters] = useState([]);
  const [selectedCounterId, setSelectedCounterId] = useState('');
  const [queueData, setQueueData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load available counters
  useEffect(() => {
    const loadCounters = async () => {
      try {
        const res = await api.get('/admin/counters');
        if (res.success && res.data.length > 0) {
          setCounters(res.data);
          setSelectedCounterId(res.data[0].counterId);
        }
      } catch (err) {
        console.error('Failed to load counters:', err);
      }
    };

    loadCounters();
  }, []);

  const selectedCounter = counters.find(c => c.counterId === selectedCounterId);

  // Fetch current queue status for selected counter department
  const fetchQueue = useCallback(async () => {
    if (!selectedCounter) return;

    try {
      // Find service associated with this counter's department
      const sRes = await api.get('/public/services');
      const service = sRes.data?.find(s => s.departmentId === selectedCounter.departmentId) || sRes.data?.[0];

      if (service) {
        const qRes = await api.get(`/queue/service/${service.serviceId}`);
        if (qRes.success) {
          setQueueData(qRes.data);
        }
      }
    } catch (err) {
      console.error('Queue load failed:', err);
    }
  }, [selectedCounter]);

  useEffect(() => {
    fetchQueue();
    const interval = setInterval(fetchQueue, 3000);
    return () => clearInterval(interval);
  }, [fetchQueue]);

  const handleCallNext = async () => {
    if (!selectedCounterId) return;
    setActionLoading(true);
    setError(null);
    try {
      const res = await api.post('/queue/next', { counterId: selectedCounterId });
      if (res.success) {
        await fetchQueue();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleComplete = async (tokenId) => {
    setActionLoading(true);
    setError(null);
    try {
      await api.post(`/queue/token/${tokenId}/complete`);
      await fetchQueue();
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSkip = async (tokenId) => {
    setActionLoading(true);
    setError(null);
    try {
      await api.post(`/queue/token/${tokenId}/skip`);
      await fetchQueue();
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRecall = async (tokenId) => {
    setActionLoading(true);
    setError(null);
    try {
      await api.post(`/queue/token/${tokenId}/recall`);
      await fetchQueue();
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        {/* Header & Counter Selector */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <h1 style={{ fontSize: '2.2rem', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Activity color="var(--accent-amber)" /> Staff Counter Operator Console
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>Manage live token processing, calls, and no-shows</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Assigned Counter:</span>
            <select
              value={selectedCounterId}
              onChange={(e) => setSelectedCounterId(e.target.value)}
              className="form-control"
              style={{ width: 'auto', background: 'var(--bg-secondary)', color: '#fff', padding: '8px 16px', borderRadius: '10px' }}
            >
              {counters.map(c => (
                <option key={c.counterId} value={c.counterId}>
                  Counter #{c.counterNumber} ({c.departmentName})
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div style={{ background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.3)', color: 'var(--accent-rose)', padding: '14px', borderRadius: '12px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldAlert size={20} /> {error}
          </div>
        )}

        {/* Counter Control Stats Bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          <div className="glass-panel" style={{ padding: '20px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Service Queue</span>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginTop: '2px' }}>
              {queueData?.serviceName || 'OPD Service'}
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '20px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Waiting Count</span>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
              {queueData?.waitingCount || 0} <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>people</span>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '20px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Crowd Density</span>
            <div style={{ marginTop: '6px' }}>
              <CrowdDensityBadge density={queueData?.crowdDensity} />
            </div>
          </div>

          {/* Primary Call Next Button */}
          <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center' }}>
            <button
              onClick={handleCallNext}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1rem', background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)' }}
              disabled={actionLoading}
            >
              <PhoneCall size={20} /> Call Next Token
            </button>
          </div>
        </div>

        {/* Active Serving Token Panel */}
        <div className="glass-panel" style={{ padding: '30px', marginBottom: '30px', border: '1px solid var(--accent-amber)' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={20} /> Currently Serving at Counter #{selectedCounter?.counterNumber || 1}
          </h3>

          {queueData?.currentlyServing && queueData.currentlyServing.length > 0 ? (
            <div>
              {queueData.currentlyServing.map(token => (
                <div key={token.tokenId} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', background: 'rgba(255,255,255,0.03)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
                  <div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Active Token Number</span>
                    <div style={{ fontSize: '3.5rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--accent-amber)', lineHeight: '1' }}>
                      {token.tokenNumber}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
                      Status: <strong>{token.status}</strong> | Called At: {new Date(token.calledAt || token.createdAt).toLocaleTimeString()}
                    </div>
                  </div>

                  {/* Operator Controls: Complete, Skip, Recall */}
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={() => handleComplete(token.tokenId)} className="btn-primary" style={{ background: 'var(--accent-emerald)', padding: '12px 20px' }} disabled={actionLoading}>
                      <CheckCircle size={18} /> Mark Complete
                    </button>
                    <button onClick={() => handleSkip(token.tokenId)} className="btn-danger" style={{ padding: '12px 20px' }} disabled={actionLoading}>
                      <SkipForward size={18} /> Skip (No-Show)
                    </button>
                    <button onClick={() => handleRecall(token.tokenId)} className="btn-secondary" style={{ padding: '12px 20px' }} disabled={actionLoading}>
                      <RotateCcw size={18} /> Re-Call Token
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
              No active token currently being served at this counter. Click "Call Next Token" to draw from queue.
            </div>
          )}
        </div>

        {/* Live Waiting Queue Table */}
        <div className="glass-panel" style={{ padding: '30px' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>
            Waiting Queue ({queueData?.waitingTokens?.length || 0})
          </h3>

          {queueData?.waitingTokens && queueData.waitingTokens.length > 0 ? (
            <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text-primary)', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-light)', textAlign: 'left' }}>
                  <th style={{ padding: '12px' }}>Token #</th>
                  <th style={{ padding: '12px' }}>Status</th>
                  <th style={{ padding: '12px' }}>People Ahead</th>
                  <th style={{ padding: '12px' }}>Est. Wait</th>
                  <th style={{ padding: '12px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {queueData.waitingTokens.map((t) => (
                  <tr key={t.tokenId} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '12px', fontWeight: 800, color: 'var(--accent-cyan)' }}>{t.tokenNumber}</td>
                    <td style={{ padding: '12px' }}>
                      <span className={`badge ${t.status === 'CHECKED_IN' ? 'badge-low' : 'badge-medium'}`}>
                        {t.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>{t.peopleAhead}</td>
                    <td style={{ padding: '12px' }}>{t.confidenceRange || `${t.estimatedWaitMinutes} mins`}</td>
                    <td style={{ padding: '12px' }}>
                      <button onClick={() => handleSkip(t.tokenId)} className="btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
                        Skip
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
              Queue is empty.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

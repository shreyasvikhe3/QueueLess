import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Clock, Ticket, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

export const TokenHistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/tokens/history');
        if (res.success) {
          setHistory(res.data);
        }
      } catch (err) {
        console.error('Failed to load token history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: '800px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '2.2rem', marginBottom: '8px' }}>Your Token History</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Review all past virtual tokens and completed visits</p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
            Loading token history...
          </div>
        ) : history.length === 0 ? (
          <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            No past token records found.
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '16px' }}>
            {history.map((token) => (
              <div key={token.tokenId} className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--accent-cyan)', width: '70px' }}>
                    {token.tokenNumber}
                  </div>
                  <div>
                    <strong style={{ fontSize: '1rem', color: '#fff' }}>{token.serviceName}</strong>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Clock size={12} /> Issued: {new Date(token.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className={`badge ${token.status === 'COMPLETED' ? 'badge-low' : token.status === 'SKIPPED' ? 'badge-high' : 'badge-medium'}`}>
                  {token.status}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

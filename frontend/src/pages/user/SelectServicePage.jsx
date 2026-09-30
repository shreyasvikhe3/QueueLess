import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { useQueue } from '../../context/QueueContext';
import { CrowdDensityBadge } from '../../components/CrowdDensityBadge';
import { Ticket, Building, Clock, ArrowRight, ShieldAlert, CheckCircle } from 'lucide-react';

export const SelectServicePage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requestingId, setRequestingId] = useState(null);
  const [error, setError] = useState(null);

  const { activeToken, fetchActiveToken } = useQueue();
  const navigate = useNavigate();

  useEffect(() => {
    const loadServices = async () => {
      try {
        const res = await api.get('/public/services');
        if (res.success) {
          // Enrich each service with real-time crowd density
          const enriched = await Promise.all(res.data.map(async (s) => {
            try {
              const qRes = await api.get(`/queue/service/${s.serviceId}`);
              return { ...s, crowdDensity: qRes.data?.crowdDensity, waitingCount: qRes.data?.waitingCount || 0 };
            } catch {
              return { ...s, crowdDensity: { level: 'LOW', badgeText: 'Low Density' }, waitingCount: 0 };
            }
          }));
          setServices(enriched);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  const handleRequestToken = async (serviceId) => {
    if (activeToken) {
      setError(`You already have an active token (${activeToken.tokenNumber}). Please complete or cancel it first.`);
      return;
    }

    setRequestingId(serviceId);
    setError(null);

    try {
      const res = await api.post('/tokens', { serviceId });
      if (res.success) {
        await fetchActiveToken();
        navigate('/my-token');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setRequestingId(null);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '2.2rem', marginBottom: '10px' }}>Select Facility Service</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Choose your desired service to issue a digital virtual token</p>
        </div>

        {activeToken && (
          <div style={{ background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)', color: 'var(--accent-amber)', padding: '16px', borderRadius: '12px', marginBottom: '30px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Ticket size={20} />
              <div>
                <strong>Active Token in Progress: {activeToken.tokenNumber}</strong>
                <div style={{ fontSize: '0.8rem' }}>Status: {activeToken.status} | People Ahead: {activeToken.peopleAhead}</div>
              </div>
            </div>
            <button onClick={() => navigate('/my-token')} className="btn-secondary" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
              View My Token <ArrowRight size={14} />
            </button>
          </div>
        )}

        {error && (
          <div style={{ background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.3)', color: 'var(--accent-rose)', padding: '14px', borderRadius: '12px', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldAlert size={20} /> {error}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
            Loading available facility services...
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {services.map((service) => (
              <div key={service.serviceId} className="glass-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Prefix [{service.prefix}]
                    </span>
                    <CrowdDensityBadge density={service.crowdDensity} />
                  </div>

                  <h3 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>{service.name}</h3>

                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Building size={14} color="var(--text-muted)" /> {service.organizationName} - {service.departmentName}
                  </div>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                    {service.description || 'Standard facility consultation and token processing service.'}
                  </p>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', marginBottom: '20px', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Clock size={14} /> Avg Service Time
                    </span>
                    <strong style={{ color: '#fff' }}>{service.averageServiceTime} mins / person</strong>
                  </div>

                  <button
                    onClick={() => handleRequestToken(service.serviceId)}
                    className="btn-primary"
                    style={{ width: '100%', justifyContent: 'center' }}
                    disabled={!!activeToken || requestingId === service.serviceId}
                  >
                    <Ticket size={18} />
                    {requestingId === service.serviceId ? 'Generating Token...' : activeToken ? 'Token Already Active' : 'Issue Virtual Token'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

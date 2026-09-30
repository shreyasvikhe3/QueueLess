import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQueue } from '../../context/QueueContext';
import { QRCodeModal } from '../../components/QRCodeModal';
import { Ticket, Clock, Users, QrCode, XCircle, CheckCircle, Bell, AlertTriangle, RefreshCw } from 'lucide-react';

export const MyTokenPage = () => {
  const { activeToken, cancelActiveToken, checkInToken, notificationMsg, clearNotification } = useQueue();
  const [showQR, setShowQR] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [checkingIn, setCheckingIn] = useState(false);

  const navigate = useNavigate();

  const handleCancel = async () => {
    if (!activeToken) return;
    if (window.confirm(`Are you sure you want to cancel token ${activeToken.tokenNumber}?`)) {
      setCancelling(true);
      try {
        await cancelActiveToken(activeToken.tokenId);
      } finally {
        setCancelling(false);
      }
    }
  };

  const handleCheckIn = async () => {
    if (!activeToken) return;
    setCheckingIn(true);
    try {
      await checkInToken(activeToken.tokenId);
    } finally {
      setCheckingIn(false);
    }
  };

  if (!activeToken) {
    return (
      <div className="page-wrapper">
        <div className="container" style={{ maxWidth: '600px', textAlign: 'center', paddingTop: '60px' }}>
          <div className="glass-panel" style={{ padding: '50px' }}>
            <Ticket size={48} color="var(--accent-cyan)" style={{ marginBottom: '20px' }} />
            <h2 style={{ fontSize: '1.8rem', marginBottom: '12px' }}>No Active Token</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>
              You currently do not have an active queue token in progress. Select a facility service to issue a new virtual token.
            </p>
            <Link to="/select-service" className="btn-primary">
              Select Service & Get Token
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Calculate progress bar indicator percentage (people ahead 0 => 100%, 10 => 10%)
  const maxAheadBaseline = Math.max(10, activeToken.peopleAhead + 1);
  const progressPercent = Math.min(100, Math.max(10, Math.round(((maxAheadBaseline - activeToken.peopleAhead) / maxAheadBaseline) * 100)));

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: '700px' }}>
        {notificationMsg && (
          <div style={{ background: 'rgba(6, 182, 212, 0.2)', border: '1px solid var(--accent-cyan)', color: '#fff', padding: '16px', borderRadius: '14px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} className="pulse-glow">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Bell size={24} color="var(--accent-cyan)" />
              <div>
                <strong style={{ fontSize: '0.95rem' }}>Notification Alert</strong>
                <div style={{ fontSize: '0.85rem' }}>{notificationMsg}</div>
              </div>
            </div>
            <button onClick={clearNotification} className="btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>Dismiss</button>
          </div>
        )}

        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Your Virtual Token</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Live updates refresh automatically in real time</p>
        </div>

        {/* Main Token Card */}
        <div className="glass-panel" style={{ padding: '36px', position: 'relative', overflow: 'hidden' }}>
          {/* Top Status Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '20px', marginBottom: '24px' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Service: {activeToken.serviceName || 'Consultation'}
              </span>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                {activeToken.departmentName || 'Outpatient OPD'}
              </div>
            </div>
            <div className={`badge ${activeToken.status === 'CALLED' || activeToken.status === 'SERVING' ? 'badge-high' : activeToken.status === 'CHECKED_IN' ? 'badge-low' : 'badge-medium'}`}>
              Status: {activeToken.status}
            </div>
          </div>

          {/* Large Token Number Display Box */}
          <div style={{
            background: 'var(--gradient-card)',
            border: '1px solid var(--border-accent)',
            borderRadius: 'var(--radius-lg)',
            padding: '30px',
            textAlign: 'center',
            marginBottom: '28px',
            boxShadow: 'inset 0 0 30px rgba(6, 182, 212, 0.05)'
          }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>
              Your Token Number
            </div>
            <div style={{ fontSize: '4.5rem', fontWeight: 800, fontFamily: 'var(--font-heading)', letterSpacing: '-0.03em', lineHeight: '1.1' }} className="gradient-text">
              {activeToken.tokenNumber}
            </div>
            {activeToken.counterNumber && (
              <div style={{ fontSize: '1.2rem', color: 'var(--accent-amber)', fontWeight: 700, marginTop: '8px' }}>
                Proceed to Counter {activeToken.counterNumber}
              </div>
            )}
          </div>

          {/* Queue Position & AI Wait Time Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '28px' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '14px', border: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <Users size={16} color="var(--accent-cyan)" /> People Ahead
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800 }}>
                {activeToken.peopleAhead}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {activeToken.peopleAhead === 0 ? 'You are next in line!' : `${activeToken.peopleAhead} ahead of you`}
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '14px', border: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <Clock size={16} color="var(--accent-indigo)" /> AI Predicted Wait
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                {activeToken.confidenceRange || `${activeToken.estimatedWaitMinutes} mins`}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Estimated range based on ML model
              </div>
            </div>
          </div>

          {/* Progress Indicator */}
          <div style={{ marginBottom: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              <span>Queue Position Progress</span>
              <span>{progressPercent}% complete</span>
            </div>
            <div style={{ height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${progressPercent}%`, background: 'var(--gradient-primary)', transition: 'width 0.5s ease-in-out' }} />
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <button onClick={() => setShowQR(true)} className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
              <QrCode size={18} /> View QR Code
            </button>

            {activeToken.status === 'WAITING' && (
              <button onClick={handleCheckIn} className="btn-secondary" style={{ flex: 1, justifyContent: 'center', borderColor: 'var(--accent-emerald)', color: 'var(--accent-emerald)' }} disabled={checkingIn}>
                <CheckCircle size={18} /> {checkingIn ? 'Checking In...' : 'Confirm Physical Arrival'}
              </button>
            )}

            <button onClick={handleCancel} className="btn-danger" style={{ flex: 1, justifyContent: 'center' }} disabled={cancelling}>
              <XCircle size={18} /> {cancelling ? 'Cancelling...' : 'Cancel Token'}
            </button>
          </div>
        </div>

        {/* QR Code Modal Popup */}
        {showQR && <QRCodeModal token={activeToken} onClose={() => setShowQR(false)} />}
      </div>
    </div>
  );
};

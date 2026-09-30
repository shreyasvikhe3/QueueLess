import React from 'react';
import { Link } from 'react-router-dom';
import { Ticket, Cpu, ShieldCheck, Clock, ArrowRight, Zap, Users } from 'lucide-react';

export const LandingPage = () => {
  return (
    <div className="page-wrapper">
      <div className="container">
        {/* Hero Section */}
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '40px auto 60px auto' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(6, 182, 212, 0.1)',
            border: '1px solid rgba(6, 182, 212, 0.3)',
            padding: '6px 16px',
            borderRadius: '9999px',
            color: 'var(--accent-cyan)',
            fontSize: '0.85rem',
            fontWeight: 700,
            marginBottom: '24px'
          }}>
            <Zap size={16} /> Zero Waiting In Physical Lines
          </div>

          <h1 style={{ fontSize: '3.2rem', lineHeight: '1.15', marginBottom: '20px' }}>
            Never Stand in a Queue Again with <span className="gradient-text">Smart AI Tokens</span>
          </h1>

          <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', marginBottom: '36px' }}>
            QueueLess replaces long physical queues in hospitals, civic centers, banks, and colleges with virtual tokens, real-time wait predictions, and intelligent turn notifications.
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <Link to="/select-service" className="btn-primary" style={{ padding: '14px 28px', fontSize: '1rem' }}>
              <Ticket size={20} /> Get Virtual Token Now <ArrowRight size={18} />
            </Link>
            <Link to="/about" className="btn-secondary" style={{ padding: '14px 28px', fontSize: '1rem' }}>
              Explore AI Model
            </Link>
          </div>
        </div>

        {/* Live System Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '80px' }}>
          <div className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}>
            <Clock color="var(--accent-cyan)" size={32} style={{ marginBottom: '12px' }} />
            <h3 style={{ fontSize: '2rem', fontWeight: 800 }}>-75%</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Average Physical Wait Reduction</p>
          </div>
          <div className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}>
            <Cpu color="var(--accent-blue)" size={32} style={{ marginBottom: '12px' }} />
            <h3 style={{ fontSize: '2rem', fontWeight: 800 }}>91%</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>ML Wait-Time Model Accuracy</p>
          </div>
          <div className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}>
            <Users color="var(--accent-emerald)" size={32} style={{ marginBottom: '12px' }} />
            <h3 style={{ fontSize: '2rem', fontWeight: 800 }}>Live</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Real-Time Crowd Density Gauges</p>
          </div>
          <div className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}>
            <ShieldCheck color="var(--accent-amber)" size={32} style={{ marginBottom: '12px' }} />
            <h3 style={{ fontSize: '2rem', fontWeight: 800 }}>100%</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Duplicate Token & Fraud Protection</p>
          </div>
        </div>

        {/* Feature Cards Section */}
        <div style={{ marginBottom: '80px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '10px' }}>How QueueLess Works</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Complete seamless 4-step digital queue experience</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
            <div className="glass-panel" style={{ padding: '30px' }}>
              <div style={{ width: '40px', height: '40px', background: 'rgba(6,182,212,0.15)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-cyan)', fontWeight: 800, marginBottom: '16px' }}>1</div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Select Facility & Service</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Choose your desired department and service directly from your phone or laptop.</p>
            </div>

            <div className="glass-panel" style={{ padding: '30px' }}>
              <div style={{ width: '40px', height: '40px', background: 'rgba(59,130,246,0.15)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-blue)', fontWeight: 800, marginBottom: '16px' }}>2</div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Instant Virtual Token</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Receive a unique token number and QR code with AI-predicted waiting range.</p>
            </div>

            <div className="glass-panel" style={{ padding: '30px' }}>
              <div style={{ width: '40px', height: '40px', background: 'rgba(99,102,241,0.15)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-indigo)', fontWeight: 800, marginBottom: '16px' }}>3</div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Real-Time Tracking</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Watch your queue position update in real time while relaxing elsewhere.</p>
            </div>

            <div className="glass-panel" style={{ padding: '30px' }}>
              <div style={{ width: '40px', height: '40px', background: 'rgba(16,185,129,0.15)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-emerald)', fontWeight: 800, marginBottom: '16px' }}>4</div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Turn Approaching Alert</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Receive web push notifications when your turn is near, proceed to assigned counter.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

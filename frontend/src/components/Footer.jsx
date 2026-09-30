import React from 'react';
import { Layers, ShieldCheck, Cpu } from 'lucide-react';

export const Footer = () => {
  return (
    <footer style={{
      background: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border-light)',
      padding: '40px 0 20px 0',
      color: 'var(--text-secondary)',
      fontSize: '0.875rem'
    }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '30px', marginBottom: '30px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <Layers color="var(--accent-cyan)" size={22} />
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-heading)' }}>QueueLess</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Next-generation smart digital queue management system powered by AI waiting-time inference and live crowd density monitoring.
          </p>
        </div>

        <div>
          <h4 style={{ color: '#fff', marginBottom: '12px', fontSize: '0.95rem' }}>AI Features</h4>
          <ul style={{ listStyle: 'none', lineHeight: '2' }}>
            <li><Cpu size={14} style={{ display: 'inline', marginRight: '6px' }} /> Machine Learning Wait Prediction</li>
            <li><ShieldCheck size={14} style={{ display: 'inline', marginRight: '6px' }} /> Multi-Model Ensembles</li>
            <li>Live Dynamic Re-balancing</li>
            <li>No-Show Auto Grace Handling</li>
          </ul>
        </div>

        <div>
          <h4 style={{ color: '#fff', marginBottom: '12px', fontSize: '0.95rem' }}>Quick Support</h4>
          <p>Need assistance or API docs?</p>
          <p style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>support@queueless-ai.org</p>
        </div>
      </div>

      <div style={{ textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        © {new Date().getFullYear()} QueueLess AI Systems. All rights reserved. Engineered for zero physical lines.
      </div>
    </footer>
  );
};

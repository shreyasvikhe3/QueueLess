import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, CheckCircle, Smartphone } from 'lucide-react';

export const QRCodeModal = ({ token, onClose }) => {
  if (!token) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000
    }}>
      <div className="glass-panel" style={{ width: '90%', maxWidth: '420px', padding: '30px', textAlign: 'center', position: 'relative' }}>
        <button onClick={onClose} style={{
          position: 'absolute',
          top: '15px',
          right: '15px',
          background: 'none',
          border: 'none',
          color: 'var(--text-muted)',
          cursor: 'pointer'
        }}>
          <X size={24} />
        </button>

        <h3 style={{ fontSize: '1.4rem', marginBottom: '6px' }}>Virtual Token QR Code</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
          Scan this QR code at facility kiosk or staff counter to confirm physical check-in.
        </p>

        <div style={{
          background: '#fff',
          padding: '20px',
          borderRadius: '16px',
          display: 'inline-block',
          boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
          marginBottom: '20px'
        }}>
          <QRCodeSVG value={token.qrCodeData || `QUELESS:${token.tokenNumber}`} size={200} />
        </div>

        <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--accent-cyan)' }}>
          {token.tokenNumber}
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
          Token ID: {token.tokenId}
        </div>

        <div style={{ marginTop: '20px', background: 'rgba(16, 185, 129, 0.1)', padding: '10px', borderRadius: '10px', border: '1px solid rgba(16, 185, 129, 0.2)', fontSize: '0.8rem', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <Smartphone size={16} /> Present when called at counter
        </div>
      </div>
    </div>
  );
};

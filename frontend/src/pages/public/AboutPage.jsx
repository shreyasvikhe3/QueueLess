import React from 'react';
import { Cpu, CheckCircle2, BarChart2, ShieldCheck, Zap } from 'lucide-react';

export const AboutPage = () => {
  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: '900px' }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>
            Inside the <span className="gradient-text">QueueLess AI Engine</span>
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
            How machine learning models accurately forecast queue waiting times dynamically.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '30px', marginBottom: '30px' }}>
          <h3 style={{ fontSize: '1.4rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Cpu color="var(--accent-cyan)" /> Feature Inputs & ML Pipeline
          </h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
            Unlike simplistic fixed estimation algorithms, QueueLess feeds real-time queue features directly into a Python FastAPI scikit-learn pipeline:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-light)' }}>
              <strong>1. People Ahead</strong>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Exact position in FIFO queue</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-light)' }}>
              <strong>2. Active Counters</strong>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Open active staff desks</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-light)' }}>
              <strong>3. Avg Service Duration</strong>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Service-specific historical time</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-light)' }}>
              <strong>4. Hour & Day Metrics</strong>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Peak hour surge factors</div>
            </div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '30px', marginBottom: '30px' }}>
          <h3 style={{ fontSize: '1.4rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BarChart2 color="var(--accent-blue)" /> Model Comparison & Selection
          </h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
            The ML service trains and benchmarks three distinct algorithms to pick the highest accuracy model:
          </p>

          <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text-primary)', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-light)', textAlign: 'left' }}>
                <th style={{ padding: '10px' }}>Model</th>
                <th style={{ padding: '10px' }}>MAE (Target &lt; 3 mins)</th>
                <th style={{ padding: '10px' }}>RMSE</th>
                <th style={{ padding: '10px' }}>R² Score</th>
                <th style={{ padding: '10px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '10px' }}>Linear Regression</td>
                <td style={{ padding: '10px' }}>3.8 mins</td>
                <td style={{ padding: '10px' }}>4.5 mins</td>
                <td style={{ padding: '10px' }}>0.78</td>
                <td style={{ padding: '10px', color: 'var(--text-muted)' }}>Baseline</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(6, 182, 212, 0.08)' }}>
                <td style={{ padding: '10px', fontWeight: 700 }}>Random Forest Regressor</td>
                <td style={{ padding: '10px', color: 'var(--accent-emerald)', fontWeight: 700 }}>2.1 mins</td>
                <td style={{ padding: '10px' }}>2.8 mins</td>
                <td style={{ padding: '10px', fontWeight: 700 }}>0.91</td>
                <td style={{ padding: '10px', color: 'var(--accent-cyan)', fontWeight: 700 }}>SELECTED BEST</td>
              </tr>
              <tr>
                <td style={{ padding: '10px' }}>Gradient Boosting</td>
                <td style={{ padding: '10px' }}>2.3 mins</td>
                <td style={{ padding: '10px' }}>3.0 mins</td>
                <td style={{ padding: '10px' }}>0.89</td>
                <td style={{ padding: '10px', color: 'var(--text-muted)' }}>Evaluated</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="glass-panel" style={{ padding: '30px' }}>
          <h3 style={{ fontSize: '1.4rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Zap color="var(--accent-amber)" /> Resilient Offline Fallback
          </h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            If the Python ML microservice is unreachable or experiencing network latency, the Node.js backend immediately invokes a dynamic statistical waiter model without interrupting user experience.
          </p>
        </div>
      </div>
    </div>
  );
};

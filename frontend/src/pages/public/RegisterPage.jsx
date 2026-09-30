import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserPlus, User, Mail, Key, Phone, ShieldAlert } from 'lucide-react';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'USER'
  });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await register(formData);
      if (res.user.role === 'ADMIN') navigate('/admin-dashboard');
      else if (res.user.role === 'STAFF') navigate('/staff-dashboard');
      else navigate('/my-token');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="container" style={{ maxWidth: '480px' }}>
        <div className="glass-panel" style={{ padding: '36px' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>Create Account</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Join QueueLess for digital token access</p>
          </div>

          {error && (
            <div style={{ background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.3)', color: 'var(--accent-rose)', padding: '12px', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldAlert size={16} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" name="name" className="form-control" placeholder="John Doe" value={formData.name} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" name="email" className="form-control" placeholder="john@example.com" value={formData.email} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label className="form-label">Mobile Phone Number</label>
              <input type="tel" name="phone" className="form-control" placeholder="+1 555 0199" value={formData.phone} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" name="password" className="form-control" placeholder="••••••••" value={formData.password} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label className="form-label">Account Role</label>
              <select name="role" className="form-control" value={formData.role} onChange={handleChange}>
                <option value="USER" style={{ background: '#131b2e' }}>Citizen / Patient / Customer (User)</option>
                <option value="STAFF" style={{ background: '#131b2e' }}>Counter Operator (Staff)</option>
                <option value="ADMIN" style={{ background: '#131b2e' }}>System Administrator (Admin)</option>
              </select>
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }} disabled={submitting}>
              <UserPlus size={18} /> {submitting ? 'Creating Account...' : 'Register Account'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Already have an account? <Link to="/login" style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

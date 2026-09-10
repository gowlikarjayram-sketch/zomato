import React, { useState } from 'react';
import './Signup.css';

const Signup = ({ onNavigate, onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('caterings'); // caterings, restaurant, cloud_kitchen
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
    setError('');
    setSuccess('');
  };

  const validate = () => {
    if (!isLogin && !form.name.trim()) return 'Please enter your name.';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) return 'Please enter a valid email.';
    if (form.password.length < 6) return 'Password must be at least 6 characters.';
    if (!isLogin && !/^[0-9]{7,15}$/.test(form.phone)) return 'Please enter a valid phone number.';
    return '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    // Placeholder API Call
    if (isLogin) {
      setSuccess(`Logged in successfully as ${role}! Redirecting...`);
      setTimeout(() => {
        if (onLogin) onLogin({ name: form.name || 'User', email: form.email, role });
      }, 1500);
    } else {
      setSuccess('Account created successfully! Please log in.');
      setTimeout(() => {
        setIsLogin(true);
        setSuccess('');
      }, 1500);
    }
    setForm({ name: '', email: '', password: '', phone: '' });
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>{isLogin ? 'Welcome Back!' : 'Join FoodNest'}</h2>
          <p>{isLogin ? 'Sign in to satisfy your cravings.' : 'Create an account to get the best food delivered.'}</p>
        </div>

        {error && <div className="auth-alert error-alert">{error}</div>}
        {success && <div className="auth-alert success-alert">{success}</div>}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="role-selector">
            <button 
              type="button" 
              className={`role-btn ${role === 'caterings' ? 'active' : ''}`}
              onClick={() => setRole('caterings')}
            >Caterings</button>
            <button 
              type="button" 
              className={`role-btn ${role === 'restaurant' ? 'active' : ''}`}
              onClick={() => setRole('restaurant')}
            >Restaurant</button>
            <button 
              type="button" 
              className={`role-btn ${role === 'cloud_kitchen' ? 'active' : ''}`}
              onClick={() => setRole('cloud_kitchen')}
            >Cloud Kitchen</button>
          </div>

          <div className={`form-fields-wrapper ${isLogin ? 'is-login' : 'is-signup'}`}>
            {!isLogin && (
              <div className="input-group slide-in">
                <span className="input-icon">👤</span>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  type="text"
                  placeholder="Full Name"
                  required={!isLogin}
                />
              </div>
            )}

            <div className="input-group">
              <span className="input-icon">✉️</span>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                type="email"
                placeholder="Email Address"
                required
              />
            </div>

            {!isLogin && (
              <div className="input-group slide-in">
                <span className="input-icon">📱</span>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  type="tel"
                  placeholder="Phone Number"
                  required={!isLogin}
                />
              </div>
            )}

            <div className="input-group">
              <span className="input-icon">🔒</span>
              <input
                name="password"
                value={form.password}
                onChange={handleChange}
                type="password"
                placeholder="Password"
                required
              />
            </div>
          </div>

          <button type="submit" className="auth-submit-btn">
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>


        <div className="auth-footer">
          {isLogin ? (
            <p>Don't have an account? <span className="auth-toggle-link" onClick={() => { setIsLogin(false); setError(''); setSuccess(''); }}>Sign Up</span></p>
          ) : (
            <p>Already have an account? <span className="auth-toggle-link" onClick={() => { setIsLogin(true); setError(''); setSuccess(''); }}>Sign In</span></p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;
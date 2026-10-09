import { useState } from 'react';
import './Signup.css';

const Signup = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('customer'); // customer, caterings, restaurant, cloud_kitchen
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
    setErrors((s) => ({ ...s, [name]: '' }));
    setGlobalError('');
    setSuccess('');
  };

  const validate = () => {
    const newErrors = {};
    if (!isLogin && !form.name.trim()) newErrors.name = 'Please enter your full name.';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) newErrors.email = 'Please enter a valid email address.';
    if (!form.password) newErrors.password = 'Password is required.';
    else if (form.password.length < 6) newErrors.password = 'Password must be at least 6 characters.';
    if (!isLogin && !/^[0-9]{10,15}$/.test(form.phone)) newErrors.phone = 'Please enter a valid phone number.';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validate();
    if (!isValid) {
      return;
    }
    
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, role: 'customer' })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      // Store the JWT token and auto-login for both Sign In and Sign Up
      setSuccess(isLogin ? 'Logged in successfully! Redirecting...' : 'Account created successfully! Redirecting...');
      localStorage.setItem('token', data.token);
      
      setTimeout(() => {
        if (onLogin) onLogin(data.user);
      }, 1500);

      if (!isLogin) {
        setForm({ name: '', email: '', password: '', phone: '' });
      }
    } catch (err) {
      setGlobalError(err.message);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>{isLogin ? 'Welcome Back!' : 'Join FoodNest'}</h2>
          <p>{isLogin ? 'Sign in to satisfy your cravings.' : 'Create an account to get the best food delivered.'}</p>
        </div>

        {globalError && <div className="auth-alert error-alert">{globalError}</div>}
        {success && <div className="auth-alert success-alert">{success}</div>}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className={`form-fields-wrapper ${isLogin ? 'is-login' : 'is-signup'}`}>
            {!isLogin && (
              <div className="input-group-wrapper slide-in">
                <div className={`input-group ${errors.name ? 'has-error' : ''}`}>
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
                {errors.name && <span className="field-error-text">{errors.name}</span>}
              </div>
            )}

            <div className="input-group-wrapper">
              <div className={`input-group ${errors.email ? 'has-error' : ''}`}>
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
              {errors.email && <span className="field-error-text">{errors.email}</span>}
            </div>

            {!isLogin && (
              <div className="input-group-wrapper slide-in">
                <div className={`input-group ${errors.phone ? 'has-error' : ''}`}>
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
                {errors.phone && <span className="field-error-text">{errors.phone}</span>}
              </div>
            )}

            <div className="input-group-wrapper">
              <div className={`input-group ${errors.password ? 'has-error' : ''}`}>
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
              {errors.password && <span className="field-error-text">{errors.password}</span>}
            </div>
          </div>

          <button type="submit" className="auth-submit-btn">
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>


        <div className="auth-footer">
          {isLogin ? (
            <p>Don't have an account? <span className="auth-toggle-link" onClick={() => { setIsLogin(false); setGlobalError(''); setErrors({}); setSuccess(''); }}>Sign Up</span></p>
          ) : (
            <p>Already have an account? <span className="auth-toggle-link" onClick={() => { setIsLogin(true); setGlobalError(''); setErrors({}); setSuccess(''); }}>Sign In</span></p>
          )}
          <div style={{ marginTop: '16px', borderTop: '1px solid #eee', paddingTop: '16px' }}>
            <p style={{ fontSize: '0.85rem' }}>Business Owner? <a href="#partner-signup" style={{color: '#ff6b6b', fontWeight: 'bold', textDecoration: 'none'}}>Partner with us</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
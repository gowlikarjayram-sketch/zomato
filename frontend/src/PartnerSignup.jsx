import { useState } from 'react';
import './Signup.css';

const PartnerSignup = ({ onLogin }) => {
  const [role, setRole] = useState('restaurant');
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    phone: '',
    businessName: '',
    fssaiNumber: '',
    address: ''
  });
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState('');
  const [success, setSuccess] = useState('');
  const [isPending, setIsPending] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
    setErrors((s) => ({ ...s, [name]: '' }));
    setGlobalError('');
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Owner name is required.';
    if (!form.businessName.trim()) newErrors.businessName = 'Business name is required.';
    if (!form.fssaiNumber.trim()) newErrors.fssaiNumber = 'FSSAI Number is required for verification.';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) newErrors.email = 'Please enter a valid email address.';
    if (!form.password || form.password.length < 6) newErrors.password = 'Password must be at least 6 characters.';
    if (!/^[0-9]{10,15}$/.test(form.phone)) newErrors.phone = 'Please enter a valid phone number.';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    try {
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone,
        role: role,
        businessDetails: {
          businessName: form.businessName,
          fssaiNumber: form.fssaiNumber,
          address: form.address
        }
      };

      const response = await fetch(`http://localhost:5000/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setSuccess('Application submitted successfully! Our team is verifying your details.');
      setIsPending(true);
      
      // Clear form
      setForm({ name: '', email: '', password: '', phone: '', businessName: '', fssaiNumber: '', address: '' });
    } catch (err) {
      setGlobalError(err.message);
    }
  };

  if (isPending) {
    return (
      <div className="auth-page-container">
        <div className="auth-card" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '3rem', marginBottom: '10px' }}>⏳</h2>
          <h2>Application Pending</h2>
          <p style={{ color: '#666', marginTop: '10px' }}>
            Thank you for applying to partner with FoodNest! Our background verification team is reviewing your FSSAI and business details.
            <br/><br/>
            You will receive an email once your dashboard access is approved.
          </p>
          <button 
            className="auth-submit-btn" 
            style={{ marginTop: '30px', width: '100%' }}
            onClick={() => window.location.hash = 'home'}
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page-container">
      <div className="auth-card" style={{ maxWidth: '500px' }}>
        <div className="auth-header">
          <h2>Partner with FoodNest</h2>
          <p>Grow your business with thousands of hungry customers.</p>
        </div>

        {globalError && <div className="auth-alert error-alert">{globalError}</div>}
        {success && <div className="auth-alert success-alert">{success}</div>}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {/* Role Selection */}
          <div className="input-group-wrapper" style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#444', marginLeft: '12px', marginBottom: '4px', display: 'block' }}>Business Type</label>
            <div className="input-group">
              <span className="input-icon">🏢</span>
              <select 
                className="role-dropdown"
                value={role} 
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="restaurant">Restaurant Partner</option>
                <option value="cloud_kitchen">Cloud Kitchen Partner</option>
                <option value="caterings">Catering Partner</option>
              </select>
              <span className="dropdown-arrow" style={{ position: 'absolute', right: '16px', fontSize: '0.8rem', color: '#888', pointerEvents: 'none' }}>▼</span>
            </div>
          </div>

          <div className="form-fields-wrapper">
            <div className="input-group-wrapper">
              <div className={`input-group ${errors.businessName ? 'has-error' : ''}`}>
                <span className="input-icon">🏪</span>
                <input name="businessName" value={form.businessName} onChange={handleChange} type="text" placeholder="Business Name" />
              </div>
              {errors.businessName && <span className="field-error-text">{errors.businessName}</span>}
            </div>

            <div className="input-group-wrapper">
              <div className={`input-group ${errors.fssaiNumber ? 'has-error' : ''}`}>
                <span className="input-icon">📜</span>
                <input name="fssaiNumber" value={form.fssaiNumber} onChange={handleChange} type="text" placeholder="FSSAI License Number" />
              </div>
              {errors.fssaiNumber && <span className="field-error-text">{errors.fssaiNumber}</span>}
            </div>

            <div className="input-group-wrapper">
              <div className={`input-group ${errors.name ? 'has-error' : ''}`}>
                <span className="input-icon">👤</span>
                <input name="name" value={form.name} onChange={handleChange} type="text" placeholder="Owner Full Name" />
              </div>
              {errors.name && <span className="field-error-text">{errors.name}</span>}
            </div>

            <div className="input-group-wrapper">
              <div className={`input-group ${errors.email ? 'has-error' : ''}`}>
                <span className="input-icon">✉️</span>
                <input name="email" value={form.email} onChange={handleChange} type="email" placeholder="Business Email" />
              </div>
              {errors.email && <span className="field-error-text">{errors.email}</span>}
            </div>

            <div className="input-group-wrapper">
              <div className={`input-group ${errors.phone ? 'has-error' : ''}`}>
                <span className="input-icon">📱</span>
                <input name="phone" value={form.phone} onChange={handleChange} type="tel" placeholder="Phone Number" />
              </div>
              {errors.phone && <span className="field-error-text">{errors.phone}</span>}
            </div>

            <div className="input-group-wrapper">
              <div className={`input-group ${errors.password ? 'has-error' : ''}`}>
                <span className="input-icon">🔒</span>
                <input name="password" value={form.password} onChange={handleChange} type="password" placeholder="Password" />
              </div>
              {errors.password && <span className="field-error-text">{errors.password}</span>}
            </div>
          </div>

          <button type="submit" className="auth-submit-btn">
            Submit Application
          </button>
        </form>

        <div className="auth-footer">
          <p>Already a verified partner? <a href="#signup" style={{color: '#ff6b6b', fontWeight: 'bold'}}>Sign In</a></p>
        </div>
      </div>
    </div>
  );
};

export default PartnerSignup;

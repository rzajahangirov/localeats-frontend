import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/api';
import './AdminAuth.css';

const AdminRegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.surname.trim()) newErrors.surname = 'Surname is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Valid corporate email required';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Minimum 6 characters';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (apiError) setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setApiError('');

    try {
      // POST mapping specifically requested
      await api.post('/api/auth/admin/register', formData);
      navigate('/admin/login');
    } catch (err) {
      if (err.response?.data?.message) {
        setApiError(err.response.data.message);
      } else {
        setApiError('System registration failed. Please contact engineering.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-auth-page">
      <div className="admin-auth-panel">
        <div className="admin-auth-header">
          <div className="admin-logo">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
              <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="admin-title">Admin Registration</h1>
          <p className="admin-subtitle">Secure access initialization</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label htmlFor="name" className="admin-label">First Name</label>
              <div className="admin-input-wrapper">
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`admin-input ${errors.name ? 'error' : ''}`}
                  placeholder="System"
                />
              </div>
              {errors.name && <span className="admin-field-error">{errors.name}</span>}
            </div>
            
            <div className="admin-form-group">
              <label htmlFor="surname" className="admin-label">Last Name</label>
              <div className="admin-input-wrapper">
                <input
                  type="text"
                  id="surname"
                  name="surname"
                  value={formData.surname}
                  onChange={handleChange}
                  className={`admin-input ${errors.surname ? 'error' : ''}`}
                  placeholder="Admin"
                />
              </div>
              {errors.surname && <span className="admin-field-error">{errors.surname}</span>}
            </div>
          </div>

          <div className="admin-form-group">
            <label htmlFor="email" className="admin-label">Corporate Email Address</label>
            <div className="admin-input-wrapper">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`admin-input ${errors.email ? 'error' : ''}`}
                placeholder="admin@localeats.com"
              />
            </div>
            {errors.email && <span className="admin-field-error">{errors.email}</span>}
          </div>

          <div className="admin-form-group">
            <label htmlFor="password" className="admin-label">System Password</label>
            <div className="admin-input-wrapper">
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`admin-input ${errors.password ? 'error' : ''}`}
                placeholder="••••••••"
              />
            </div>
            {errors.password && <span className="admin-field-error">{errors.password}</span>}
          </div>

          {apiError && (
            <div className="admin-error-box">
              <svg viewBox="0 0 24 24" fill="none" width="18" height="18" style={{minWidth: 18}}>
                <path d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span>{apiError}</span>
            </div>
          )}

          <button type="submit" className="admin-submit-btn" disabled={loading}>
            {loading ? <span className="admin-loader"></span> : 'Initialize Root Access'}
          </button>
        </form>

        <div className="admin-auth-footer">
          Already verified? <Link to="/admin/login" className="admin-link">Log in here</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminRegisterPage;

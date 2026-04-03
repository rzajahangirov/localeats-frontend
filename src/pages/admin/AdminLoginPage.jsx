import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/api';
import './AdminAuth.css';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = 'Email required';
    if (!formData.password) newErrors.password = 'Password required';
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
      const response = await api.post('/api/auth/login', formData);
      const { accessToken, token: refreshToken } = response.data;

      if (!accessToken) {
        setApiError('Session allocation failed.');
        setLoading(false);
        return;
      }

      // Explicitly save as adminToken (Backend handles actual authorization)
      localStorage.setItem('adminToken', accessToken);
      if (refreshToken) {
        localStorage.setItem('adminRefreshToken', refreshToken);
      }

      navigate('/admin/dashboard');
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        setApiError('Invalid credentials.');
      } else if (err.response?.data?.message) {
        setApiError(err.response.data.message);
      } else {
        setApiError('System offline or unreachable.');
      }
    } finally {
      if (apiError === '') {
        setLoading(false);
      } else {
        setLoading(false);
      }
    }
  };

  return (
    <div className="admin-auth-page">
      <div className="admin-auth-panel">
        <div className="admin-auth-header">
          <div className="admin-logo">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 15V17M6 21H18C19.1046 21 20 20.1046 20 19V5C20 3.89543 19.1046 3 18 3H6C4.89543 3 4 3.89543 4 5V19C4 20.1046 4.89543 21 6 21ZM16 11C16 13.2091 14.2091 15 12 15C9.79086 15 8 13.2091 8 11C8 8.79086 9.79086 7 12 7C14.2091 7 16 8.79086 16 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="admin-title">System Authentication</h1>
          <p className="admin-subtitle">Provide your credentials</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="admin-form-group">
            <label htmlFor="email" className="admin-label">Corporate Email</label>
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
            <label htmlFor="password" className="admin-label">Password</label>
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
            {loading ? <span className="admin-loader"></span> : 'Establish Session'}
          </button>
        </form>

        <div className="admin-auth-footer">
          Request system access? <Link to="/admin/register" className="admin-link">Register</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/api';
import './CustomerRegisterPage.css';

const CustomerRegisterPage = () => {
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
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'First name is required';
    if (!formData.surname.trim()) newErrors.surname = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Please enter a valid email';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
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
      const payload = {
        name: formData.name,
        surname: formData.surname,
        email: formData.email,
        password: formData.password,
        roleName: 'CUSTOMER',
      };
      await api.post('/api/auth/register', payload);
      navigate('/login');
    } catch (err) {
      if (err.response?.data?.message) {
        setApiError(err.response.data.message);
      } else if (err.response?.data) {
        setApiError(typeof err.response.data === 'string' ? err.response.data : 'Registration failed. Please try again.');
      } else {
        setApiError('Unable to connect to server. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      {/* Header */}
      <header className="register-header">
        <div className="header-logo">
          <svg className="logo-icon" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="14" cy="14" r="13" stroke="#DC2626" strokeWidth="2"/>
            <path d="M9 14C9 11.2386 11.2386 9 14 9C16.7614 9 19 11.2386 19 14" stroke="#DC2626" strokeWidth="2" strokeLinecap="round"/>
            <path d="M7 18L14 11L21 18" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="logo-text">LocalEats</span>
        </div>
        <nav className="header-nav">
          <Link to="/partner/register" className="nav-link" id="register-business-link">Register your business</Link>
          <Link to="/login" className="nav-link" id="login-link">Login</Link>
          <button className="nav-signup-btn" id="signup-header-btn">Sign Up</button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="register-main">
        {/* Left Panel — Brand Hero */}
        <div className="register-hero">
          <div className="hero-content">
            <span className="hero-badge animate-fade-in-up">THE CULINARY CURATOR</span>
            <h1 className="hero-title animate-fade-in-up delay-1">
              Experience food<br />
              as <span className="hero-title-accent">art.</span>
            </h1>
            <p className="hero-subtitle animate-fade-in-up delay-2">
              Join our community of food lovers discovering the most exquisite local culinary masterpieces.
            </p>
            <div className="hero-image-container animate-fade-in-up delay-3">
              <img
                src="/images/restaurant-hero.png"
                alt="Elegant restaurant interior"
                className="hero-image"
              />
              <div className="hero-image-overlay">
                <blockquote className="hero-quote">
                  "The best meals aren't delivered, they're curated."
                  <cite>— Chef Julian, LocalEats Partner</cite>
                </blockquote>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel — Registration Form */}
        <div className="register-form-panel">
          <div className="form-container animate-slide-in-right">
            <div className="form-header">
              <h2 className="form-title">Create Account</h2>
              <p className="form-subtitle">Begin your journey with LocalEats</p>
            </div>

            <form onSubmit={handleSubmit} className="register-form" id="register-form" noValidate>
              {/* Name Row */}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name" className="form-label">First Name</label>
                  <div className={`input-wrapper ${errors.name ? 'input-error' : ''}`}>
                    <svg className="input-icon" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 10C12.2091 10 14 8.20914 14 6C14 3.79086 12.2091 2 10 2C7.79086 2 6 3.79086 6 6C6 8.20914 7.79086 10 10 10Z" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M3 18C3 14.134 6.13401 11 10 11C13.866 11 17 14.134 17 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="John"
                      value={formData.name}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
                  {errors.name && <span className="field-error">{errors.name}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="surname" className="form-label">Last Name</label>
                  <div className={`input-wrapper ${errors.surname ? 'input-error' : ''}`}>
                    <svg className="input-icon" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 10C12.2091 10 14 8.20914 14 6C14 3.79086 12.2091 2 10 2C7.79086 2 6 3.79086 6 6C6 8.20914 7.79086 10 10 10Z" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M3 18C3 14.134 6.13401 11 10 11C13.866 11 17 14.134 17 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    <input
                      type="text"
                      id="surname"
                      name="surname"
                      placeholder="Doe"
                      value={formData.surname}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
                  {errors.surname && <span className="field-error">{errors.surname}</span>}
                </div>
              </div>

              {/* Email */}
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email Address</label>
                <div className={`input-wrapper ${errors.email ? 'input-error' : ''}`}>
                  <svg className="input-icon" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2" y="4" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M2 6L10 11L18 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="gourmet@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
                {errors.email && <span className="field-error">{errors.email}</span>}
              </div>

              {/* Password */}
              <div className="form-group">
                <label htmlFor="password" className="form-label">Password</label>
                <div className={`input-wrapper ${errors.password ? 'input-error' : ''}`}>
                  <svg className="input-icon" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="4" y="9" width="12" height="9" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M7 9V6C7 4.34315 8.34315 3 10 3C11.6569 3 13 4.34315 13 6V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <circle cx="10" cy="13.5" r="1.5" fill="currentColor"/>
                  </svg>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="form-input"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    id="toggle-password-btn"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? (
                      <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 3L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        <path d="M10 5C5.5 5 2 10 2 10C2 10 3.5 12.5 6 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        <path d="M10 15C14.5 15 18 10 18 10C18 10 16.5 7.5 14 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    ) : (
                      <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 5C5.5 5 2 10 2 10C2 10 5.5 15 10 15C14.5 15 18 10 18 10C18 10 14.5 5 10 5Z" stroke="currentColor" strokeWidth="1.5"/>
                        <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.5"/>
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && <span className="field-error">{errors.password}</span>}
              </div>

              {/* API Error */}
              {apiError && (
                <div className="api-error-box" role="alert">
                  <svg className="error-icon" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="10" cy="10" r="8" stroke="#DC2626" strokeWidth="1.5"/>
                    <path d="M10 6V11" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round"/>
                    <circle cx="10" cy="14" r="0.75" fill="#DC2626"/>
                  </svg>
                  <span>{apiError}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className={`submit-btn ${loading ? 'loading' : ''}`}
                id="register-submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <span className="btn-loader"></span>
                ) : (
                  <>
                    Create Account
                    <svg className="btn-arrow" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="form-divider">
                <span>OR CONTINUE WITH</span>
              </div>

              {/* Social Buttons */}
              <div className="social-buttons">
                <button type="button" className="social-btn" id="google-login-btn">
                  <svg viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
                    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
                    <path d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
                  </svg>
                  Google
                </button>
                <button type="button" className="social-btn" id="apple-login-btn">
                  <svg viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14.94 9.88c-.02-2.12 1.73-3.14 1.81-3.19-1-1.44-2.53-1.64-3.07-1.66-1.29-.14-2.54.77-3.2.77-.67 0-1.68-.76-2.77-.73-1.41.02-2.72.83-3.45 2.1-1.49 2.58-.38 6.37 1.05 8.46.72 1.02 1.56 2.17 2.67 2.13 1.08-.04 1.49-.69 2.79-.69 1.3 0 1.67.69 2.79.67 1.15-.02 1.87-1.03 2.56-2.06.82-1.17 1.15-2.32 1.16-2.38-.03-.01-2.22-.85-2.24-3.39l-.1-.03zM12.87 3.17c.57-.72.97-1.7.86-2.7-.84.04-1.88.58-2.48 1.28-.53.62-1.01 1.63-.88 2.59.93.07 1.89-.48 2.5-1.17z" fill="#1A1A1A"/>
                  </svg>
                  Apple
                </button>
              </div>

              {/* Footer Link */}
              <div className="form-footer-text">
                <p>Already have an account? <Link to="/login" className="form-link" id="sign-in-link">Sign In</Link></p>
                <p style={{ marginTop: '0.5rem' }}>Are you a restaurant owner? <Link to="/partner/register" className="form-link">Register your business here</Link></p>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="register-footer">
        <div className="footer-left">
          <span className="footer-logo">LocalEats</span>
          <span className="footer-copy">© 2024 LocalEats. The Culinary Curator.</span>
        </div>
        <div className="footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Help Center</a>
          <a href="#">Contact Us</a>
        </div>
      </footer>
    </div>
  );
};

export default CustomerRegisterPage;

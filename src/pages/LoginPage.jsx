import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/api';
import './LoginPage.css';

const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    const newErrors = {};
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
      const response = await api.post('/api/auth/login', {
        email: formData.email,
        password: formData.password,
      });

      const { accessToken, token } = response.data;

      if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
      }
      if (token) {
        localStorage.setItem('refreshToken', token);
      }

      // Decode token to find role
      const decoded = parseJwt(accessToken);
      let userRole = '';
      
      // Handle various common ways roles are stored in JWTs from Spring Boot
      if (decoded) {
        if (decoded.roleName) userRole = decoded.roleName;
        else if (decoded.role) userRole = decoded.role;
        else if (decoded.roles && decoded.roles.length > 0) userRole = decoded.roles[0];
        else if (decoded.authorities && decoded.authorities.length > 0) {
          const auth = decoded.authorities[0];
          userRole = typeof auth === 'object' ? auth.authority : auth;
        }
      }

      // Default redirect logic based on found role
      if (userRole === 'CUSTOMER' || userRole === 'ROLE_CUSTOMER') {
        navigate('/home');
      } else if (userRole === 'RESTAURANT_OWNER' || userRole === 'ROLE_RESTAURANT_OWNER') {
        navigate('/dashboard/restaurant');
      } else {
        // Fallback if role is not identifiable
        navigate('/home');
      }
    } catch (err) {
      if (err.response?.data?.message) {
        setApiError(err.response.data.message);
      } else if (err.response?.status === 401) {
        setApiError('Invalid email or password. Please try again.');
      } else if (err.response?.data) {
        setApiError(typeof err.response.data === 'string' ? err.response.data : 'Login failed. Please try again.');
      } else {
        setApiError('Unable to connect to server. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Header */}
      <header className="login-header">
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
          <Link to="/register" className="nav-signup-btn" id="signup-header-btn">Sign Up</Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="login-main">
        {/* Left Panel — Brand Hero */}
        <div className="login-hero">
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

            {/* Restaurant Owner CTA */}
            <div className="hero-cta animate-fade-in-up delay-4">
              <div className="cta-icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L14.5 9H22L16 13.5L18 21L12 16.5L6 21L8 13.5L2 9H9.5L12 2Z" stroke="#DC2626" strokeWidth="1.5" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="cta-content">
                <span className="cta-title">Are you a restaurant owner?</span>
                <span className="cta-subtitle">Join our curated list of gourmet partners.</span>
              </div>
              <Link to="/partner/register" className="cta-link">Register here</Link>
            </div>
          </div>
        </div>

        {/* Right Panel — Login Form */}
        <div className="login-form-panel">
          <div className="form-container animate-slide-in-right">
            <div className="form-header">
              <h2 className="form-title">Welcome Back</h2>
              <p className="form-subtitle">Please enter your culinary credentials.</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form" id="login-form" noValidate>
              {/* Email */}
              <div className="form-group">
                <label htmlFor="login-email" className="form-label">Email Address</label>
                <div className={`input-wrapper ${errors.email ? 'input-error' : ''}`}>
                  <svg className="input-icon" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2" y="4" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M2 6L10 11L18 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  <input
                    type="email"
                    id="login-email"
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
                <div className="label-row">
                  <label htmlFor="login-password" className="form-label">Password</label>
                  <a href="#" className="forgot-link" id="forgot-password-link">Forgot?</a>
                </div>
                <div className={`input-wrapper ${errors.password ? 'input-error' : ''}`}>
                  <svg className="input-icon" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="4" y="9" width="12" height="9" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M7 9V6C7 4.34315 8.34315 3 10 3C11.6569 3 13 4.34315 13 6V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <circle cx="10" cy="13.5" r="1.5" fill="currentColor"/>
                  </svg>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="login-password"
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
                    id="toggle-login-password-btn"
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
                id="login-submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <span className="btn-loader"></span>
                ) : (
                  <>
                    Sign In to LocalEats
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
                <button type="button" className="social-btn" id="google-signin-btn">
                  <svg viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
                    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
                    <path d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
                  </svg>
                  Google
                </button>
                <button type="button" className="social-btn" id="apple-signin-btn">
                  <svg viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14.94 9.88c-.02-2.12 1.73-3.14 1.81-3.19-1-1.44-2.53-1.64-3.07-1.66-1.29-.14-2.54.77-3.2.77-.67 0-1.68-.76-2.77-.73-1.41.02-2.72.83-3.45 2.1-1.49 2.58-.38 6.37 1.05 8.46.72 1.02 1.56 2.17 2.67 2.13 1.08-.04 1.49-.69 2.79-.69 1.3 0 1.67.69 2.79.67 1.15-.02 1.87-1.03 2.56-2.06.82-1.17 1.15-2.32 1.16-2.38-.03-.01-2.22-.85-2.24-3.39l-.1-.03zM12.87 3.17c.57-.72.97-1.7.86-2.7-.84.04-1.88.58-2.48 1.28-.53.62-1.01 1.63-.88 2.59.93.07 1.89-.48 2.5-1.17z" fill="#1A1A1A"/>
                  </svg>
                  Apple
                </button>
              </div>

              {/* Footer Link */}
              <p className="form-footer-text">
                Don't have an account? <Link to="/register" className="form-link" id="create-account-link">Create Account</Link>
              </p>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="login-footer">
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

export default LoginPage;

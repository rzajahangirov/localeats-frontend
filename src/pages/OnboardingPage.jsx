import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import './OnboardingPage.css';

const CUISINE_TYPES = [
  'Italian',
  'Mexican',
  'Local',
  'Chinese',
  'Japanese',
  'Indian',
  'Thai',
  'American',
  'French',
  'Mediterranean',
];

const OnboardingPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    cuisineType: '',
    address: '',
    phoneNumber: '',
    contactEmail: '',
    openingHours: '',
    description: '',
    coverImage: '',
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeField, setActiveField] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/register');
    }
  }, [navigate]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Restaurant name is required';
    if (!formData.cuisineType) newErrors.cuisineType = 'Please select a cuisine type';
    if (!formData.address.trim()) newErrors.address = 'Business address is required';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    if (!formData.contactEmail.trim()) newErrors.contactEmail = 'Contact email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.contactEmail)) newErrors.contactEmail = 'Please enter a valid email';
    if (!formData.openingHours.trim()) newErrors.openingHours = 'Opening hours are required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
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
      await api.post('/api/restaurants/create', formData);
      navigate('/pending');
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('accessToken');
        navigate('/register');
        return;
      }
      if (err.response?.data?.message) {
        setApiError(err.response.data.message);
      } else {
        setApiError('Failed to submit application. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const completedFields = Object.values(formData).filter((v) => v.trim && v.trim() !== '' || v !== '').length;
  const totalFields = Object.keys(formData).length;
  const progress = Math.round((completedFields / totalFields) * 100);

  return (
    <div className="onboarding-page">
      {/* Header */}
      <header className="onboarding-header">
        <div className="header-logo">
          <svg className="logo-icon" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="14" cy="14" r="13" stroke="#DC2626" strokeWidth="2"/>
            <path d="M9 14C9 11.2386 11.2386 9 14 9C16.7614 9 19 11.2386 19 14" stroke="#DC2626" strokeWidth="2" strokeLinecap="round"/>
            <path d="M7 18L14 11L21 18" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="logo-text">LocalEats</span>
        </div>
        <div className="header-steps">
          <div className="step-indicator completed">
            <div className="step-dot">
              <svg viewBox="0 0 12 12" fill="none"><path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <span>Account Created</span>
          </div>
          <div className="step-line"></div>
          <div className="step-indicator active">
            <div className="step-dot">2</div>
            <span>Restaurant Profile</span>
          </div>
          <div className="step-line dim"></div>
          <div className="step-indicator">
            <div className="step-dot dim">3</div>
            <span>Verification</span>
          </div>
        </div>
      </header>

      <main className="onboarding-main">
        {/* Left Panel */}
        <div className="onboarding-hero">
          <div className="hero-content">
            <span className="hero-badge animate-fade-in-up">STEP 2 OF 3</span>
            <h1 className="hero-title animate-fade-in-up delay-1">
              Tell Us About<br />
              Your <span className="hero-title-accent">Restaurant</span>
            </h1>
            <p className="hero-subtitle animate-fade-in-up delay-2">
              Complete your restaurant profile to start receiving orders from food enthusiasts in your area.
            </p>

            {/* Progress Card */}
            <div className="progress-card animate-fade-in-up delay-3">
              <div className="progress-header">
                <span className="progress-label">Profile Completion</span>
                <span className="progress-value">{progress}%</span>
              </div>
              <div className="progress-bar-track">
                <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
              </div>
              <p className="progress-hint">
                {progress < 100
                  ? `${totalFields - completedFields} field${totalFields - completedFields !== 1 ? 's' : ''} remaining`
                  : 'All fields complete! Ready to submit.'}
              </p>
            </div>

            {/* Restaurant Image */}
            <div className="hero-image-container animate-fade-in-up delay-4">
              <img
                src="/images/restaurant-hero.png"
                alt="Elegant restaurant interior"
                className="hero-image"
              />
              <div className="hero-image-overlay">
                <div className="hero-stats">
                  <div className="stat">
                    <span className="stat-number">2,500+</span>
                    <span className="stat-label">Partner Restaurants</span>
                  </div>
                  <div className="stat-divider"></div>
                  <div className="stat">
                    <span className="stat-number">150K+</span>
                    <span className="stat-label">Monthly Orders</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel — Restaurant Form */}
        <div className="onboarding-form-panel">
          <div className="form-container animate-slide-in-right">
            <div className="form-header">
              <h2 className="form-title">Restaurant Profile</h2>
              <p className="form-subtitle">Fill in your restaurant details to get started</p>
            </div>

            <form onSubmit={handleSubmit} className="onboarding-form" id="onboarding-form" noValidate>
              {/* Restaurant Name */}
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  <svg className="label-icon" viewBox="0 0 20 20" fill="none"><path d="M3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10C17 13.866 13.866 17 10 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M10 7V10L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Restaurant Name
                </label>
                <div className={`input-wrapper ${errors.name ? 'input-error' : ''} ${activeField === 'name' ? 'focused' : ''}`}>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="e.g., The Golden Plate"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => setActiveField('name')}
                    onBlur={() => setActiveField('')}
                    className="form-input"
                  />
                </div>
                {errors.name && <span className="field-error">{errors.name}</span>}
              </div>

              {/* Cuisine Type + Phone Row */}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="cuisineType" className="form-label">
                    <svg className="label-icon" viewBox="0 0 20 20" fill="none"><path d="M7 3V10M13 3V6M13 6C13 7.65685 11.6569 9 10 9H7M13 6H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M7 10L5 17H15L13 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Cuisine Type
                  </label>
                  <div className={`input-wrapper select-wrapper ${errors.cuisineType ? 'input-error' : ''}`}>
                    <select
                      id="cuisineType"
                      name="cuisineType"
                      value={formData.cuisineType}
                      onChange={handleChange}
                      className={`form-input form-select ${formData.cuisineType === '' ? 'placeholder' : ''}`}
                    >
                      <option value="" disabled>Select cuisine</option>
                      {CUISINE_TYPES.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    <svg className="select-chevron" viewBox="0 0 20 20" fill="none"><path d="M5 8L10 13L15 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  {errors.cuisineType && <span className="field-error">{errors.cuisineType}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="phoneNumber" className="form-label">
                    <svg className="label-icon" viewBox="0 0 20 20" fill="none"><path d="M3 5C3 3.89543 3.89543 3 5 3H7.27924C7.70967 3 8.09181 3.27543 8.22792 3.68377L9.27924 6.84377C9.39818 7.20058 9.28781 7.59228 8.99999 7.83205L7.63246 8.97369C8.55426 10.944 10.056 12.4457 12.0263 13.3675L13.168 11.9999C13.4077 11.7121 13.7994 11.6018 14.1562 11.7207L17.3162 12.7721C17.7246 12.9082 18 13.2903 18 13.7208V16C18 17.1046 17.1046 18 16 18H15C8.37258 18 3 12.6274 3 6V5Z" stroke="currentColor" strokeWidth="1.5"/></svg>
                    Contact Phone
                  </label>
                  <div className={`input-wrapper ${errors.phoneNumber ? 'input-error' : ''}`}>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      placeholder="+1 (555) 123-4567"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
                  {errors.phoneNumber && <span className="field-error">{errors.phoneNumber}</span>}
                </div>
              </div>

              {/* Address */}
              <div className="form-group">
                <label htmlFor="address" className="form-label">
                  <svg className="label-icon" viewBox="0 0 20 20" fill="none"><path d="M10 11C11.6569 11 13 9.65685 13 8C13 6.34315 11.6569 5 10 5C8.34315 5 7 6.34315 7 8C7 9.65685 8.34315 11 10 11Z" stroke="currentColor" strokeWidth="1.5"/><path d="M10 18S3 12.5 3 8C3 4.13401 6.13401 1 10 1C13.866 1 17 4.13401 17 8C17 12.5 10 18 10 18Z" stroke="currentColor" strokeWidth="1.5"/></svg>
                  Business Address
                </label>
                <div className={`input-wrapper ${errors.address ? 'input-error' : ''}`}>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    placeholder="123 Gourmet Street, Food City, FC 12345"
                    value={formData.address}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
                {errors.address && <span className="field-error">{errors.address}</span>}
              </div>

              {/* Email + Opening Hours Row */}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="contactEmail" className="form-label">
                    <svg className="label-icon" viewBox="0 0 20 20" fill="none"><rect x="2" y="4" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M2 6L10 11L18 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                    Business Email
                  </label>
                  <div className={`input-wrapper ${errors.contactEmail ? 'input-error' : ''}`}>
                    <input
                      type="email"
                      id="contactEmail"
                      name="contactEmail"
                      placeholder="info@restaurant.com"
                      value={formData.contactEmail}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
                  {errors.contactEmail && <span className="field-error">{errors.contactEmail}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="openingHours" className="form-label">
                    <svg className="label-icon" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5"/><path d="M10 6V10L13 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Opening Hours
                  </label>
                  <div className={`input-wrapper ${errors.openingHours ? 'input-error' : ''}`}>
                    <input
                      type="text"
                      id="openingHours"
                      name="openingHours"
                      placeholder="09:00 - 22:00"
                      value={formData.openingHours}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
                  {errors.openingHours && <span className="field-error">{errors.openingHours}</span>}
                </div>
              </div>

              {/* Description */}
              <div className="form-group">
                <label htmlFor="description" className="form-label">
                  <svg className="label-icon" viewBox="0 0 20 20" fill="none"><path d="M4 5H16M4 9H12M4 13H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  Short Bio
                </label>
                <div className={`input-wrapper textarea-wrapper ${errors.description ? 'input-error' : ''}`}>
                  <textarea
                    id="description"
                    name="description"
                    placeholder="Tell us what makes your restaurant special..."
                    value={formData.description}
                    onChange={handleChange}
                    className="form-input form-textarea"
                    rows={3}
                  />
                </div>
                {errors.description && <span className="field-error">{errors.description}</span>}
              </div>

              {/* Cover Image URL */}
              <div className="form-group">
                <label htmlFor="coverImage" className="form-label">
                  <svg className="label-icon" viewBox="0 0 20 20" fill="none"><rect x="2" y="3" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/><circle cx="7" cy="8" r="2" stroke="currentColor" strokeWidth="1.5"/><path d="M2 14L6 10L10 14L14 9L18 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Cover Image URL <span className="optional-tag">(Optional)</span>
                </label>
                <div className="input-wrapper">
                  <input
                    type="url"
                    id="coverImage"
                    name="coverImage"
                    placeholder="https://example.com/your-restaurant.jpg"
                    value={formData.coverImage}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
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

              {/* Submit */}
              <button
                type="submit"
                className={`submit-btn ${loading ? 'loading' : ''}`}
                id="submit-application-btn"
                disabled={loading}
              >
                {loading ? (
                  <span className="btn-loader"></span>
                ) : (
                  <>
                    Submit Application
                    <svg className="btn-arrow" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OnboardingPage;

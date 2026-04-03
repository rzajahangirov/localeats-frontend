import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PendingPage.css';

const PendingPage = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/register');
      return;
    }
    // Trigger entrance animation
    const timer = setTimeout(() => setShow(true), 100);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="pending-page">
      {/* Animated Background Elements */}
      <div className="pending-bg-elements">
        <div className="bg-circle bg-circle-1"></div>
        <div className="bg-circle bg-circle-2"></div>
        <div className="bg-circle bg-circle-3"></div>
      </div>

      <div className={`pending-card ${show ? 'visible' : ''}`}>
        {/* Success Icon */}
        <div className="pending-icon-wrapper">
          <div className="pending-icon-ring"></div>
          <div className="pending-icon">
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="24" cy="24" r="22" stroke="url(#gradient)" strokeWidth="2.5" strokeDasharray="4 2" className="icon-circle-dashed"/>
              <path d="M16 24L22 30L34 18" stroke="url(#gradient)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="icon-check"/>
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="48" y2="48">
                  <stop stopColor="#E85D5D"/>
                  <stop offset="1" stopColor="#C0392B"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Badge */}
        <div className="pending-badge">
          <span className="badge-dot"></span>
          Application Pending
        </div>

        {/* Title */}
        <h1 className="pending-title">
          Your Application is<br />
          Being <span className="pending-accent">Reviewed</span>
        </h1>

        {/* Description */}
        <p className="pending-description">
          Thank you for registering your restaurant with LocalEats! Our team is reviewing your application. 
          You'll receive a notification once your restaurant profile has been approved.
        </p>

        {/* Info Cards */}
        <div className="pending-info-grid">
          <div className="info-card">
            <div className="info-card-icon">
              <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/><path d="M12 7V12L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </div>
            <div className="info-card-content">
              <span className="info-card-title">Review Time</span>
              <span className="info-card-value">24-48 hours</span>
            </div>
          </div>
          <div className="info-card">
            <div className="info-card-icon">
              <svg viewBox="0 0 24 24" fill="none"><rect x="2" y="4" width="20" height="16" rx="3" stroke="currentColor" strokeWidth="1.5"/><path d="M2 8L12 13L22 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </div>
            <div className="info-card-content">
              <span className="info-card-title">Notification</span>
              <span className="info-card-value">Via Email</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="pending-divider"></div>

        {/* Footer Action */}
        <div className="pending-footer">
          <p className="pending-footer-text">
            Have questions? Contact our partner support team.
          </p>
          <a href="mailto:partners@localeats.com" className="pending-contact-link" id="contact-support-link">
            <svg viewBox="0 0 20 20" fill="none"><rect x="2" y="4" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M2 6L10 11L18 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            partners@localeats.com
          </a>
        </div>

        {/* LocalEats Branding */}
        <div className="pending-branding">
          <svg className="brand-icon" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="14" cy="14" r="13" stroke="#DC2626" strokeWidth="2"/>
            <path d="M9 14C9 11.2386 11.2386 9 14 9C16.7614 9 19 11.2386 19 14" stroke="#DC2626" strokeWidth="2" strokeLinecap="round"/>
            <path d="M7 18L14 11L21 18" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="brand-text">LocalEats</span>
        </div>
      </div>
    </div>
  );
};

export default PendingPage;

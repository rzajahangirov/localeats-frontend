import { Link, Outlet, useNavigate } from 'react-router-dom';
import './CustomerLayout.css';

const CustomerLayout = () => {
  const navigate = useNavigate();

  const accessToken = localStorage.getItem('accessToken');

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  };

  return (
    <div className="customer-layout">
      {/* Top Navbar */}
      <nav className="customer-navbar">
        <div className="navbar-container">
          <div className="navbar-left">
            <Link to="/home" className="navbar-brand">
              <svg className="brand-icon" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="14" cy="14" r="13" stroke="#DC2626" strokeWidth="2" />
                <path d="M9 14C9 11.2386 11.2386 9 14 9C16.7614 9 19 11.2386 19 14" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
                <path d="M7 18L14 11L21 18" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="brand-text">LocalEats</span>
            </Link>
          </div>

          {/* Center Search Bar */}
          <div className="navbar-center">
            <div className="search-bar">
              <svg className="search-icon" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 19L14.6569 14.6569M14.6569 14.6569C16.1046 13.2091 17 11.2091 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17C11.2091 17 13.2091 16.1046 14.6569 14.6569Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <input type="text" placeholder="Search for restaurants or cuisines..." className="search-input" />
            </div>
          </div>

          {/* Right Account/Cart or Auth Buttons */}
          <div className="navbar-right">
            {accessToken ? (
              <>
                <button className="nav-icon-btn" aria-label="Cart">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.70711 15.2929C4.07714 15.9229 4.52331 17 5.41421 17H17M17 17C15.8954 17 15 17.8954 15 19C15 20.1046 15.8954 21 17 21C18.1046 21 19 20.1046 19 19C19 17.8954 18.1046 17 17 17ZM9 19C9 20.1046 8.10457 21 7 21C5.89543 21 5 20.1046 5 19C5 17.8954 5.89543 17 7 17C8.10457 17 9 17.8954 9 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="cart-badge">0</span>
                </button>
                <div className="nav-profile">
                  <div className="profile-avatar">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <button onClick={handleLogout} className="logout-btn">Log out</button>
                </div>
              </>
            ) : (
              <div className="nav-auth-actions" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <Link to="/login" style={{ textDecoration: 'none', color: '#1F2937', fontWeight: '500', fontSize: '0.9rem' }}>Log in</Link>
                <Link to="/register" style={{ textDecoration: 'none', background: '#DC2626', color: '#FFF', padding: '0.5rem 1rem', borderRadius: '6px', fontWeight: '600', fontSize: '0.9rem' }}>Sign up</Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Page Content */}
      <main className="customer-main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default CustomerLayout;

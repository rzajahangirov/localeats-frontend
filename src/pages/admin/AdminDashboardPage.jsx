import './AdminDashboardPage.css';

const STATS = [
  { id: 1, label: 'Pending Restaurants', value: '12', trend: '+3 today', status: 'warning' },
  { id: 2, label: 'Total Users', value: '1,240', trend: '+15% this month', status: 'success' },
  { id: 3, label: 'System Health', value: '98%', trend: 'Nominal', status: 'info' },
];

const AdminDashboardPage = () => {
  return (
    <div className="admin-dashboard-page">
      <div className="admin-dashboard-header animate-fade-in-up">
        <h2>Welcome, System Administrator</h2>
        <p>Here is the current state of the LocalEats platform network.</p>
      </div>

      <div className="admin-stats-grid">
        {STATS.map((stat, i) => (
          <div className="admin-stat-card animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }} key={stat.id}>
            <div className="stat-card-header">
              <span className="stat-label">{stat.label}</span>
              <div className={`stat-icon-bg ${stat.status}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {stat.id === 1 && <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />}
                  {stat.id === 2 && <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>}
                  {stat.id === 3 && <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />}
                </svg>
              </div>
            </div>
            <div className="stat-card-body">
              <div className="stat-value">{stat.value}</div>
              <div className={`stat-trend text-${stat.status}`}>{stat.trend}</div>
            </div>
          </div>
        ))}
      </div>

      {/* System Quick Actions */}
      <div className="admin-dashboard-actions animate-fade-in-up delay-3">
        <h3>Platform Administration</h3>
        <div className="admin-actions-grid">
          <div className="admin-action-block">
            <div className="action-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2v20M2 12h20" /></svg>
            </div>
            <div className="action-details">
              <h4>Review Restaurant Submissions</h4>
              <p>12 submissions waiting for approval queue.</p>
            </div>
            <button className="admin-btn-secondary">Review Queue</button>
          </div>
          
          <div className="admin-action-block">
            <div className="action-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
            </div>
            <div className="action-details">
              <h4>Database Backup</h4>
              <p>Last snapshot taken 4 hours ago.</p>
            </div>
            <button className="admin-btn-secondary">Trigger Snapshot</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;

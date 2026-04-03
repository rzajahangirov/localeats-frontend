import './DashboardPage.css';

const STATS = [
  { id: 1, label: 'Today\'s Orders', value: '42', trend: '+12%', isPositive: true },
  { id: 2, label: 'Revenue', value: '$845.50', trend: '+5.4%', isPositive: true },
  { id: 3, label: 'Avg. Order Value', value: '$20.13', trend: '-2.1%', isPositive: false },
  { id: 4, label: 'Active Items', value: '38', trend: '0%', isPositive: true },
];

const RECENT_ORDERS = [
  { id: '#1045', customer: 'Sarah Jenkins', items: '2x Truffle Pasta', total: '$45.00', status: 'Prepping', time: '10 min ago' },
  { id: '#1044', customer: 'Michael Chen', items: '1x Margherita Pizza', total: '$18.50', status: 'Ready', time: '18 min ago' },
  { id: '#1043', customer: 'Emma Thompson', items: '3x Garlic Bread, 1x Caesar', total: '$32.00', status: 'Delivered', time: '45 min ago' },
  { id: '#1042', customer: 'David Okafor', items: '1x Spaghetti Carbonara', total: '$22.00', status: 'Delivered', time: '1 hr ago' },
];

const DashboardPage = () => {
  return (
    <div className="dashboard-page">
      {/* Stats Grid */}
      <section className="stats-grid">
        {STATS.map((stat, i) => (
          <div className="stat-card animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }} key={stat.id}>
            <div className="stat-header">
              <span className="stat-label">{stat.label}</span>
              <span className={`stat-trend ${stat.isPositive ? 'positive' : 'negative'}`}>
                {stat.isPositive ? '↑' : '↓'} {stat.trend}
              </span>
            </div>
            <div className="stat-value">{stat.value}</div>
          </div>
        ))}
      </section>

      <div className="dashboard-row">
        {/* Recent Orders */}
        <section className="recent-orders-section animate-fade-in-up delay-3">
          <div className="section-header">
            <h2 className="section-title">Recent Orders</h2>
            <button className="view-all-btn">View All</button>
          </div>
          
          <div className="table-responsive">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Time</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {RECENT_ORDERS.map((order) => (
                  <tr key={order.id}>
                    <td className="fw-medium">{order.id}</td>
                    <td>{order.customer}</td>
                    <td className="text-muted">{order.items}</td>
                    <td className="fw-medium">{order.total}</td>
                    <td>
                      <span className={`status-badge ${order.status.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="text-muted">{order.time}</td>
                    <td>
                      <button className="action-dots" aria-label="Order actions">⋮</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Quick Actions / Notifications */}
        <div className="dashboard-sidebar-column animate-fade-in-up delay-4">
          <section className="quick-actions-card">
            <h3 className="card-title">Quick Actions</h3>
            <div className="actions-list">
              <button className="action-btn">
                <span className="icon-wrapper">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M12 4V20M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                Add New Menu Item
              </button>
              <button className="action-btn">
                <span className="icon-wrapper">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M21 15V19C21 19.5523 20.5523 20 20 20H4C3.44772 20 3 19.5523 3 19V15M17 8L12 3M12 3L7 8M12 3V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                Export Report
              </button>
              <button className="action-btn">
                <span className="icon-wrapper outline">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" stroke="currentColor" strokeWidth="1.5"/>
                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                </span>
                Store Settings
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

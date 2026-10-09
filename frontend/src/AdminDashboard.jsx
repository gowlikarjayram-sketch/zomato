import { useState, useEffect } from 'react';
import './AdminDashboard.css';

const AdminDashboard = ({ onNavigate, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [metrics, setMetrics] = useState({ totalCustomers: 0, activePartners: 0, pendingPartners: 0, totalOrders: 0, totalRevenue: 0 });
  const [pendingUsers, setPendingUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };

      const [metricsRes, partnersRes, usersRes, ordersRes] = await Promise.all([
        fetch('http://localhost:5000/api/admin/metrics', { headers }),
        fetch('http://localhost:5000/api/admin/partners/pending', { headers }),
        fetch('http://localhost:5000/api/admin/users', { headers }),
        fetch('http://localhost:5000/api/admin/orders', { headers })
      ]);

      if (!metricsRes.ok) throw new Error('Failed to fetch data');

      setMetrics(await metricsRes.json());
      setPendingUsers(await partnersRes.json());
      setAllUsers(await usersRes.json());
      setOrders(await ordersRes.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleAction = async (id, action) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/admin/partners/${id}/${action}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error(`Failed to ${action} partner`);
      fetchDashboardData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this user?")) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete user');
      fetchDashboardData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    if (onLogout) onLogout();
    if (onNavigate) onNavigate('home');
  };

  if (loading) return <div className="admin-loading">Loading Master Dashboard...</div>;

  return (
    <div className="admin-layout">
      {/* Sidebar Navigation */}
      <aside className="admin-sidebar">
        <div className="sidebar-brand">
          <span>👑</span> Master Control
        </div>
        <nav className="sidebar-nav">
          <button className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}>
            📊 Overview
          </button>
          <button className={activeTab === 'verifications' ? 'active' : ''} onClick={() => setActiveTab('verifications')}>
            🛡️ Verifications
            {metrics.pendingPartners > 0 && <span className="badge">{metrics.pendingPartners}</span>}
          </button>
          <button className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>
            👥 Users
          </button>
          <button className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}>
            🛒 Orders
          </button>
        </nav>
        <button onClick={handleLogout} className="sidebar-logout">Log Out</button>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main-content">
        <header className="admin-header">
          <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
          <p>Manage your FoodNest platform</p>
        </header>

        {error && <div className="admin-error">{error}</div>}

        {/* TAB: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="admin-metrics-grid">
            <div className="metric-card">
              <h3>👥 Total Customers</h3>
              <div className="metric-value">{metrics.totalCustomers}</div>
            </div>
            <div className="metric-card">
              <h3>🤝 Active Partners</h3>
              <div className="metric-value">{metrics.activePartners}</div>
            </div>
            <div className="metric-card">
              <h3>🛒 Total Orders</h3>
              <div className="metric-value">{metrics.totalOrders}</div>
            </div>
            <div className="metric-card highlight">
              <h3>💰 Total Revenue</h3>
              <div className="metric-value">₹{metrics.totalRevenue.toLocaleString()}</div>
            </div>
          </div>
        )}

        {/* TAB: VERIFICATIONS */}
        {activeTab === 'verifications' && (
          <section className="admin-section">
            <h2>Pending Partner Applications</h2>
            {pendingUsers.length === 0 ? (
              <div className="admin-empty">No pending applications right now.</div>
            ) : (
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Business Name</th>
                      <th>Role</th>
                      <th>FSSAI License</th>
                      <th>Email</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingUsers.map(user => (
                      <tr key={user._id}>
                        <td><strong>{user.businessDetails?.businessName || '-'}</strong></td>
                        <td><span className={`role-badge ${user.role}`}>{user.role.replace('_', ' ')}</span></td>
                        <td><code>{user.businessDetails?.fssaiNumber || '-'}</code></td>
                        <td>{user.email}</td>
                        <td className="admin-actions">
                          <button className="approve-btn" onClick={() => handleAction(user._id, 'approve')}>Approve</button>
                          <button className="reject-btn" onClick={() => handleAction(user._id, 'reject')}>Reject</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* TAB: USERS */}
        {activeTab === 'users' && (
          <section className="admin-section">
            <h2>Platform Users</h2>
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allUsers.map(user => (
                    <tr key={user._id}>
                      <td><strong>{user.name}</strong></td>
                      <td>{user.email}</td>
                      <td><span className={`role-badge ${user.role}`}>{user.role.replace('_', ' ')}</span></td>
                      <td>
                        <span className={`status-dot ${user.status}`}></span>
                        {user.status}
                      </td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button className="delete-btn" onClick={() => handleDeleteUser(user._id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* TAB: ORDERS */}
        {activeTab === 'orders' && (
          <section className="admin-section">
            <h2>Global Orders</h2>
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Restaurant</th>
                    <th>Items</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order._id}>
                      <td><code>{order._id.slice(-6).toUpperCase()}</code></td>
                      <td><strong>{order.restaurant?.businessDetails?.businessName || order.restaurant?.name || 'Unknown'}</strong></td>
                      <td style={{ maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {order.items}
                      </td>
                      <td style={{ fontWeight: 'bold' }}>{order.amount}</td>
                      <td><span className={`order-status ${order.status.toLowerCase()}`}>{order.status}</span></td>
                      <td>{new Date(order.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr><td colSpan="6" className="admin-empty">No orders found on the platform.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

      </main>
    </div>
  );
};

export default AdminDashboard;

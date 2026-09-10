import React, { useState } from 'react';
import './Dashboard.css';

const RestaurantDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const orders = [
    { id: '#ORD-1029', items: '2x Hyderabadi Biryani', amount: '₹498', status: 'Preparing', time: '10 mins ago' },
    { id: '#ORD-1028', items: '1x Paneer Butter Masala', amount: '₹199', status: 'Ready', time: '25 mins ago' },
    { id: '#ORD-1027', items: '4x Butter Naan, 1x Dal Makhani', amount: '₹260', status: 'Delivered', time: '1 hr ago' },
  ];

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-brand">
          <span className="brand-icon">🏪</span>
          <span className="brand-text">Restaurant Partner</span>
        </div>
        
        <div className="sidebar-user">
          <div className="avatar">{user.name.charAt(0)}</div>
          <div className="user-info">
            <h4>{user.name}</h4>
            <p>Premium Partner</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button 
            className={`nav-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📊 Overview
          </button>
          <button 
            className={`nav-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            🍳 Live Orders
          </button>
          <button 
            className={`nav-btn ${activeTab === 'menu' ? 'active' : ''}`}
            onClick={() => setActiveTab('menu')}
          >
            🧾 Menu Management
          </button>
          <button 
            className={`nav-btn ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            📈 Analytics
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={onLogout}>Logout</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <h2>Welcome back, {user.name}!</h2>
          <div className="header-status">
            <span className="status-dot online"></span>
            Accepting Orders
          </div>
        </header>

        {activeTab === 'overview' && (
          <div className="dashboard-content">
            {/* KPI Cards */}
            <div className="kpi-grid">
              <div className="kpi-card">
                <div className="kpi-icon">💰</div>
                <div className="kpi-info">
                  <p>Today's Revenue</p>
                  <h3>₹12,450</h3>
                  <span className="trend positive">+15% vs yesterday</span>
                </div>
              </div>
              <div className="kpi-card">
                <div className="kpi-icon">📦</div>
                <div className="kpi-info">
                  <p>Orders Today</p>
                  <h3>42</h3>
                  <span className="trend positive">+5 vs yesterday</span>
                </div>
              </div>
              <div className="kpi-card">
                <div className="kpi-icon">⭐</div>
                <div className="kpi-info">
                  <p>Average Rating</p>
                  <h3>4.8 / 5</h3>
                  <span className="trend neutral">Based on 120 reviews</span>
                </div>
              </div>
            </div>

            {/* Recent Orders Table */}
            <div className="dashboard-panel">
              <div className="panel-header">
                <h3>Recent Orders</h3>
                <button className="view-all-btn" onClick={() => setActiveTab('orders')}>View All</button>
              </div>
              <div className="table-responsive">
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Items</th>
                      <th>Amount</th>
                      <th>Time</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order, i) => (
                      <tr key={i}>
                        <td>{order.id}</td>
                        <td>{order.items}</td>
                        <td>{order.amount}</td>
                        <td>{order.time}</td>
                        <td>
                          <span className={`status-badge ${order.status.toLowerCase()}`}>
                            {order.status}
                          </span>
                        </td>
                        <td>
                          <button className="action-btn">Update</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab !== 'overview' && (
          <div className="placeholder-content">
            <span className="placeholder-icon">🚧</span>
            <h2>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Module</h2>
            <p>This module is currently under development. Check back soon!</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default RestaurantDashboard;

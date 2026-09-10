import React, { useState } from 'react';
import './Dashboard.css';

const CloudKitchenDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const brands = [
    { name: 'Burger Cartel', orders: 142, revenue: '₹42,500', status: 'Active' },
    { name: 'Desi Bowls', orders: 89, revenue: '₹18,200', status: 'Active' },
    { name: 'Midnight Munchies', orders: 204, revenue: '₹55,100', status: 'Active' },
  ];

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-brand">
          <span className="brand-icon">☁️</span>
          <span className="brand-text">Cloud Kitchen Hub</span>
        </div>
        
        <div className="sidebar-user">
          <div className="avatar">{user.name.charAt(0)}</div>
          <div className="user-info">
            <h4>{user.name}</h4>
            <p>Multi-Brand Operator</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button 
            className={`nav-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            🛰️ Command Center
          </button>
          <button 
            className={`nav-btn ${activeTab === 'brands' ? 'active' : ''}`}
            onClick={() => setActiveTab('brands')}
          >
            🍔 Virtual Brands
          </button>
          <button 
            className={`nav-btn ${activeTab === 'inventory' ? 'active' : ''}`}
            onClick={() => setActiveTab('inventory')}
          >
            📦 Central Inventory
          </button>
          <button 
            className={`nav-btn ${activeTab === 'logistics' ? 'active' : ''}`}
            onClick={() => setActiveTab('logistics')}
          >
            🛵 Logistics & Delivery
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={onLogout}>Logout</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <h2>Cloud Kitchen Operations</h2>
          <div className="header-status">
            <span className="status-dot online"></span>
            All Brands Online
          </div>
        </header>

        {activeTab === 'overview' && (
          <div className="dashboard-content">
            {/* KPI Cards */}
            <div className="kpi-grid">
              <div className="kpi-card">
                <div className="kpi-icon">📊</div>
                <div className="kpi-info">
                  <p>Total Network Revenue</p>
                  <h3>₹1,15,800</h3>
                  <span className="trend positive">+22% vs yesterday</span>
                </div>
              </div>
              <div className="kpi-card">
                <div className="kpi-icon">🌐</div>
                <div className="kpi-info">
                  <p>Active Virtual Brands</p>
                  <h3>3 / 3</h3>
                  <span className="trend neutral">Operating optimally</span>
                </div>
              </div>
              <div className="kpi-card">
                <div className="kpi-icon">⚡</div>
                <div className="kpi-info">
                  <p>Avg Prep Time</p>
                  <h3>12 mins</h3>
                  <span className="trend positive">-2 mins improvement</span>
                </div>
              </div>
            </div>

            {/* Virtual Brands Performance Table */}
            <div className="dashboard-panel">
              <div className="panel-header">
                <h3>Brand Performance Matrix</h3>
                <button className="view-all-btn" onClick={() => setActiveTab('brands')}>Manage Brands</button>
              </div>
              <div className="table-responsive">
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>Virtual Brand Name</th>
                      <th>Today's Orders</th>
                      <th>Today's Revenue</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {brands.map((brand, i) => (
                      <tr key={i}>
                        <td><strong>{brand.name}</strong></td>
                        <td>{brand.orders}</td>
                        <td>{brand.revenue}</td>
                        <td>
                          <span className="status-badge ready">
                            {brand.status}
                          </span>
                        </td>
                        <td>
                          <button className="action-btn">Configure</button>
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
            <span className="placeholder-icon">🛠️</span>
            <h2>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Subsystem</h2>
            <p>Cloud infrastructure for this module is currently syncing.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default CloudKitchenDashboard;

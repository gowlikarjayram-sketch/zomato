import React, { useState } from 'react';
import './Dashboard.css';

const CateringDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const upcomingEvents = [
    { eventName: 'Tech Summit Afterparty', guests: 250, date: 'Oct 15, 2026', status: 'Preparing' },
    { eventName: 'College Annual Fest', guests: 800, date: 'Oct 22, 2026', status: 'Confirmed' },
    { eventName: 'Private Wedding', guests: 150, date: 'Nov 02, 2026', status: 'Pending' },
  ];

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-brand">
          <span className="brand-icon">🎉</span>
          <span className="brand-text">Catering Pro</span>
        </div>
        
        <div className="sidebar-user">
          <div className="avatar">{user.name.charAt(0)}</div>
          <div className="user-info">
            <h4>{user.name}</h4>
            <p>Event Catering Partner</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button 
            className={`nav-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📊 Dashboard
          </button>
          <button 
            className={`nav-btn ${activeTab === 'events' ? 'active' : ''}`}
            onClick={() => setActiveTab('events')}
          >
            📅 Upcoming Events
          </button>
          <button 
            className={`nav-btn ${activeTab === 'inquiries' ? 'active' : ''}`}
            onClick={() => setActiveTab('inquiries')}
          >
            ✉️ Active Inquiries
          </button>
          <button 
            className={`nav-btn ${activeTab === 'packages' ? 'active' : ''}`}
            onClick={() => setActiveTab('packages')}
          >
            🍽️ Menu Packages
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={onLogout}>Logout</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <h2>Catering Management</h2>
          <div className="header-status">
            <span className="status-dot online"></span>
            Booking Open
          </div>
        </header>

        {activeTab === 'overview' && (
          <div className="dashboard-content">
            {/* KPI Cards */}
            <div className="kpi-grid">
              <div className="kpi-card">
                <div className="kpi-icon">💰</div>
                <div className="kpi-info">
                  <p>Monthly Revenue</p>
                  <h3>₹4,50,000</h3>
                  <span className="trend positive">+10% vs last month</span>
                </div>
              </div>
              <div className="kpi-card">
                <div className="kpi-icon">📅</div>
                <div className="kpi-info">
                  <p>Events This Month</p>
                  <h3>12</h3>
                  <span className="trend positive">3 slots remaining</span>
                </div>
              </div>
              <div className="kpi-card">
                <div className="kpi-icon">📩</div>
                <div className="kpi-info">
                  <p>Pending Inquiries</p>
                  <h3>8</h3>
                  <span className="trend neutral">Requires action</span>
                </div>
              </div>
            </div>

            {/* Upcoming Events Table */}
            <div className="dashboard-panel">
              <div className="panel-header">
                <h3>Upcoming Events</h3>
                <button className="view-all-btn" onClick={() => setActiveTab('events')}>View Calendar</button>
              </div>
              <div className="table-responsive">
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>Event Name</th>
                      <th>Guests</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {upcomingEvents.map((event, i) => (
                      <tr key={i}>
                        <td><strong>{event.eventName}</strong></td>
                        <td>{event.guests} pax</td>
                        <td>{event.date}</td>
                        <td>
                          <span className={`status-badge ${event.status === 'Confirmed' ? 'ready' : event.status === 'Preparing' ? 'preparing' : 'delivered'}`}>
                            {event.status}
                          </span>
                        </td>
                        <td>
                          <button className="action-btn">Details</button>
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

export default CateringDashboard;

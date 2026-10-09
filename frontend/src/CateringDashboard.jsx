import { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './Dashboard.css';

const CateringDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [modalConfig, setModalConfig] = useState(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [newEvent, setNewEvent] = useState({ eventName: '', guests: '', date: '', status: 'Pending' });
  const [showPackageForm, setShowPackageForm] = useState(false);
  const [newPackage, setNewPackage] = useState({ name: '', price: '', items: '', image: '' });

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEditEvent, setShowEditEvent] = useState(false);
  const [showViewInvoice, setShowViewInvoice] = useState(false);

  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [showDeclineForm, setShowDeclineForm] = useState(false);

  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showEditPackage, setShowEditPackage] = useState(false);

  const showModal = (title, message) => setModalConfig({ title, message });

  const [eventsList, setEventsList] = useState([]);
  const [inquiriesList, setInquiriesList] = useState([]);
  const [packagesList, setPackagesList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };
        
        const [evRes, inqRes, pkgRes] = await Promise.all([
          fetch('http://localhost:5000/api/catering/events', { headers }),
          fetch('http://localhost:5000/api/catering/inquiries', { headers }),
          fetch('http://localhost:5000/api/catering/packages', { headers })
        ]);
        
        if (evRes.ok) setEventsList(await evRes.json());
        if (inqRes.ok) setInquiriesList(await inqRes.json());
        if (pkgRes.ok) setPackagesList(await pkgRes.json());
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      }
    };
    fetchData();
  }, []);

  const handleAddEvent = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/catering/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(newEvent)
      });
      if (res.ok) {
        const added = await res.json();
        setEventsList([...eventsList, added]);
        setShowEventForm(false);
        setNewEvent({ eventName: '', guests: '', date: '', status: 'Pending' });
        showModal('Success', 'Event added successfully!');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddPackage = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/catering/packages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(newPackage)
      });
      if (res.ok) {
        const added = await res.json();
        setPackagesList([...packagesList, added]);
        setShowPackageForm(false);
        setNewPackage({ name: '', price: '', items: '', image: '' });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditEventSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/catering/events/${selectedEvent._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(selectedEvent)
      });
      if (res.ok) {
        const updated = await res.json();
        setEventsList(eventsList.map(ev => ev._id === updated._id ? updated : ev));
        setShowEditEvent(false);
        setSelectedEvent(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateInquiryStatus = async (status) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/catering/inquiries/${selectedInquiry._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        const updated = await res.json();
        setInquiriesList(inquiriesList.map(inq => inq._id === updated._id ? updated : inq));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleQuoteSubmit = async (e) => {
    e.preventDefault();
    await updateInquiryStatus('Quoted');
    setShowQuoteForm(false);
    setSelectedInquiry(null);
  };

  const handleDeclineSubmit = async (e) => {
    e.preventDefault();
    await updateInquiryStatus('Declined');
    setShowDeclineForm(false);
    setSelectedInquiry(null);
  };

  const handleEditPackageSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/catering/packages/${selectedPackage._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(selectedPackage)
      });
      if (res.ok) {
        const updated = await res.json();
        setPackagesList(packagesList.map(pkg => pkg._id === updated._id ? updated : pkg));
        setShowEditPackage(false);
        setSelectedPackage(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Dynamic KPI Calculations
  const totalRevenue = eventsList.reduce((sum, ev) => sum + (Number(ev.guests) || 0) * 500, 0);
  const eventsCount = eventsList.length;
  const pendingInquiriesCount = inquiriesList.filter(i => i.status === 'New').length;

  const eventStatusData = [
    { name: 'Pending', count: eventsList.filter(e => e.status === 'Pending').length },
    { name: 'Confirmed', count: eventsList.filter(e => e.status === 'Confirmed').length },
    { name: 'Preparing', count: eventsList.filter(e => e.status === 'Preparing').length },
  ];

  const revenueTrend = [{v: 120000}, {v: 145000}, {v: 110000}, {v: 180000}, {v: 210000}, {v: 250000}, {v: totalRevenue > 0 ? totalRevenue : 300000}];
  const eventsTrend = [{v: 5}, {v: 8}, {v: 6}, {v: 10}, {v: 12}, {v: 15}, {v: eventsCount > 0 ? eventsCount : 20}];
  const inquiriesTrend = [{v: 4}, {v: 6}, {v: 5}, {v: 8}, {v: 7}, {v: 10}, {v: pendingInquiriesCount > 0 ? pendingInquiriesCount : 12}];
  const COLORS = ['#f59e0b', '#38bdf8', '#10b981'];

  return (
    <div className="dashboard-layout" style={{ backgroundImage: "linear-gradient(rgba(15, 23, 42, 0.6), rgba(15, 23, 42, 0.8)), url('/user_catering_bg.png')" }}>
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
              <div className="kpi-card" style={{ paddingBottom: '10px' }}>
                <div className="kpi-icon">💰</div>
                <div className="kpi-info" style={{ width: '100%' }}>
                  <p>Monthly Revenue</p>
                  <h3>₹{totalRevenue > 0 ? totalRevenue.toLocaleString('en-IN') : '0'}</h3>
                  <span className="trend positive">+10% vs last month</span>
                  <div style={{ width: '100%', height: '50px', marginTop: '10px' }}>
                    <ResponsiveContainer>
                      <LineChart data={revenueTrend}>
                        <Line type="monotone" dataKey="v" stroke="#10b981" strokeWidth={3} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              <div className="kpi-card" style={{ paddingBottom: '10px' }}>
                <div className="kpi-icon">📅</div>
                <div className="kpi-info" style={{ width: '100%' }}>
                  <p>Events This Month</p>
                  <h3>{eventsCount}</h3>
                  <span className="trend positive">3 slots remaining</span>
                  <div style={{ width: '100%', height: '50px', marginTop: '10px' }}>
                    <ResponsiveContainer>
                      <LineChart data={eventsTrend}>
                        <Line type="stepAfter" dataKey="v" stroke="#38bdf8" strokeWidth={3} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              <div className="kpi-card" style={{ paddingBottom: '10px' }}>
                <div className="kpi-icon">📩</div>
                <div className="kpi-info" style={{ width: '100%' }}>
                  <p>Pending Inquiries</p>
                  <h3>{pendingInquiriesCount}</h3>
                  <span className="trend neutral">Requires action</span>
                  <div style={{ width: '100%', height: '50px', marginTop: '10px' }}>
                    <ResponsiveContainer>
                      <LineChart data={inquiriesTrend}>
                        <Line type="monotone" dataKey="v" stroke="#f59e0b" strokeWidth={3} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>

            {/* 3-Chart Grid Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '24px' }}>
              
              {/* Chart 1: Revenue Trend (Area) */}
              <div className="dashboard-panel" style={{ padding: '15px' }}>
                <h4 style={{ color: '#f8fafc', marginBottom: '15px', fontSize: '1rem' }}>Monthly Revenue Growth</h4>
                <div style={{ width: '100%', height: '200px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }} />
                      <Area type="monotone" dataKey="v" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 2: Event Status (Pie) */}
              <div className="dashboard-panel" style={{ padding: '15px' }}>
                <h4 style={{ color: '#f8fafc', marginBottom: '15px', fontSize: '1rem' }}>Live Event Status</h4>
                <div style={{ width: '100%', height: '200px' }}>
                  {eventsList.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }} />
                        <Pie data={eventStatusData} dataKey="count" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={80} paddingAngle={5}>
                          {eventStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  ) : <p style={{ color: '#94a3b8', textAlign: 'center', paddingTop: '80px' }}>No Active Events</p>}
                </div>
              </div>

              {/* Chart 3: Inquiry Volume (Bar) */}
              <div className="dashboard-panel" style={{ padding: '15px' }}>
                <h4 style={{ color: '#f8fafc', marginBottom: '15px', fontSize: '1rem' }}>Inquiry Volume (Last 7 Days)</h4>
                <div style={{ width: '100%', height: '200px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={inquiriesTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }} />
                      <Bar dataKey="v" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
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
                    {eventsList.map((event, i) => (
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
                          <button className="action-btn" onClick={() => { setSelectedEvent(event); setShowEditEvent(true); }}>Details</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div className="dashboard-content">
            <div className="dashboard-panel">
              <div className="panel-header">
                <h3>Upcoming Events Calendar</h3>
                <button className="add-btn" onClick={() => setShowEventForm(true)}>+ Add Manual Event</button>
              </div>
              <div className="orders-grid">
                {eventsList.map((event, i) => (
                  <div key={i} className="order-card">
                    <div className="order-header">
                      <h4>{event.eventName}</h4>
                      <span className={`status-badge ${event.status === 'Confirmed' ? 'ready' : event.status === 'Preparing' ? 'preparing' : 'delivered'}`}>
                        {event.status}
                      </span>
                    </div>
                    <div className="order-body">
                      <p className="order-items">Guests: <strong>{event.guests} pax</strong></p>
                      <p className="order-time">Date: <strong>{event.date}</strong></p>
                    </div>
                    <div className="order-footer">
                      <button className="action-btn primary" onClick={() => { setSelectedEvent(event); setShowViewInvoice(true); }}>View Invoice</button>
                      <button className="action-btn" onClick={() => { setSelectedEvent(event); setShowEditEvent(true); }}>Edit Details</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'inquiries' && (
          <div className="dashboard-content">
            <div className="dashboard-panel">
              <div className="panel-header">
                <h3>Active Catering Inquiries</h3>
              </div>
              <div className="table-responsive">
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>Client Name</th>
                      <th>Event Type</th>
                      <th>Packages Requested</th>
                      <th>Guests</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inquiriesList.map((inq, i) => (
                      <tr key={i}>
                        <td>
                          <strong>{inq.client}</strong><br />
                          <small style={{color: '#64748b'}}>{inq.phone}</small>
                        </td>
                        <td>{inq.event}</td>
                        <td>{inq.items || 'None specified'}</td>
                        <td>{inq.guests}</td>
                        <td>
                          <span className={`status-badge ${inq.status === 'New' ? 'preparing' : 'ready'}`}>
                            {inq.status}
                          </span>
                        </td>
                        <td>
                          <button className="action-btn primary" onClick={() => { setSelectedInquiry(inq); setShowQuoteForm(true); }}>Send Quote</button>
                          <button className="action-btn text-danger" onClick={() => { setSelectedInquiry(inq); setShowDeclineForm(true); }}>Decline</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'packages' && (
          <div className="dashboard-content">
            <div className="dashboard-panel">
              <div className="panel-header">
                <h3>Menu Packages</h3>
                <button className="add-btn" onClick={() => setShowPackageForm(true)}>+ Create Package</button>
              </div>
              <div className="orders-grid">
                {packagesList.map((pkg, i) => (
                  <div key={i} className="order-card">
                    <div className="order-header">
                      <h4>{pkg.name}</h4>
                      <span className="order-amount" style={{fontSize: '1rem'}}>{pkg.price}</span>
                    </div>
                    <div className="order-body" style={{marginTop: '12px'}}>
                      <p className="order-time" style={{lineHeight: '1.5'}}>{pkg.items}</p>
                    </div>
                    <div className="order-footer">
                      <button className="action-btn primary" style={{width: '100%'}} onClick={() => { setSelectedPackage(pkg); setShowEditPackage(true); }}>Edit Package</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {showEditEvent && selectedEvent && (
        <div className="custom-modal-backdrop" onClick={() => setShowEditEvent(false)}>
          <div className="custom-modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>Edit Event</h3>
            <form onSubmit={handleEditEventSubmit} className="event-form">
              <input 
                type="text" 
                placeholder="Event Name" 
                required 
                value={selectedEvent.eventName} 
                onChange={(e) => setSelectedEvent({...selectedEvent, eventName: e.target.value})}
                className="form-input"
              />
              <input 
                type="number" 
                placeholder="Guests" 
                required 
                value={selectedEvent.guests} 
                onChange={(e) => setSelectedEvent({...selectedEvent, guests: e.target.value})}
                className="form-input"
              />
              <select 
                value={selectedEvent.status} 
                onChange={(e) => setSelectedEvent({...selectedEvent, status: e.target.value})}
                className="form-input"
              >
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Preparing">Preparing</option>
              </select>
              <div style={{display: 'flex', gap: '10px', marginTop: '10px', justifyContent: 'center'}}>
                <button type="button" className="action-btn" onClick={() => setShowEditEvent(false)}>Cancel</button>
                <button type="submit" className="action-btn primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showViewInvoice && selectedEvent && (
        <div className="custom-modal-backdrop" onClick={() => setShowViewInvoice(false)}>
          <div className="custom-modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>Invoice Breakdown</h3>
            <div className="event-form" style={{textAlign: 'left'}}>
              <p><strong>Event:</strong> {selectedEvent.eventName}</p>
              <p><strong>Guests:</strong> {selectedEvent.guests}</p>
              <p><strong>Date:</strong> {selectedEvent.date}</p>
              <hr style={{borderColor: '#334155', margin: '12px 0'}} />
              <p><strong>Total Estimate:</strong> ₹{selectedEvent.guests * 500}</p>
            </div>
            <button className="action-btn primary" onClick={() => setShowViewInvoice(false)} style={{marginTop: '16px'}}>Close</button>
          </div>
        </div>
      )}

      {showQuoteForm && selectedInquiry && (
        <div className="custom-modal-backdrop" onClick={() => setShowQuoteForm(false)}>
          <div className="custom-modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>Send Quote to {selectedInquiry.client}</h3>
            <form onSubmit={handleQuoteSubmit} className="event-form">
              <input 
                type="text" 
                placeholder="Estimated Amount (e.g. ₹50,000)" 
                required 
                className="form-input"
              />
              <textarea 
                placeholder="Message/Details..." 
                className="form-input"
                rows="3"
                style={{fontFamily: 'inherit'}}
              ></textarea>
              <div style={{display: 'flex', gap: '10px', marginTop: '10px', justifyContent: 'center'}}>
                <button type="button" className="action-btn" onClick={() => setShowQuoteForm(false)}>Cancel</button>
                <button type="submit" className="action-btn primary">Send Quote</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeclineForm && selectedInquiry && (
        <div className="custom-modal-backdrop" onClick={() => setShowDeclineForm(false)}>
          <div className="custom-modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>Decline Inquiry</h3>
            <form onSubmit={handleDeclineSubmit} className="event-form">
              <textarea 
                placeholder="Reason for declining..." 
                required 
                className="form-input"
                rows="3"
                style={{fontFamily: 'inherit'}}
              ></textarea>
              <div style={{display: 'flex', gap: '10px', marginTop: '10px', justifyContent: 'center'}}>
                <button type="button" className="action-btn" onClick={() => setShowDeclineForm(false)}>Cancel</button>
                <button type="submit" className="action-btn text-danger">Decline Request</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditPackage && selectedPackage && (
        <div className="custom-modal-backdrop" onClick={() => setShowEditPackage(false)}>
          <div className="custom-modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>Edit Package</h3>
            <form onSubmit={handleEditPackageSubmit} className="event-form">
              <input 
                type="text" 
                placeholder="Package Name" 
                required 
                value={selectedPackage.name} 
                onChange={(e) => setSelectedPackage({...selectedPackage, name: e.target.value})}
                className="form-input"
              />
              <input 
                type="text" 
                placeholder="Price" 
                required 
                value={selectedPackage.price} 
                onChange={(e) => setSelectedPackage({...selectedPackage, price: e.target.value})}
                className="form-input"
              />
              <input 
                type="text" 
                placeholder="Image URL (optional)" 
                value={selectedPackage.image || ''} 
                onChange={(e) => setSelectedPackage({...selectedPackage, image: e.target.value})}
                className="form-input"
              />
              <textarea 
                required 
                value={selectedPackage.items} 
                onChange={(e) => setSelectedPackage({...selectedPackage, items: e.target.value})}
                className="form-input"
                rows="3"
                style={{fontFamily: 'inherit'}}
              ></textarea>
              <div style={{display: 'flex', gap: '10px', marginTop: '10px', justifyContent: 'center'}}>
                <button type="button" className="action-btn" onClick={() => setShowEditPackage(false)}>Cancel</button>
                <button type="submit" className="action-btn primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEventForm && (
        <div className="custom-modal-backdrop" onClick={() => setShowEventForm(false)}>
          <div className="custom-modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>Add New Event</h3>
            <form onSubmit={handleAddEvent} className="event-form">
              <input 
                type="text" 
                placeholder="Event Name" 
                required 
                value={newEvent.eventName} 
                onChange={(e) => setNewEvent({...newEvent, eventName: e.target.value})}
                className="form-input"
              />
              <input 
                type="number" 
                placeholder="Number of Guests" 
                required 
                value={newEvent.guests} 
                onChange={(e) => setNewEvent({...newEvent, guests: e.target.value})}
                className="form-input"
              />
              <input 
                type="date" 
                required 
                value={newEvent.date} 
                onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                className="form-input"
              />
              <select 
                value={newEvent.status} 
                onChange={(e) => setNewEvent({...newEvent, status: e.target.value})}
                className="form-input"
              >
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Preparing">Preparing</option>
              </select>
              <div style={{display: 'flex', gap: '10px', marginTop: '10px', justifyContent: 'center'}}>
                <button type="button" className="action-btn" onClick={() => setShowEventForm(false)}>Cancel</button>
                <button type="submit" className="action-btn primary">Save Event</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showPackageForm && (
        <div className="custom-modal-backdrop" onClick={() => setShowPackageForm(false)}>
          <div className="custom-modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>Create New Package</h3>
            <form onSubmit={handleAddPackage} className="event-form">
              <input 
                type="text" 
                placeholder="Package Name (e.g., Premium Non-Veg)" 
                required 
                value={newPackage.name} 
                onChange={(e) => setNewPackage({...newPackage, name: e.target.value})}
                className="form-input"
              />
              <input 
                type="text" 
                placeholder="Price (e.g., ₹600/plate)" 
                required 
                value={newPackage.price} 
                onChange={(e) => setNewPackage({...newPackage, price: e.target.value})}
                className="form-input"
              />
              <input 
                type="text" 
                placeholder="Image URL (e.g., Unsplash link)" 
                value={newPackage.image} 
                onChange={(e) => setNewPackage({...newPackage, image: e.target.value})}
                className="form-input"
              />
              <textarea 
                placeholder="Included Items (e.g., Chicken Biryani, Raita...)" 
                required 
                value={newPackage.items} 
                onChange={(e) => setNewPackage({...newPackage, items: e.target.value})}
                className="form-input"
                rows="3"
                style={{fontFamily: 'inherit'}}
              ></textarea>
              <div style={{display: 'flex', gap: '10px', marginTop: '10px', justifyContent: 'center'}}>
                <button type="button" className="action-btn" onClick={() => setShowPackageForm(false)}>Cancel</button>
                <button type="submit" className="action-btn primary">Save Package</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modalConfig && (
        <div className="custom-modal-backdrop" onClick={() => setModalConfig(null)}>
          <div className="custom-modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>{modalConfig.title}</h3>
            <p>{modalConfig.message}</p>
            <button className="close-btn" onClick={() => setModalConfig(null)}>Got it</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CateringDashboard;

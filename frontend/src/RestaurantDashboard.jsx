import { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './Dashboard.css';

const RestaurantDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [modalConfig, setModalConfig] = useState(null);
  const [showDishForm, setShowDishForm] = useState(false);
  const [newDish, setNewDish] = useState({ name: '', price: '', category: 'Main Course', image: '', description: '', inStock: true });
  const [showOrderUpdate, setShowOrderUpdate] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [showEditDish, setShowEditDish] = useState(false);
  const [selectedDish, setSelectedDish] = useState(null);
  const [showToggleStock, setShowToggleStock] = useState(false);

  const [ordersList, setOrdersList] = useState([]);
  const [menuList, setMenuList] = useState([]);

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };
        
        const [ordersRes, menuRes] = await Promise.all([
          fetch('http://localhost:5000/api/restaurant/orders', { headers }),
          fetch('http://localhost:5000/api/restaurant/menu', { headers })
        ]);
        
        if (ordersRes.ok) setOrdersList(await ordersRes.json());
        if (menuRes.ok) setMenuList(await menuRes.json());
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      }
    };
    fetchData();
  }, []);

  const handleAddDish = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/restaurant/menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newDish)
      });
      if (res.ok) {
        const addedDish = await res.json();
        setMenuList([...menuList, addedDish]);
        setShowDishForm(false);
        setNewDish({ name: '', price: '', category: 'Main Course', image: '', description: '', inStock: true });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateOrderStatus = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/restaurant/orders/${selectedOrder._id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: selectedOrder.status })
      });
      if (res.ok) {
        const updatedOrder = await res.json();
        setOrdersList(ordersList.map(o => o._id === updatedOrder._id ? updatedOrder : o));
        setShowOrderUpdate(false);
        setSelectedOrder(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditDishSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/restaurant/menu/${selectedDish._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(selectedDish)
      });
      if (res.ok) {
        const updatedDish = await res.json();
        setMenuList(menuList.map(d => d._id === updatedDish._id ? updatedDish : d));
        setShowEditDish(false);
        setSelectedDish(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const confirmToggleStock = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/restaurant/menu/${selectedDish._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ inStock: !selectedDish.inStock })
      });
      if (res.ok) {
        const updatedDish = await res.json();
        setMenuList(menuList.map(d => d._id === updatedDish._id ? updatedDish : d));
        setShowToggleStock(false);
        setSelectedDish(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Dynamic KPI Calculations
  const totalRevenue = ordersList.reduce((sum, order) => {
    const amt = Number(String(order.amount).replace(/[^0-9.-]+/g, '')) || 0;
    return sum + amt;
  }, 0);
  const ordersToday = ordersList.length;

  const orderStatusData = [
    { name: 'Preparing', count: ordersList.filter(o => o.status === 'Preparing').length },
    { name: 'Ready', count: ordersList.filter(o => o.status === 'Ready').length },
    { name: 'Delivered', count: ordersList.filter(o => o.status === 'Delivered').length },
  ];

  const revenueTrend = [{v: 1200}, {v: 1450}, {v: 1100}, {v: 1800}, {v: 2100}, {v: 2500}, {v: totalRevenue > 0 ? totalRevenue : 3000}];
  const ordersTrend = [{v: 5}, {v: 8}, {v: 6}, {v: 10}, {v: 12}, {v: 15}, {v: ordersToday > 0 ? ordersToday : 20}];
  const ratingTrend = [{v: 4.5}, {v: 4.6}, {v: 4.6}, {v: 4.7}, {v: 4.7}, {v: 4.8}, {v: 4.8}];
  const COLORS = ['#f59e0b', '#38bdf8', '#10b981'];

  return (
    <div className="dashboard-layout" style={{ backgroundImage: "linear-gradient(rgba(15, 23, 42, 0.5), rgba(15, 23, 42, 0.7)), url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop')" }}>
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
              <div className="kpi-card" style={{ paddingBottom: '10px' }}>
                <div className="kpi-icon">💰</div>
                <div className="kpi-info" style={{ width: '100%' }}>
                  <p>Today's Revenue</p>
                  <h3>₹{totalRevenue > 0 ? totalRevenue.toLocaleString('en-IN') : '0'}</h3>
                  <span className="trend positive">+15% vs yesterday</span>
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
                <div className="kpi-icon">📦</div>
                <div className="kpi-info" style={{ width: '100%' }}>
                  <p>Orders Today</p>
                  <h3>{ordersToday}</h3>
                  <span className="trend positive">+5 vs yesterday</span>
                  <div style={{ width: '100%', height: '50px', marginTop: '10px' }}>
                    <ResponsiveContainer>
                      <LineChart data={ordersTrend}>
                        <Line type="stepAfter" dataKey="v" stroke="#38bdf8" strokeWidth={3} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              <div className="kpi-card" style={{ paddingBottom: '10px' }}>
                <div className="kpi-icon">⭐</div>
                <div className="kpi-info" style={{ width: '100%' }}>
                  <p>Average Rating</p>
                  <h3>4.8 / 5</h3>
                  <span className="trend neutral">Based on 120 reviews</span>
                  <div style={{ width: '100%', height: '50px', marginTop: '10px' }}>
                    <ResponsiveContainer>
                      <LineChart data={ratingTrend}>
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
                <h4 style={{ color: '#f8fafc', marginBottom: '15px', fontSize: '1rem' }}>7-Day Revenue Trend</h4>
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

              {/* Chart 2: Order Status (Pie) */}
              <div className="dashboard-panel" style={{ padding: '15px' }}>
                <h4 style={{ color: '#f8fafc', marginBottom: '15px', fontSize: '1rem' }}>Live Order Status</h4>
                <div style={{ width: '100%', height: '200px' }}>
                  {ordersList.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }} />
                        <Pie data={orderStatusData} dataKey="count" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={80} paddingAngle={5}>
                          {orderStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  ) : <p style={{ color: '#94a3b8', textAlign: 'center', paddingTop: '80px' }}>No Active Orders</p>}
                </div>
              </div>

              {/* Chart 3: Orders Volume (Bar) */}
              <div className="dashboard-panel" style={{ padding: '15px' }}>
                <h4 style={{ color: '#f8fafc', marginBottom: '15px', fontSize: '1rem' }}>Weekly Orders Volume</h4>
                <div style={{ width: '100%', height: '200px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ordersTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }} />
                      <Bar dataKey="v" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
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
                    {ordersList.map((order, i) => (
                      <tr key={i}>
                        <td>{order._id ? order._id.slice(-6).toUpperCase() : order.id}</td>
                        <td>{order.items}</td>
                        <td>{order.amount}</td>
                        <td>{order.time}</td>
                        <td>
                          <span className={`status-badge ${order.status.toLowerCase()}`}>
                            {order.status}
                          </span>
                        </td>
                        <td>
                          <button className="action-btn" onClick={() => { setSelectedOrder(order); setShowOrderUpdate(true); }}>Update</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="dashboard-content">
            <div className="dashboard-panel">
              <div className="panel-header">
                <h3>Live Kitchen Orders</h3>
                <div className="filter-group">
                  <button className="filter-btn active">All (3)</button>
                  <button className="filter-btn">Preparing (1)</button>
                  <button className="filter-btn">Ready (1)</button>
                </div>
              </div>
              <div className="orders-grid">
                {ordersList.map((order, i) => (
                  <div key={i} className="order-card">
                    <div className="order-header">
                      <h4>{order._id ? '#' + order._id.slice(-6).toUpperCase() : order.id}</h4>
                      <span className={`status-badge ${order.status.toLowerCase()}`}>{order.status}</span>
                    </div>
                    <div className="order-body">
                      <p className="order-items">{order.items}</p>
                      <p className="order-time">⏱️ {order.time}</p>
                    </div>
                    <div className="order-footer">
                      <span className="order-amount">{order.amount}</span>
                      <button className="action-btn primary" onClick={() => { 
                        setSelectedOrder(order); 
                        if(order.status === 'Preparing') setShowOrderUpdate(true); 
                        else setShowOrderDetails(true); 
                      }}>
                        {order.status === 'Preparing' ? 'Mark Ready' : 'View Details'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'menu' && (
          <div className="dashboard-content">
            <div className="dashboard-panel">
              <div className="panel-header">
                <h3>Menu Management</h3>
                <button className="add-btn" onClick={() => setShowDishForm(true)}>+ Add New Dish</button>
              </div>
              <div className="table-responsive">
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>Dish Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {menuList.map((item, i) => (
                      <tr key={i}>
                        <td><strong>{item.name}</strong></td>
                        <td>{item.category}</td>
                        <td>{item.price}</td>
                        <td>
                          <span className={`status-badge ${item.inStock ? 'ready' : 'preparing'}`}>
                            {item.inStock ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </td>
                        <td>
                          <button className="action-btn" onClick={() => { setSelectedDish(item); setShowEditDish(true); }}>Edit</button>
                          <button className="action-btn text-danger" onClick={() => { setSelectedDish(item); setShowToggleStock(true); }}>Toggle</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="dashboard-content">
            <div className="dashboard-panel">
              <div className="panel-header">
                <h3>Weekly Performance</h3>
                <select className="date-select">
                  <option>This Week</option>
                  <option>Last Week</option>
                </select>
              </div>
              <div className="analytics-layout">
                <div className="chart-placeholder">
                  <div className="bar-chart">
                    <div className="bar" style={{height: '40%'}} title="Mon"></div>
                    <div className="bar" style={{height: '60%'}} title="Tue"></div>
                    <div className="bar" style={{height: '50%'}} title="Wed"></div>
                    <div className="bar" style={{height: '80%'}} title="Thu"></div>
                    <div className="bar" style={{height: '95%'}} title="Fri"></div>
                    <div className="bar" style={{height: '100%', backgroundColor: '#ef4444'}} title="Sat"></div>
                    <div className="bar" style={{height: '85%'}} title="Sun"></div>
                  </div>
                  <p className="chart-label">Revenue over the last 7 days</p>
                </div>
                <div className="top-dishes">
                  <h4>Top Selling Items</h4>
                  <ul className="top-list">
                    <li>1. Hyderabadi Biryani (120 orders)</li>
                    <li>2. Butter Naan (85 orders)</li>
                    <li>3. Paneer Butter Masala (60 orders)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {showOrderUpdate && selectedOrder && (
        <div className="custom-modal-backdrop" onClick={() => setShowOrderUpdate(false)}>
          <div className="custom-modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>Update Order {selectedOrder._id ? selectedOrder._id.slice(-6).toUpperCase() : selectedOrder.id}</h3>
            <form onSubmit={handleUpdateOrderStatus} className="event-form">
              <p>Current Status: <strong>{selectedOrder.status}</strong></p>
              <select 
                value={selectedOrder.status} 
                onChange={(e) => setSelectedOrder({...selectedOrder, status: e.target.value})}
                className="form-input"
              >
                <option value="Preparing">Preparing</option>
                <option value="Ready">Ready</option>
                <option value="Delivered">Delivered</option>
              </select>
              <div style={{display: 'flex', gap: '10px', marginTop: '10px', justifyContent: 'center'}}>
                <button type="button" className="action-btn" onClick={() => setShowOrderUpdate(false)}>Cancel</button>
                <button type="submit" className="action-btn primary">Update Status</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showOrderDetails && selectedOrder && (
        <div className="custom-modal-backdrop" onClick={() => setShowOrderDetails(false)}>
          <div className="custom-modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>Order Details {selectedOrder._id ? selectedOrder._id.slice(-6).toUpperCase() : selectedOrder.id}</h3>
            <div className="event-form" style={{textAlign: 'left'}}>
              <p><strong>Items:</strong> {selectedOrder.items}</p>
              <p><strong>Amount:</strong> {selectedOrder.amount}</p>
              <p><strong>Time:</strong> {selectedOrder.time}</p>
              <p><strong>Status:</strong> {selectedOrder.status}</p>
            </div>
            <button className="action-btn primary" onClick={() => setShowOrderDetails(false)} style={{marginTop: '16px'}}>Close</button>
          </div>
        </div>
      )}

      {showEditDish && selectedDish && (
        <div className="custom-modal-backdrop" onClick={() => setShowEditDish(false)}>
          <div className="custom-modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>Edit Dish</h3>
            <form onSubmit={handleEditDishSubmit} className="event-form">
              <input 
                type="text" 
                placeholder="Dish Name" 
                required 
                value={selectedDish.name} 
                onChange={(e) => setSelectedDish({...selectedDish, name: e.target.value})}
                className="form-input"
              />
              <input 
                type="text" 
                placeholder="Price" 
                required 
                value={selectedDish.price} 
                onChange={(e) => setSelectedDish({...selectedDish, price: e.target.value})}
                className="form-input"
              />
              <input 
                type="text" 
                placeholder="Image URL (optional)" 
                value={selectedDish.image || ''} 
                onChange={(e) => setSelectedDish({...selectedDish, image: e.target.value})}
                className="form-input"
              />
              <textarea 
                placeholder="Dish Description" 
                value={selectedDish.description || ''} 
                onChange={(e) => setSelectedDish({...selectedDish, description: e.target.value})}
                className="form-input"
                rows="2"
              />
              <select 
                value={selectedDish.category} 
                onChange={(e) => setSelectedDish({...selectedDish, category: e.target.value})}
                className="form-input"
              >
                <option value="Main Course">Main Course</option>
                <option value="Breads">Breads</option>
                <option value="Desserts">Desserts</option>
                <option value="Beverages">Beverages</option>
              </select>
              <div style={{display: 'flex', gap: '10px', marginTop: '10px', justifyContent: 'center'}}>
                <button type="button" className="action-btn" onClick={() => setShowEditDish(false)}>Cancel</button>
                <button type="submit" className="action-btn primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showToggleStock && selectedDish && (
        <div className="custom-modal-backdrop" onClick={() => setShowToggleStock(false)}>
          <div className="custom-modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>Toggle Stock Status</h3>
            <p>Are you sure you want to mark <strong>{selectedDish.name}</strong> as {selectedDish.inStock ? 'Out of Stock' : 'In Stock'}?</p>
            <div style={{display: 'flex', gap: '10px', marginTop: '10px', justifyContent: 'center'}}>
              <button type="button" className="action-btn" onClick={() => setShowToggleStock(false)}>Cancel</button>
              <button type="button" className="action-btn primary" onClick={confirmToggleStock}>Confirm</button>
            </div>
          </div>
        </div>
      )}

      {showDishForm && (
        <div className="custom-modal-backdrop" onClick={() => setShowDishForm(false)}>
          <div className="custom-modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>Add New Dish</h3>
            <form onSubmit={handleAddDish} className="event-form">
              <input 
                type="text" 
                placeholder="Dish Name" 
                required 
                value={newDish.name} 
                onChange={(e) => setNewDish({...newDish, name: e.target.value})}
                className="form-input"
              />
              <input 
                type="text" 
                placeholder="Price (e.g., ₹250)" 
                required 
                value={newDish.price} 
                onChange={(e) => setNewDish({...newDish, price: e.target.value})}
                className="form-input"
              />
              <input 
                type="text" 
                placeholder="Image URL (e.g., Unsplash link)" 
                value={newDish.image} 
                onChange={(e) => setNewDish({...newDish, image: e.target.value})}
                className="form-input"
              />
              <textarea 
                placeholder="Dish Description (optional)" 
                value={newDish.description} 
                onChange={(e) => setNewDish({...newDish, description: e.target.value})}
                className="form-input"
                rows="2"
              />
              <select 
                value={newDish.category} 
                onChange={(e) => setNewDish({...newDish, category: e.target.value})}
                className="form-input"
              >
                <option value="Main Course">Main Course</option>
                <option value="Breads">Breads</option>
                <option value="Desserts">Desserts</option>
                <option value="Beverages">Beverages</option>
              </select>
              <div style={{display: 'flex', gap: '10px', marginTop: '10px', justifyContent: 'center'}}>
                <button type="button" className="action-btn" onClick={() => setShowDishForm(false)}>Cancel</button>
                <button type="submit" className="action-btn primary">Save Dish</button>
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

export default RestaurantDashboard;

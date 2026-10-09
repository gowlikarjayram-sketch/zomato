import { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './Dashboard.css';

const CloudKitchenDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [modalConfig, setModalConfig] = useState(null);
  const [showBrandForm, setShowBrandForm] = useState(false);
  const [newBrand, setNewBrand] = useState({ name: '', orders: 0, revenue: '₹0', status: 'Active' });
  const [showStockForm, setShowStockForm] = useState(false);
  const [newStock, setNewStock] = useState({ item: '', quantity: '', status: 'In Stock' });

  const [selectedBrand, setSelectedBrand] = useState(null);
  const [showEditBrand, setShowEditBrand] = useState(false);
  const [showPauseBrand, setShowPauseBrand] = useState(false);

  const [selectedInventory, setSelectedInventory] = useState(null);
  const [showRestockForm, setShowRestockForm] = useState(false);

  const showModal = (title, message) => setModalConfig({ title, message });

  const [brandsList, setBrandsList] = useState([]);
  const [inventoryList, setInventoryList] = useState([]);
  const [menuList, setMenuList] = useState([]);
  const [showDishForm, setShowDishForm] = useState(false);
  const [newDish, setNewDish] = useState({ name: '', price: '', category: 'Main Course', image: '', description: '', inStock: true });

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };

        const [brandsRes, invRes, menuRes] = await Promise.all([
          fetch('http://localhost:5000/api/cloudkitchen/brands', { headers }),
          fetch('http://localhost:5000/api/cloudkitchen/inventory', { headers }),
          fetch('http://localhost:5000/api/cloudkitchen/menu', { headers })
        ]);

        if (brandsRes.ok) setBrandsList(await brandsRes.json());
        if (invRes.ok) setInventoryList(await invRes.json());
        if (menuRes.ok) setMenuList(await menuRes.json());
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      }
    };
    fetchData();
  }, []);

  const handleAddBrand = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/cloudkitchen/brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(newBrand)
      });
      if (res.ok) {
        const addedBrand = await res.json();
        setBrandsList([...brandsList, addedBrand]);
        setShowBrandForm(false);
        setNewBrand({ name: '', orders: 0, revenue: '₹0', status: 'Active' });
        showModal('Success', 'New brand launched successfully!');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddStock = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/cloudkitchen/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(newStock)
      });
      if (res.ok) {
        const addedStock = await res.json();
        setInventoryList([...inventoryList, addedStock]);
        setShowStockForm(false);
        setNewStock({ item: '', quantity: '', status: 'In Stock' });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddDish = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/cloudkitchen/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(newDish)
      });
      if (res.ok) {
        const addedDish = await res.json();
        setMenuList([...menuList, addedDish]);
        setShowDishForm(false);
        setNewDish({ name: '', price: '', category: 'Main Course', image: '', description: '', inStock: true });
        showModal('Success', 'Dish added successfully!');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditBrandSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/cloudkitchen/brands/${selectedBrand._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(selectedBrand)
      });
      if (res.ok) {
        const updatedBrand = await res.json();
        setBrandsList(brandsList.map(b => b._id === updatedBrand._id ? updatedBrand : b));
        setShowEditBrand(false);
        setSelectedBrand(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const confirmPauseBrand = async () => {
    try {
      const token = localStorage.getItem('token');
      const newStatus = selectedBrand.status === 'Paused' ? 'Active' : 'Paused';
      const res = await fetch(`http://localhost:5000/api/cloudkitchen/brands/${selectedBrand._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        const updatedBrand = await res.json();
        setBrandsList(brandsList.map(b => b._id === updatedBrand._id ? updatedBrand : b));
        setShowPauseBrand(false);
        setSelectedBrand(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRestockSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/cloudkitchen/inventory/${selectedInventory._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(selectedInventory)
      });
      if (res.ok) {
        const updatedInv = await res.json();
        setInventoryList(inventoryList.map(i => i._id === updatedInv._id ? updatedInv : i));
        setShowRestockForm(false);
        setSelectedInventory(null);
      }
    } catch (err) {
      console.error(err);
    }
  };



  // Dynamic KPI Calculations
  const calculatedRevenue = brandsList.reduce((sum, b) => {
    const rev = Number(String(b.revenue).replace(/[^0-9.-]+/g, '')) || 0;
    return sum + rev;
  }, 0);
  const totalRevenue = calculatedRevenue > 0 ? calculatedRevenue : 0;

  const activeBrandsCount = brandsList.filter(b => b.status === 'Active').length;
  const totalBrandsCount = brandsList.length || 0;

  const validTimes = menuList.map(m => {
    const timeMatch = String(m.time || '').match(/(\d+)/);
    return timeMatch ? parseInt(timeMatch[1], 10) : null;
  }).filter(t => t !== null);
  const avgPrepTime = validTimes.length > 0 ? Math.round(validTimes.reduce((a, b) => a + b, 0) / validTimes.length) : 12;

  const chartData = brandsList.map(brand => ({
    name: brand.name,
    Revenue: Number(String(brand.revenue).replace(/[^0-9.-]+/g, '')) || 0,
    Orders: brand.orders || 0
  }));

  const COLORS = ['#38bdf8', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  // Sparkline dummy data for visual trends in the 3 boxes
  const revenueTrend = [{v: 30}, {v: 45}, {v: 50}, {v: 70}, {v: 85}, {v: 95}, {v: 100}];
  const brandsTrend = [{v: 1}, {v: 1}, {v: 2}, {v: 2}, {v: 2}, {v: 3}, {v: 3}];
  const prepTrend = [{v: 25}, {v: 22}, {v: 21}, {v: 19}, {v: 17}, {v: 15}, {v: 12}];

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
            className={`nav-btn ${activeTab === 'dishes' ? 'active' : ''}`}
            onClick={() => setActiveTab('dishes')}
          >
            🍛 Menu Dishes
          </button>
          <button
            className={`nav-btn ${activeTab === 'inventory' ? 'active' : ''}`}
            onClick={() => setActiveTab('inventory')}
          >
            📦 Central Inventory
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
              <div className="kpi-card" style={{ paddingBottom: '10px' }}>
                <div className="kpi-icon">📊</div>
                <div className="kpi-info" style={{ width: '100%' }}>
                  <p>Total Network Revenue</p>
                  <h3>₹{totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                  <span className="trend positive">+22% vs yesterday</span>
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
                <div className="kpi-icon">🌐</div>
                <div className="kpi-info" style={{ width: '100%' }}>
                  <p>Active Virtual Brands</p>
                  <h3>{activeBrandsCount} / {totalBrandsCount || 1}</h3>
                  <span className="trend neutral">{activeBrandsCount === totalBrandsCount && totalBrandsCount > 0 ? 'Operating optimally' : 'Some brands paused'}</span>
                  <div style={{ width: '100%', height: '50px', marginTop: '10px' }}>
                    <ResponsiveContainer>
                      <LineChart data={brandsTrend}>
                        <Line type="stepAfter" dataKey="v" stroke="#38bdf8" strokeWidth={3} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              <div className="kpi-card" style={{ paddingBottom: '10px' }}>
                <div className="kpi-icon">⚡</div>
                <div className="kpi-info" style={{ width: '100%' }}>
                  <p>Avg Prep Time</p>
                  <h3>{avgPrepTime} mins</h3>
                  <span className="trend positive">-2 mins improvement</span>
                  <div style={{ width: '100%', height: '50px', marginTop: '10px' }}>
                    <ResponsiveContainer>
                      <LineChart data={prepTrend}>
                        <Line type="monotone" dataKey="v" stroke="#10b981" strokeWidth={3} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>

            {/* 3-Chart Grid Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '24px' }}>
              
              {/* Chart 1: Revenue (Bar) */}
              <div className="dashboard-panel" style={{ padding: '15px' }}>
                <h4 style={{ color: '#f8fafc', marginBottom: '15px', fontSize: '1rem' }}>Revenue by Brand</h4>
                <div style={{ width: '100%', height: '200px' }}>
                  {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="name" stroke="#94a3b8" tick={{fontSize: 10}} />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }} />
                        <Bar dataKey="Revenue" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : <p style={{ color: '#94a3b8', textAlign: 'center', paddingTop: '80px' }}>No Data</p>}
                </div>
              </div>

              {/* Chart 2: Orders (Pie) */}
              <div className="dashboard-panel" style={{ padding: '15px' }}>
                <h4 style={{ color: '#f8fafc', marginBottom: '15px', fontSize: '1rem' }}>Orders Distribution</h4>
                <div style={{ width: '100%', height: '200px' }}>
                  {chartData.length > 0 && chartData.reduce((sum, item) => sum + item.Orders, 0) > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }} />
                        <Pie data={chartData} dataKey="Orders" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={80} paddingAngle={5}>
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  ) : <p style={{ color: '#94a3b8', textAlign: 'center', paddingTop: '80px' }}>No Orders Yet</p>}
                </div>
              </div>

              {/* Chart 3: Trends (Area) */}
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
                    {brandsList.map((brand, i) => (
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
                          <button className="action-btn" onClick={() => { setSelectedBrand(brand); setShowEditBrand(true); }}>Configure</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'brands' && (
          <div className="dashboard-content">
            <div className="dashboard-panel">
              <div className="panel-header">
                <h3>Virtual Brands Manager</h3>
                <button className="add-btn" onClick={() => setShowBrandForm(true)}>+ Launch New Brand</button>
              </div>
              <div className="orders-grid">
                {brandsList.map((brand, i) => (
                  <div key={i} className="order-card">
                    <div className="order-header">
                      <h4>{brand.name}</h4>
                      <span className="status-badge ready">{brand.status}</span>
                    </div>
                    <div className="order-body">
                      <p className="order-items">Today's Orders: <strong>{brand.orders}</strong></p>
                      <p className="order-time">Revenue: <strong>{brand.revenue}</strong></p>
                    </div>
                    <div className="order-footer">
                      <button className="action-btn" onClick={() => { setSelectedBrand(brand); setShowEditBrand(true); }}>Edit Menu</button>
                      <button className="action-btn text-danger" onClick={() => { setSelectedBrand(brand); setShowPauseBrand(true); }}>
                        {brand.status === 'Paused' ? 'Resume Brand' : 'Pause Brand'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'dishes' && (
          <div className="dashboard-content">
            <div className="dashboard-panel">
              <div className="panel-header">
                <h3>Public Menu Dishes</h3>
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
                    </tr>
                  </thead>
                  <tbody>
                    {menuList.map((dish, i) => (
                      <tr key={i}>
                        <td><strong>{dish.name}</strong></td>
                        <td>{dish.category}</td>
                        <td>₹{dish.price}</td>
                        <td><span className="status-badge ready">Available</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="dashboard-content">
            <div className="dashboard-panel">
              <div className="panel-header">
                <h3>Central Inventory</h3>
                <button className="add-btn" onClick={() => setShowStockForm(true)}>+ Add Stock</button>
              </div>
              <div className="table-responsive">
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>Item Name</th>
                      <th>Quantity</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventoryList.map((inv, i) => (
                      <tr key={i}>
                        <td><strong>{inv.item}</strong></td>
                        <td>{inv.quantity}</td>
                        <td>
                          <span className={`status-badge ${inv.status === 'In Stock' ? 'ready' : inv.status === 'Low Stock' ? 'preparing' : 'delivered'}`}>
                            {inv.status}
                          </span>
                        </td>
                        <td>
                          <button className="action-btn primary" onClick={() => { setSelectedInventory(inv); setShowRestockForm(true); }}>Restock</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}


      </main>

      {showEditBrand && selectedBrand && (
        <div className="custom-modal-backdrop" onClick={() => setShowEditBrand(false)}>
          <div className="custom-modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>Configure Brand</h3>
            <form onSubmit={handleEditBrandSubmit} className="event-form">
              <input
                type="text"
                placeholder="Brand Name"
                required
                value={selectedBrand.name}
                onChange={(e) => setSelectedBrand({ ...selectedBrand, name: e.target.value })}
                className="form-input"
              />
              <input
                type="number"
                placeholder="Today's Orders (e.g. 25)"
                value={selectedBrand.orders === 0 ? '' : selectedBrand.orders}
                onChange={(e) => setSelectedBrand({ ...selectedBrand, orders: Number(e.target.value) })}
                className="form-input"
                style={{ marginTop: '10px' }}
              />
              <input
                type="text"
                placeholder="Revenue (e.g. ₹50000)"
                value={selectedBrand.revenue || ''}
                onChange={(e) => setSelectedBrand({ ...selectedBrand, revenue: e.target.value })}
                className="form-input"
                style={{ marginTop: '10px' }}
              />
              <p style={{ textAlign: 'left', margin: '8px 0', color: '#f8fafc' }}>Status: <strong>{selectedBrand.status}</strong></p>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px', justifyContent: 'center' }}>
                <button type="button" className="action-btn" onClick={() => setShowEditBrand(false)}>Cancel</button>
                <button type="submit" className="action-btn primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showPauseBrand && selectedBrand && (
        <div className="custom-modal-backdrop" onClick={() => setShowPauseBrand(false)}>
          <div className="custom-modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>{selectedBrand.status === 'Paused' ? 'Resume' : 'Pause'} Brand</h3>
            <p>Are you sure you want to {selectedBrand.status === 'Paused' ? 'resume operations for' : 'temporarily pause'} <strong>{selectedBrand.name}</strong>?</p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px', justifyContent: 'center' }}>
              <button type="button" className="action-btn" onClick={() => setShowPauseBrand(false)}>Cancel</button>
              <button type="button" className="action-btn primary" onClick={confirmPauseBrand}>Confirm</button>
            </div>
          </div>
        </div>
      )}

      {showRestockForm && selectedInventory && (
        <div className="custom-modal-backdrop" onClick={() => setShowRestockForm(false)}>
          <div className="custom-modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>Restock Inventory</h3>
            <form onSubmit={handleRestockSubmit} className="event-form">
              <p style={{ textAlign: 'left', margin: '0', color: '#f8fafc' }}>Item: <strong>{selectedInventory.item}</strong></p>
              <p style={{ textAlign: 'left', margin: '0 0 16px 0', color: '#94a3b8' }}>Current: {selectedInventory.quantity}</p>
              <input
                type="text"
                placeholder="New Quantity (e.g., 50 kg)"
                required
                value={selectedInventory.quantity}
                onChange={(e) => setSelectedInventory({ ...selectedInventory, quantity: e.target.value })}
                className="form-input"
              />
              <select
                value={selectedInventory.status}
                onChange={(e) => setSelectedInventory({ ...selectedInventory, status: e.target.value })}
                className="form-input"
              >
                <option value="In Stock">In Stock</option>
                <option value="Low Stock">Low Stock</option>
                <option value="Critical">Critical</option>
              </select>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px', justifyContent: 'center' }}>
                <button type="button" className="action-btn" onClick={() => setShowRestockForm(false)}>Cancel</button>
                <button type="submit" className="action-btn primary">Update Stock</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showBrandForm && (
        <div className="custom-modal-backdrop" onClick={() => setShowBrandForm(false)}>
          <div className="custom-modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>Launch New Brand</h3>
            <form onSubmit={handleAddBrand} className="event-form">
              <input
                type="text"
                placeholder="Brand Name"
                required
                value={newBrand.name}
                onChange={(e) => setNewBrand({ ...newBrand, name: e.target.value })}
                className="form-input"
              />
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px', justifyContent: 'center' }}>
                <button type="button" className="action-btn" onClick={() => setShowBrandForm(false)}>Cancel</button>
                <button type="submit" className="action-btn primary">Launch Brand</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showStockForm && (
        <div className="custom-modal-backdrop" onClick={() => setShowStockForm(false)}>
          <div className="custom-modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>Add Inventory Item</h3>
            <form onSubmit={handleAddStock} className="event-form">
              <input
                type="text"
                placeholder="Item Name"
                required
                value={newStock.item}
                onChange={(e) => setNewStock({ ...newStock, item: e.target.value })}
                className="form-input"
              />
              <input
                type="text"
                placeholder="Quantity (e.g., 50 units)"
                required
                value={newStock.quantity}
                onChange={(e) => setNewStock({ ...newStock, quantity: e.target.value })}
                className="form-input"
              />
              <select
                value={newStock.status}
                onChange={(e) => setNewStock({ ...newStock, status: e.target.value })}
                className="form-input"
              >
                <option value="In Stock">In Stock</option>
                <option value="Low Stock">Low Stock</option>
                <option value="Critical">Critical</option>
              </select>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px', justifyContent: 'center' }}>
                <button type="button" className="action-btn" onClick={() => setShowStockForm(false)}>Cancel</button>
                <button type="submit" className="action-btn primary">Save Item</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDishForm && (
        <div className="custom-modal-backdrop" onClick={() => setShowDishForm(false)}>
          <div className="custom-modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>Add Public Dish</h3>
            <form onSubmit={handleAddDish} className="event-form">
              <input
                type="text"
                placeholder="Dish Name"
                required
                value={newDish.name}
                onChange={(e) => setNewDish({ ...newDish, name: e.target.value })}
                className="form-input"
              />
              <input
                type="text"
                placeholder="Price (e.g., ₹250)"
                required
                value={newDish.price}
                onChange={(e) => setNewDish({ ...newDish, price: e.target.value })}
                className="form-input"
              />
              <input
                type="text"
                placeholder="Image URL (e.g., Unsplash link)"
                value={newDish.image}
                onChange={(e) => setNewDish({ ...newDish, image: e.target.value })}
                className="form-input"
              />
              <textarea
                placeholder="Dish Description (optional)"
                value={newDish.description}
                onChange={(e) => setNewDish({ ...newDish, description: e.target.value })}
                className="form-input"
                rows="2"
              />
              <select
                value={newDish.category}
                onChange={(e) => setNewDish({ ...newDish, category: e.target.value })}
                className="form-input"
              >
                <option value="Main Course">Main Course</option>
                <option value="Starters">Starters</option>
                <option value="Desserts">Desserts</option>
                <option value="Beverages">Beverages</option>
              </select>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px', justifyContent: 'center' }}>
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

export default CloudKitchenDashboard;

import React from 'react';
import { Link } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard-container">
      <header className="admin-dashboard-header">
        <h1>Admin Dashboard</h1>
        <nav>
          <ul className="admin-dashboard-nav">
            <li><Link to="/admin/users">Manage Users</Link></li>
            <li><Link to="/admin/customers">Customers</Link></li>
            <li><Link to="/admin/suppliers">Suppliers</Link></li>
            <li><Link to="/admin/inventory">Inventory</Link></li>
            <li><Link to="/admin/reports">Reports</Link></li>
            <li><Link to="/admin/settings">Settings</Link></li>
          </ul>
        </nav>
      </header>
      <main className="admin-dashboard-main">
        <section className="admin-dashboard-welcome">
          <h2>Welcome, Admin!</h2>
          <p>Select a section from the navigation above to manage the system.</p>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;

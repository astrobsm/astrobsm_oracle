import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import API_BASE_URL from '../config';
import './AdminDashboard.css';

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'full_name', headerName: 'Full Name', flex: 1 },
  { field: 'username', headerName: 'Username', flex: 1 },
  { field: 'email', headerName: 'Email', flex: 1 },
  { field: 'role', headerName: 'Role', flex: 1 },
  { field: 'status', headerName: 'Status', flex: 1 },
  { field: 'actions', headerName: 'Actions', flex: 1, renderCell: (params) => params.row.status === 'pending' ? <Button variant="contained" color="success" onClick={() => params.row.onApprove(params.row)}>Approve</Button> : 'Approved' },
];

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/users?status=pending`);
        const data = await res.json();
        setUsers(Array.isArray(data) ? data.map(u => ({ ...u, onApprove: handleApprove })) : []);
      } catch (err) {
        setUsers([]);
      }
      setLoading(false);
    };
    fetchUsers();
    // eslint-disable-next-line
  }, []);

  const handleApprove = async (user) => {
    try {
      const res = await fetch(`${API_BASE_URL}/users/${user.id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (res.ok) {
        alert(`User approved!\nUsername: ${data.username}\nPassword: ${data.password}`);
        setUsers(users => users.map(u => u.id === user.id ? { ...u, status: 'approved' } : u));
      } else {
        alert(data.detail || 'Failed to approve user.');
      }
    } catch (err) {
      alert('Network error.');
    }
  };

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
        <section className="admin-dashboard-users">
          <h2>Newly Created Users & Profiles</h2>
          <DataGrid
            rows={users.map((u, i) => ({ id: u.id || i, ...u }))}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10, 20, 50]}
            loading={loading}
            disableRowSelectionOnClick
            sx={{ background: '#fff', borderRadius: 2, boxShadow: 2, mt: 2 }}
            autoHeight
          />
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;

import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import API_BASE_URL from '../config';
import './AdminDashboard.css';

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'username', headerName: 'Username', flex: 1 },
  { field: 'full_name', headerName: 'Full Name', flex: 1 },
  { field: 'role', headerName: 'Role', flex: 1 },
  { field: 'status', headerName: 'Status', flex: 1 },
  { field: 'email', headerName: 'Email', flex: 1 },
  { field: 'phone', headerName: 'Phone', flex: 1 },
  {
    field: 'actions',
    headerName: 'Actions',
    flex: 1,
    renderCell: (params) => (
      params.row.status === 'pending' ? (
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => params.row.onApprove(params.row)}
        >
          Approve
        </Button>
      ) : 'Approved'
    )
  }
];

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/list-users`); // Correct endpoint
        const data = await response.json();
        setUsers(Array.isArray(data) ? data.map(u => ({ ...u, onApprove })) : []);
      } catch (error) {
        setUsers([]);
      }
      setLoading(false);
    };
    fetchUsers();
  }, []);

  const onApprove = async (user) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/approve-user/${user.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to approve user');
      // Get PDF blob and trigger download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `credentials_user_${user.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      alert('User approved and credentials PDF downloaded!');
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: 'approved' } : u));
    } catch (error) {
      alert('Error approving user.');
    }
  };

  return (
    <Box className="admin-dashboard-container" sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>
      <Typography variant="h6" sx={{ mb: 2 }}>Newly Created Users & Profiles</Typography>
      <DataGrid
        rows={users}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10, 20, 50]}
        loading={loading}
        autoHeight
        disableRowSelectionOnClick
        sx={{ background: '#fff', borderRadius: 2, boxShadow: 2 }}
      />
    </Box>
  );
};

export default AdminDashboard;

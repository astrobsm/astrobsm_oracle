import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import API_BASE_URL from '../config';
import './StaffPerformance.css';

const columns = [
  { field: 'name', headerName: 'Staff Name', flex: 1 },
  { field: 'attendance_records', headerName: 'Attendance Records', flex: 1 },
  { field: 'production_participation', headerName: 'Production Participation', flex: 1 },
];

const StaffPerformance = () => {
  const [staff, setStaff] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStaffPerformance = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/staff-performance`);
        if (!response.ok) throw new Error('Failed to fetch staff performance');
        const data = await response.json();
        setStaff(Array.isArray(data) ? data.map(s => ({ ...s, id: s.id })) : []);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchStaffPerformance();
  }, []);

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <Box className="staff-performance-container" sx={{ height: 600, width: '100%' }}>
      <Typography variant="h4" gutterBottom>Staff Performance</Typography>
      <DataGrid
        rows={staff}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10, 20, 50]}
        checkboxSelection
        disableRowSelectionOnClick
        sortingOrder={['desc', 'asc']}
        sx={{ background: '#fff', borderRadius: 2, boxShadow: 2 }}
      />
    </Box>
  );
};

export default StaffPerformance;
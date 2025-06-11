import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import API_BASE_URL from '../config';
import './SalesSummary.css';

const columns = [
  { field: 'id', headerName: 'Transaction ID', flex: 1 },
  { field: 'customer_name', headerName: 'Customer Name', flex: 1 },
  { field: 'total_amount', headerName: 'Total Amount', flex: 1 },
  { field: 'status', headerName: 'Status', flex: 1 },
  {
    field: 'action',
    headerName: 'Action',
    flex: 1,
    renderCell: (params) => (
      <Button
        variant="contained"
        color="primary"
        size="small"
        onClick={() => sendReminder(params.row)}
      >
        Send Reminder
      </Button>
    ),
    sortable: false,
    filterable: false,
  },
];

function sendReminder(invoice) {
  const message = `Dear ${invoice.customer_name},\n\nThis is a reminder to complete the payment for the following transaction:\n\nTransaction ID: ${invoice.id}\nTotal Amount: ${invoice.total_amount}\nStatus: ${invoice.status}\n\nCompany Name: Bonnesante Medicals\nBank Name: MONIEPOINT\nAccount Name: BONNESANTE MEDICALS\nAccount Number: 8259518195\n\nBank Name: Access Bank\nAccount Name: BONNESANTE MEDICALS\nAccount Number: 1379643548\n\nThank you.`;
  alert(message);
  // Integrate with email/SMS API as needed
}

const SalesSummary = () => {
  const [summary, setSummary] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSummary = async () => {
    if (!startDate || !endDate) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/reports/sales?start_date=${startDate}&end_date=${endDate}`);
      if (!response.ok) throw new Error('Failed to fetch sales summary');
      const data = await response.json();
      setSummary(data);
    } catch (err) {
      setError(err.message);
      setSummary(null);
    }
    setLoading(false);
  };

  return (
    <Box className="sales-summary-container" sx={{ maxWidth: 1200, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>Sales Summary</Typography>
      <form className="summary-form" onSubmit={e => { e.preventDefault(); fetchSummary(); }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={5}>
            <TextField
              label="Start Date"
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} md={5}>
            <TextField
              label="End Date"
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
              {loading ? 'Loading...' : 'Get Summary'}
            </Button>
          </Grid>
        </Grid>
      </form>
      {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
      {summary && (
        <>
          <Box sx={{ mt: 4, mb: 2 }}>
            <Typography variant="h6">Summary for {summary.start_date} to {summary.end_date}</Typography>
            <Typography>Total Sales: <b>₦{summary.total_sales?.toLocaleString(undefined, {minimumFractionDigits:2})}</b></Typography>
            <Typography>Total VAT: <b>₦{summary.total_vat?.toLocaleString(undefined, {minimumFractionDigits:2})}</b></Typography>
          </Box>
          <DataGrid
            rows={summary.transactions.map((t, i) => ({ ...t, id: t.id || i }))}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10, 20, 50]}
            checkboxSelection
            disableRowSelectionOnClick
            sx={{ background: '#fff', borderRadius: 2, boxShadow: 2 }}
          />
        </>
      )}
    </Box>
  );
};

export default SalesSummary;
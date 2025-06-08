import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
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
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/v1/invoices');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setInvoices(Array.isArray(data) ? data.map((inv, i) => ({ ...inv, id: inv.id || i })) : []);
      } catch (error) {
        setInvoices([]);
      }
    };
    fetchInvoices();
  }, []);

  return (
    <Box className="sales-summary-container" sx={{ height: 600, width: '100%' }}>
      <Typography variant="h4" gutterBottom>Sales Summary</Typography>
      <DataGrid
        rows={invoices}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10, 20, 50]}
        checkboxSelection
        disableRowSelectionOnClick
        sx={{ background: '#fff', borderRadius: 2, boxShadow: 2 }}
      />
    </Box>
  );
};

export default SalesSummary;
import React, { useEffect, useState } from 'react';
import './SalesSummary.css';

const SalesSummary = () => {
    const [invoices, setInvoices] = useState([]);

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/v1/invoices');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setInvoices(data);
            } catch (error) {
                console.error('Error fetching invoices:', error);
            }
        };

        fetchInvoices();
    }, []);

    const sendReminder = (invoice) => {
        const message = `Dear ${invoice.customer_name},\n\nThis is a reminder to complete the payment for the following transaction:\n\nTransaction ID: ${invoice.id}\nTotal Amount: ${invoice.total_amount}\nStatus: ${invoice.status}\n\nCompany Name: Bonnesante Medicals\nBank Name: MONIEPOINT\nAccount Name: BONNESANTE MEDICALS\nAccount Number: 8259518195\n\nBank Name: Access Bank\nAccount Name: BONNESANTE MEDICALS\nAccount Number: 1379643548\n\nThank you.`;
        console.log('Sending reminder:', message);
        // Logic to send the reminder (e.g., email or SMS API)
    };

    return (
        <div className="sales-summary-container">
            <h1>Sales Summary</h1>
            <table className="sales-summary-table">
                <thead>
                    <tr>
                        <th>Transaction ID</th>
                        <th>Customer Name</th>
                        <th>Total Amount</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {invoices.map((invoice) => (
                        <tr key={invoice.id}>
                            <td>{invoice.id}</td>
                            <td>{invoice.customer_name}</td>
                            <td>{invoice.total_amount}</td>
                            <td>{invoice.status}</td>
                            <td>
                                <button onClick={() => sendReminder(invoice)}>Send Reminder</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SalesSummary;
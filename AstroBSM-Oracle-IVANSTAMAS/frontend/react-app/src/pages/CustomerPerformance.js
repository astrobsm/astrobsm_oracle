import React, { useEffect, useState } from 'react';
import './CustomerPerformance.css';
import API_BASE_URL from '../config';

const CustomerPerformance = () => {
    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        const fetchCustomerPerformance = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/customer-performance`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setCustomers(data);
            } catch (error) {
                console.error('Error fetching customer performance:', error);
            }
        };

        fetchCustomerPerformance();
    }, []);

    const getFeedbackMessage = (totalAmount) => {
        if (totalAmount > 10000) {
            return 'Thank you for being a top customer! We appreciate your loyalty.';
        } else if (totalAmount > 5000) {
            return 'We value your patronage! Keep shopping with us.';
        } else {
            return 'Thank you for your business! We look forward to serving you again.';
        }
    };

    return (
        <div className="customer-performance-container">
            <h1>Customer Performance</h1>
            <table className="customer-performance-table">
                <thead>
                    <tr>
                        <th>Customer Name</th>
                        <th>Total Transactions</th>
                        <th>Total Amount</th>
                        <th>Feedback</th>
                    </tr>
                </thead>
                <tbody>
                    {customers.map((customer) => (
                        <tr key={customer.id}>
                            <td>{customer.name}</td>
                            <td>{customer.totalTransactions}</td>
                            <td>{customer.totalAmount}</td>
                            <td>{getFeedbackMessage(customer.totalAmount)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CustomerPerformance;
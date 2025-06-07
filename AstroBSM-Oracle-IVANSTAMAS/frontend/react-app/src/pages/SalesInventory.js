import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SalesInventory.css';

const SalesInventory = () => {
    const navigate = useNavigate();

    return (
        <div className="sales-inventory-container">
            <h1>Sales Inventory</h1>
            <div className="sales-inventory-buttons">
                <button onClick={() => navigate('/product-stock-intake')}>Product Stock Intake</button>
                <button onClick={() => { console.log('Navigating to /product-stock-level'); navigate('/product-stock-level'); }}>Product Stock Level</button>
                <button onClick={() => navigate('/generate-invoice')}>Generate Invoice</button>
                <button onClick={() => navigate('/sales-summary')}>Sales Summary</button>
                <button onClick={() => navigate('/customer-performance')}>Customer Performance</button>
            </div>
        </div>
    );
};

export default SalesInventory;
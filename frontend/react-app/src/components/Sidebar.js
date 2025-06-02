import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
    return (
        <div className="sidebar">
            <h2>Navigation</h2>
            <ul>
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/registration">Registration</Link></li>
                <li><Link to="/attendance">Attendance</Link></li>
                <li><Link to="/sales-inventory">Sales Inventory</Link></li>
                <li><Link to="/production-inventory">Production Inventory</Link></li>
                <li><Link to="/factory-inventory">Factory Inventory</Link></li>
                <li><Link to="/staff-management">Staff Management</Link></li>
                <li><Link to="/payroll">Payroll</Link></li>
                <li><Link to="/reports-analysis">Reports & Analysis</Link></li>
                <li><Link to="/settings">Settings</Link></li>
            </ul>
        </div>
    );
};

export default Sidebar;
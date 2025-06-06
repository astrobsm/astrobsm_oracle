import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';
import './Sidebar.responsive.css';

const Sidebar = () => {
    const [sidebarOpen, setSidebarOpen] = React.useState(false);

    const handleSidebarToggle = () => setSidebarOpen(!sidebarOpen);

    return (
        <>
            <button className="sidebar-toggle" onClick={handleSidebarToggle} aria-label="Open sidebar">
                &#9776;
            </button>
            {sidebarOpen && <div className="sidebar-backdrop" onClick={handleSidebarToggle}></div>}
            <div className={`sidebar${sidebarOpen ? ' open' : ''}`}>
                <h2>Navigation</h2>
                <ul>
                    <li><Link to="/dashboard" onClick={handleSidebarToggle}>Dashboard</Link></li>
                    <li><Link to="/registration" onClick={handleSidebarToggle}>Registration</Link></li>
                    <li><Link to="/attendance" onClick={handleSidebarToggle}>Attendance</Link></li>
                    <li><Link to="/sales-inventory" onClick={handleSidebarToggle}>Sales Inventory</Link></li>
                    <li><Link to="/production-inventory" onClick={handleSidebarToggle}>Production Inventory</Link></li>
                    <li><Link to="/factory-inventory" onClick={handleSidebarToggle}>Factory Inventory</Link></li>
                    <li><Link to="/staff-management" onClick={handleSidebarToggle}>Staff Management</Link></li>
                    <li><Link to="/payroll" onClick={handleSidebarToggle}>Payroll</Link></li>
                    <li><Link to="/reports-analysis" onClick={handleSidebarToggle}>Reports & Analysis</Link></li>
                    <li><Link to="/settings" onClick={handleSidebarToggle}>Settings</Link></li>
                </ul>
            </div>
        </>
    );
};

export default Sidebar;
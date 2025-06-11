import React, { useEffect, useState } from 'react';
import './Settings.css';

const Settings = () => {
    const [settings, setSettings] = useState({ appName: '', theme: '' });
    const [selectedPage, setSelectedPage] = useState('');
    const [uploadedImage, setUploadedImage] = useState(null);
    const [selectedFont, setSelectedFont] = useState('');

    // Grant Access UI state
    const [users, setUsers] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [userWarehouseAccess, setUserWarehouseAccess] = useState([]);
    const [userSectionAccess, setUserSectionAccess] = useState([]);
    const [showGrantAccess, setShowGrantAccess] = useState(false);

    const pages = [
        { path: '/dashboard', name: 'Dashboard' },
        { path: '/registration', name: 'Registration' },
        { path: '/inventory', name: 'Inventory' },
        { path: '/payroll', name: 'Payroll' },
        { path: '/attendance', name: 'Attendance' },
        { path: '/factory-inventory', name: 'Factory Inventory' },
        { path: '/login', name: 'Login' },
        { path: '/stock-intake', name: 'Stock Intake' },
        { path: '/stock-level', name: 'Stock Level' },
        { path: '/grant-access', name: 'Grant Access' },
        { path: '/timed-attendance', name: 'Timed Attendance' },
        { path: '/attendance-record', name: 'Attendance Record' },
        { path: '/attendance-analysis', name: 'Attendance Analysis' },
        { path: '/product-stock-intake', name: 'Product Stock Intake' },
        { path: '/product-stock-level', name: 'Product Stock Level' },
        { path: '/generate-invoice', name: 'Generate Invoice' },
        { path: '/sales-summary', name: 'Sales Summary' },
        { path: '/customer-performance', name: 'Customer Performance' },
        { path: '/sales-inventory', name: 'Sales Inventory' },
        { path: '/database-table', name: 'Database Table' },
        { path: '/register-customer', name: 'Register Customer' },
        // Add more pages as needed
    ];

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/v1/settings');
                const data = await response.json();
                setSettings(data);
            } catch (error) {
                console.error('Error fetching settings:', error);
            }
        };

        fetchSettings();
    }, []);

    // Fetch users and warehouses for Grant Access
    useEffect(() => {
        if (showGrantAccess) {
            fetch('/api/v1/users').then(res => res.json()).then(setUsers);
            fetch('/api/v1/warehouses').then(res => res.json()).then(setWarehouses);
        }
    }, [showGrantAccess]);

    // Fetch access for selected user
    useEffect(() => {
        if (selectedUser) {
            fetch(`/api/v1/access/user/${selectedUser}`).then(res => res.json()).then(data => {
                setUserWarehouseAccess(data.warehouses || []);
                setUserSectionAccess(data.sections || []);
            });
        }
    }, [selectedUser]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSettings({ ...settings, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8000/api/v1/settings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(settings),
            });
            const data = await response.json();
            alert(data.message || 'Settings updated successfully!');
        } catch (error) {
            console.error('Error updating settings:', error);
        }
    };

    const handlePageChange = (e) => {
        setSelectedPage(e.target.value);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setUploadedImage(reader.result);
                alert(`Background image for ${selectedPage} updated successfully!`);
                // Logic to apply the background image to the selected page can be added here
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFontChange = (e) => {
        const font = e.target.value;
        setSelectedFont(font);
        document.body.style.fontFamily = font;
        alert(`Font changed to ${font} successfully!`);
    };

    const handleApplyChanges = async () => {
        if (!selectedPage) {
            alert('Please select a page to apply settings.');
            return;
        }
        try {
            const response = await fetch('http://localhost:8000/api/v1/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    page_name: selectedPage,
                    background_image: uploadedImage,
                    font_family: selectedFont,
                }),
            });
            const data = await response.json();
            alert(data.message || 'Settings applied successfully!');
        } catch (error) {
            alert('Error applying settings.');
        }
    };

    const handleGrantWarehouse = async (warehouseId, grant) => {
        await fetch('/api/v1/access/warehouse', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: selectedUser, warehouse_id: warehouseId, grant })
        });
        // Refresh
        setUserWarehouseAccess(grant
            ? [...userWarehouseAccess, warehouseId]
            : userWarehouseAccess.filter(id => id !== warehouseId));
    };
    const handleGrantSection = async (section, grant) => {
        await fetch('/api/v1/access/section', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: selectedUser, section_name: section, grant })
        });
        setUserSectionAccess(grant
            ? [...userSectionAccess, section]
            : userSectionAccess.filter(s => s !== section));
    };

    return (
        <div className="settings-container">
            <h1>Settings</h1>
            <div className="settings-buttons">
                <button onClick={() => alert('Change Background Image')}>Change Background Image</button>
                <button onClick={() => alert('Select Fonts')}>Select Fonts</button>
                <button onClick={() => alert('Themes')}>Themes</button>
                <div>
                    <label htmlFor="page-select">Select Page:</label>
                    <select id="page-select" value={selectedPage} onChange={handlePageChange}>
                        <option value="">--Select a Page--</option>
                        {pages.map((page) => (
                            <option key={page.path} value={page.path}>{page.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="image-upload">Upload Background Image:</label>
                    <input
                        type="file"
                        id="image-upload"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={!selectedPage}
                    />
                </div>
                <div>
                    <label htmlFor="font-select">Select Font:</label>
                    <select id="font-select" value={selectedFont} onChange={handleFontChange}>
                        <option value="">--Select a Font--</option>
                        <option value="Arial, sans-serif">Arial</option>
                        <option value="'Courier New', monospace">Courier New</option>
                        <option value="'Georgia', serif">Georgia</option>
                        <option value="'Times New Roman', serif">Times New Roman</option>
                        <option value="'Verdana', sans-serif">Verdana</option>
                    </select>
                </div>
                <button onClick={handleApplyChanges} style={{marginTop: 16, background: '#1976d2', color: 'white', padding: '8px 24px', border: 'none', borderRadius: 4, fontWeight: 'bold'}}>Apply Changes</button>
                <button onClick={() => setShowGrantAccess(true)} style={{marginTop: 16, background: '#388e3c', color: 'white', padding: '8px 24px', border: 'none', borderRadius: 4, fontWeight: 'bold'}}>Grant Access</button>
            </div>
            {showGrantAccess && (
                <div className="grant-access-modal">
                    <h2>Grant Access</h2>
                    <label>Select User:
                        <select value={selectedUser} onChange={e => setSelectedUser(e.target.value)}>
                            <option value="">--Select User--</option>
                            {users.map(u => <option key={u.id} value={u.id}>{u.username}</option>)}
                        </select>
                    </label>
                    <h3>Warehouses</h3>
                    {warehouses.map(w => (
                        <div key={w.id}>
                            <input type="checkbox" checked={userWarehouseAccess.includes(w.id)} onChange={e => handleGrantWarehouse(w.id, e.target.checked)} />
                            {w.name}
                        </div>
                    ))}
                    <h3>Sections/Pages</h3>
                    {pages.map(p => (
                        <div key={p.path}>
                            <input type="checkbox" checked={userSectionAccess.includes(p.path)} onChange={e => handleGrantSection(p.path, e.target.checked)} />
                            {p.name}
                        </div>
                    ))}
                    <button onClick={() => setShowGrantAccess(false)} style={{marginTop: 16}}>Close</button>
                </div>
            )}
        </div>
    );
};

export default Settings;
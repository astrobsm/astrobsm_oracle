import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './FactoryInventory.css';
import API_BASE_URL from '../config';

const FactoryInventory = () => {
    const [factoryData, setFactoryData] = useState({
        name: '',
        type: 'machine',
        supplierId: '',
        cost: 0,
        usefulLife: 0,
        responsibleStaff: '',
    });
    const [message, setMessage] = useState('');
    const [suppliers, setSuppliers] = useState([]);

    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/suppliers`);
                const data = await response.json();
                if (Array.isArray(data)) {
                    setSuppliers(data);
                } else {
                    console.error('Unexpected response format:', data);
                    setSuppliers([]);
                }
            } catch (error) {
                console.error('Error fetching suppliers:', error);
                setSuppliers([]);
            }
        };

        fetchSuppliers();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFactoryData({ ...factoryData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_BASE_URL}/factory-inventory`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(factoryData),
            });
            const data = await response.json();
            setMessage(data.message || 'Factory inventory recorded successfully!');
        } catch (error) {
            setMessage('An error occurred. Please try again.');
        }
    };

    return (
        <div className="factory-inventory-container">
            <h1>Factory Inventory</h1>
            <div className="inventory-buttons">
                <Link to="/factory-inventory/device-intake" className="awesome-button">Device Intake</Link>
                <Link to="/factory-inventory/device-list" className="awesome-button">Device List</Link>
                <Link to="/factory-inventory/device-maintenance-log" className="awesome-button">Device Maintenance Log</Link>
                <Link to="/factory-inventory/device-fault-reporting" className="awesome-button">Device Fault Reporting</Link>
            </div>
            <form onSubmit={handleSubmit} className="factory-inventory-form">
                <label>
                    Name:
                    <input
                        type="text"
                        name="name"
                        value={factoryData.name}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <label>
                    Type:
                    <select
                        name="type"
                        value={factoryData.type}
                        onChange={handleInputChange}
                    >
                        <option value="machine">Machine</option>
                        <option value="tool">Tool</option>
                    </select>
                </label>
                <label>
                    Supplier:
                    <select
                        name="supplierId"
                        value={factoryData.supplierId}
                        onChange={handleInputChange}
                    >
                        {suppliers.map((supplier) => (
                            <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
                        ))}
                    </select>
                </label>
                <label>
                    Cost:
                    <input
                        type="number"
                        name="cost"
                        value={factoryData.cost}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <label>
                    Useful Life (years):
                    <input
                        type="number"
                        name="usefulLife"
                        value={factoryData.usefulLife}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <label>
                    Responsible Staff:
                    <input
                        type="text"
                        name="responsibleStaff"
                        value={factoryData.responsibleStaff}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <button type="submit">Submit Factory Inventory</button>
            </form>
            {message && <p className="message">{message}</p>}
        </div>
    );
};

export default FactoryInventory;
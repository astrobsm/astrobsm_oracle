import React, { useState, useEffect } from 'react';
import './DeviceMaintenanceLog.css';
import API_BASE_URL from '../config';

const DeviceMaintenanceLog = () => {
    const [devices, setDevices] = useState([]);
    const [formData, setFormData] = useState({
        deviceId: '',
        date: '',
        technicianName: '',
        findings: '',
        nextMaintenanceDate: '',
    });

    useEffect(() => {
        const fetchDevices = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/devices`);
                const data = await response.json();
                setDevices(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error fetching devices:', error);
            }
        };

        fetchDevices();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_BASE_URL}/maintenance-logs`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            alert(data.message || 'Maintenance log recorded successfully!');
        } catch (error) {
            alert('An error occurred. Please try again.');
        }
    };

    return (
        <div className="maintenance-log-container">
            <h1>Device Maintenance Log</h1>
            <form onSubmit={handleSubmit} className="maintenance-log-form">
                <label>
                    Select Device:
                    <select
                        name="deviceId"
                        value={formData.deviceId}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">-- Select a Device --</option>
                        {devices.map((device) => (
                            <option key={device.id} value={device.id}>{device.deviceName}</option>
                        ))}
                    </select>
                </label>
                <label>
                    Date:
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <label>
                    Technician Name:
                    <input
                        type="text"
                        name="technicianName"
                        value={formData.technicianName}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <label>
                    Findings:
                    <textarea
                        name="findings"
                        value={formData.findings}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <label>
                    Next Maintenance Date:
                    <input
                        type="date"
                        name="nextMaintenanceDate"
                        value={formData.nextMaintenanceDate}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <button type="submit" className="submit-button">Submit</button>
            </form>
        </div>
    );
};

export default DeviceMaintenanceLog;
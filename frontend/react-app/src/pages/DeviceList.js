import React, { useEffect, useState } from 'react';
import './DeviceList.css';
import API_BASE_URL from '../config';

const DeviceList = () => {
    const [devices, setDevices] = useState([]);

    useEffect(() => {
        const fetchDevices = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/products`);
                const data = await response.json();
                setDevices(data);
            } catch (error) {
                console.error('Error fetching devices:', error);
            }
        };

        fetchDevices();
    }, []);

    return (
        <div className="device-list-container">
            <h1>Device List</h1>
            <button className="awesome-button">View All Devices</button>
            <ul>
                {devices.map(device => (
                    <li key={device.id}>{device.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default DeviceList;
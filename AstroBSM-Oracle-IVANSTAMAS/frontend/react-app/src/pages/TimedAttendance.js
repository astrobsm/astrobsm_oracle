import React, { useState, useEffect } from 'react';
import QrScanner from 'react-qr-scanner';
import './TimedAttendance.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "";

const TimedAttendance = () => {
    const [action, setAction] = useState('time-in');
    const [message, setMessage] = useState('');
    const [selectedStaff, setSelectedStaff] = useState('');
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [qrCodeData, setQrCodeData] = useState('');
    const [staffList, setStaffList] = useState([]);

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/v1/staff/`)
            .then((res) => res.json())
            .then((data) => setStaffList(Array.isArray(data) ? data : []))
            .catch((err) => console.error('Failed to fetch staff:', err));
    }, []);

    const handleScanQRCode = () => {
        setIsCameraActive(true);
    };

    const handleQRCodeScan = (data) => {
        if (data) {
            setQrCodeData(data);
            setIsCameraActive(false);
            // Simulate matching QR code with database
            if (data === 'expected_qr_code') {
                setMessage(`QR code matched successfully for ${action}.`);
            } else {
                setMessage('QR code does not match any records.');
            }
        }
    };

    const handleQRCodeError = (err) => {
        console.error(err);
        setMessage('Error scanning QR code.');
    };

    const handleFacialScan = () => {
        // Simulate facial recognition functionality
        setMessage(`Facial scan completed successfully for ${action}.`);
    };

    const handleStaffChange = (e) => {
        setSelectedStaff(e.target.value);
    };

    return (
        <div className="timed-attendance-container">
            <h1>Timed Attendance</h1>
            <label>
                Select Staff:
                <select value={selectedStaff} onChange={handleStaffChange}>
                    <option value="">-- Select Staff --</option>
                    {staffList.length === 0 && <option disabled>No staff found</option>}
                    {staffList.map((staff) => (
                        <option key={staff.id} value={staff.id}>
                            {staff.name} ({staff.staff_id})
                        </option>
                    ))}
                </select>
            </label>
            <label>
                Select Action:
                <select value={action} onChange={(e) => setAction(e.target.value)}>
                    <option value="time-in">Time-In</option>
                    <option value="time-out">Time-Out</option>
                </select>
            </label>
            <div className="attendance-buttons">
                <button onClick={handleScanQRCode}>Scan QR Code</button>
                <button onClick={handleFacialScan}>Facial Scan</button>
            </div>
            {isCameraActive && (
                <QrScanner
                    delay={300}
                    onError={handleQRCodeError}
                    onScan={handleQRCodeScan}
                    style={{ width: '100%' }}
                />
            )}
            {message && <p className="message">{message}</p>}
        </div>
    );
};

export default TimedAttendance;
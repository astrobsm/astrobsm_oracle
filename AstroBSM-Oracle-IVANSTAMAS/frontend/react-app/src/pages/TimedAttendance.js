import React, { useState } from 'react';
import WebAuthnButton from '../components/WebAuthnButton';
import './TimedAttendance.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "";

const TimedAttendance = () => {
    const [action, setAction] = useState('time-in');
    const [message, setMessage] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    // Replace with your actual user ID from session/auth
    const userId = 1;

    // Desktop fingerprint scan function (DigitalPersona)
    const handleFingerprintScan = async () => {
        setIsScanning(true);
        setMessage('Place your finger on the scanner...');
        try {
            const res = await fetch('http://localhost:5001/scan');
            if (!res.ok) throw new Error('Scan failed');
            const fingerprintTemplate = await res.text();
            const apiRes = await fetch(`${API_BASE_URL}/attendance`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fingerprint_template: fingerprintTemplate, // Use consistent key
                    action: action === 'time-in' ? 'IN' : 'OUT'
                })
            });
            const data = await apiRes.json();
            if (apiRes.ok) {
                setMessage(`Attendance ${action === 'time-in' ? 'Time-In' : 'Time-Out'} recorded successfully.`);
            } else {
                setMessage(data.detail || 'Error recording attendance.');
            }
        } catch (err) {
            setMessage('Fingerprint scan failed or service not running.');
        }
        setIsScanning(false);
    };

    // Mobile biometric (WebAuthn) handler
    const handleAttendanceSuccess = async (userId, action) => {
        setMessage('Submitting attendance...');
        const res = await fetch(`${API_BASE_URL}/attendance`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: userId,
                action: action
            })
        });
        const data = await res.json();
        if (res.ok) {
            setMessage('Attendance recorded!');
        } else {
            setMessage(data.detail || 'Error recording attendance.');
        }
    };

    return (
        <div className="timed-attendance-container">
            <h1>Timed Attendance</h1>
            <label>
                Select Action:
                <select value={action} onChange={e => setAction(e.target.value)} required>
                    <option value="time-in">Time-In</option>
                    <option value="time-out">Time-Out</option>
                </select>
            </label>
            <button className="submit-btn" onClick={handleFingerprintScan} disabled={isScanning}>
                {isScanning ? 'Scanning...' : 'Scan Fingerprint (Desktop)'}
            </button>
            <div style={{ margin: '16px 0' }}>
                <WebAuthnButton userId={userId} action={action === 'time-in' ? 'IN' : 'OUT'} onSuccess={handleAttendanceSuccess} />
            </div>
            {message && <p className="message">{message}</p>}
        </div>
    );
};

export default TimedAttendance;
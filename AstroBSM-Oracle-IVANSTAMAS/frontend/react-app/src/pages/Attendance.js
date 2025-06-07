import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Attendance.css';

const Attendance = () => {
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    return (
        <div className="attendance-container">
            <h1>Attendance</h1>
            <form className="attendance-form">
                {/* Removed Employee ID, Date, and Status fields */}
            </form>
            {message && <p className="message">{message}</p>}
            <div className="attendance-buttons">
                <button onClick={() => navigate('/timed-attendance')}>Timed Attendance</button>
                <button onClick={() => navigate('/attendance-record')}>Attendance Record</button>
                <button onClick={() => navigate('/attendance-analysis')}>Attendance Analysis</button>
            </div>
        </div>
    );
};

export default Attendance;
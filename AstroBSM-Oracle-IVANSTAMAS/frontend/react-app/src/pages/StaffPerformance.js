import React, { useEffect, useState } from 'react';
import API_BASE_URL from '../config';
import './StaffPerformance.css';

const StaffPerformance = () => {
    const [staff, setStaff] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStaffPerformance = async () => {
            try {
                console.log('Fetching staff performance data...');
                const response = await fetch(`${API_BASE_URL}/staff-performance`);
                console.log('Response status:', response.status);
                if (!response.ok) {
                    throw new Error('Failed to fetch staff performance');
                }
                const data = await response.json();
                console.log('Fetched data:', data);
                setStaff(data);
            } catch (err) {
                console.error('Error fetching staff performance:', err);
                setError(err.message);
            }
        };

        fetchStaffPerformance();
    }, []);

    if (error) {
        return <div className="error">Error: {error}</div>;
    }

    return (
        <div className="staff-performance-container">
            <h1>Staff Performance</h1>
            <table className="staff-performance-table">
                <thead>
                    <tr>
                        <th>Staff Name</th>
                        <th>Attendance Records</th>
                        <th>Production Participation</th>
                    </tr>
                </thead>
                <tbody>
                    {staff.map((member) => (
                        <tr key={member.id}>
                            <td>{member.name}</td>
                            <td>{member.attendance_records}</td>
                            <td>{member.production_participation}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default StaffPerformance;
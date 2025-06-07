import React, { useState, useEffect } from 'react';
import './StaffList.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const StaffList = () => {
    const [staff, setStaff] = useState([]);

    useEffect(() => {
        const fetchStaff = async () => {
            try {
                // Always use the trailing slash to avoid CORS/redirect issues
                const response = await fetch(`${API_BASE_URL}/staff/`);
                const data = await response.json();
                setStaff(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error fetching staff:', error);
            }
        };

        fetchStaff();
    }, []);

    return (
        <div className="staff-list-container">
            <h1>Staff List</h1>
            <table className="staff-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Staff ID</th>
                        <th>Date of Birth</th>
                        <th>Gender</th>
                        <th>Phone</th>
                        <th>Address</th>
                        <th>Bank</th>
                        <th>Account Number</th>
                        <th>Hourly Rate</th>
                        <th>Role</th>
                        <th>Department</th>
                        <th>Appointment Type</th>
                    </tr>
                </thead>
                <tbody>
                    {staff.map((member, idx) => (
                        <tr key={member.id || member.staff_id || idx}>
                            <td>{member.name}</td>
                            <td>{member.staff_id}</td>
                            <td>{member.dob || member.date_of_birth}</td>
                            <td>{member.gender}</td>
                            <td>{member.phone}</td>
                            <td>{member.address}</td>
                            <td>{member.bank}</td>
                            <td>{member.account_number}</td>
                            <td>{member.hourly_rate}</td>
                            <td>{member.role}</td>
                            <td>{member.department}</td>
                            <td>{member.appointment_type}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default StaffList;
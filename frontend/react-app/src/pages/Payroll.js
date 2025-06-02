import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config';
import './Payroll.css';

const Payroll = () => {
    const [payrollData, setPayrollData] = useState({
        employeeId: '',
        salary: '',
        bonus: '',
        deductions: ''
    });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPayrollData({ ...payrollData, [name]: value });
    };

    const fetchPayroll = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/payroll`);
            const data = await response.json();
            setPayrollData(data);
        } catch (error) {
            console.error('Error fetching payroll data:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        try {
            const response = await fetch(`${API_BASE_URL}/payroll`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payrollData),
            });
            let data;
            try {
                data = await response.json();
            } catch (jsonErr) {
                data = {};
            }
            if (response.ok) {
                setMessage('Payroll recorded successfully!');
                setPayrollData({
                    employeeId: '',
                    salary: '',
                    bonus: '',
                    deductions: ''
                });
            } else {
                let errorMsg = 'Failed to record payroll.';
                if (data.detail) {
                    if (typeof data.detail === 'string') {
                        errorMsg = data.detail;
                    } else if (Array.isArray(data.detail)) {
                        errorMsg = data.detail.map(d => d.msg || JSON.stringify(d)).join('; ');
                    } else if (typeof data.detail === 'object') {
                        errorMsg = JSON.stringify(data.detail);
                    }
                }
                setMessage(errorMsg);
            }
        } catch (error) {
            setMessage('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="payroll-container">
            <h1>Payroll</h1>
            <div className="payroll-buttons">
                <button onClick={() => navigate('/salary-console')} className="payroll-button">Salary Console</button>
                <button onClick={() => navigate('/salary-report')} className="payroll-button">Salary Report</button>
            </div>
            <form onSubmit={handleSubmit} className="payroll-form">
                <label>
                    Employee ID:
                    <input
                        type="text"
                        name="employeeId"
                        value={payrollData.employeeId}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <label>
                    Salary:
                    <input
                        type="number"
                        name="salary"
                        value={payrollData.salary}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <label>
                    Bonus:
                    <input
                        type="number"
                        name="bonus"
                        value={payrollData.bonus}
                        onChange={handleInputChange}
                    />
                </label>
                <label>
                    Deductions:
                    <input
                        type="number"
                        name="deductions"
                        value={payrollData.deductions}
                        onChange={handleInputChange}
                    />
                </label>
                <button type="submit" disabled={loading}>{loading ? 'Submitting...' : 'Submit'}</button>
            </form>
            {message && <div className={message.includes('success') ? 'success' : 'error'} style={{marginTop:'1rem'}}>{message}</div>}
        </div>
    );
};

export default Payroll;
import React, { useEffect, useState } from 'react';
import API_BASE_URL from '../config';
import './SalaryReport.css';

const SalaryReport = () => {
    const [report, setReport] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSalaryReport = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/salary-report`);
                if (!response.ok) {
                    throw new Error('Failed to fetch salary report');
                }
                const data = await response.json();
                setReport(data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchSalaryReport();
    }, []);

    if (error) {
        return <div className="error">Error: {error}</div>;
    }

    if (!report) {
        return <div>Loading...</div>;
    }

    return (
        <div className="salary-report-container">
            <h1>Salary Report</h1>
            <table className="salary-report-table">
                <thead>
                    <tr>
                        <th>Total Salary</th>
                        <th>Total Bonus</th>
                        <th>Total Deductions</th>
                        <th>Total Net Salary</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{report.total_salary}</td>
                        <td>{report.total_bonus}</td>
                        <td>{report.total_deductions}</td>
                        <td>{report.total_net_salary}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default SalaryReport;
import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './SalaryConsole.css';
import API_BASE_URL from '../config';

const SalaryConsole = () => {
    const [staff, setStaff] = useState([]);
    const [formData, setFormData] = useState({
        staffId: '',
        duration: '',
        hourlyRate: '',
        hoursWorked: 0,
        totalSalary: 0,
    });

    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/staff`);
                const data = await response.json();
                setStaff(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error fetching staff:', error);
            }
        };

        fetchStaff();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const fetchHoursWorked = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/hours-worked/${formData.staffId}?duration=${formData.duration}`);
            const data = await response.json();
            setFormData({ ...formData, hoursWorked: data.hoursWorked });
        } catch (error) {
            console.error('Error fetching hours worked:', error);
        }
    };

    const calculateSalary = () => {
        const totalSalary = formData.hoursWorked * parseFloat(formData.hourlyRate);
        setFormData({ ...formData, totalSalary });
    };

    const generatePayslip = () => {
        const doc = new jsPDF();
        doc.text('Payslip', 20, 20);
        doc.autoTable({
            head: [['Field', 'Value']],
            body: [
                ['Staff Name', staff.find((s) => s.id === formData.staffId)?.name || ''],
                ['Duration', formData.duration],
                ['Hourly Rate (₦)', formData.hourlyRate],
                ['Hours Worked', formData.hoursWorked],
                ['Total Salary (₦)', formData.totalSalary],
            ],
        });
        doc.save('payslip.pdf');
    };

    return (
        <div className="salary-console-container">
            <h1>Salary Console</h1>
            <form className="salary-console-form">
                <label>
                    Select Staff:
                    <select
                        name="staffId"
                        value={formData.staffId}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">-- Select a Staff --</option>
                        {staff.map((member) => (
                            <option key={member.id} value={member.id}>{member.name}</option>
                        ))}
                    </select>
                </label>
                <label>
                    Duration:
                    <input
                        type="text"
                        name="duration"
                        value={formData.duration}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <label>
                    Hourly Rate (₦):
                    <input
                        type="number"
                        name="hourlyRate"
                        value={formData.hourlyRate}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <button type="button" onClick={fetchHoursWorked} className="fetch-button">Fetch Hours Worked</button>
                <p>Hours Worked: {formData.hoursWorked}</p>
                <button type="button" onClick={calculateSalary} className="calculate-button">Calculate Salary</button>
                <p>Total Salary: ₦{formData.totalSalary}</p>
                <button type="button" onClick={generatePayslip} className="generate-button">Generate Payslip</button>
            </form>
        </div>
    );
};

export default SalaryConsole;
import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './StaffAppraisal.css';

const StaffAppraisal = () => {
    const [staff, setStaff] = useState([]);
    const [selectedStaff, setSelectedStaff] = useState('');
    const [appraisalData, setAppraisalData] = useState({
        participation: 0,
        hoursWorked: 0,
        punctuality: 0,
        performanceScore: 0,
    });

    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/v1/staff');
                const data = await response.json();
                setStaff(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error fetching staff:', error);
            }
        };

        fetchStaff();
    }, []);

    const fetchAppraisalData = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/v1/appraisal/${selectedStaff}`);
            const data = await response.json();
            setAppraisalData(data);
        } catch (error) {
            console.error('Error fetching appraisal data:', error);
        }
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.text('Staff Appraisal', 20, 20);
        doc.autoTable({
            head: [['Metric', 'Value']],
            body: [
                ['Participation', appraisalData.participation],
                ['Hours Worked', appraisalData.hoursWorked],
                ['Punctuality', appraisalData.punctuality],
                ['Performance Score', appraisalData.performanceScore],
            ],
        });
        doc.save('staff_appraisal.pdf');
    };

    return (
        <div className="staff-appraisal-container">
            <h1>Staff Appraisal</h1>
            <form className="staff-appraisal-form">
                <label>
                    Select Staff:
                    <select
                        value={selectedStaff}
                        onChange={(e) => setSelectedStaff(e.target.value)}
                        required
                    >
                        <option value="">-- Select a Staff --</option>
                        {staff.map((member) => (
                            <option key={member.id} value={member.id}>{member.name}</option>
                        ))}
                    </select>
                </label>
                <button type="button" onClick={fetchAppraisalData} className="fetch-button">Fetch Appraisal Data</button>
                <div className="appraisal-details">
                    <p>Participation: {appraisalData.participation}</p>
                    <p>Hours Worked: {appraisalData.hoursWorked}</p>
                    <p>Punctuality: {appraisalData.punctuality}</p>
                    <p>Performance Score: {appraisalData.performanceScore}</p>
                </div>
                <button type="button" onClick={exportToPDF} className="export-button">Export to PDF</button>
            </form>
        </div>
    );
};

export default StaffAppraisal;
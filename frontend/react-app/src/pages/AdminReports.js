import React, { useEffect, useState } from 'react';
import AdminSection from '../components/AdminSection';
import './AdminReports.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/reports`);
        if (!response.ok) throw new Error('Failed to fetch reports');
        const data = await response.json();
        setReports(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  return (
    <AdminSection title="Reports">
      <div className="admin-reports-list">
        {loading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}
        {!loading && !error && reports.length === 0 && <p>No reports found.</p>}
        {!loading && !error && reports.length > 0 && (
          <table className="admin-reports-table">
            <thead>
              <tr>
                <th>Report Name</th>
                <th>Date</th>
                <th>Type</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r.id}>
                  <td>{r.name || r.report_name}</td>
                  <td>{r.date || '-'}</td>
                  <td>{r.type || '-'}</td>
                  <td>{r.status || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminSection>
  );
};

export default AdminReports;

import React, { useEffect, useState } from 'react';
import AdminSection from '../components/AdminSection';
import './AdminSettings.css';

const AdminSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/v1/settings');
        if (!response.ok) throw new Error('Failed to fetch settings');
        const data = await response.json();
        setSettings(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  return (
    <AdminSection title="Settings">
      <div className="admin-settings-container">
        {loading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}
        {!loading && !error && settings && (
          <div className="admin-settings-list">
            {Object.entries(settings).map(([key, value]) => (
              <div className="admin-settings-item" key={key}>
                <span className="admin-settings-key">{key}</span>
                <span className="admin-settings-value">{String(value)}</span>
              </div>
            ))}
          </div>
        )}
        {!loading && !error && !settings && <p>No settings found.</p>}
      </div>
    </AdminSection>
  );
};

export default AdminSettings;

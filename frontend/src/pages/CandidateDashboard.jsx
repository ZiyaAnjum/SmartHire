import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';

const CandidateDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Redirect if not logged in or not a candidate
    if (!user || user.role !== 'candidate') {
      navigate('/auth');
      return;
    }

    const fetchApplications = async () => {
      try {
        const res = await API.get('/applications/my-applications');
        setApplications(res.data.data);
      } catch (err) {
        setError('Failed to retrieve your job applications.');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div>
          <h2>Candidate Dashboard</h2>
          <p className="welcome-tag">Logged in as: <strong>{user?.name}</strong> ({user?.email})</p>
        </div>
        <div className="header-actions">
          <button onClick={() => navigate('/')} className="btn-secondary">Explore Jobs Feed</button>
          <button onClick={handleLogout} className="btn-danger">Logout</button>
        </div>
      </header>

      {error && <div className="error-banner">{error}</div>}

      <div className="dashboard-list-full">
        <h3>Your Submitted Job Applications ({applications.length})</h3>

        {loading ? (
          <div className="loading-spinner">Retrieving application history...</div>
        ) : applications.length === 0 ? (
          <div className="empty-state">
            <p>You haven't submitted any job applications yet.</p>
            <button onClick={() => navigate('/')} className="btn-primary" style={{ marginTop: '15px' }}>
              Explore Available Jobs
            </button>
          </div>
        ) : (
          <div className="applicants-table-wrapper">
            <table className="applicants-table">
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Company</th>
                  <th>Location</th>
                  <th>Salary Range</th>
                  <th>Applied On</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app._id}>
                    <td>
                      <strong>{app.job_id?.title || 'Job Listing Deleted'}</strong>
                    </td>
                    <td>{app.job_id?.company || 'N/A'}</td>
                    <td>{app.job_id?.location || 'N/A'}</td>
                    <td>{app.job_id?.salary || 'N/A'}</td>
                    <td>{new Date(app.applied_at || app.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span className={`status-badge ${app.status.toLowerCase()}`}>
                        {app.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateDashboard;

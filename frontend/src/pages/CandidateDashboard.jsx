import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';

const CandidateDashboard = () => {
  const { user, loginUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('applications');
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Pagination for my-applications
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');

  // Candidate Profile State
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    headline: user?.headline || '',
    bio: user?.bio || '',
    skillsString: user?.skills ? user.skills.join(', ') : '',
  });
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError('');
      const params = { page, limit: 5 };
      if (statusFilter) params.status = statusFilter;

      const res = await API.get('/applications/my-applications', { params });
      setApplications(res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
      setTotalCount(res.data.totalCount || (res.data.data ? res.data.data.length : 0));
    } catch (err) {
      setError('Failed to retrieve your job applications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user || user.role !== 'candidate') {
      navigate('/auth');
      return;
    }
    fetchApplications();
  }, [user, navigate, page, statusFilter]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');

    const skills = profileData.skillsString
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    try {
      const res = await API.patch('/auth/me', {
        name: profileData.name,
        headline: profileData.headline,
        bio: profileData.bio,
        skills,
      });

      setProfileSuccess('Profile updated successfully!');
      if (loginUser && res.data.data) {
        loginUser(res.data.data, localStorage.getItem('token'));
      }
    } catch (err) {
      setProfileError(err.response?.data?.message || 'Failed to update profile.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div>
          <h2>Candidate Career Portal</h2>
          <p className="welcome-tag">
            Candidate: <strong>{user?.name}</strong> • {user?.email}
          </p>
        </div>
        <div className="header-actions">
          <button onClick={() => navigate('/')} className="btn-secondary">
            Explore Open Roles
          </button>
          <button onClick={handleLogout} className="btn-danger">
            Logout
          </button>
        </div>
      </header>

      {error && <div className="error-banner">{error}</div>}

      {/* Tabs */}
      <div className="dashboard-tabs">
        <button
          className={`tab-button ${activeTab === 'applications' ? 'active' : ''}`}
          onClick={() => setActiveTab('applications')}
        >
          My Applications ({totalCount})
        </button>
        <button
          className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Candidate Profile & Skills
        </button>
      </div>

      {activeTab === 'applications' ? (
        <div className="dashboard-list-full">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <h3 style={{ margin: 0 }}>Application Status History</h3>
            <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="search-input"
                style={{ padding: '0.3rem 0.6rem', fontSize: '0.85rem' }}
              >
                <option value="">All Statuses</option>
                <option value="Applied">Applied</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="loading-spinner">Retrieving application history...</div>
          ) : applications.length === 0 ? (
            <div
              style={{
                background: 'rgba(30, 41, 59, 0.7)',
                border: '1px dashed rgba(148, 163, 184, 0.3)',
                borderRadius: '10px',
                padding: '2.5rem 1.5rem',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📄</div>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#f1f5f9' }}>No Applications Yet</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '440px', margin: '0 auto 1.25rem auto' }}>
                No applications yet — explore open roles to get started with your job search.
              </p>
              <button onClick={() => navigate('/')} className="btn-primary">
                Explore Open Roles
              </button>
            </div>
          ) : (
            <>
              <div className="applicants-table-wrapper">
                <table className="applicants-table">
                  <thead>
                    <tr>
                      <th>Job Title</th>
                      <th>Company</th>
                      <th>Location</th>
                      <th>Salary Range</th>
                      <th>Applied On</th>
                      <th>Application Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((app) => (
                      <tr key={app._id}>
                        <td>
                          <strong>{app.job_id?.title || 'Job Listing Deleted'}</strong>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {app.job_id?.jobType}
                          </div>
                        </td>
                        <td>{app.job_id?.company || 'N/A'}</td>
                        <td>{app.job_id?.location || 'N/A'}</td>
                        <td>{app.job_id?.salary || 'N/A'}</td>
                        <td>{new Date(app.applied_at || app.createdAt).toLocaleDateString()}</td>
                        <td>
                          <span className={`status-badge ${app.status.toLowerCase()}`}>
                            {app.status === 'Shortlisted' ? '🌟 ' : app.status === 'Rejected' ? '✕ ' : '⏳ '}
                            {app.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', marginTop: '1.5rem' }}>
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="btn-secondary"
                    style={{ opacity: page <= 1 ? 0.5 : 1, cursor: page <= 1 ? 'not-allowed' : 'pointer' }}
                  >
                    ← Previous
                  </button>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    Page {page} of {totalPages}
                  </span>
                  <button
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className="btn-secondary"
                    style={{ opacity: page >= totalPages ? 0.5 : 1, cursor: page >= totalPages ? 'not-allowed' : 'pointer' }}
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        /* Candidate Profile Tab */
        <div className="dashboard-list-full" style={{ maxWidth: '650px', margin: '0 auto' }}>
          <h3>Candidate Profile & Skills (PATCH /me)</h3>
          {profileSuccess && <div className="success-banner">{profileSuccess}</div>}
          {profileError && <div className="error-banner">{profileError}</div>}

          <form onSubmit={handleProfileSubmit} className="dashboard-form-card" style={{ marginTop: '1rem' }}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Professional Headline</label>
              <input
                type="text"
                value={profileData.headline}
                onChange={(e) => setProfileData({ ...profileData, headline: e.target.value })}
                placeholder="e.g. Senior Full Stack Engineer (React, Node, TS)"
              />
            </div>

            <div className="form-group">
              <label>Professional Bio / Summary</label>
              <textarea
                rows="4"
                value={profileData.bio}
                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                placeholder="Tell hiring managers about your background, key projects, and expertise..."
              ></textarea>
            </div>

            <div className="form-group">
              <label>Core Skills (Comma-separated)</label>
              <input
                type="text"
                value={profileData.skillsString}
                onChange={(e) => setProfileData({ ...profileData, skillsString: e.target.value })}
                placeholder="React, TypeScript, Node.js, PostgreSQL, Docker, AWS"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                Save Profile Changes (PATCH /me)
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default CandidateDashboard;

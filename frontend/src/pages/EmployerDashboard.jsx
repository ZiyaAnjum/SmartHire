import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';

const EmployerDashboard = () => {
  const { user, updateUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Tab state: 'jobs', 'applicants', or 'profile'
  const [activeTab, setActiveTab] = useState('jobs');
  const [jobs, setJobs] = useState([]);
  const [jobCounts, setJobCounts] = useState({});
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form state for creating/editing jobs
  const [editingJobId, setEditingJobId] = useState(null);
  const [jobFormData, setJobFormData] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
    description: '',
    requirementsString: '',
    jobType: 'Full-time',
  });
  const [formSuccess, setFormSuccess] = useState('');
  const [formError, setFormError] = useState('');

  // Profile edit state
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    headline: user?.headline || '',
    bio: user?.bio || '',
  });
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      const currentUserId = (user?.id || user?._id)?.toString();
      
      // Fetch all jobs
      const jobsRes = await API.get('/jobs', { params: { limit: 100 } });
      const employerJobs = (jobsRes.data?.data || []).filter(
        (j) => String(j.employer_id?._id || j.employer_id?.id || j.employer_id) === currentUserId
      );
      setJobs(employerJobs);

      // Fetch counts per job using GET /jobs/:id/applications-count
      const countsMap = {};
      await Promise.all(
        employerJobs.map(async (job) => {
          try {
            const countRes = await API.get(`/jobs/${job._id}/applications-count`);
            countsMap[job._id] = countRes.data.data.totalApplications;
          } catch {
            countsMap[job._id] = 0;
          }
        })
      );
      setJobCounts(countsMap);

      // Fetch applications submitted to jobs posted by this employer
      const appsRes = await API.get('/applications/job-applications');
      setApplicants(appsRes.data.data || []);
    } catch (err) {
      setError('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user || user.role !== 'employer') {
      navigate('/auth');
      return;
    }
    loadDashboardData();
  }, [user, navigate]);

  const handleFormChange = (e) => {
    setJobFormData({ ...jobFormData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    const requirements = jobFormData.requirementsString
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    const submitData = {
      title: jobFormData.title,
      company: jobFormData.company,
      location: jobFormData.location,
      salary: jobFormData.salary,
      description: jobFormData.description,
      requirements,
      jobType: jobFormData.jobType,
    };

    try {
      if (editingJobId) {
        const res = await API.put(`/jobs/${editingJobId}`, submitData);
        setJobs(jobs.map((j) => (j._id === editingJobId ? res.data.data : j)));
        setFormSuccess('Job posting updated successfully!');
      } else {
        const res = await API.post('/jobs', submitData);
        setJobs([res.data.data, ...jobs]);
        setFormSuccess('Job posting created successfully!');
      }

      setEditingJobId(null);
      setJobFormData({
        title: '',
        company: '',
        location: '',
        salary: '',
        description: '',
        requirementsString: '',
        jobType: 'Full-time',
      });
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save job posting.');
    }
  };

  const handleEditClick = (job) => {
    setEditingJobId(job._id);
    setJobFormData({
      title: job.title,
      company: job.company,
      location: job.location,
      salary: job.salary || '',
      description: job.description,
      requirementsString: job.requirements ? job.requirements.join(', ') : '',
      jobType: job.jobType,
    });
    setActiveTab('jobs');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteClick = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job posting? This will also remove associated applications.')) {
      return;
    }
    try {
      await API.delete(`/jobs/${jobId}`);
      setJobs(jobs.filter((j) => j._id !== jobId));
      setApplicants(applicants.filter((a) => (a.job_id?._id || a.job_id) !== jobId));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete job posting.');
    }
  };

  const handleStatusUpdate = async (appId, newStatus) => {
    try {
      const res = await API.patch(`/applications/job-applications/${appId}/status`, {
        status: newStatus,
      });
      setApplicants(
        applicants.map((a) => (a._id === appId ? { ...a, status: newStatus } : a))
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update application status.');
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');
    try {
      const res = await API.patch('/auth/me', profileData);
      setProfileSuccess('Profile updated successfully!');
      if (res.data?.data && updateUser) {
        updateUser(res.data.data);
      }
    } catch (err) {
      setProfileError(err.response?.data?.message || 'Failed to update profile.');
    }
  };

  const cancelEdit = () => {
    setEditingJobId(null);
    setJobFormData({
      title: '',
      company: '',
      location: '',
      salary: '',
      description: '',
      requirementsString: '',
      jobType: 'Full-time',
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div>
          <h2>Employer Management Portal</h2>
          <p className="welcome-tag">
            Company: <strong>{user?.name}</strong> • {user?.email}
          </p>
        </div>
        <div className="header-actions">
          <button onClick={() => navigate('/')} className="btn-secondary">
            Public Jobs Feed
          </button>
          <button onClick={handleLogout} className="btn-danger">
            Logout
          </button>
        </div>
      </header>

      {error && <div className="error-banner">{error}</div>}

      {/* Tab Switcher */}
      <div className="dashboard-tabs">
        <button
          className={`tab-button ${activeTab === 'jobs' ? 'active' : ''}`}
          onClick={() => setActiveTab('jobs')}
        >
          Job Postings ({jobs.length})
        </button>
        <button
          className={`tab-button ${activeTab === 'applicants' ? 'active' : ''}`}
          onClick={() => setActiveTab('applicants')}
        >
          Applicants Inbox ({applicants.length})
        </button>
        <button
          className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Company Profile
        </button>
      </div>

      {loading ? (
        <div className="loading-spinner">Loading dashboard data...</div>
      ) : activeTab === 'jobs' ? (
        <div className="dashboard-grid">
          {/* Job Post Form */}
          <div className="dashboard-form-card">
            <h3>{editingJobId ? 'Edit Job Posting' : 'Create New Job Listing'}</h3>
            {formSuccess && <div className="success-banner">{formSuccess}</div>}
            {formError && <div className="error-banner">{formError}</div>}

            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label>Job Title</label>
                <input
                  type="text"
                  name="title"
                  value={jobFormData.title}
                  onChange={handleFormChange}
                  placeholder="e.g. Senior Frontend Engineer"
                  required
                />
              </div>

              <div className="form-group">
                <label>Company Name</label>
                <input
                  type="text"
                  name="company"
                  value={jobFormData.company}
                  onChange={handleFormChange}
                  placeholder="e.g. Stripe, Linear, Airbnb"
                  required
                />
              </div>

              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  value={jobFormData.location}
                  onChange={handleFormChange}
                  placeholder="e.g. Remote, San Francisco, New York"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Salary Range (Optional)</label>
                  <input
                    type="text"
                    name="salary"
                    value={jobFormData.salary}
                    onChange={handleFormChange}
                    placeholder="e.g. $140,000 - $180,000"
                  />
                </div>

                <div className="form-group">
                  <label>Job Type</label>
                  <select
                    name="jobType"
                    value={jobFormData.jobType}
                    onChange={handleFormChange}
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={jobFormData.description}
                  onChange={handleFormChange}
                  placeholder="Describe key responsibilities and expectations..."
                  rows="4"
                  required
                ></textarea>
              </div>

              <div className="form-group">
                <label>Requirements (Comma-separated)</label>
                <input
                  type="text"
                  name="requirementsString"
                  value={jobFormData.requirementsString}
                  onChange={handleFormChange}
                  placeholder="React, TypeScript, Node.js, REST APIs"
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  {editingJobId ? 'Save Changes' : 'Publish Job Posting'}
                </button>
                {editingJobId && (
                  <button type="button" onClick={cancelEdit} className="btn-secondary">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Job Postings list */}
          <div className="dashboard-list-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0 }}>Your Active Listings ({jobs.length})</h3>
            </div>
            {jobs.length === 0 ? (
              <div
                style={{
                  background: 'rgba(30, 41, 59, 0.7)',
                  border: '1px dashed rgba(148, 163, 184, 0.3)',
                  borderRadius: '10px',
                  padding: '2.5rem 1.5rem',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💼</div>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#f1f5f9' }}>No Active Job Listings Yet</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '380px', margin: '0 auto' }}>
                  Use the creation form on the left to publish your first open role.
                </p>
              </div>
            ) : (
              <div className="dashboard-job-list">
                {jobs.map((job) => (
                  <div key={job._id} className="dashboard-job-item">
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <h4 style={{ margin: 0 }}>{job.title}</h4>
                        <span className="badge-jobtype" style={{ fontSize: '0.7rem' }}>{job.jobType}</span>
                      </div>
                      <p style={{ margin: '0.25rem 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        {job.company} • {job.location} • {job.salary}
                      </p>
                      <div style={{ marginTop: '0.35rem' }}>
                        <span style={{ fontSize: '0.8rem', background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                          👥 {jobCounts[job._id] ?? 0} Applicants
                        </span>
                      </div>
                    </div>
                    <div className="item-actions">
                      <button onClick={() => handleEditClick(job)} className="btn-edit">Edit</button>
                      <button onClick={() => handleDeleteClick(job._id)} className="btn-delete">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : activeTab === 'applicants' ? (
        /* Applicants Section with real-time status updates */
        <div className="dashboard-list-full">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <h3 style={{ margin: 0 }}>Candidate Applications ({applicants.length})</h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Use dropdown to update status
            </span>
          </div>

          {applicants.length === 0 ? (
            <div
              style={{
                background: 'rgba(30, 41, 59, 0.7)',
                border: '1px dashed rgba(148, 163, 184, 0.3)',
                borderRadius: '10px',
                padding: '2.5rem 1.5rem',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👥</div>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#f1f5f9' }}>No Candidates Have Applied Yet</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '400px', margin: '0 auto' }}>
                When candidates submit applications to your open roles, they will appear here with contact details and skills.
              </p>
            </div>
          ) : (
            <div className="applicants-table-wrapper">
              <table className="applicants-table">
                <thead>
                  <tr>
                    <th>Job Title</th>
                    <th>Candidate</th>
                    <th>Email & Bio</th>
                    <th>Applied At</th>
                    <th>Status Action</th>
                  </tr>
                </thead>
                <tbody>
                  {applicants.map((app) => (
                    <tr key={app._id}>
                      <td>
                        <strong>{app.job_id?.title || 'Unknown Job'}</strong>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{app.job_id?.company}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{app.candidate_id?.name || 'Applicant'}</div>
                        <div style={{ fontSize: '0.8rem', color: '#93c5fd' }}>{app.candidate_id?.headline}</div>
                      </td>
                      <td>
                        <div>{app.candidate_id?.email || 'N/A'}</div>
                        {app.candidate_id?.skills && app.candidate_id.skills.length > 0 && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                            Skills: {app.candidate_id.skills.slice(0, 3).join(', ')}
                          </div>
                        )}
                      </td>
                      <td>{new Date(app.applied_at || app.createdAt).toLocaleDateString()}</td>
                      <td>
                        <select
                          value={app.status}
                          onChange={(e) => handleStatusUpdate(app._id, e.target.value)}
                          style={{
                            padding: '0.35rem 0.6rem',
                            borderRadius: '6px',
                            background: app.status === 'Shortlisted' ? 'rgba(16, 185, 129, 0.2)' : app.status === 'Rejected' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                            color: app.status === 'Shortlisted' ? '#34d399' : app.status === 'Rejected' ? '#f87171' : '#60a5fa',
                            border: '1px solid currentColor',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          <option value="Applied" style={{ background: '#1e293b', color: '#fff' }}>Applied</option>
                          <option value="Shortlisted" style={{ background: '#1e293b', color: '#34d399' }}>Shortlisted</option>
                          <option value="Rejected" style={{ background: '#1e293b', color: '#f87171' }}>Rejected</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        /* Company Profile Tab (PATCH /me) */
        <div className="dashboard-list-full" style={{ maxWidth: '650px', margin: '0 auto' }}>
          <h3>Employer Profile Information</h3>
          {profileSuccess && <div className="success-banner">{profileSuccess}</div>}
          {profileError && <div className="error-banner">{profileError}</div>}

          <form onSubmit={handleProfileSubmit} className="dashboard-form-card" style={{ marginTop: '1rem' }}>
            <div className="form-group">
              <label>Contact / Representative Name</label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Headline / Role</label>
              <input
                type="text"
                value={profileData.headline}
                onChange={(e) => setProfileData({ ...profileData, headline: e.target.value })}
                placeholder="e.g. VP of Engineering @ Stripe"
              />
            </div>

            <div className="form-group">
              <label>Company Mission / Bio</label>
              <textarea
                rows="4"
                value={profileData.bio}
                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                placeholder="Describe your organization's mission and team culture..."
              ></textarea>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                Save Profile Updates (PATCH /me)
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default EmployerDashboard;

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';

const EmployerDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Tab state: 'jobs' or 'applicants'
  const [activeTab, setActiveTab] = useState('jobs');
  const [jobs, setJobs] = useState([]);
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

  useEffect(() => {
    // Redirect if not an employer
    if (!user || user.role !== 'employer') {
      navigate('/auth');
      return;
    }

    const loadDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch jobs (filter by logged-in employer ID)
        const jobsRes = await API.get('/jobs');
        const employerJobs = jobsRes.data.data.filter(
          (j) => j.employer_id === user.id || j.employer_id?._id === user.id
        );
        setJobs(employerJobs);

        // Fetch applications submitted to jobs posted by this employer
        const appsRes = await API.get('/applications/job-applications');
        setApplicants(appsRes.data.data);
      } catch (err) {
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user, navigate]);

  const handleFormChange = (e) => {
    setJobFormData({ ...jobFormData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    // Parse requirements string into array of strings
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
        // Edit existing job
        const res = await API.put(`/jobs/${editingJobId}`, submitData);
        setJobs(jobs.map((j) => (j._id === editingJobId ? res.data.data : j)));
        setFormSuccess('Job posting updated successfully!');
      } else {
        // Create new job
        const res = await API.post('/jobs', submitData);
        setJobs([res.data.data, ...jobs]);
        setFormSuccess('Job posting created successfully!');
      }

      // Reset form
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
      setFormError(err.response?.data?.message || 'Failed to submit job posting details.');
    }
  };

  const handleEditClick = (job) => {
    setEditingJobId(job._id);
    setJobFormData({
      title: job.title,
      company: job.company,
      location: job.location,
      salary: job.salary,
      description: job.description,
      requirementsString: job.requirements ? job.requirements.join(', ') : '',
      jobType: job.jobType,
    });
    setFormSuccess('');
    setFormError('');
  };

  const handleDeleteClick = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job posting?')) return;
    try {
      await API.delete(`/jobs/${jobId}`);
      setJobs(jobs.filter((j) => j._id !== jobId));
    } catch (err) {
      alert('Failed to delete job posting.');
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
          <h2>Employer Dashboard</h2>
          <p className="welcome-tag">Logged in as: <strong>{user?.name}</strong> ({user?.email})</p>
        </div>
        <div className="header-actions">
          <button onClick={() => navigate('/')} className="btn-secondary">View Jobs Feed</button>
          <button onClick={handleLogout} className="btn-danger">Logout</button>
        </div>
      </header>

      {/* Tabs */}
      <div className="tabs-container">
        <button
          onClick={() => setActiveTab('jobs')}
          className={`tab-btn ${activeTab === 'jobs' ? 'active' : ''}`}
        >
          Manage Jobs
        </button>
        <button
          onClick={() => setActiveTab('applicants')}
          className={`tab-btn ${activeTab === 'applicants' ? 'active' : ''}`}
        >
          Applicants ({applicants.length})
        </button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {loading ? (
        <div className="loading-spinner">Retrieving dashboard information...</div>
      ) : activeTab === 'jobs' ? (
        <div className="dashboard-content-split">
          {/* Job Postings Form */}
          <div className="dashboard-form-card">
            <h3>{editingJobId ? 'Edit Job Posting' : 'Post a New Job'}</h3>
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
                  placeholder="e.g. Frontend Engineer"
                  required
                />
              </div>

              <div className="form-group-row">
                <div className="form-group">
                  <label>Company</label>
                  <input
                    type="text"
                    name="company"
                    value={jobFormData.company}
                    onChange={handleFormChange}
                    placeholder="e.g. Tech Corp"
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
                    placeholder="e.g. Remote / New York"
                    required
                  />
                </div>
              </div>

              <div className="form-group-row">
                <div className="form-group">
                  <label>Salary Package</label>
                  <input
                    type="text"
                    name="salary"
                    value={jobFormData.salary}
                    onChange={handleFormChange}
                    placeholder="e.g. $80k - $100k"
                    required
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
                  placeholder="Describe roles & responsibilities..."
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
                  placeholder="React, CSS, Git, REST APIs"
                  required
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  {editingJobId ? 'Save Changes' : 'Publish Posting'}
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
            <h3>Your Posted Jobs ({jobs.length})</h3>
            {jobs.length === 0 ? (
              <p className="empty-hint">You haven't posted any jobs yet.</p>
            ) : (
              <div className="dashboard-job-list">
                {jobs.map((job) => (
                  <div key={job._id} className="dashboard-job-item">
                    <div>
                      <h4>{job.title}</h4>
                      <p>{job.company} • {job.location}</p>
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
      ) : (
        /* Applicants Section */
        <div className="dashboard-list-full">
          <h3>Candidates Applying to Your Postings ({applicants.length})</h3>
          {applicants.length === 0 ? (
            <div className="empty-state">No candidates have applied to your job postings yet.</div>
          ) : (
            <div className="applicants-table-wrapper">
              <table className="applicants-table">
                <thead>
                  <tr>
                    <th>Job Title</th>
                    <th>Candidate Name</th>
                    <th>Candidate Email</th>
                    <th>Applied At</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {applicants.map((app) => (
                    <tr key={app._id}>
                      <td><strong>{app.job_id?.title || 'Unknown Job'}</strong></td>
                      <td>{app.candidate_id?.name || 'Deleted User'}</td>
                      <td>{app.candidate_id?.email || 'N/A'}</td>
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
      )}
    </div>
  );
};

export default EmployerDashboard;

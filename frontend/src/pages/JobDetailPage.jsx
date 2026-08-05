import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';

const JobDetailPage = () => {
  const { id } = useParams();
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applyStatus, setApplyStatus] = useState({ loading: false, success: false, msg: '' });

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const res = await API.get(`/jobs/${id}`);
        setJob(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load job details.');
      } finally {
        setLoading(false);
      }
    };
    fetchJobDetails();
  }, [id]);

  const handleApply = async () => {
    if (!token) {
      navigate('/auth');
      return;
    }

    setApplyStatus({ loading: true, success: false, msg: '' });

    try {
      const res = await API.post(`/applications/apply/${id}`);
      setApplyStatus({
        loading: false,
        success: true,
        msg: res.data.message || 'Successfully applied!',
      });
    } catch (err) {
      setApplyStatus({
        loading: false,
        success: false,
        msg: err.response?.data?.message || 'Failed to submit application.',
      });
    }
  };

  if (loading) return <div className="loading-spinner">Loading job specifications...</div>;
  if (error) return <div className="error-banner">{error}</div>;
  if (!job) return <div className="empty-state">Job posting not found.</div>;

  return (
    <div className="detail-container">
      <div className="back-navigation">
        <Link to="/" className="btn-link">← Back to Job Listings</Link>
      </div>

      <div className="job-detail-card">
        <div className="job-detail-header">
          <div>
            <span className="badge-jobtype">{job.jobType}</span>
            <h2>{job.title}</h2>
            <p className="job-detail-company">{job.company}</p>
          </div>
          <div className="job-detail-meta">
            <span className="detail-meta-item">📍 {job.location}</span>
            <span className="detail-meta-item">💰 {job.salary}</span>
          </div>
        </div>

        <hr className="divider" />

        <div className="job-detail-body">
          <h3>Job Description</h3>
          <p className="job-description-text">{job.description}</p>

          <h3>Requirements</h3>
          {job.requirements && job.requirements.length > 0 ? (
            <ul className="requirements-list">
              {job.requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          ) : (
            <p>No specific requirements outlined.</p>
          )}
        </div>

        <hr className="divider" />

        <div className="job-detail-footer">
          {user?.role === 'employer' ? (
            <div className="employer-warning-banner">
              Employers cannot apply for jobs.
            </div>
          ) : (
            <button
              onClick={handleApply}
              disabled={applyStatus.loading || applyStatus.success}
              className={`btn-primary btn-apply ${applyStatus.success ? 'success' : ''}`}
            >
              {applyStatus.loading
                ? 'Applying...'
                : applyStatus.success
                ? '✓ Applied Successfully'
                : 'Apply for this Job'}
            </button>
          )}

          {applyStatus.msg && (
            <div className={`apply-feedback-banner ${applyStatus.success ? 'success' : 'error'}`}>
              {applyStatus.msg}
            </div>
          )}

          {!token && (
            <p className="auth-hint">
              * Note: You will be redirected to log in or create an account to apply.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetailPage;

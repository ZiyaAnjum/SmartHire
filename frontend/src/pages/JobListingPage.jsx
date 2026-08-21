import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';

const JobListingPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search & Filter state (corresponds to backend ?search=, ?location=, ?jobType=, ?minSalary=, ?page=, ?limit=)
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');
  const [minSalary, setMinSalary] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {
        page,
        limit: 6,
      };
      if (search) params.search = search;
      if (location) params.location = location;
      if (jobType) params.jobType = jobType;
      if (minSalary) params.minSalary = minSalary;

      const res = await API.get('/jobs', { params });
      setJobs(res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
      setTotalCount(res.data.totalCount || (res.data.data ? res.data.data.length : 0));
    } catch (err) {
      setError('Failed to fetch job postings. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [page, jobType]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchJobs();
  };

  const handleResetFilters = () => {
    setSearch('');
    setLocation('');
    setJobType('');
    setMinSalary('');
    setPage(1);
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.75rem' }}>💼</span>
            <h1 style={{ margin: 0 }}>SmartHire Careers</h1>
          </div>
          <p style={{ marginTop: '0.25rem', color: 'var(--text-muted)' }}>
            Discover and apply to top roles at industry-leading companies
          </p>
        </div>
        <div className="header-actions">
          {user ? (
            <Link
              to={user.role === 'employer' ? '/employer-dashboard' : '/candidate-dashboard'}
              className="btn-secondary"
            >
              {user.role === 'employer' ? '👔 Employer Dashboard' : '📋 Candidate Portal'}
            </Link>
          ) : (
            <Link to="/auth" className="btn-secondary">Sign In / Register</Link>
          )}
        </div>
      </header>

      {/* Query Filter Section */}
      <form onSubmit={handleSearchSubmit} className="search-section" style={{ flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', width: '100%', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Search keywords (e.g. React, Engineer, Systems)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
            style={{ flex: '2 1 200px' }}
          />
          <input
            type="text"
            placeholder="Location (e.g. Remote, San Francisco)..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="search-input"
            style={{ flex: '1 1 150px' }}
          />
          <select
            value={jobType}
            onChange={(e) => {
              setJobType(e.target.value);
              setPage(1);
            }}
            className="search-input"
            style={{ flex: '1 1 130px', cursor: 'pointer' }}
          >
            <option value="">All Job Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
            <option value="Remote">Remote</option>
          </select>
          <select
            value={minSalary}
            onChange={(e) => {
              setMinSalary(e.target.value);
              setPage(1);
            }}
            className="search-input"
            style={{ flex: '1 1 130px', cursor: 'pointer' }}
          >
            <option value="">Min Salary</option>
            <option value="50000">$50k+</option>
            <option value="80000">$80k+</option>
            <option value="120000">$120k+</option>
            <option value="150000">$150k+</option>
          </select>
          <button type="submit" className="btn-primary" style={{ padding: '0.6rem 1.25rem', whiteSpace: 'nowrap' }}>
            Filter Jobs
          </button>
          {(search || location || jobType || minSalary) && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="btn-secondary"
              style={{ padding: '0.6rem 1rem' }}
            >
              Clear
            </button>
          )}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <span>Showing {jobs.length} of {totalCount} open positions</span>
          <span>Page {page} of {totalPages}</span>
        </div>
      </form>

      {loading ? (
        <div className="loading-spinner">Searching live job openings...</div>
      ) : error ? (
        <div className="error-banner">{error}</div>
      ) : jobs.length === 0 ? (
        <div className="empty-state">
          <p>No job listings match your current filters.</p>
          <button onClick={handleResetFilters} className="btn-secondary" style={{ marginTop: '0.75rem' }}>
            Reset Filters
          </button>
        </div>
      ) : (
        <>
          <div className="job-grid">
            {jobs.map((job) => (
              <div key={job._id} className="job-card" onClick={() => navigate(`/jobs/${job._id}`)}>
                <div className="job-card-header">
                  <span className="badge-jobtype">{job.jobType}</span>
                  <span className="job-card-salary">{job.salary}</span>
                </div>
                <h3 className="job-card-title">{job.title}</h3>
                <p className="job-card-company">{job.company}</p>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: '0.5rem 0', lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {job.description}
                </p>
                {job.requirements && job.requirements.length > 0 && (
                  <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                    {job.requirements.slice(0, 3).map((r, i) => (
                      <span key={i} style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.06)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                        {r}
                      </span>
                    ))}
                    {job.requirements.length > 3 && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>+{job.requirements.length - 3} more</span>
                    )}
                  </div>
                )}
                <div className="job-card-footer">
                  <span className="job-card-location">📍 {job.location}</span>
                  <button className="btn-card-action">View details →</button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', marginTop: '2rem' }}>
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
  );
};

export default JobListingPage;

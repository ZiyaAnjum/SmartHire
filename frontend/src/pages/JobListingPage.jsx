import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';

const JobListingPage = () => {
  const [jobs, setJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await API.get('/jobs');
        setJobs(res.data.data);
      } catch (err) {
        setError('Failed to fetch job postings. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // Filter jobs based on title, company, or location search query
  const filteredJobs = jobs.filter((job) => {
    const query = searchQuery.toLowerCase();
    return (
      job.title.toLowerCase().includes(query) ||
      job.company.toLowerCase().includes(query) ||
      job.location.toLowerCase().includes(query)
    );
  });

  return (
    <div className="page-container">
      <header className="page-header">
        <div>
          <h1>Explore Job Opportunities</h1>
          <p>Find your next dream career match here</p>
        </div>
        <div className="header-actions">
          <Link to="/auth" className="btn-secondary">Portal Access</Link>
        </div>
      </header>

      {/* Search Input section */}
      <div className="search-section">
        <input
          type="text"
          placeholder="Search jobs by title, company, or location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      {loading ? (
        <div className="loading-spinner">Searching opportunities...</div>
      ) : error ? (
        <div className="error-banner">{error}</div>
      ) : filteredJobs.length === 0 ? (
        <div className="empty-state">No jobs found matching your criteria.</div>
      ) : (
        <div className="job-grid">
          {filteredJobs.map((job) => (
            <div key={job._id} className="job-card" onClick={() => navigate(`/jobs/${job._id}`)}>
              <div className="job-card-header">
                <span className="badge-jobtype">{job.jobType}</span>
                <span className="job-card-salary">{job.salary}</span>
              </div>
              <h3 className="job-card-title">{job.title}</h3>
              <p className="job-card-company">{job.company}</p>
              <div className="job-card-footer">
                <span className="job-card-location">📍 {job.location}</span>
                <button className="btn-card-action">View details →</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobListingPage;

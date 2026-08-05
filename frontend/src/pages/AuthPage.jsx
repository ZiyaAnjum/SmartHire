import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';

const AuthPage = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'candidate', // default role
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { name, email, password, role } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // Send login request
        const res = await API.post('/auth/login', { email, password });
        login(res.data.token, res.data.data);
        // Navigate based on role
        if (res.data.data.role === 'employer') {
          navigate('/employer-dashboard');
        } else {
          navigate('/candidate-dashboard');
        }
      } else {
        // Send signup request
        const res = await API.post('/auth/signup', { name, email, password, role });
        login(res.data.token, res.data.data);
        if (res.data.data.role === 'employer') {
          navigate('/employer-dashboard');
        } else {
          navigate('/candidate-dashboard');
        }
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Authentication failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
        <p className="auth-subtitle">
          {isLogin ? 'Sign in to access your dashboard' : 'Join our portal and start matching'}
        </p>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={onSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={onChange}
                placeholder="Enter your name"
                required
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={onChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={onChange}
              placeholder="At least 6 characters"
              required
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label>Select Your Role</label>
              <div className="role-selector">
                <label className={`role-option ${role === 'candidate' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="role"
                    value="candidate"
                    checked={role === 'candidate'}
                    onChange={onChange}
                  />
                  <span>Candidate</span>
                </label>
                <label className={`role-option ${role === 'employer' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="role"
                    value="employer"
                    checked={role === 'employer'}
                    onChange={onChange}
                  />
                  <span>Employer</span>
                </label>
              </div>
            </div>
          )}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-switch">
          <span>{isLogin ? "Don't have an account?" : 'Already have an account?'}</span>
          <button onClick={() => setIsLogin(!isLogin)} className="btn-link">
            {isLogin ? 'Sign Up Now' : 'Sign In Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;

import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Link, useNavigate } from 'react-router-dom'; // Add useNavigate here

const Login = () => {
  const { axios, setUser } = useAppContext();
  const navigate = useNavigate(); // Initialize navigate

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await axios.post('/api/user/login', { email, password }, {
        withCredentials: true
      });
      setUser(data.user);
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.message || error.message || 'An error occurred');
    }
    setLoading(false);
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-50'>
      <div className='w-full max-w-md p-6 border border-primary/30 shadow-xl shadow-primary/15 rounded-lg bg-white'>
        <div className='text-center mb-6'>
          <h1 className='text-3xl font-bold text-primary'>Login</h1>
          <p className='font-light'>
            Enter your college credentials to access the platform.
          </p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-center">{error}</div>
        )}

        <form onSubmit={handleSubmit} className='space-y-6 text-gray-600'>
          <div>
            <label htmlFor="email" className="block mb-1 font-medium text-gray-700">Email</label>
            <input
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              required
              placeholder="your university email"
              className='w-full border-b-2 border-gray-300 p-2 outline-none focus:border-primary transition'
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-1 font-medium text-gray-700">Password</label>
            <input
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              required
              placeholder="your password"
              className='w-full border-b-2 border-gray-300 p-2 outline-none focus:border-primary transition'
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className='w-full py-3 font-medium bg-primary text-white rounded hover:bg-primary/90 transition'
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-500 text-sm">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary font-semibold hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

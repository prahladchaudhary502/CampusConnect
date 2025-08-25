import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Link, useNavigate } from 'react-router-dom';
import { isValidDomain,ALLOWED_DOMAINS } from '../utils/validateDomain';

const Register = () => {
    const { axios } = useAppContext();
    const navigate = useNavigate();

    const [username, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (!isValidDomain(email)) {
            setError(`Only emails from ${ALLOWED_DOMAINS.join(', ')} are allowed.`);
            return;
        }

        setLoading(true);
        try {
            const { data } = await axios.post('/api/user/register', {
                username,
                email,
                password
            });
            
            console.log(data);
            if (data.success) {
                navigate('/login');
            } else {
                setError(data.message || 'Registration failed');
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Error occurred');
        }
        setLoading(false);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md p-6 border border-primary/30 shadow-xl shadow-primary/15 rounded-lg bg-white">
                <h1 className="text-3xl text-center font-bold mb-6 text-primary">Register</h1>

                {error && (
                    <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-center">{error}</div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5 text-gray-600">
                    <div>
                        <label htmlFor="name" className="block mb-1 font-medium text-gray-700">
                            Full Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={username}
                            onChange={(e) => setUserName(e.target.value)}
                            required
                            placeholder="Your full name"
                            className="w-full border-b-2 border-gray-300 p-2 outline-none focus:border-primary transition"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block mb-1 font-medium text-gray-700">
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Your university email"
                            className="w-full border-b-2 border-gray-300 p-2 outline-none focus:border-primary transition"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block mb-1 font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Create a password"
                            className="w-full border-b-2 border-gray-300 p-2 outline-none focus:border-primary transition"
                        />
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block mb-1 font-medium text-gray-700">
                            Confirm Password
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            placeholder="Confirm password"
                            className="w-full border-b-2 border-gray-300 p-2 outline-none focus:border-primary transition"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 font-medium bg-primary text-white rounded hover:bg-primary/90 transition"
                    >
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </form>

                <p className="mt-6 text-center text-gray-500 text-sm">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary font-semibold hover:underline">
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;

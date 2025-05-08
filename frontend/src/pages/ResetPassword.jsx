import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/request-reset',
        { email },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      setSuccess(response.data.message);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      console.error('Reset password error:', err);
      setError(err.response?.data?.error || 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-black to-[#1a1a1a] text-white overflow-hidden">
      <div className="animate-fadeIn">
        <h1 className="text-4xl font-bold mb-2 text-center hover:scale-105 transition-transform duration-300">
          GameVerse
        </h1>
        <p className="text-gray-400 mb-8 text-center animate-slideUp">
          Your gaming collection starts here
        </p>
      </div>

      <div className="bg-[#181818] p-8 rounded-lg shadow-md w-96 animate-slideUpAndFade hover:shadow-purple-600/20 transition-shadow duration-300">
        <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>

        {error && (
          <div className="bg-[#b91c1c]/30 text-[#dc2626] p-3 rounded mb-4 text-center animate-shake">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-[#b91c1c] text-[#dc2626] p-3 rounded mb-4 text-center animate-slideUp">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2 group">
            <label className="block text-sm transition-colors group-hover:text-purple-400">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded bg-[#2a2a2a] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 transform transition-all duration-300 hover:bg-[#2f2f2f]"
              required
            />
          </div>

          <div className="flex gap-4">
            <Link
              to="/login"
              className="w-1/2 p-3 rounded bg-[#2a2a2a] text-white text-center hover:bg-[#333333] transition-all duration-300 hover:shadow-lg"
            >
              Back to Login
            </Link>
            <button
              type="submit"
              disabled={loading}
              className={`w-1/2 p-3 rounded bg-purple-600 text-white font-medium transform hover:scale-[1.02] hover:bg-purple-500 transition-all duration-300 active:scale-95 hover:shadow-lg hover:shadow-purple-600/50 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Sending...' : 'Reset Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;

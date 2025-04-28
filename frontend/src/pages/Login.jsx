import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', 
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        
        login({
          ...res.data.user,
          token: res.data.token
        });
        
        navigate('/');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
    }
  };

  const handleGoogleLogin = () => {
    // Implement Google login functionality
    console.log('Google login clicked');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white overflow-hidden">
      <div className="animate-fadeIn">
        <h1 className="text-4xl font-bold mb-2 text-center hover:scale-105 transition-transform duration-300">
          GameVerse
        </h1>
        <p className="text-gray-400 mb-8 text-center animate-slideUp">
          Your gaming collection starts here
        </p>
      </div>
      
      <div className="bg-[#1a1a1a] p-8 rounded-lg shadow-md w-96 animate-slideUpAndFade hover:shadow-purple-600/20 transition-shadow duration-300">
        <div className="flex mb-8 gap-4">
          <Link 
            to="/login" 
            className="pb-2 px-6 text-white bg-purple-600 rounded-md focus:outline-none transform hover:scale-105 transition-all duration-300 hover:bg-purple-500"
          >
            Login
          </Link>
          <Link 
            to="/register" 
            className="pb-2 px-6 text-white hover:text-gray-300 focus:outline-none transform hover:scale-105 transition-all duration-300"
          >
            Sign Up
          </Link>
        </div>

        {error && (
          <div className="bg-red-500 text-white p-3 rounded mb-4 text-center animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2 group">
            <label className="block text-sm transition-colors group-hover:text-purple-400">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="w-full p-3 rounded bg-[#2a2a2a] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 transform transition-all duration-300 hover:bg-[#2f2f2f]"
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2 group">
            <label className="block text-sm transition-colors group-hover:text-purple-400">Password</label>
            <div className="relative">
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                className="w-full p-3 rounded bg-[#2a2a2a] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 transform transition-all duration-300 hover:bg-[#2f2f2f]"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="text-right">
            <Link 
              to="/forgot-password" 
              className="text-purple-600 text-sm hover:text-purple-400 transition-colors duration-300 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <button 
            type="submit" 
            className="w-full p-3 rounded bg-purple-600 text-white font-medium transform hover:scale-[1.02] hover:bg-purple-500 transition-all duration-300 active:scale-95 hover:shadow-lg hover:shadow-purple-600/50"
          >
            Login
          </button>

          <div className="text-center text-gray-400 text-sm animate-pulse">or continue with</div>

          <button
            type="button"
            className="w-full p-3 rounded bg-[#2a2a2a] text-white flex items-center justify-center gap-2 hover:bg-[#333333] border border-gray-700 transform hover:scale-[1.02] transition-all duration-300 hover:border-purple-500 active:scale-95"
          >
            <img
              src="https://www.google.com/favicon.ico"
              alt="Google"
              className="w-5 h-5 animate-spin-slow"
            />
            Continue with Google
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

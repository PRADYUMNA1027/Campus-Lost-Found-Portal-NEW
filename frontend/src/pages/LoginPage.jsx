import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { FiLock, FiMail, FiArrowRight, FiShield, FiUserCheck } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (searchParams.get('error') === 'google_auth_failed') {
      setError('Google Single Sign-On failed. Please try again or log in with password.');
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      if (result.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } else {
      setError(result.error || 'Invalid email or password.');
    }
  };

  const handleQuickDemo = async (role) => {
    setIsSubmitting(true);
    if (role === 'admin') {
      setEmail('admin@campus.edu');
      setPassword('admin123');
      const res = await login('admin@campus.edu', 'admin123');
      if (res.success) navigate('/admin');
    } else {
      setEmail('student@campus.edu');
      setPassword('student123');
      const res = await login('student@campus.edu', 'student123');
      if (res.success) navigate('/dashboard');
    }
    setIsSubmitting(false);
  };

  const handleGoogleLogin = () => {
    const backendApiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';
    window.location.href = `${backendApiUrl}/auth/google`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-md mx-auto px-4 py-16"
    >
      <div className="bg-white rounded-3xl border border-slate-100 shadow-card p-8 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-extrabold text-slate-900">Welcome Back</h1>
          <p className="text-xs text-slate-500">Sign in to your Campus Lost & Found account</p>
        </div>

        {/* Demo Quick Logins */}
        <div className="p-3 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-2">
          <span className="text-[11px] font-bold text-blue-900 uppercase tracking-wider block text-center">
            Quick Demo Login Toggles
          </span>
          <div className="grid grid-cols-2 gap-2">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleQuickDemo('student')}
              className="py-2 px-3 bg-white rounded-xl border border-blue-200 text-xs font-bold text-blue-700 hover:bg-blue-50 flex items-center justify-center space-x-1 cursor-pointer"
            >
              <FiUserCheck className="w-3.5 h-3.5" />
              <span>Student Account</span>
            </motion.button>

            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleQuickDemo('admin')}
              className="py-2 px-3 bg-white rounded-xl border border-amber-200 text-xs font-bold text-amber-800 hover:bg-amber-50 flex items-center justify-center space-x-1 cursor-pointer"
            >
              <FiShield className="w-3.5 h-3.5 text-amber-600" />
              <span>Admin Account</span>
            </motion.button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-semibold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Email */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">Campus Email</label>
            <div className="relative">
              <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@campus.edu"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">Password</label>
            <div className="relative">
              <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>{isSubmitting ? 'Authenticating...' : 'Sign In'}</span>
            <FiArrowRight />
          </motion.button>

        </form>

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2.5 text-slate-400 font-semibold tracking-wider">Or</span>
          </div>
        </div>

        {/* Google SSO Button */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleGoogleLogin}
          className="w-full py-3 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm shadow-xs hover:shadow transition-all flex items-center justify-center space-x-2.5 cursor-pointer"
        >
          <FcGoogle className="w-5 h-5 shrink-0" />
          <span>Continue with Google</span>
        </motion.button>

        <div className="text-center pt-2 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-blue-600 hover:underline">
              Register Here
            </Link>
          </p>
        </div>

      </div>
    </motion.div>
  );
};

export default LoginPage;

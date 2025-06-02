import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const { login, error, clearError } = useAuth();

  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [formData, clearError]);

  // Clear InputField
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  //Login Validation
  const validateForm = () => {
    const errors = {};

    if(!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if(!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submission Handling
  const handleSubmit = async (e) => {
    e.preventDefault();

    setFormErrors({});
    clearError();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const userData = await login(formData.email, formData.password);
      console.log('Login successful:', userData);

      if (formData.rememberMe) {
        console.log('Remember me was selected');
      }

      setFormData({
        email: '',
        password: '',
        rememberMe: false
      });

    } catch (error) {
      console.error('login failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const handleGoogleSignIn = () => {
    console.log('We are working on that, Please Create a User account');
  };

  const handleSignUpClick = () => {
    console.log('Navigate to sign up page');
    // navigate('/register'); // Use when React Router is available
  }

  const handleForgotPassword = () => {
    console.log('Working on that. Please try to remember');
  };

  return (
    <>
      {/* Mobile Header - Shows on mobile and tablet */}
      <div className='w-full max-w-sm mx-auto px-4 md:px-0'>
        {/* Header */}
        <div className='text-center mb-6 sm:mb-8'>
          <h2 className='text-2xl sm:text-3xl font-bold text-gray-900 mb-2'>
            Welcome Back
          </h2>
          <p className='text-sm sm:text-base text-gray-600'>
            Enter your email and password to access your account
          </p>
        </div>

        {/* Login Form */}
        <div className='space-y-4 sm:space-y-6'>
          {/* Global Error Message */}
          {error && (
            <div className='bg-red-50 border border-red-200 rounded-lg p-4 flex items-start'>
              <AlertCircle className='h-5 w-5 text-red-400 mt-0.5 mr-3 flex-shrink-0' />
              <p className='text-sm text-red-800'>{error}</p>
            </div>
          )}

          <div>
            {/* Email Field*/}
            <div className='mb-4 sm:mb-6'>
              <label htmlFor='email' className='block text-sm font-medium text-gray-700 mb-2'>
                Email
              </label>
              <input
                id='email'
                name='email'
                type='email'
                autoComplete='email'
                required
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:ring-2 focus:outline-none transition-colors text-sm sm:text-base ${
                  formErrors.email
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                }`}
                placeholder='Enter your email'
                disabled={isSubmitting}
              />
              {formErrors.email && (
                <p className='mt-2 text-sm text-red-600'>{formErrors.email}</p>
              )}
            </div>

            {/* Password Field*/}
            <div className='mb-4 sm:mb-6'>
              <label htmlFor='password' className='block text-sm font-medium text-gray-700 mb-2'>
                Password
              </label>
              <div className='relative'>
                <input
                  id='password'
                  name='password'
                  type={showPassword ? 'text' : 'password'}
                  autoComplete='current-password'
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-10 sm:pr-12 border rounded-lg focus:ring-2 focus:outline-none transition-colors text-sm sm:text-base ${
                    formErrors.password
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                  }`}
                  placeholder='Enter your password'
                  disabled={isSubmitting}
                />
                <button
                  type='button'
                  className='absolute inset-y-0 right-0 flex items-center justify-center w-10 sm:w-12'
                  onClick={togglePasswordVisibility}
                  disabled={isSubmitting}
                >
                  {showPassword ? (
                    <EyeOff className='h-5 w-5 text-gray-400 hover:text-gray-600' />
                  ) : (
                    <Eye className='h-5 w-5 text-gray-400 hover:text-gray-600' />
                  )}
                </button>
              </div>
              {formErrors.password && (
                <p className='mt-2 text-sm text-red-600'>{formErrors.password}</p>
              )}
            </div>

            {/* Remember Me & Forgot Password*/}
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 mb-4 sm:mb-6'>
              <label className='flex items-center'>
                <input
                  name='rememberMe'
                  type='checkbox'
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className='h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded'
                  disabled={isSubmitting}
                />
                <span className='ml-2 text-sm text-gray-600'>Remember me</span>
              </label>
              <button
                type='button'
                className='text-sm text-indigo-600 hover:text-indigo-500 font-medium text-left sm:text-right'
                onClick={handleForgotPassword}
              >
                Forgot Password
              </button>
            </div>

            {/* Submit Button */}
            <button
              type='button'
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`w-full py-2.5 sm:py-3 px-4 rounded-lg text-white font-medium transition-all duration-200 text-sm sm:text-base mb-4 ${
                isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-black hover:bg-gray-800 focus:ring-4 focus:ring-gray-300'
              }`}
            >
              {isSubmitting ? (
                <div className='flex items-center justify-center'>
                  <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3'></div>
                  Signing in...
                </div>
              ): (
                'Sign In'
              )}
            </button>

            {/* Google Sign In */}
            <button
              type='button'
              onClick={handleGoogleSignIn}
              disabled={isSubmitting}
              className='w-full py-2.5 sm:py-3 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 focus:ring-4 focus:ring-gray-100 transition-all duration-200 flex items-center justify-center text-sm sm:text-base mb-4'
            >
              <svg className='w-5 h-5 mr-3' viewBox='0 0 24 24'>
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign In with Google
            </button>

            {/* Sign Up Link */}
            <div className='text-center'>
              <p className='text-sm text-gray-600'>
                Don't have an account?{' '}
                <button
                  type='button'
                  onClick={handleSignUpClick}
                  className='font-medium text-indigo-600 hover:text-indigo-500 transition-colors'
                >
                  Sign Up
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
import { User, Mail, LogOut, UserCheck } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useFormValidation } from '../../hooks/useFormValidation';
import { useAuthForm } from '../../hooks/useAuthForm';
import { validationRules } from '../../../../shared/utils/validationRules';
import { usePasswordStrength } from '../../hooks/usePasswordStrength';
import FormField from '../../../../shared/components/FormField';
import Input from '../../../../shared/components/Input';
import PasswordInput from '../../../../shared/components/PasswordInput/PasswordInput';
import ErrorMessage from '../../../../shared/components/ErrorMessage';
import GoogleSignInButton from '../../../../shared/components/GoogleSingButton';
import { useState, useEffect } from 'react';

const AUTH_MODES = {
  LOGIN: 'login',
  REGISTER: 'register'
};

const AuthForm = ({ initialMode = AUTH_MODES.LOGIN }) => {
  const [mode, setMode] = useState(initialMode);
  const { user, isAuthenticated } = useAuth();
  const { isSubmitting, handleLogin, handleRegister, handleGoogleAuth, authError, clearAuthError } = useAuthForm();

  // Form initial values based on mode
  const getInitialValues = (currentMode) => ({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    rememberMe: false,
    agreeToTerms: false
  });

  // Validation rules based on mode
  const getValidationRules = (currentMode) => {
    const baseRules = {
      email: validationRules.email,
      password: validationRules.password
    };

    if (currentMode === AUTH_MODES.REGISTER) {
      return {
        ...baseRules,
        name: validationRules.name,
        confirmPassword: validationRules.confirmPassword,
        agreeToTerms: validationRules.agreeToTerms
      };
    }

    return baseRules;
  };

  const {
    formData,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    resetForm,
    setFormData
  } = useFormValidation(getInitialValues(mode), getValidationRules(mode));

  const passwordStrength = usePasswordStrength(formData.password);

  // Reset form when mode changes
  useEffect(() => {
    setFormData(getInitialValues(mode));
    clearAuthError();
  }, [mode, setFormData, clearAuthError]);

  // Clear auth errors when form data changes
  useEffect(() => {
    if (authError) {
      clearAuthError();
    }
  }, [formData, clearAuthError]);

  const switchMode = () => {
    setMode(prev => prev === AUTH_MODES.LOGIN ? AUTH_MODES.REGISTER : AUTH_MODES.LOGIN);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      if (mode === AUTH_MODES.LOGIN) {
        await handleLogin(formData, () => {
          if (formData.rememberMe) {
            console.log('Remember me was selected');
          }
          resetForm();
        });
      } else {
        await handleRegister(formData, () => {
          resetForm();
        });
      }
    } catch (error) {
      // Error is handled by useAuthForm hook
      console.error('Form submission error:', error);
    }
  };

  const handleLogout = async () => {
    try {
      const { logout } = useAuth();
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleForgotPassword = () => {
    console.log('Working on that. Please try to remember');
  };

  const handleTermsClick = () => {
    console.log('Show Terms & Conditions');
  };

  const handlePrivacyClick = () => {
    console.log('Show Privacy Policy');
  };

  // Authenticated user view
  if (user && isAuthenticated()) {
    return (
      <div className='w-full max-w-sm mx-auto px-4 lg:px-0'>
        <div className='text-center mb-6 md:mb-8'>
          <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
            mode === AUTH_MODES.REGISTER 
              ? 'bg-gradient-to-br from-green-500 to-emerald-600' 
              : 'bg-gradient-to-br from-indigo-500 to-purple-600'
          }`}>
            {mode === AUTH_MODES.REGISTER ? (
              <UserCheck className='w-7 h-7 md:w-8 md:h-8 text-white' />
            ) : (
              <User className='w-7 h-7 md:w-8 md:h-8 text-white' />
            )}
          </div>
          <h2 className='text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2'>
            {mode === AUTH_MODES.REGISTER ? 'Welcome to Our Platform!' : 'Welcome Back'}
          </h2>
          <p className='text-sm md:text-base font-medium text-gray-600 break-words'>
            {mode === AUTH_MODES.REGISTER 
              ? `Registration successful. Hello, ${user.name}!` 
              : user.name || user.email
            }
          </p>
        </div>

        <button
          onClick={handleLogout}
          disabled={isSubmitting}
          className={`w-full py-2.5 sm:py-3 px-4 rounded-lg text-white font-medium transition-all duration-200 text-sm sm:text-base flex items-center justify-center touch-manipulation ${
            isSubmitting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-300 active:bg-red-800'
          }`}
        >
          {isSubmitting ? (
            <div className='flex items-center justify-center'>
              <div className='animate-spin rounded-full h-4 w-4 md:h-5 md:w-5 border-b-2 border-white mr-2 md:mr-3'></div>
              <span>Signing out...</span>
            </div>
          ) : (
            <>
              <LogOut className='w-4 h-4 md:w-5 md:h-5 mr-2' />
              <span>Sign Out</span>
            </>
          )}
        </button>
      </div>
    );
  }

  const isLogin = mode === AUTH_MODES.LOGIN;
  const isRegister = mode === AUTH_MODES.REGISTER;

  return (
    <div className='w-full max-w-sm mx-auto px-4 md:px-0'>
      {/* Header */}
      <div className='text-center mb-6 sm:mb-8'>
        <h2 className='text-2xl sm:text-3xl font-bold text-gray-900 mb-2'>
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className='text-sm sm:text-base text-gray-600'>
          {isLogin 
            ? 'Enter your email and password to access your account'
            : 'Join us today and start your journey'
          }
        </p>
      </div>

      {/* Error Message */}
      <ErrorMessage message={authError} className="mb-4" />

      {/* Form */}
      <form onSubmit={handleSubmit} className='space-y-4 sm:space-y-6' noValidate>
        {/* Name Field - Only for Register */}
        {isRegister && (
          <FormField 
            label="Full Name" 
            error={errors.name} 
            touched={touched.name}
            required
          >
            <Input
              id='name'
              name='name'
              type='text'
              autoComplete='name'
              required
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder='Enter your full name'
              disabled={isSubmitting}
              icon={User}
              error={errors.name}
              touched={touched.name}
            />
          </FormField>
        )}

        {/* Email Field */}
        <FormField 
          label={isRegister ? "Email Address" : "Email"} 
          error={errors.email} 
          touched={touched.email}
          required
        >
          <Input
            id='email'
            name='email'
            type='email'
            autoComplete='email'
            required
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={isRegister ? 'Enter your email address' : 'Enter your email'}
            disabled={isSubmitting}
            icon={Mail}
            error={errors.email}
            touched={touched.email}
          />
        </FormField>

        {/* Password Field */}
        <FormField 
          label="Password" 
          error={errors.password} 
          touched={touched.password}
          required
        >
          <PasswordInput
            id='password'
            name='password'
            autoComplete={isLogin ? 'current-password' : 'new-password'}
            required
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={isLogin ? 'Enter your password' : 'Create a strong password'}
            disabled={isSubmitting}
            error={errors.password}
            touched={touched.password}
            showStrength={isRegister}
            strengthData={passwordStrength}
          />
        </FormField>

        {/* Confirm Password - Only for Register */}
        {isRegister && (
          <FormField 
            label="Confirm Password" 
            error={errors.confirmPassword} 
            touched={touched.confirmPassword}
            required
          >
            <PasswordInput
              id='confirmPassword'
              name='confirmPassword'
              autoComplete='new-password'
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder='Confirm your password'
              disabled={isSubmitting}
              error={errors.confirmPassword}
              touched={touched.confirmPassword}
            />
            {formData.confirmPassword && formData.password === formData.confirmPassword && (
              <p className='mt-2 text-sm text-green-600'>✓ Passwords match</p>
            )}
          </FormField>
        )}

        {/* Remember Me & Forgot Password - Only for Login */}
        {isLogin && (
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0'>
            <label className='flex items-center'>
              <input
                name='rememberMe'
                type='checkbox'
                checked={formData.rememberMe}
                onChange={handleChange}
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
              Forgot Password?
            </button>
          </div>
        )}

        {/* Terms and Conditions - Only for Register */}
        {isRegister && (
          <FormField error={errors.agreeToTerms} touched={touched.agreeToTerms}>
            <label className='flex items-start'>
              <input
                name='agreeToTerms'
                type='checkbox'
                checked={formData.agreeToTerms}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`h-4 w-4 mt-0.5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded ${
                  errors.agreeToTerms && touched.agreeToTerms ? 'border-red-300' : ''
                }`}
                disabled={isSubmitting}
              />
              <span className='ml-2 text-sm text-gray-600 leading-relaxed'>
                I agree to the{' '}
                <button
                  type='button'
                  className='text-indigo-600 hover:text-indigo-500 font-medium'
                  onClick={handleTermsClick}
                >
                  Terms & Conditions
                </button>
                {' '}and{' '}
                <button
                  type='button'
                  className='text-indigo-600 hover:text-indigo-500 font-medium'
                  onClick={handlePrivacyClick}
                >
                  Privacy Policy
                </button>
              </span>
            </label>
          </FormField>
        )}

        {/* Submit Button */}
        <button
          type="submit"
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
              {isLogin ? "Signing in..." : "Creating Account..."}
            </div>
          ) : (
            isLogin ? 'Sign In' : 'Create Account'
          )}
        </button>
      </form>

      {/* Google Sign In/Up */}
      <button
        type='button'
        onClick={handleGoogleAuth}
        disabled={isSubmitting}
        className='w-full py-2.5 sm:py-3 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 focus:ring-4 focus:ring-gray-100 transition-all duration-200 flex items-center justify-center text-sm sm:text-base mb-4'
      >
        <svg className='w-5 h-5 mr-3' viewBox='0 0 24 24'>
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        {isLogin ? "Sign In with Google" : "Sign Up with Google"}
      </button>

      {/* Mode Switch */}
      <div className='text-center'>
        <p className='text-sm text-gray-600'>
          {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
          <button
            type='button'
            onClick={switchMode}
            className='font-medium text-indigo-600 hover:text-indigo-500 transition-colors'
            disabled={isSubmitting}
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
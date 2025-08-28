import { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import AuthForm from '../../components/AuthForm/AuthForm';
import LoadingSpinner from '../../../../shared/components/LoadingSpinner';
import { ArrowLeft } from 'lucide-react';

const AuthPage = () => {
  const { user, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determine initial mode based on URL or query params
  const getInitialMode = () => {
    const searchParams = new URLSearchParams(location.search);
    const mode = searchParams.get('mode');
    return mode === 'register' ? 'register' : 'login';
  };

  const initialMode = getInitialMode();

  useEffect(() => {
    if (user && isAuthenticated()) {
      navigate('/', { replace: true });
    }
  }, [user, isAuthenticated, navigate]);

  if (loading) {
    return <LoadingSpinner message="Loading..." />;
  }

  if (user && isAuthenticated()) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-gray-900 mb-4'>
            Welcome back, {user.name}!
          </h2>
          <p className='text-gray-600 mb-4'>You are already logged in.</p>
          <button
            onClick={() => navigate('/')}
            className='bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors'
          >
            Back to HomePage
          </button>
        </div>
      </div>
    );
  }

  const isRegisterMode = initialMode === 'register';

  return (
    <div className='min-h-screen flex'>
      {/* Left Panel - Dynamic Background */}
      <div className={`hidden lg:flex lg:w-1/2 relative overflow-hidden ${
        isRegisterMode 
          ? 'bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900'
          : 'bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900'
      }`}>
        {/* Animated gradient overlay */}
        <div className={`absolute inset-0 animate-pulse ${
          isRegisterMode
            ? 'bg-gradient-to-br from-emerald-600/20 via-teal-500/20 to-cyan-500/20'
            : 'bg-gradient-to-br from-purple-600/20 via-pink-500/20 to-blue-500/20'
        }`}></div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <div className={`absolute top-20 left-20 w-72 h-72 rounded-full mix-blend-multiply filter blur-xl animate-blob ${
            isRegisterMode ? 'bg-emerald-500' : 'bg-purple-500'
          }`}></div>
          <div className={`absolute top-40 right-20 w-72 h-72 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000 ${
            isRegisterMode ? 'bg-teal-500' : 'bg-yellow-500'
          }`}></div>
          <div className={`absolute bottom-20 left-40 w-72 h-72 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000 ${
            isRegisterMode ? 'bg-cyan-500' : 'bg-pink-500'
          }`}></div>
        </div>

        {/* Content */}
        <div className='relative z-10 flex flex-col justify-between p-12 text-white w-full'>
          {/* Quote Badge */}
          <div className="mb-8">
            <span className="inline-block px-3 py-1 text-xs font-medium tracking-wider uppercase bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              Ramon Lora Reyes
            </span>
          </div>

          {/* Main Content */}
          <div className='flex-1 flex flex-col justify-center'>
            <h1 className='text-5xl font-bold leading-tight mb-6'>
              {isRegisterMode ? (
                <>
                  Start your <br />
                  creative journey <br />
                  today
                </>
              ) : (
                <>
                  Every picture <br />
                  has a story <br />
                  to tell
                </>
              )}
            </h1>
            <p className='text-lg text-white/80 max-w-md leading-relaxed'>
              {isRegisterMode 
                ? 'Join our community and discover amazing photography experiences.'
                : 'Thank you for your trust!'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="w-full lg:w-1/2 flex flex-col bg-gray-50 min-h-screen relative">
        {/* Back to Home Button - Always visible */}
        <div className="absolute top-4 left-4 lg:top-8 lg:left-8 z-10">
          <Link
            to="/"
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors px-3 py-2 rounded-lg hover:bg-white/50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>
        
        {/* Auth Form Container */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8">
          <AuthForm initialMode={initialMode} />
        </div>
      </div>

      {/* Custom styles for animations */}
      <>
              <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
      </>
    </div>
  );
};

export default AuthPage;
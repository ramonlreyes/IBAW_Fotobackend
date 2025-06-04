

const ErrorState = ({ error, onRetry }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="text-red-500 text-6xl mb-4">⚠️</div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">Error Loading Albums</h2>
      <p className="text-gray-600 mb-4">{error}</p>
      <button 
        onClick={onRetry}
        className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
      >
        Try Again
      </button>
    </div>
  </div>
);

export default ErrorState;
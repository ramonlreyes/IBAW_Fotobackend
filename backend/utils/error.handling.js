
/**
 * Handles Multer errors and converts them to the standard API response format
 * @param {Error} err - The error object from Multer
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const handleMulterError = (err, req, res, next) => {
  if (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
  next();
};

/**
 * Creates a standard error response
 * @param {number} status - HTTP status code
 * @param {string} message - Error message
 * @returns {Object} Error response object
 */
export const createErrorResponse = (status, message) => {
  return {
    status,
    response: {
      success: false,
      message
    }
  };
};

/**
 * Handles common API errors with standard responses
 * @param {Error} error - The error object
 * @param {string} context - Context where the error occurred (optional)
 * @returns {Object} Error response with status and message
 */
export const handleApiError = (error, context = '') => {
  // Handle MongoDB validation errors
  if (error.name === 'ValidationError') {
    const messages = Object.values(error.errors).map(val => val.message);
    return createErrorResponse(400, messages.join(', '));
  }
  
  // Handle MongoDB duplicate key errors
  if (error.code === 11000) {
    return createErrorResponse(400, `Duplicate value entered for ${Object.keys(error.keyValue)} field`);
  }
  
  // Handle MongoDB invalid ID format
  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return createErrorResponse(400, 'Invalid ID format');
  }

  // Log the error for debugging but return a generic message to the client
  console.error(`Error in ${context}:`, error);
  return createErrorResponse(500, 'Server Error');
};

export default {
  handleMulterError,
  createErrorResponse,
  handleApiError
};
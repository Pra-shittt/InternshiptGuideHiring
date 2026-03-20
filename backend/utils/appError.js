// ─── Custom Error Class ──────────────────────────────
// Used throughout controllers for consistent error responses.
// The error handler middleware in server.js catches these.

export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // distinguishes from programming errors
    Error.captureStackTrace(this, this.constructor);
  }
}

// Wrapper for async route handlers — eliminates try/catch boilerplate
export const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

// ─── Role-based Authorization Middleware ─────────────
// Use AFTER the protect middleware.
// Restricts route access to specific user roles.
//
// Usage:  router.post('/', protect, authorize('recruiter', 'admin'), handler)

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role '${req.user.role}' is not authorized to access this resource`,
      });
    }

    next();
  };
};

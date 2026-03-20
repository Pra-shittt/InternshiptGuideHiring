// ─── Smart Interview Preparation & Talent Hiring Platform ───
// Main server entry point — Express.js REST API
// Tech: Node.js, Express, MongoDB (Mongoose), JWT Auth

import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import questionRoutes from './routes/questionRoutes.js';
import testRoutes from './routes/testRoutes.js';
import performanceRoutes from './routes/performanceRoutes.js';
import recruiterRoutes from './routes/recruiterRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import leaderboardRoutes from './routes/leaderboardRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import interviewRoutes from './routes/interviewRoutes.js';
import assessmentRoutes from './routes/assessmentRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ─── Global Middleware ───────────────────────────────
app.use(cors());                              // Enable CORS for all origins
app.use(express.json({ limit: '10mb' }));     // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files (resumes, etc.)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── API Routes ──────────────────────────────────────
app.use('/api/auth', authRoutes);             // Signup, Login
app.use('/api/users', userRoutes);            // Profile CRUD, solved questions
app.use('/api/questions', questionRoutes);    // Coding questions CRUD
app.use('/api/tests', testRoutes);            // Mock tests
app.use('/api/performance', performanceRoutes); // Performance analytics
app.use('/api/recruiter', recruiterRoutes);   // Recruiter dashboard
app.use('/api/resume', resumeRoutes);         // Resume upload
app.use('/api/leaderboard', leaderboardRoutes); // Leaderboard
app.use('/api/admin', adminRoutes);           // Admin management
app.use('/api/interviews', interviewRoutes);  // Interview scheduling & management
app.use('/api/assessments', assessmentRoutes); // Assessment submission
app.use('/api/jobs', jobRoutes);              // Job postings CRUD
app.use('/api/applications', applicationRoutes); // Job applications

// ─── Health Check ────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Smart Hiring Platform API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// ─── 404 Handler ─────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

// ─── Global Error Handler ────────────────────────────
// Catches all errors thrown in route handlers and middleware.
// AppError instances carry a statusCode; other errors default to 500.
app.use((err, req, res, next) => {
  // Log the error in development
  if (process.env.NODE_ENV !== 'production') {
    console.error('❌ Error:', err.message);
    if (!err.isOperational) console.error(err.stack);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: messages,
    });
  }

  // Mongoose duplicate key error (e.g. duplicate email)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      success: false,
      message: `Duplicate value for '${field}'. This ${field} already exists.`,
    });
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: `Invalid ${err.path}: ${err.value}`,
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ success: false, message: 'Token expired' });
  }

  // Default: operational errors from AppError, or 500 for unknown
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.isOperational ? err.message : 'Internal Server Error',
  });
});

// ─── Start Server ────────────────────────────────────
const PORT = process.env.PORT || 8080;

connectDB()
  .then(() => {
    const server = app.listen(PORT, () => {
      console.log(`\n🚀 Server running on http://localhost:${PORT}`);
      console.log(`📚 Health check: http://localhost:${PORT}/api/health`);
      console.log(`🔗 API Base URL: http://localhost:${PORT}/api\n`);
    });

    // Handle server shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received. Shutting down gracefully...');
      server.close(() => {
        console.log('Process terminated.');
      });
    });
  })
  .catch((err) => {
    console.error('❌ Failed to connect to MongoDB:', err.message);
    process.exit(1);
  });

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err.message);
  // In production, you might want to exit the process
});

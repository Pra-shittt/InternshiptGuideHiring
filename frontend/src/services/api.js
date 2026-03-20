import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─── Auth ────────────────────────────────────────────
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// ─── Questions ───────────────────────────────────────
export const questionAPI = {
  getAll: (params) => api.get('/questions', { params }),
  getById: (id) => api.get(`/questions/${id}`),
  getCompanies: () => api.get('/questions/companies'),
  create: (data) => api.post('/questions', data),
  update: (id, data) => api.put(`/questions/${id}`, data),
  delete: (id) => api.delete(`/questions/${id}`),
};

// ─── Tests ───────────────────────────────────────────
export const testAPI = {
  start: (data) => api.post('/tests/start', data),
  submit: (data) => api.post('/tests/submit', data),
  getAttempts: () => api.get('/tests/attempts'),
};

// ─── Performance ─────────────────────────────────────
export const performanceAPI = {
  getSummary: () => api.get('/performance/summary'),
};

// ─── Recruiter ───────────────────────────────────────
export const recruiterAPI = {
  getCandidates: () => api.get('/recruiter/candidates'),
  getCandidatePerformance: (id) => api.get(`/recruiter/candidates/${id}`),
  scheduleInterview: (data) => api.post('/recruiter/interviews', data),
  getInterviews: () => api.get('/recruiter/interviews'),
  getAnalytics: () => api.get('/recruiter/analytics'),
};

// ─── Interviews ──────────────────────────────────────
export const interviewAPI = {
  getById: (id) => api.get(`/interviews/${id}`),
  start: (id) => api.post(`/interviews/${id}/start`),
  saveNotes: (id, data) => api.put(`/interviews/${id}/notes`, data),
  end: (id, data) => api.put(`/interviews/${id}/end`, data),
  getCandidateUpcoming: () => api.get('/interviews/candidate/upcoming'),
};

// ─── Assessments ─────────────────────────────────────
export const assessmentAPI = {
  submit: (data) => api.post('/assessments', data),
  getAll: () => api.get('/assessments'),
  getCandidateAssessments: (id) => api.get(`/assessments/candidate/${id}`),
};

// ─── Resume ──────────────────────────────────────────
export const resumeAPI = {
  upload: (formData) => api.post('/resume/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

// ─── Leaderboard ─────────────────────────────────────
export const leaderboardAPI = {
  get: () => api.get('/leaderboard'),
};

// ─── Admin ───────────────────────────────────────────
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getUsers: (params) => api.get('/admin/users', { params }),
};

export default api;

import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout';
import { LandingPage } from './pages/LandingPage';
import { Login } from './pages/auth/Login';
import { Signup } from './pages/auth/Signup';

import { CandidateDashboard } from './pages/candidate/Dashboard';
import { VideoInterview } from './pages/candidate/VideoInterview';
import { MockTest } from './pages/candidate/MockTest';
import { CompanyPrep } from './pages/candidate/CompanyPrep';
import { PracticeMode } from './pages/candidate/PracticeMode';
import { PracticeQuestionsPage } from './pages/candidate/PracticeQuestionsPage';
import { McqSolve } from './pages/candidate/McqSolve';
import { Results } from './pages/candidate/Results';
import { Performance } from './pages/candidate/Performance';
import { Leaderboard } from './pages/Leaderboard';

import { RecruiterDashboard } from './pages/recruiter/Dashboard';
import { InterviewPanel } from './pages/recruiter/InterviewPanel';
import { ScheduleInterview } from './pages/recruiter/ScheduleInterview';
import { CandidateList } from './pages/recruiter/CandidateList';

import { AdminDashboard } from './pages/admin/Dashboard';
import { ManageUsers } from './pages/admin/ManageUsers';
import { ManageContent } from './pages/admin/ManageContent';


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Candidate Routes */}
      <Route element={<DashboardLayout allowedRoles={['CANDIDATE']} />}>
        <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
        <Route path="/candidate/companies" element={<CompanyPrep />} />
        <Route path="/candidate/practice" element={<PracticeQuestionsPage />} />
        <Route path="/candidate/practice/mock" element={<PracticeMode />} />
        <Route path="/candidate/mcq/:id" element={<McqSolve />} />
        <Route path="/candidate/results" element={<Results />} />
        <Route path="/candidate/performance" element={<Performance />} />
        <Route path="/candidate/leaderboard" element={<Leaderboard />} />
        <Route path="/candidate/interview/:id" element={<VideoInterview />} />
        <Route path="/candidate/test" element={<MockTest />} />
        <Route path="/candidate/test/:id" element={<MockTest />} />
      </Route>

      {/* Recruiter Routes */}
      <Route element={<DashboardLayout allowedRoles={['RECRUITER']} />}>
        <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
        <Route path="/recruiter/schedule" element={<ScheduleInterview />} />
        <Route path="/recruiter/candidates" element={<CandidateList />} />
        <Route path="/recruiter/interview/:id" element={<InterviewPanel />} />
      </Route>

      {/* Admin Routes */}
      <Route element={<DashboardLayout allowedRoles={['ADMIN']} />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<ManageUsers />} />
        <Route path="/admin/content" element={<ManageContent />} />

      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Onboarding from './pages/Onboarding';
import Feed from './pages/Feed';
import Mentorship from './pages/Mentorship';
import Opportunities from './pages/Opportunities';
import Events from './pages/Events';
import Profile from './pages/Profile';
import FacultyTools from './pages/FacultyTools';
import StudentAnalytics from './pages/faculty/StudentAnalytics';
import AlumniTracking from './pages/faculty/AlumniTracking';
import OpportunityManagement from './pages/faculty/OpportunityManagement';
import EventManagement from './pages/faculty/EventManagement';
import StudentSupport from './pages/faculty/StudentSupport';
import ProjectRepository from './pages/faculty/ProjectRepository';
import AlumniNetwork from './pages/AlumniNetwork';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/onboarding" 
            element={
              <ProtectedRoute>
                <Onboarding />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/feed" 
            element={
              <ProtectedRoute>
                <Feed />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/mentorship" 
            element={
              <ProtectedRoute>
                <Mentorship />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/opportunities" 
            element={
              <ProtectedRoute>
                <Opportunities />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/events" 
            element={
              <ProtectedRoute>
                <Events />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile/:userId" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/faculty-tools" 
            element={
              <ProtectedRoute>
                <FacultyTools />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/faculty-tools/student-analytics" 
            element={
              <ProtectedRoute>
                <StudentAnalytics />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/faculty-tools/alumni-tracking" 
            element={
              <ProtectedRoute>
                <AlumniTracking />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/faculty-tools/opportunity-management" 
            element={
              <ProtectedRoute>
                <OpportunityManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/faculty-tools/event-management" 
            element={
              <ProtectedRoute>
                <EventManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/faculty-tools/student-support" 
            element={
              <ProtectedRoute>
                <StudentSupport />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/faculty-tools/project-repository" 
            element={
              <ProtectedRoute>
                <ProjectRepository />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/alumni-network" 
            element={
              <ProtectedRoute>
                <AlumniNetwork />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;

import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import ResearcherDashboard from './pages/ResearcherDashboard';
import TestEngineerDashboard from './pages/TestEngineerDashboard';
import LogResultsPage from './pages/LogResultsPage';
import AnalysisDashboard from './pages/AnalysisDashboard';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import './styles.css';

const App = () => (
  <Router>
    <div>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard/admin" element={<PrivateRoute component={AdminDashboard} />} />
          <Route path="/dashboard/researcher" element={<PrivateRoute component={ResearcherDashboard} />} />
          <Route path="/dashboard/testengineer" element={<PrivateRoute component={TestEngineerDashboard} />} />
          <Route path="/log-results/:testId" element={<PrivateRoute component={LogResultsPage} />} />
          <Route path="/dashboard/analysis" element={<PrivateRoute component={AnalysisDashboard} />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </div>
  </Router>
);

export default App;

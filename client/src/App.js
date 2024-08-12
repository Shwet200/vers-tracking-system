import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import ResearcherDashboard from './pages/ResearcherDashboard';
import TestEngineerDashboard from './pages/TestEngineerDashboard';
import AnalysisDashboard from './pages/AnalysisDashboard';
import PrivateRoute from './components/PrivateRoute';
import LogResultsGrid from './pages/LogResultsGrid';
import Navbar from './components/Navbar';
import DataReviewDashboard from './pages/DataReviewDashboard';
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
          <Route path="/log-results" element={<PrivateRoute component={LogResultsGrid} />} />
          <Route path="/dashboard/analysis" element={<PrivateRoute component={AnalysisDashboard} />} />
          <Route path="/data-review" element={<PrivateRoute component={DataReviewDashboard} />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </div>
  </Router>
);

export default App;
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Trang chủ redirect về login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Trang đăng nhập */}
        <Route path="/login" element={<Login />} />

        {/* Trang dashboard (tạm thời) */}
        <Route path="/admin/dashboard" element={<h1>Admin Dashboard</h1>} />
        <Route path="/teacher/dashboard" element={<h1>Teacher Dashboard</h1>} />
        <Route path="/student/dashboard" element={<h1>Student Dashboard</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
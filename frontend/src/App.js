// ============================================
// FILE: App.js
// MỤC ĐÍCH: Component gốc với Routing
// ============================================

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Import các pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import RoleList from './pages/Roles/RoleList';

import StudentList from './pages/Students/StudentList';
import UserList from './pages/Users/UserList';
import UserEdit from './pages/Users/UserEdit';
import UserCreate from './pages/Users/UserCreate';
// Import service để check auth
import { isAuthenticated } from './services/authService';

import './App.css';

// ============================================
// PROTECTED ROUTE COMPONENT
// ============================================
function ProtectedRoute({ children }) {
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }
    return children;
}

// ============================================
// PUBLIC ROUTE COMPONENT
// ============================================
function PublicRoute({ children }) {
    if (isAuthenticated()) {
        return <Navigate to="/dashboard" replace />;
    }
    return children;
}

// ============================================
// MAIN APP COMPONENT
// ============================================
function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <Routes>
                    {/* Route mặc định */}
                    <Route
                        path="/"
                        element={<Navigate to="/dashboard" replace />}
                    />

                    {/* Trang Login - Public */}
                    <Route
                        path="/login"
                        element={
                            <PublicRoute>
                                <Login />
                            </PublicRoute>
                        }
                    />

                    {/* Trang Dashboard - Protected */}
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />

                    {/* Trang Students */}
                    <Route
                        path="/students"
                        element={
                            <ProtectedRoute>
                                <StudentList />
                            </ProtectedRoute>
                        }
                    />

                    {/* Trang Users */}
                    <Route
                        path="/users"
                        element={
                            <ProtectedRoute>
                                <UserList />
                            </ProtectedRoute>
                        }
                    />
                    //Tạo user
                    <Route
                        path="/users/create"
                        element={
                            <ProtectedRoute>
                                <UserCreate />
                            </ProtectedRoute>
                        }
                    />
                    //Sửa user
                    <Route
                        path="/users/edit/:id"
                        element={
                            <ProtectedRoute>
                                <UserEdit />
                            </ProtectedRoute>
                        }
                    />
                    //Trang roles
                    <Route
                        path="/roles"
                        element={
                            <ProtectedRoute>
                                <RoleList />
                            </ProtectedRoute>
                        }
                    />
                    {/* Trang Profile */}
                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />

                    {/* 404 - Không tìm thấy trang */}
                    <Route
                        path="*"
                        element={
                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: '100vh',
                                flexDirection: 'column'
                            }}>
                                <h1>404</h1>
                                <p>Không tìm thấy trang</p>
                                <a href="/dashboard">Về trang chủ</a>
                            </div>
                        }
                    />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
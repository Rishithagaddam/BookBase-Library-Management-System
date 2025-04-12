import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword'; // Import ResetPassword component
import FacultyDashboard from './components/FacultyDashboard';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} /> {/* Home Page */}
                <Route path="/login" element={<LoginPage />} /> {/* Login Page */}
                <Route path="/signup" element={<SignupPage />} /> {/* Signup Page */}
                <Route path="/forgot-password" element={<ForgotPassword />} /> {/* Forgot Password Page */}
                <Route path="/reset-password/:token" element={<ResetPassword />} /> {/* Reset Password Page */}
                <Route path="/faculty/dashboard" element={<FacultyDashboard />} /> {/* Faculty Dashboard */}
            </Routes>
        </Router>
    );
};

export default App;
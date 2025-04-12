import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const SignupPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        facultyId: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        if (name === 'password') {
            evaluatePasswordStrength(value);
        }
    };

    const evaluatePasswordStrength = (password) => {
        if (password.length < 6) {
            setPasswordStrength('Weak');
        } else if (password.match(/[A-Z]/) && password.match(/[0-9]/)) {
            setPasswordStrength('Strong');
        } else {
            setPasswordStrength('Medium');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/auth/signup', {
                facultyId: formData.facultyId,
                email: formData.email,
                password: formData.password
            });

            if (response.data.message === 'Registration successful') {
                navigate('/login');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-blue-300">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm transform transition-all duration-500 hover:scale-105">
                <h2 className="text-xl font-bold text-center text-blue-600 mb-4">Sign Up</h2>
                {error && <div className="bg-red-100 text-red-600 p-2 rounded mb-3">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="block text-gray-700 font-medium mb-1">Faculty ID</label>
                        <input
                            type="text"
                            name="facultyId"
                            value={formData.facultyId}
                            onChange={handleChange}
                            placeholder="Enter your Faculty ID"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="block text-gray-700 font-medium mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your Email"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                    </div>
                    <div className="mb-3 relative">
                        <label className="block text-gray-700 font-medium mb-1">Password</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your Password"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 text-gray-500"
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                        {passwordStrength && (
                            <p
                                className={`mt-1 text-sm ${
                                    passwordStrength === 'Weak'
                                        ? 'text-red-500'
                                        : passwordStrength === 'Medium'
                                        ? 'text-yellow-500'
                                        : 'text-green-500'
                                }`}
                            >
                                Password Strength: {passwordStrength}
                            </p>
                        )}
                    </div>
                    <div className="mb-3 relative">
                        <label className="block text-gray-700 font-medium mb-1">Confirm Password</label>
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm your Password"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-3 text-gray-500"
                        >
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                    >
                        Sign Up
                    </button>
                </form>
                <p className="text-center text-gray-600 mt-3">
                    Already have an account?{' '}
                    <a href="/login" className="text-blue-600 hover:underline">
                        Login
                    </a>
                </p>
            </div>
        </div>
    );
};

export default SignupPage;
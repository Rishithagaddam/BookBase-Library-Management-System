import React, { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';

const AdminProfile = () => {
    const [profileData, setProfileData] = useState({
        username: '',
        adminId: '',
        email: '',
        mobile: '',
    });
    const [showPasswordChange, setShowPasswordChange] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [passwordError, setPasswordError] = useState('');
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        const fetchProfileData = async () => {
            const user = JSON.parse(localStorage.getItem('user'));
            if (user) {
                try {
                    const response = await axios.get(`${import.meta.env.VITE_BACKEND_API_URL}/api/auth/profile/${user.adminId}`);
                    setProfileData(response.data);
                } catch (error) {
                    console.error('Error fetching profile data:', error.message);
                }
            }
        };
        fetchProfileData();
    }, []);

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData({ ...passwordData, [name]: value });
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const showSuccessToast = () => {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setPasswordError('');

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordError('New passwords do not match');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setPasswordError('New password must be at least 6 characters long');
            return;
        }

        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const response = await axios.put(`${import.meta.env.VITE_BACKEND_API_URL}/api/auth/change-password/${user.adminId}`, {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });

            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            setShowPasswordChange(false);
            setShowPasswords({
                current: false,
                new: false,
                confirm: false
            });
            showSuccessToast();
        } catch (error) {
            setPasswordError(error.response?.data?.message || 'Failed to update password');
        }
    };

    return (
        <div className="p-6">
            {/* Toast Notification */}
            {showToast && (
                <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300">
                    <div className="flex items-center">
                        <span className="mr-2">✓</span>
                        Password updated successfully!
                    </div>
                </div>
            )}

            <h1 className="text-3xl font-bold mb-6">Admin Profile</h1>
            
            <div className="bg-white shadow-md rounded-lg p-6">
                <div className="space-y-4">
                    <p><strong>Username:</strong> {profileData.username}</p>
                    <p><strong>Admin ID:</strong> {profileData.adminId}</p>
                    <p><strong>Email:</strong> {profileData.email}</p>
                    <p><strong>Mobile:</strong> {profileData.mobile || 'N/A'}</p>
                </div>
                
                <div className="mt-6">
                    <button
                        onClick={() => setShowPasswordChange(true)}
                        className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition duration-300"
                    >
                        Change Password
                    </button>
                </div>
            </div>

            {/* Password Change Modal */}
            {showPasswordChange && (
                <div className="fixed inset-0 backdrop-filter backdrop-blur-md flex items-center justify-center z-50" style={{backgroundColor: 'rgba(239, 218, 215, 0.4)'}}>
                    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                        <h3 className="text-lg font-semibold mb-4">Change Password</h3>
                        
                        {passwordError && (
                            <div className="bg-red-100 text-red-600 p-3 rounded mb-4">
                                {passwordError}
                            </div>
                        )}

                        <form onSubmit={handlePasswordSubmit} className="space-y-4">
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Current Password</label>
                                <div className="relative">
                                    <input
                                        type={showPasswords.current ? 'text' : 'password'}
                                        name="currentPassword"
                                        value={passwordData.currentPassword}
                                        onChange={handlePasswordChange}
                                        className="w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => togglePasswordVisibility('current')}
                                        className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                                    >
                                        {showPasswords.current ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">New Password</label>
                                <div className="relative">
                                    <input
                                        type={showPasswords.new ? 'text' : 'password'}
                                        name="newPassword"
                                        value={passwordData.newPassword}
                                        onChange={handlePasswordChange}
                                        className="w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => togglePasswordVisibility('new')}
                                        className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                                    >
                                        {showPasswords.new ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Confirm New Password</label>
                                <div className="relative">
                                    <input
                                        type={showPasswords.confirm ? 'text' : 'password'}
                                        name="confirmPassword"
                                        value={passwordData.confirmPassword}
                                        onChange={handlePasswordChange}
                                        className="w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => togglePasswordVisibility('confirm')}
                                        className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                                    >
                                        {showPasswords.confirm ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                            </div>
                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowPasswordChange(false);
                                        setPasswordData({
                                            currentPassword: '',
                                            newPassword: '',
                                            confirmPassword: ''
                                        });
                                        setPasswordError('');
                                        setShowPasswords({
                                            current: false,
                                            new: false,
                                            confirm: false
                                        });
                                    }}
                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                                >
                                    Update Password
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProfile;
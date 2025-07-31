import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminProfile = () => {
    const [profileData, setProfileData] = useState({
        username: '',
        adminId: '',
        email: '',
        mobile: '',
    });

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

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Admin Profile</h1>
            <div className="bg-white shadow-md rounded-lg p-6">
                <div className="space-y-4">
                    <p><strong>Username:</strong> {profileData.username}</p>
                    <p><strong>Admin ID:</strong> {profileData.adminId}</p>
                    <p><strong>Email:</strong> {profileData.email}</p>
                    <p><strong>Mobile:</strong> {profileData.mobile || 'N/A'}</p>
                </div>
            </div>
        </div>
    );
};

export default AdminProfile;
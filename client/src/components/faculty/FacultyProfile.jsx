import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FacultyProfile = () => {
    const [profileData, setProfileData] = useState({
        username: '',
        facultyId: '',
        email: '',
        mobile: '',
        profileImage: '',
    });

    useEffect(() => {
        const fetchProfileData = async () => {
            const user = JSON.parse(localStorage.getItem('user'));
            if (user) {
                try {
                    const response = await axios.get(`http://:5000/api/auth/profile/${user.facultyId}`);
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
            <h1 className="text-3xl font-bold mb-6">Faculty Profile</h1>
            <div className="bg-white shadow-md rounded-lg p-6">
                <div className="flex items-center mb-6">
                    {profileData.profileImage ? (
                        <img
                            src={`${import.meta.env.VITE_BACKEND_API_URL}/${profileData.profileImage}`}
                            alt="Profile"
                            className="w-24 h-24 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500 text-2xl">👤</span>
                        </div>
                    )}
                </div>
                <div className="space-y-4">
                    <p><strong>Username:</strong> {profileData.username}</p>
                    <p><strong>Faculty ID:</strong> {profileData.facultyId}</p>
                    <p><strong>Email:</strong> {profileData.email}</p>
                    <p><strong>Mobile:</strong> {profileData.mobile || 'N/A'}</p>
                </div>
            </div>
        </div>
    );
};

export default FacultyProfile;
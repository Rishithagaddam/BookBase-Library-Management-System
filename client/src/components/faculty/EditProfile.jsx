import React, { useState, useEffect } from 'react';
import Header from '../Header';
import { FaUserCircle, FaCamera } from 'react-icons/fa';

const EditProfile = () => {
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [formData, setFormData] = useState({
        username: '',
        facultyId: '',
        email: '',
        phone: '',
    });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        // Fetch user details from localStorage
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            setFormData({
                username: user.facultyId,
                facultyId: user.facultyId,
                email: user.email,
                phone: '',
            });
        }
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePhoto(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add logic to update the profile in the database
        console.log('Updated Profile:', formData);
        setIsEditing(false);
    };

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
            {/* Header */}
            <Header isSidebarOpen={false} setIsSidebarOpen={() => {}} />

            {/* Main Content */}
            <div className="flex justify-center items-center flex-1 p-6">
                <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-2xl border border-gray-100">
                    <h1 className="text-3xl font-bold mb-6 text-indigo-800 flex items-center">
                        <span className="mr-2">✨</span> 
                         Faculty Profile
                        <span className="ml-2">✨</span>
                    </h1>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Profile Photo */}
                        <div className="flex flex-col items-center mb-8">
                            <div className="relative group">
                                <div className={`w-32 h-32 rounded-full overflow-hidden border-4 ${isEditing ? 'border-indigo-500' : 'border-gray-200'} shadow-md transition-all duration-300`}>
                                    {profilePhoto ? (
                                        <img
                                            src={profilePhoto}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                            <FaUserCircle className="w-24 h-24 text-gray-400" />
                                        </div>
                                    )}
                                </div>
                                
                                {isEditing && (
                                    <label className="absolute bottom-0 right-0 cursor-pointer bg-indigo-600 text-white p-2 rounded-full shadow-lg hover:bg-indigo-700 transition-all duration-300">
                                        <FaCamera className="w-5 h-5" />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handlePhotoUpload}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                            </div>
                            
                            {isEditing && (
                                <p className="text-sm text-gray-500 mt-2">Click the camera icon to update your photo</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Username */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    className={`w-full border rounded-lg px-4 py-3 focus:outline-none ${
                                        isEditing 
                                            ? 'border-indigo-300 focus:ring-2 focus:ring-indigo-500 bg-white' 
                                            : 'border-gray-200 bg-gray-50 text-gray-700'
                                    }`}
                                    disabled={!isEditing}
                                    required
                                />
                            </div>

                            {/* Faculty ID */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Faculty ID</label>
                                <input
                                    type="text"
                                    name="facultyId"
                                    value={formData.facultyId}
                                    className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-gray-50 text-gray-700"
                                    disabled
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-gray-50 text-gray-700"
                                    disabled
                                    required
                                />
                            </div>

                            {/* Phone Number */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder="+1 (123) 456-7890"
                                    className={`w-full border rounded-lg px-4 py-3 focus:outline-none ${
                                        isEditing 
                                            ? 'border-indigo-300 focus:ring-2 focus:ring-indigo-500 bg-white' 
                                            : 'border-gray-200 bg-gray-50 text-gray-700'
                                    }`}
                                    disabled={!isEditing}
                                />
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="pt-4 border-t border-gray-100 flex justify-end space-x-4 mt-8">
                            {!isEditing ? (
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(true)}
                                    className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-md transition-all duration-300 font-medium"
                                >
                                    Edit Profile
                                </button>
                            ) : (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all duration-300 font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 shadow-md transition-all duration-300 font-medium"
                                    >
                                        Save Changes
                                    </button>
                                </>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditProfile;
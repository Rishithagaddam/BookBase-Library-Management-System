import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEllipsisV } from 'react-icons/fa';

const Header = ({ isSidebarOpen, setIsSidebarOpen }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold">Faculty Dashboard</h1>
            <div className="flex items-center space-x-4">
                <button
                    onClick={() => navigate('/faculty/edit-profile')}
                    className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-700"
                >
                    👤 Edit Profile
                </button>
                <button
                    onClick={handleLogout}
                    className="bg-red-500 px-4 py-2 rounded hover:bg-red-700"
                >
                    🚪 Logout
                </button>
                {!isSidebarOpen && (
                    <button
                        onClick={() => setIsSidebarOpen(true)} // Open the sidebar
                        className="p-2 bg-blue-500 rounded-full hover:bg-blue-700 focus:outline-none"
                    >
                        <FaEllipsisV className="text-white" />
                    </button>
                )}
            </div>
        </header>
    );
};

export default Header;
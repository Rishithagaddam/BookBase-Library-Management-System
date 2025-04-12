import React from 'react';
import { AiOutlineClose } from 'react-icons/ai'; // Import the close icon

const Sidebar = ({ features, activeFeature, setActiveFeature, handleLogout, setIsSidebarOpen }) => {
    return (
        <div className="w-64 bg-gray-800 text-white p-6 relative min-h-screen shadow-lg">
            {/* Close Button with Red Box and Animation */}
            <button
                className="absolute top-4 right-4 bg-red-600 text-white p-2 rounded flex items-center justify-center 
                hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 
                transition-all duration-300 transform hover:scale-110 active:scale-95"
                onClick={() => setIsSidebarOpen(false)}
                aria-label="Close sidebar"
            >
                <AiOutlineClose className="text-white text-xl" /> {/* React icon */}
            </button>
            
            <ul className="space-y-4 mt-8">
                {features.map((feature) => (
                    <li
                        key={feature.name}
                        className={`cursor-pointer p-3 rounded-lg text-lg font-medium transition-all duration-300 transform ${
                            activeFeature === feature.name 
                                ? 'bg-blue-600 shadow-md scale-105' 
                                : 'hover:bg-gray-700 hover:scale-105'
                        }`}
                        onClick={() => {
                            if (feature.name === '🚪 Logout') {
                                handleLogout && handleLogout();
                            } else {
                                setActiveFeature(feature.name);
                            }
                        }}
                    >
                        {feature.name}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;
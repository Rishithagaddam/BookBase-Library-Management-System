import React, { useState } from 'react';

const Sidebar = ({ features, activeFeature, setActiveFeature, handleLogout }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const handleCloseSidebar = () => {
        setIsSidebarOpen(false); // Close the sidebar
    };

    const handleOpenSidebar = () => {
        setIsSidebarOpen(true); // Open the sidebar
    };

    return (
        <>
            {/* Sidebar Toggle Button (Visible when sidebar is closed) */}
            {!isSidebarOpen && (
                <button
                    className="fixed top-4 left-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    onClick={handleOpenSidebar}
                >
                    ☰
                </button>
            )}

            {/* Sidebar */}
            {isSidebarOpen && (
                <div className="w-1/4 bg-gray-800 text-white p-6 relative min-h-screen">
                    {/* Close Button */}
                    <button
                        className="absolute top-4 right-4 text-white text-xl font-bold hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
                        onClick={handleCloseSidebar}
                    >
                        ✖
                    </button>

                    <h2 className="text-2xl font-bold mb-8 text-center">Faculty Dashboard</h2>
                    <ul className="space-y-4">
                        {features.map((feature) => (
                            <li
                                key={feature.name}
                                className={`cursor-pointer p-3 rounded-lg text-lg font-medium ${
                                    activeFeature === feature.name ? 'bg-gray-700' : 'hover:bg-gray-700'
                                }`}
                                onClick={() => {
                                    if (feature.name === '🚪 Logout') {
                                        handleLogout();
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
            )}
        </>
    );
};

export default Sidebar;
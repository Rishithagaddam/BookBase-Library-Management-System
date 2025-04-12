import React from 'react';

const Dashboard = () => {
    return (
        <div>
            <h1 className="text-4xl font-bold mb-6 text-gray-800">🏠 Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
                    <div className="space-y-2">
                        <p>Total Books: 500</p>
                        <p>Active Faculty: 50</p>
                        <p>Books Issued: 100</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                    <div className="space-y-2">
                        <p>New Faculty Registration: 2</p>
                        <p>Books Added Today: 5</p>
                        <p>Pending Returns: 15</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">System Status</h2>
                    <div className="space-y-2">
                        <p>System: Online</p>
                        <p>Last Backup: 2 hours ago</p>
                        <p>Server Load: Normal</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
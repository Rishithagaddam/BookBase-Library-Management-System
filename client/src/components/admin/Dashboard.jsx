import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalBooks: 0,
        totalFaculty: 0,
        issuedBooks: 0,
        availableBooks: 0,
        pendingFeedbacks: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
        const interval = setInterval(fetchStats, 30000); // Refresh every 30 seconds
        return () => clearInterval(interval);
    }, []);

    const fetchStats = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/admin/dashboard/stats');
            setStats(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            setLoading(false);
        }
    };

    if (loading) {
        return <div>Loading dashboard...</div>;
    }

    return (
        <div>
            <h1 className="text-4xl font-bold mb-6 text-gray-800">🏠 Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Book Statistics</h2>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span>Total Books:</span>
                            <span className="font-semibold">{stats.totalBooks}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Available:</span>
                            <span className="text-green-600 font-semibold">{stats.availableBooks}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Issued:</span>
                            <span className="text-blue-600 font-semibold">{stats.issuedBooks}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Faculty & Feedback</h2>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span>Total Faculty:</span>
                            <span className="font-semibold">{stats.totalFaculty}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Pending Feedbacks:</span>
                            <span className="text-yellow-600 font-semibold">{stats.pendingFeedbacks}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">System Status</h2>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span>Status:</span>
                            <span className="text-green-600 font-semibold">Online</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Last Updated:</span>
                            <span className="text-gray-600">{new Date().toLocaleTimeString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
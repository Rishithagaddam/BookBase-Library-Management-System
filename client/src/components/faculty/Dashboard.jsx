import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
    const [userData, setUserData] = useState(null);
    const [libraryInfo, setLibraryInfo] = useState({
        workingHours: null,
        holidays: [],
        issuedBooks: [],
        dueBooks: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            
            const [
                hoursResponse, 
                holidaysResponse, 
                issuedBooksResponse
            ] = await Promise.all([
                axios.get('http://localhost:5000/api/admin/settings/working-hours'),
                axios.get('http://localhost:5000/api/admin/settings/holidays'),
                axios.get(`http://localhost:5000/api/faculty/books/issued/${user.facultyId}`)
            ]);

            setLibraryInfo({
                workingHours: hoursResponse.data,
                holidays: holidaysResponse.data,
                issuedBooks: issuedBooksResponse.data,
                dueBooks: issuedBooksResponse.data.filter(book => 
                    new Date(book.dueDate) < new Date()
                )
            });
            setUserData(user);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setError('Failed to load dashboard information');
            setLoading(false);
        }
    };

    if (loading) return <div>Loading dashboard...</div>;
    if (error) return <div className="text-red-600">{error}</div>;

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-lg shadow-md">
                <h1 className="text-3xl font-bold mb-2">
                    Welcome back, {userData?.facultyName}! 👋
                </h1>
                <p>Faculty ID: {userData?.facultyId}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Quick Stats */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">📚 Your Library Status</h2>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span>Books Issued:</span>
                            <span className="font-bold text-blue-600">
                                {libraryInfo.issuedBooks.length}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span>Books Overdue:</span>
                            <span className="font-bold text-red-600">
                                {libraryInfo.dueBooks.length}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Library Hours */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">🕒 Library Hours</h2>
                    {libraryInfo.workingHours && (
                        <div className="text-center">
                            <p className="text-gray-600">Open from</p>
                            <p className="text-2xl font-bold text-blue-600">
                                {libraryInfo.workingHours.start} - {libraryInfo.workingHours.end}
                            </p>
                        </div>
                    )}
                </div>

                {/* Due Books Alert */}
                {libraryInfo.dueBooks.length > 0 && (
                    <div className="bg-red-50 p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4 text-red-800">
                            ⚠️ Overdue Books
                        </h2>
                        <div className="space-y-2">
                            {libraryInfo.dueBooks.map(book => (
                                <div key={book._id} className="flex justify-between items-center">
                                    <span>{book.title}</span>
                                    <span className="text-red-600">
                                        Due: {new Date(book.dueDate).toLocaleDateString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Upcoming Holidays */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">📅 Upcoming Holidays</h2>
                    <div className="space-y-2">
                        {libraryInfo.holidays
                            .filter(holiday => new Date(holiday.date) >= new Date())
                            .slice(0, 3)
                            .map(holiday => (
                                <div 
                                    key={holiday._id} 
                                    className="flex justify-between items-center p-2 bg-gray-50 rounded"
                                >
                                    <span className="font-medium">{holiday.description}</span>
                                    <span className="text-sm text-gray-600">
                                        {new Date(holiday.date).toLocaleDateString()}
                                    </span>
                                </div>
                            ))}
                    </div>
                </div>
            </div>

            {/* Library Rules */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">📋 Quick Reminders</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Maximum 5 books can be issued at a time</li>
                    <li>Return period is 14 days from issue date</li>
                    <li>Renewals must be done before due date</li>
                    <li>Library hours are subject to change during holidays</li>
                </ul>
            </div>
        </div>
    );
};

export default Dashboard;
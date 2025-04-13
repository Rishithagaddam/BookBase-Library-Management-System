import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
    const [issuedBooks, setIssuedBooks] = useState([]);
    const [dueBooks, setDueBooks] = useState([]);
    const [newBooks, setNewBooks] = useState([]);

    useEffect(() => {
        fetchIssuedBooks();
        fetchDueBooks();
        fetchNewBooks();
    }, []);

    const fetchIssuedBooks = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/faculty/dashboard');
            setIssuedBooks(response.data.currentlyIssuedBooks || []);
        } catch (error) {
            console.error('Error fetching issued books:', error);
        }
    };

    const fetchDueBooks = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/faculty/books/due');
            setDueBooks(response.data || []);
        } catch (error) {
            console.error('Error fetching due books:', error);
        }
    };

    const fetchNewBooks = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/admin/books/new');
            setNewBooks(response.data || []);
        } catch (error) {
            console.error('Error fetching new books:', error);
        }
    };

    const getBadgeClass = (daysLeft) => {
        if (daysLeft <= 2) return 'bg-red-100 text-red-800';
        if (daysLeft <= 5) return 'bg-yellow-100 text-yellow-800';
        return 'bg-green-100 text-green-800';
    };

    return (
        <div>
            <h1 className="text-4xl font-bold mb-6 text-gray-800">🏠 Faculty Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Live Reminders Section */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Live Reminders</h2>
                    <ul>
                        {issuedBooks.map((book, index) => {
                            const daysLeft = Math.ceil(
                                (new Date(book.dueDate) - new Date()) / (1000 * 60 * 60 * 24)
                            );
                            return (
                                <li
                                    key={index}
                                    className={`p-2 rounded mb-2 ${getBadgeClass(daysLeft)}`}
                                >
                                    {book.title} - {daysLeft} days left
                                </li>
                            );
                        })}
                    </ul>
                </div>

                {/* Upcoming Due Books Carousel */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Upcoming Due Books</h2>
                    <div className="flex gap-4 overflow-x-auto">
                        {dueBooks.map((book, index) => (
                            <div
                                key={index}
                                className="flex-shrink-0 w-40 p-4 bg-gray-100 rounded-lg shadow hover:shadow-lg transition-shadow"
                            >
                                <img
                                    src={book.thumbnail}
                                    alt={book.title}
                                    className="w-full h-24 object-cover rounded"
                                />
                                <h3 className="text-sm font-semibold mt-2">{book.title}</h3>
                                <p className="text-xs text-gray-600">Due: {book.dueDate}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Newly Added Books Section */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Newly Added Books</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {newBooks.map((book, index) => (
                            <div
                                key={index}
                                className="p-4 bg-gray-100 rounded-lg shadow hover:shadow-lg transition-shadow"
                            >
                                <img
                                    src={book.thumbnail}
                                    alt={book.title}
                                    className="w-full h-24 object-cover rounded"
                                />
                                <h3 className="text-sm font-semibold mt-2">{book.title}</h3>
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                    New
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
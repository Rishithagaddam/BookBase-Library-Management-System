import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MyIssuedBooks = () => {
    const [issuedBooks, setIssuedBooks] = useState([]);
    const [totalIssuedBooks, setTotalIssuedBooks] = useState(0);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchIssuedBooks = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                const facultyId = user?.facultyId;

                if (!facultyId) {
                    setError('Invalid user data: facultyId is missing');
                    return;
                }

                // Changed: Use query parameters instead of request body for GET request
                const response = await axios.get(`http://localhost:5000/api/faculty/dashboard/${user.facultyId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.data) {
                    setIssuedBooks(response.data.currentlyIssuedBooks || []);
                    setTotalIssuedBooks(response.data.totalBooksIssued || 0);
                }
            } catch (error) {
                console.error('Error fetching issued books:', error);
                setError('Failed to fetch issued books.');
            }
        };

        fetchIssuedBooks();
    }, []);

    const handleReturnBook = async (bookId) => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            
            const response = await axios.put(
                `http://localhost:5000/api/faculty/books/return/${bookId}`,
                {
                    facultyId: user.facultyId
                }
            );

            if (response.status === 200) {
                alert(response.data.message);
                // Remove the returned book from the list
                setIssuedBooks((prevBooks) =>
                    prevBooks.filter((book) => book._id !== bookId)
                );
                setTotalIssuedBooks((prevCount) => prevCount - 1);
            }
        } catch (error) {
            console.error('Error returning book:', error.response?.data?.message || error.message);
            alert('Failed to return the book.');
        }
    };

    const calculateDaysSinceIssued = (issuedDate) => {
        const issued = new Date(issuedDate);
        const today = new Date();
        const differenceInTime = today - issued;
        return Math.floor(differenceInTime / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
    };

    return (
        <div className="p-6">
            <h1 className="text-4xl font-bold mb-6 text-gray-800">📄 My Issued Books</h1>

            {/* Error Message */}
            {error && (
                <div className="bg-red-100 text-red-600 p-4 rounded mb-6">
                    {error}
                </div>
            )}

            {/* Total Issued Books */}
            <div className="mb-6">
                <p className="text-lg font-medium text-gray-700">
                    Total Issued Books: <span className="text-blue-600 font-bold">{totalIssuedBooks}</span>
                </p>
            </div>

            {/* Issued Books Table */}
            <div className="overflow-x-auto">
                <table className="table-auto w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border border-gray-300 px-4 py-2">Book ID</th>
                            <th className="border border-gray-300 px-4 py-2">Title</th>
                            <th className="border border-gray-300 px-4 py-2">Author</th>
                            <th className="border border-gray-300 px-4 py-2">Category</th>
                            <th className="border border-gray-300 px-4 py-2">Issued Date</th>
                            <th className="border border-gray-300 px-4 py-2">Days Since Issued</th>
                            <th className="border border-gray-300 px-4 py-2">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {issuedBooks.map((book, index) => {
                            const daysSinceIssued = calculateDaysSinceIssued(book.issuedDate);
                            return (
                                <tr
                                    key={book.bookId}
                                    className={`${
                                        index % 2 === 0 ? 'bg-white' : 'bg-gray-100'
                                    } hover:bg-gray-200`}
                                >
                                    <td className="border border-gray-300 px-4 py-2">{book.bookId}</td>
                                    <td className="border border-gray-300 px-4 py-2">{book.title}</td>
                                    <td className="border border-gray-300 px-4 py-2">{book.author}</td>
                                    <td className="border border-gray-300 px-4 py-2">{book.category}</td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {new Date(book.issuedDate).toLocaleDateString()}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">{daysSinceIssued} days</td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        <button
                                            onClick={() => handleReturnBook(book._id)} // Changed from book.bookId to book._id
                                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                        >
                                            Return
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MyIssuedBooks;
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BookWishlist = () => {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        category: 'Subject',
        reason: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_API_URL}/api/faculty/wishlist?facultyId=${user.facultyId}`);
            setWishlistItems(response.data);
        } catch (error) {
            console.error('Error fetching wishlist:', error);
            setError('Failed to fetch wishlist');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_API_URL}/api/faculty/wishlist`, {
                ...formData,
                facultyId: user.facultyId
            });

            setSuccess('Book suggestion submitted successfully!');
            setFormData({ title: '', author: '', category: 'Subject', reason: '' });
            fetchWishlist(); // Refresh the list
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to submit book suggestion');
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-4xl font-bold mb-6 text-gray-800">📚 Book Wishlist</h1>

            {/* Suggestion Form */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-2xl font-semibold mb-4">Suggest a Book</h2>
                {error && <div className="bg-red-100 text-red-600 p-3 rounded mb-4">{error}</div>}
                {success && <div className="bg-green-100 text-green-600 p-3 rounded mb-4">{success}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 mb-2">Book Title *</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-2">Author</label>
                        <input
                            type="text"
                            value={formData.author}
                            onChange={(e) => setFormData({...formData, author: e.target.value})}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-2">Category</label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="Subject">Subject</option>
                            <option value="Research">Research</option>
                            <option value="General">General</option>
                            <option value="Magazine">Magazine</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-2">Reason for Recommendation</label>
                        <textarea
                            value={formData.reason}
                            onChange={(e) => setFormData({...formData, reason: e.target.value})}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            rows="4"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Submit Suggestion
                    </button>
                </form>
            </div>

            {/* Previous Suggestions */}
            <div>
                <h2 className="text-2xl font-semibold mb-4">Previous Suggestions</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {wishlistItems.map((item) => (
                        <div key={item._id} className="bg-white p-4 rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold">{item.title}</h3>
                            {item.author && <p className="text-sm text-gray-600">By: {item.author}</p>}
                            <p className="text-sm text-gray-600 mt-1">Category: {item.category}</p>
                            <p className="mt-2 text-sm">{item.reason}</p>
                            <p className="text-sm text-gray-500 mt-2">
                                Suggested on: {new Date(item.createdAt).toLocaleDateString()}
                            </p>
                            <div className={`mt-2 inline-block px-2 py-1 rounded text-sm ${
                                item.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                item.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                            }`}>
                                {item.status || 'Pending'}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BookWishlist;
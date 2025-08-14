import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BookInventory = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [newBook, setNewBook] = useState({
        bookId: '',
        title: '',
        author: '',
        category: '',
        publisher: '',
        status: 'available',
        placeLocated: ''
    });
    const [editingBook, setEditingBook] = useState(null);
    const [searchId, setSearchId] = useState('');
    const [searchResults, setSearchResults] = useState(null);
    const [showIssueModal, setShowIssueModal] = useState(false);
    const [showReturnModal, setShowReturnModal] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [facultyId, setFacultyId] = useState('');

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_API_URL}/api/admin/books`);
            setBooks(response.data);
            setLoading(false);
        } catch (error) {
            setError('Error fetching books');
            setLoading(false);
        }
    };

    const handleAddBook = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_API_URL}/api/admin/books`, newBook);
            setBooks([...books, response.data]);
            setNewBook({
                bookId: '',
                title: '',
                author: '',
                category: '',
                publisher: '',
                status: 'available',
                placeLocated: ''
            });
        } catch (error) {
            setError('Error adding book');
        }
    };

    const handleUpdateBook = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_API_URL}/api/admin/books/${editingBook._id}`, 
                editingBook
            );

            // Update the books list with the updated book
            setBooks(books.map(book => 
                book._id === editingBook._id ? response.data : book
            ));

            // Reset the editing state
            setEditingBook(null);
            setSuccess('Book updated successfully');
            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            console.error('Error updating book:', error);
            setError(error.response?.data?.message || 'Error updating book');
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleRemoveBook = async (bookId) => {
        if (window.confirm('Are you sure you want to remove this book?')) {
            try {
                await axios.delete(`${import.meta.env.VITE_BACKEND_API_URL}/api/admin/books/${bookId}`);
                setBooks(books.filter(book => book._id !== bookId));
            } catch (error) {
                setError('Error removing book');
            }
        }
    };

    const handleSearch = async () => {
        if (!searchId.trim()) {
            setError('Please enter a book ID');
            return;
        }
    
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_API_URL}/api/admin/books/search?bookId=${searchId}`);
            setSearchResults(response.data);
            setError('');
        } catch (error) {
            setSearchResults(null);
            setError(error.response?.data?.message || 'Book not found');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingBook) {
            handleUpdateBook(e);
        } else {
            handleAddBook(e);
        }
    };

    const handleIssueBook = async () => {
        if (!facultyId.trim()) {
            setError('Please enter a faculty ID');
            return;
        }

        try {
            console.log('Issuing book:', selectedBook._id, 'to faculty:', facultyId); // Debug log
            
            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_API_URL}/api/admin/books/issue/${selectedBook._id}`,
                {
                    facultyId: facultyId,
                    issuedDate: new Date()
                }
            );

            if (response.status === 200) {
                setSuccess(`Book "${selectedBook.title}" issued successfully to Faculty ID: ${facultyId}`);
                
                // Update the books list locally
                setBooks(books.map(book => 
                    book._id === selectedBook._id 
                        ? { ...book, status: 'issued', issuedTo: facultyId, issuedDate: new Date() }
                        : book
                ));

                setShowIssueModal(false);
                setSelectedBook(null);
                setFacultyId('');
                setTimeout(() => setSuccess(''), 5000);
            }
        } catch (error) {
            console.error('Full error object:', error); // Enhanced debug log
            console.error('Error response data:', error.response?.data); // Enhanced debug log
            
            const errorMessage = error.response?.data?.message || 
                           error.response?.data?.error || 
                           'Error issuing book';
            setError(errorMessage);
            setTimeout(() => setError(''), 5000);
        }
    };

    const handleReturnBook = async () => {
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_API_URL}/api/admin/books/return/${selectedBook._id}`
            );

            if (response.status === 200) {
                setSuccess(`Book "${selectedBook.title}" returned successfully`);
                
                // Update the books list locally
                setBooks(books.map(book => 
                    book._id === selectedBook._id 
                        ? { ...book, status: 'available', issuedTo: null, issuedDate: null, returnedDate: new Date() }
                        : book
                ));

                setShowReturnModal(false);
                setSelectedBook(null);
                setTimeout(() => setSuccess(''), 5000);
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Error returning book');
            setTimeout(() => setError(''), 5000);
        }
    };

    const openIssueModal = (book) => {
        setSelectedBook(book);
        setShowIssueModal(true);
    };

    const openReturnModal = (book) => {
        setSelectedBook(book);
        setShowReturnModal(true);
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold mb-6">📚 Book Inventory</h1>

            {error && (
                <div className="bg-red-100 text-red-600 p-3 rounded mb-4">{error}</div>
            )}

            {success && (
                <div className="bg-green-100 text-green-600 p-3 rounded mb-4">{success}</div>
            )}

            {/* Add/Edit Book Form */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">
                    {editingBook ? 'Edit Book' : 'Add New Book'}
                </h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                    <input
                        type="text"
                        placeholder="Book ID"
                        value={editingBook ? editingBook.bookId : newBook.bookId}
                        onChange={(e) => editingBook 
                            ? setEditingBook({...editingBook, bookId: e.target.value})
                            : setNewBook({...newBook, bookId: e.target.value})
                        }
                        className="p-2 border rounded"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Title"
                        value={editingBook ? editingBook.title : newBook.title}
                        onChange={(e) => editingBook
                            ? setEditingBook({...editingBook, title: e.target.value})
                            : setNewBook({...newBook, title: e.target.value})
                        }
                        className="p-2 border rounded"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Author"
                        value={editingBook ? editingBook.author : newBook.author}
                        onChange={(e) => editingBook
                            ? setEditingBook({...editingBook, author: e.target.value})
                            : setNewBook({...newBook, author: e.target.value})
                        }
                        className="p-2 border rounded"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Category"
                        value={editingBook ? editingBook.category : newBook.category}
                        onChange={(e) => editingBook
                            ? setEditingBook({...editingBook, category: e.target.value})
                            : setNewBook({...newBook, category: e.target.value})
                        }
                        className="p-2 border rounded"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Publisher"
                        value={editingBook ? editingBook.publisher : newBook.publisher}
                        onChange={(e) => editingBook
                            ? setEditingBook({...editingBook, publisher: e.target.value})
                            : setNewBook({...newBook, publisher: e.target.value})
                        }
                        className="p-2 border rounded"
                    />
                    <input
                        type="text"
                        placeholder="Location (Shelf, Room)"
                        value={editingBook ? editingBook.placeLocated : newBook.placeLocated}
                        onChange={(e) => editingBook
                            ? setEditingBook({...editingBook, placeLocated: e.target.value})
                            : setNewBook({...newBook, placeLocated: e.target.value})
                        }
                        className="p-2 border rounded"
                    />
                    <div className="col-span-2 flex justify-end gap-4">
                        {editingBook && (
                            <button
                                type="button"
                                onClick={() => setEditingBook(null)}
                                className="bg-gray-500 text-white px-4 py-2 rounded"
                            >
                                Cancel
                            </button>
                        )}
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            {editingBook ? 'Update Book' : 'Add Book'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Search Book by ID */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-xl font-semibold mb-4">Search Book by ID</h2>
                <div className="flex gap-4">
                    <input
                        type="text"
                        placeholder="Enter Book ID"
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                        className="p-2 border rounded flex-1"
                    />
                    <button
                        onClick={handleSearch}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Search
                    </button>
                </div>
                {searchResults && (
                    <div className="mt-4 p-4 bg-gray-50 rounded">
                        <h3 className="font-semibold">{searchResults.title}</h3>
                        <p>ID: {searchResults.bookId}</p>
                        <p>Author: {searchResults.author}</p>
                        <p>Status: {searchResults.status}</p>
                    </div>
                )}
            </div>

            {/* Books List */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Book List</h2>
                {loading ? (
                    <p>Loading books...</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2">Book ID</th>
                                    <th className="px-4 py-2">Title</th>
                                    <th className="px-4 py-2">Author</th>
                                    <th className="px-4 py-2">Category</th>
                                    <th className="px-4 py-2">Status</th>
                                    <th className="px-4 py-2">Location</th>
                                    <th className="px-4 py-2">Issued To</th>
                                    <th className="px-4 py-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {books.map((book) => (
                                    <tr key={book._id} className="border-t">
                                        <td className="px-4 py-2">{book.bookId}</td>
                                        <td className="px-4 py-2">{book.title}</td>
                                        <td className="px-4 py-2">{book.author}</td>
                                        <td className="px-4 py-2">{book.category}</td>
                                        <td className="px-4 py-2">
                                            <span className={`px-2 py-1 rounded ${
                                                book.status === 'available' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {book.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2">{book.placeLocated}</td>
                                        <td className="px-4 py-2">{book.issuedTo || 'N/A'}</td>
                                        <td className="px-4 py-2">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setEditingBook(book)}
                                                    className="text-blue-600 hover:text-blue-800 px-2 py-1 text-sm"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleRemoveBook(book._id)}
                                                    className="text-red-600 hover:text-red-800 px-2 py-1 text-sm"
                                                >
                                                    Remove
                                                </button>
                                                {book.status === 'available' ? (
                                                    <button
                                                        onClick={() => openIssueModal(book)}
                                                        className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-sm"
                                                    >
                                                        Issue
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => openReturnModal(book)}
                                                        className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-sm"
                                                    >
                                                        Return
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Issue Book Modal */}
            {showIssueModal && selectedBook && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-bold mb-4">Issue Book</h2>
                        <p className="mb-4">Book: <strong>{selectedBook.title}</strong></p>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Faculty ID:</label>
                            <input
                                type="text"
                                value={facultyId}
                                onChange={(e) => setFacultyId(e.target.value)}
                                placeholder="Enter Faculty ID"
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => {
                                    setShowIssueModal(false);
                                    setSelectedBook(null);
                                    setFacultyId('');
                                }}
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleIssueBook}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Issue Book
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Return Book Modal */}
            {showReturnModal && selectedBook && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-bold mb-4">Return Book</h2>
                        <p className="mb-4">Book: <strong>{selectedBook.title}</strong></p>
                        <p className="mb-4">Issued To: <strong>{selectedBook.issuedTo}</strong></p>
                        <p className="mb-4">Are you sure you want to return this book?</p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => {
                                    setShowReturnModal(false);
                                    setSelectedBook(null);
                                }}
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReturnBook}
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                            >
                                Return Book
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookInventory;
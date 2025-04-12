import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BookInventory = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newBook, setNewBook] = useState({
        bookId: '',
        title: '',
        author: '',
        category: '',
        publisher: '',
        placeLocated: ''
    });
    const [editingBook, setEditingBook] = useState(null);

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/admin/books');
            setBooks(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching books:', error);
        }
    };

    const handleAddBook = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/admin/books', newBook);
            setBooks([...books, response.data]);
            setNewBook({
                bookId: '',
                title: '',
                author: '',
                category: '',
                publisher: '',
                placeLocated: ''
            });
        } catch (error) {
            console.error('Error adding book:', error);
        }
    };

    const handleUpdateBook = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/api/admin/books/${editingBook._id}`, editingBook);
            setBooks(books.map(book => 
                book._id === editingBook._id ? editingBook : book
            ));
            setEditingBook(null);
        } catch (error) {
            console.error('Error updating book:', error);
        }
    };

    const handleDeleteBook = async (bookId) => {
        if (window.confirm('Are you sure you want to delete this book?')) {
            try {
                await axios.delete(`http://localhost:5000/api/admin/books/${bookId}`);
                setBooks(books.filter(book => book._id !== bookId));
            } catch (error) {
                console.error('Error deleting book:', error);
            }
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold mb-6">📘 Book Inventory</h1>

            {/* Add/Edit Book Form */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">
                    {editingBook ? 'Edit Book' : 'Add New Book'}
                </h2>
                <form onSubmit={editingBook ? handleUpdateBook : handleAddBook} className="grid grid-cols-2 gap-4">
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
                            className="bg-blue-600 text-white px-4 py-2 rounded"
                        >
                            {editingBook ? 'Update Book' : 'Add Book'}
                        </button>
                    </div>
                </form>
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
                                        <td className="px-4 py-2">
                                            <button
                                                onClick={() => setEditingBook(book)}
                                                className="text-blue-600 hover:text-blue-800 mr-2"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteBook(book._id)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookInventory;
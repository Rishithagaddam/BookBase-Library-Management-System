import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FacultyRecords = () => {
    const [faculty, setFaculty] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [newFaculty, setNewFaculty] = useState({
        facultyId: '',
        facultyName: '',
        role: 'faculty'
    });
    const [selectedFacultyIds, setSelectedFacultyIds] = useState([]);

    useEffect(() => {
        fetchFacultyData();
    }, []);

    const fetchFacultyData = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_API_URL}/api/admin/faculty`);
            setFaculty(response.data);
            setLoading(false);
        } catch (error) {
            setError('Error fetching faculty data');
            setLoading(false);
        }
    };

    const handleAddFaculty = async (e) => {
        e.preventDefault();
        try {
            if (!newFaculty.facultyId || !newFaculty.facultyName) {
                setError('Faculty ID and Name are required');
                return;
            }

            const response = await axios.post(`${import.meta.env.VITE_BACKEND_API_URL}/api/admin/faculty`, newFaculty);
            
            // Add new faculty to the list
            setFaculty([...faculty, response.data]);
            
            // Reset form
            setNewFaculty({
                facultyId: '',
                facultyName: '',
                role: 'faculty'
            });
            
            setSuccess('Faculty added successfully');
            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            setError(error.response?.data?.message || 'Error adding faculty');
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleRemoveFaculty = async () => {
        if (!window.confirm('Are you sure you want to remove the selected faculty members?')) {
            return;
        }

        try {
            // Remove selected faculty using their IDs
            const response = await axios.delete(`${import.meta.env.VITE_BACKEND_API_URL}/api/admin/faculty`, {
                data: { facultyIds: selectedFacultyIds }
            });

            if (response.status === 200) {
                // Remove deleted faculty from the list
                setFaculty(prevFaculty => prevFaculty.filter(f => !selectedFacultyIds.includes(f.facultyId)));
                setSelectedFacultyIds([]); // Clear selected IDs
                setSuccess('Selected faculty members removed successfully');
                setTimeout(() => setSuccess(''), 3000);
            }
        } catch (error) {
            console.error('Error removing faculty:', error);
            setError(error.response?.data?.message || 'Error removing faculty');
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleFacultySelect = (facultyId) => {
        setSelectedFacultyIds(prevIds => {
            if (prevIds.includes(facultyId)) {
                return prevIds.filter(id => id !== facultyId);
            } else {
                return [...prevIds, facultyId];
            }
        });
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold mb-6">🧑‍🏫 Faculty Records</h1>

            {/* Faculty Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Faculty Members</h2>

                {/* Add Faculty Form */}
                <form onSubmit={handleAddFaculty} className="flex gap-4 mb-6">
                    <input
                        type="text"
                        value={newFaculty.facultyId}
                        onChange={(e) => setNewFaculty({...newFaculty, facultyId: e.target.value})}
                        placeholder="Faculty ID"
                        className="p-2 border rounded"
                        required
                    />
                    <input
                        type="text"
                        value={newFaculty.facultyName}
                        onChange={(e) => setNewFaculty({...newFaculty, facultyName: e.target.value})}
                        placeholder="Faculty Name"
                        className="p-2 border rounded"
                        required
                    />
                    <select
                        value={newFaculty.role}
                        onChange={(e) => setNewFaculty({...newFaculty, role: e.target.value})}
                        className="p-2 border rounded"
                    >
                        <option value="faculty">Faculty</option>
                        <option value="admin">Admin</option>
                    </select>
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        Add Faculty
                    </button>
                </form>

                {/* Bulk Delete Button */}
                <div className="mb-4">
                    <button
                        onClick={handleRemoveFaculty}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                        disabled={selectedFacultyIds.length === 0}
                    >
                        Remove Selected Faculty
                    </button>
                </div>

                {/* Faculty Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-2">
                                    <input
                                        type="checkbox"
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedFacultyIds(faculty.map(f => f.facultyId));
                                            } else {
                                                setSelectedFacultyIds([]);
                                            }
                                        }}
                                    />
                                </th>
                                <th className="px-4 py-2">Faculty ID</th>
                                <th className="px-4 py-2">Name</th>
                                <th className="px-4 py-2">Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {faculty.map(f => (
                                <tr key={f.facultyId}>
                                    <td className="px-4 py-2 text-center">
                                        <input
                                            type="checkbox"
                                            checked={selectedFacultyIds.includes(f.facultyId)}
                                            onChange={() => handleFacultySelect(f.facultyId)}
                                        />
                                    </td>
                                    <td className="px-4 py-2 text-center">{f.facultyId}</td>
                                    <td className="px-4 py-2 text-center">{f.facultyName}</td>
                                    <td className="px-4 py-2 text-center">{f.role}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default FacultyRecords;

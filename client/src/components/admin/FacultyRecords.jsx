import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FacultyRecords = () => {
    const [faculty, setFaculty] = useState([]);
    const [loading, setLoading] = useState(true);
    const [workingHours, setWorkingHours] = useState({
        start: '09:00',
        end: '17:00'
    });
    const [holidays, setHolidays] = useState([]);
    const [newHoliday, setNewHoliday] = useState({
        date: '',
        description: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [newFaculty, setNewFaculty] = useState({
        facultyId: '',
        facultyName: '',
        role: 'faculty'
    });

    useEffect(() => {
        fetchFacultyData();
        fetchWorkingHours();
        fetchHolidays();
    }, []);

    const fetchFacultyData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/admin/faculty');
            setFaculty(response.data);
            setLoading(false);
        } catch (error) {
            setError('Error fetching faculty data');
            setLoading(false);
        }
    };

    const fetchWorkingHours = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/admin/settings/working-hours');
            setWorkingHours(response.data);
        } catch (error) {
            console.error('Error fetching working hours:', error);
        }
    };

    const fetchHolidays = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/admin/settings/holidays');
            setHolidays(response.data);
        } catch (error) {
            console.error('Error fetching holidays:', error);
        }
    };

    const handleWorkingHoursSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/admin/settings/working-hours', workingHours);
            setSuccess('Working hours updated successfully');
            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            setError('Error updating working hours');
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleAddHoliday = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/admin/settings/holidays', newHoliday);
            setHolidays([...holidays, response.data]);
            setNewHoliday({ date: '', description: '' });
            setSuccess('Holiday added successfully');
            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            setError('Error adding holiday');
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleDeleteHoliday = async (holidayId) => {
        try {
            await axios.delete(`http://localhost:5000/api/admin/settings/holidays/${holidayId}`);
            setHolidays(holidays.filter(h => h._id !== holidayId));
            setSuccess('Holiday deleted successfully');
            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            setError('Error deleting holiday');
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleAddFaculty = async (e) => {
        e.preventDefault();
        try {
            if (!newFaculty.facultyId || !newFaculty.facultyName) {
                setError('Faculty ID and Name are required');
                return;
            }

            const response = await axios.post('http://localhost:5000/api/admin/faculty', newFaculty);
            
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

    const handleRemoveFaculty = async (facultyId) => {
        if (!window.confirm('Are you sure you want to remove this faculty member?')) {
            return;
        }

        try {
            // Remove using facultyId directly
            const response = await axios.delete(`http://localhost:5000/api/admin/faculty/${facultyId}`);
            
            if (response.status === 200) {
                // Remove faculty from the list and update state
                setFaculty(prevFaculty => prevFaculty.filter(f => f.facultyId !== facultyId));
                setSuccess('Faculty removed successfully');
                setTimeout(() => setSuccess(''), 3000);
            }
        } catch (error) {
            console.error('Error removing faculty:', error);
            setError(error.response?.data?.message || 'Error removing faculty');
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleToggleFacultyStatus = async (facultyId, currentStatus) => {
        try {
            const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
            
            // Check for issued books before deactivating
            if (newStatus === 'inactive') {
                const facultyResponse = await axios.get(`http://localhost:5000/api/admin/faculty/${facultyId}`);
                if (facultyResponse.data.currentlyIssuedBooks?.length > 0) {
                    setError('Cannot deactivate faculty with issued books');
                    setTimeout(() => setError(''), 3000);
                    return;
                }
            }

            // Update status in database
            const response = await axios.patch(`http://localhost:5000/api/admin/faculty/${facultyId}/status`, {
                status: newStatus
            });
            
            if (response.status === 200) {
                // Update faculty list with new status
                setFaculty(prevFaculty => prevFaculty.map(f => {
                    if (f._id === facultyId) {
                        return { ...f, status: newStatus };
                    }
                    return f;
                }));
                
                setSuccess(`Faculty status updated to ${newStatus}`);
                setTimeout(() => setSuccess(''), 3000);
                
                // Refresh faculty data to ensure sync with DB
                fetchFacultyData();
            }
        } catch (error) {
            console.error('Error updating faculty status:', error);
            setError(error.response?.data?.message || 'Error updating faculty status');
            setTimeout(() => setError(''), 3000);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold mb-6">🧑‍🏫 Faculty Records</h1>

            {error && (
                <div className="bg-red-100 text-red-600 p-3 rounded mb-4">{error}</div>
            )}
            {success && (
                <div className="bg-green-100 text-green-600 p-3 rounded mb-4">{success}</div>
            )}

            {/* Working Hours Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Library Working Hours</h2>
                <form onSubmit={handleWorkingHoursSubmit} className="flex gap-4">
                    <input
                        type="time"
                        value={workingHours.start}
                        onChange={(e) => setWorkingHours({...workingHours, start: e.target.value})}
                        className="p-2 border rounded"
                        required
                    />
                    <span className="self-center">to</span>
                    <input
                        type="time"
                        value={workingHours.end}
                        onChange={(e) => setWorkingHours({...workingHours, end: e.target.value})}
                        className="p-2 border rounded"
                        required
                    />
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        Update Hours
                    </button>
                </form>
            </div>

            {/* Holidays Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Library Holidays</h2>
                <form onSubmit={handleAddHoliday} className="flex gap-4 mb-4">
                    <input
                        type="date"
                        value={newHoliday.date}
                        onChange={(e) => setNewHoliday({...newHoliday, date: e.target.value})}
                        className="p-2 border rounded"
                        required
                    />
                    <input
                        type="text"
                        value={newHoliday.description}
                        onChange={(e) => setNewHoliday({...newHoliday, description: e.target.value})}
                        placeholder="Holiday Description"
                        className="p-2 border rounded flex-1"
                        required
                    />
                    <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                        Add Holiday
                    </button>
                </form>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-2">Date</th>
                                <th className="px-4 py-2">Description</th>
                                <th className="px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {holidays.map((holiday) => (
                                <tr key={holiday._id} className="border-t">
                                    <td className="px-4 py-2">{new Date(holiday.date).toLocaleDateString()}</td>
                                    <td className="px-4 py-2">{holiday.description}</td>
                                    <td className="px-4 py-2">
                                        <button
                                            onClick={() => handleDeleteHoliday(holiday._id)}
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
            </div>

            {/* Add Faculty Form */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Add New Faculty</h2>
                <form onSubmit={handleAddFaculty} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                            type="text"
                            placeholder="Faculty ID"
                            value={newFaculty.facultyId}
                            onChange={(e) => setNewFaculty({...newFaculty, facultyId: e.target.value})}
                            className="p-2 border rounded"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Faculty Name"
                            value={newFaculty.facultyName}
                            onChange={(e) => setNewFaculty({...newFaculty, facultyName: e.target.value})}
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
                    </div>
                    <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                        Add Faculty
                    </button>
                </form>
            </div>

            {/* Faculty List - Update the table to include Remove button */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Faculty Members</h2>
                {loading ? (
                    <div>Loading faculty data...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2">Faculty ID</th>
                                    <th className="px-4 py-2">Name</th>
                                    <th className="px-4 py-2">Role</th>
                                    <th className="px-4 py-2">Books Issued</th>
                                    <th className="px-4 py-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {faculty.map((member) => (
                                    <tr key={member._id || member.facultyId} className="border-t">
                                        <td className="px-4 py-2">{member.facultyId}</td>
                                        <td className="px-4 py-2">{member.facultyName}</td>
                                        <td className="px-4 py-2">{member.role}</td>
                                        <td className="px-4 py-2">{member.currentlyIssuedBooks?.length || 0}</td>
                                        <td className="px-4 py-2">
                                            <button
                                                onClick={() => handleRemoveFaculty(member.facultyId)}
                                                className="text-red-600 hover:text-red-800 px-3 py-1 rounded border border-red-600 hover:bg-red-50"
                                                disabled={member.currentlyIssuedBooks?.length > 0}
                                            >
                                                Remove
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

export default FacultyRecords;
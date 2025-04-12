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

    useEffect(() => {
        fetchFacultyData();
    }, []);

    const fetchFacultyData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/admin/faculty');
            setFaculty(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching faculty data:', error);
        }
    };

    const handleWorkingHoursSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/admin/settings/working-hours', workingHours);
            alert('Working hours updated successfully');
        } catch (error) {
            console.error('Error updating working hours:', error);
        }
    };

    const handleAddHoliday = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/admin/settings/holidays', newHoliday);
            setHolidays([...holidays, response.data]);
            setNewHoliday({ date: '', description: '' });
        } catch (error) {
            console.error('Error adding holiday:', error);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold mb-6">🧑‍🏫 Faculty Records</h1>

            {/* Working Hours Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Library Working Hours</h2>
                <form onSubmit={handleWorkingHoursSubmit} className="flex gap-4">
                    <input
                        type="time"
                        value={workingHours.start}
                        onChange={(e) => setWorkingHours({...workingHours, start: e.target.value})}
                        className="p-2 border rounded"
                    />
                    <span className="self-center">to</span>
                    <input
                        type="time"
                        value={workingHours.end}
                        onChange={(e) => setWorkingHours({...workingHours, end: e.target.value})}
                        className="p-2 border rounded"
                    />
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
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
                    <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
                        Add Holiday
                    </button>
                </form>

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

            {/* Faculty List */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Faculty Members</h2>
                {loading ? (
                    <p>Loading faculty data...</p>
                ) : (
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-2">Faculty ID</th>
                                <th className="px-4 py-2">Name</th>
                                <th className="px-4 py-2">Email</th>
                                <th className="px-4 py-2">Books Issued</th>
                                <th className="px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {faculty.map((member) => (
                                <tr key={member._id} className="border-t">
                                    <td className="px-4 py-2">{member.facultyId}</td>
                                    <td className="px-4 py-2">{member.facultyName}</td>
                                    <td className="px-4 py-2">{member.facultyEmail}</td>
                                    <td className="px-4 py-2">{member.currentlyIssuedBooks.length}</td>
                                    <td className="px-4 py-2">
                                        <button
                                            onClick={() => handleViewDetails(member._id)}
                                            className="text-blue-600 hover:text-blue-800 mr-2"
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default FacultyRecords;
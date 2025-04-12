import React from 'react';

const Dashboard = () => (
    <div>
        <h1 className="text-4xl font-bold mb-6 text-gray-800">🏠 Dashboard</h1>
        <div className="space-y-4">
            <div>
                <h2 className="text-2xl font-semibold">Quick Stats</h2>
                <p>Issued Books: 10 | Due Soon: 2 | Returned: 5</p>
            </div>
            <div>
                <h2 className="text-2xl font-semibold">Recent Activity</h2>
                <ul>
                    <li>Issued: "Book A" on 10th April</li>
                    <li>Returned: "Book B" on 8th April</li>
                </ul>
            </div>
            <div>
                <h2 className="text-2xl font-semibold">Reminders</h2>
                <p>2 books are due for return in 3 days.</p>
            </div>
        </div>
    </div>
);

export default Dashboard;
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BroadcastNotification = () => {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_API_URL}/api/broadcasts`);
                setMessages(response.data);
            } catch (error) {
                console.error('Error fetching broadcasts:', error);
            }
        };

        fetchMessages();
        const interval = setInterval(fetchMessages, 60000); // Check every minute
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed bottom-4 right-4 z-50 space-y-2">
            {messages.map((msg) => (
                <div
                    key={msg._id}
                    className={`p-4 rounded-lg shadow-lg max-w-sm ${
                        msg.priority === 'urgent' 
                            ? 'bg-red-50 border-red-200' 
                            : 'bg-blue-50 border-blue-200'
                    }`}
                >
                    <h4 className="font-semibold">{msg.title}</h4>
                    <p className="text-sm mt-1">{msg.content}</p>
                </div>
            ))}
        </div>
    );
};

export default BroadcastNotification;
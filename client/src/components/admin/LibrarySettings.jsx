import React, { useState } from 'react';

const LibrarySettings = () => {
    const [settings, setSettings] = useState({
        maxBooksPerFaculty: 5,
        maxDaysForReturn: 14,
        enableEmailNotifications: true,
        enableSMSNotifications: false,
        enableAutoReminders: true,
        allowBookRenewals: true,
    });

    const handleSettingChange = (settingName, value) => {
        setSettings(prev => ({
            ...prev,
            [settingName]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: Implement settings update logic
        alert('Settings updated successfully!');
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-6 text-gray-800">⚙️ Library Settings</h1>
            
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
                <div className="space-y-6">
                    {/* Book Lending Settings */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Book Lending Settings</h2>
                        <div className="grid gap-4">
                            <div>
                                <label className="block text-gray-700 mb-2">
                                    Maximum Books Per Faculty
                                </label>
                                <input
                                    type="number"
                                    value={settings.maxBooksPerFaculty}
                                    onChange={(e) => handleSettingChange('maxBooksPerFaculty', parseInt(e.target.value))}
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400"
                                    min="1"
                                    max="10"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-2">
                                    Maximum Days for Return
                                </label>
                                <input
                                    type="number"
                                    value={settings.maxDaysForReturn}
                                    onChange={(e) => handleSettingChange('maxDaysForReturn', parseInt(e.target.value))}
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400"
                                    min="1"
                                    max="30"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Notification Settings */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
                        <div className="space-y-4">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="emailNotifications"
                                    checked={settings.enableEmailNotifications}
                                    onChange={(e) => handleSettingChange('enableEmailNotifications', e.target.checked)}
                                    className="h-4 w-4 text-blue-600"
                                />
                                <label htmlFor="emailNotifications" className="ml-2 text-gray-700">
                                    Enable Email Notifications
                                </label>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="smsNotifications"
                                    checked={settings.enableSMSNotifications}
                                    onChange={(e) => handleSettingChange('enableSMSNotifications', e.target.checked)}
                                    className="h-4 w-4 text-blue-600"
                                />
                                <label htmlFor="smsNotifications" className="ml-2 text-gray-700">
                                    Enable SMS Notifications
                                </label>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="autoReminders"
                                    checked={settings.enableAutoReminders}
                                    onChange={(e) => handleSettingChange('enableAutoReminders', e.target.checked)}
                                    className="h-4 w-4 text-blue-600"
                                />
                                <label htmlFor="autoReminders" className="ml-2 text-gray-700">
                                    Enable Automatic Reminders
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Book Renewal Settings */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Book Renewal Settings</h2>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="allowRenewals"
                                checked={settings.allowBookRenewals}
                                onChange={(e) => handleSettingChange('allowBookRenewals', e.target.checked)}
                                className="h-4 w-4 text-blue-600"
                            />
                            <label htmlFor="allowRenewals" className="ml-2 text-gray-700">
                                Allow Book Renewals
                            </label>
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <div className="mt-8">
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Save Settings
                    </button>
                </div>
            </form>
        </div>
    );
};

export default LibrarySettings;
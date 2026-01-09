import React, { useState } from 'react';
import AdminLayout from '../components/AdminLayout';

const AdminSettings = () => {
    const [settings, setSettings] = useState({
        storeName: 'Organic Farms',
        supportEmail: 'support@organicfarms.com',
        phoneNumber: '+91 98765 43210',
        currency: 'INR',
        maintenanceMode: false,
        enableNotifications: true
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Settings Saved Successfully!');
    };

    return (
        <AdminLayout>
            <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Store Settings</h2>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* General Settings */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                            <h3 className="font-bold text-gray-800">General Information</h3>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
                                <input
                                    type="text" name="storeName"
                                    value={settings.storeName} onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                                <select
                                    name="currency"
                                    value={settings.currency} onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                                >
                                    <option value="INR">Indian Rupee (INR)</option>
                                    <option value="USD">US Dollar (USD)</option>
                                    <option value="EUR">Euro (EUR)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                            <h3 className="font-bold text-gray-800">Contact Details</h3>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Support Email</label>
                                <input
                                    type="email" name="supportEmail"
                                    value={settings.supportEmail} onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <input
                                    type="text" name="phoneNumber"
                                    value={settings.phoneNumber} onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Preferences */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                            <h3 className="font-bold text-gray-800">Preferences</h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-medium text-gray-900">Maintenance Mode</h4>
                                    <p className="text-sm text-gray-500">Temporarily disable the store for visitors.</p>
                                </div>
                                <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                                    <input
                                        type="checkbox" name="maintenanceMode" id="toggle"
                                        checked={settings.maintenanceMode} onChange={handleChange}
                                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                                        style={{ right: settings.maintenanceMode ? '0' : 'auto', left: settings.maintenanceMode ? 'auto' : '0', borderColor: settings.maintenanceMode ? '#E67E22' : '#ccc' }}
                                    />
                                    <label htmlFor="toggle" className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${settings.maintenanceMode ? 'bg-primary' : 'bg-gray-300'}`}></label>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-medium text-gray-900">Email Notifications</h4>
                                    <p className="text-sm text-gray-500">Receive emails for new orders.</p>
                                </div>
                                <input
                                    type="checkbox" name="enableNotifications"
                                    checked={settings.enableNotifications} onChange={handleChange}
                                    className="h-5 w-5 text-primary border-gray-300 rounded focus:ring-primary"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button type="button" className="mr-4 px-6 py-2 bg-gray-200 text-gray-700 font-bold rounded-md hover:bg-gray-300 transition">Cancel</button>
                        <button type="submit" className="px-6 py-2 bg-primary text-white font-bold rounded-md hover:bg-orange-700 transition shadow-md">Save Changes</button>
                    </div>

                </form>
            </div>
        </AdminLayout>
    );
};

export default AdminSettings;

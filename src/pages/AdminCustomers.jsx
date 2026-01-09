import React from 'react';
import AdminLayout from '../components/AdminLayout';

const AdminCustomers = () => {
    // Mock Customers Data
    const customers = [
        { id: 1, name: 'Raju Kumar', email: 'raju.nm@example.com', orders: 12, spent: 14500, city: 'Hyderabad' },
        { id: 2, name: 'Priya Reddy', email: 'priya.r@example.com', orders: 5, spent: 4200, city: 'Bangalore' },
        { id: 3, name: 'Anita Singh', email: 'anita.s@example.com', orders: 8, spent: 9800, city: 'Mumbai' },
        { id: 4, name: 'Vikram Mehta', email: 'vikram.m@example.com', orders: 2, spent: 1500, city: 'Delhi' },
        { id: 5, name: 'Suresh Raina', email: 'suresh.raina@example.com', orders: 15, spent: 22000, city: 'Chennai' },
        { id: 6, name: 'Meerya K', email: 'meera.k@example.com', orders: 3, spent: 2100, city: 'Pune' },
    ];

    return (
        <AdminLayout>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-gray-800">Registered Customers</h3>
                    <div className="flex gap-2">
                        <input type="text" placeholder="Search customers..." className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                        <button className="px-3 py-1 bg-white border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50">Export</button>
                    </div>
                </div>
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                            <th className="px-6 py-3 font-medium">Customer</th>
                            <th className="px-6 py-3 font-medium">Contact</th>
                            <th className="px-6 py-3 font-medium">City</th>
                            <th className="px-6 py-3 font-medium">Orders</th>
                            <th className="px-6 py-3 font-medium">Total Spent</th>
                            <th className="px-6 py-3 font-medium text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {customers.map(customer => (
                            <tr key={customer.id} className="hover:bg-gray-50 transition">
                                <td className="px-6 py-4 text-sm font-bold text-gray-900 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                                        {customer.name.charAt(0)}
                                    </div>
                                    {customer.name}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">{customer.email}</td>
                                <td className="px-6 py-4 text-sm text-gray-700">{customer.city}</td>
                                <td className="px-6 py-4 text-sm text-gray-900 font-medium">{customer.orders}</td>
                                <td className="px-6 py-4 text-sm text-gray-900">₹{customer.spent}</td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-gray-400 hover:text-primary font-bold text-xs uppercase transition">View Profile</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
};

export default AdminCustomers;

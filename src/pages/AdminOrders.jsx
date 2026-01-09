import React from 'react';
import AdminLayout from '../components/AdminLayout';

const AdminOrders = () => {
    // Mock Orders Data
    const orders = [
        { id: '#ORD-7829', customer: 'Raju Kumar', date: 'Oct 24, 2023', total: 1250, status: 'Delivered' },
        { id: '#ORD-7830', customer: 'Priya Reddy', date: 'Oct 24, 2023', total: 650, status: 'Processing' },
        { id: '#ORD-7831', customer: 'Anita Singh', date: 'Oct 23, 2023', total: 3400, status: 'Shipped' },
        { id: '#ORD-7832', customer: 'Vikram Mehta', date: 'Oct 23, 2023', total: 890, status: 'Cancelled' },
        { id: '#ORD-7833', customer: 'Suresh Raina', date: 'Oct 22, 2023', total: 1500, status: 'Delivered' },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Delivered': return 'bg-green-100 text-green-800';
            case 'Processing': return 'bg-blue-100 text-blue-800';
            case 'Shipped': return 'bg-orange-100 text-orange-800';
            case 'Cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AdminLayout>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-gray-800">Recent Orders</h3>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 bg-white border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50">Filter</button>
                        <button className="px-3 py-1 bg-white border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50">Export</button>
                    </div>
                </div>
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                            <th className="px-6 py-3 font-medium">Order ID</th>
                            <th className="px-6 py-3 font-medium">Customer</th>
                            <th className="px-6 py-3 font-medium">Date</th>
                            <th className="px-6 py-3 font-medium">Total (₹)</th>
                            <th className="px-6 py-3 font-medium">Status</th>
                            <th className="px-6 py-3 font-medium text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {orders.map(order => (
                            <tr key={order.id} className="hover:bg-gray-50 transition">
                                <td className="px-6 py-4 text-sm font-bold text-gray-900">{order.id}</td>
                                <td className="px-6 py-4 text-sm text-gray-700">{order.customer}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">{order.date}</td>
                                <td className="px-6 py-4 text-sm font-bold text-gray-900">₹{order.total}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-primary hover:text-orange-700 font-bold text-xs uppercase">View</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
};

export default AdminOrders;

import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const AdminLayout = ({ children }) => {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path ? 'bg-primary text-white font-bold' : 'text-gray-300 hover:bg-gray-800 hover:text-white transition';
    };

    return (
        <div className="min-h-screen bg-gray-100 font-sans flex text-gray-800">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 text-white flex-shrink-0 hidden md:block">
                <div className="p-6 border-b border-gray-800">
                    <h1 className="font-serif text-xl font-bold">Organic Farm</h1>
                    <span className="text-xs text-gray-500 uppercase tracking-widest">Admin Panel</span>
                </div>
                <nav className="p-4 space-y-2">
                    <Link to="/admin/dashboard" className={`block px-4 py-2 rounded-md ${isActive('/admin/dashboard')}`}>Dashboard</Link>
                    <Link to="/admin/products" className={`block px-4 py-2 rounded-md ${isActive('/admin/products')}`}>Products</Link>
                    <Link to="/admin/orders" className={`block px-4 py-2 rounded-md ${isActive('/admin/orders')}`}>Orders</Link>
                    <Link to="/admin/customers" className={`block px-4 py-2 rounded-md ${isActive('/admin/customers')}`}>Customers</Link>
                    <Link to="/admin/settings" className={`block px-4 py-2 rounded-md ${isActive('/admin/settings')}`}>Settings</Link>
                </nav>
                <div className="absolute bottom-0 w-64 p-4 border-t border-gray-800">
                    <Link to="/" className="block text-center text-sm text-gray-500 hover:text-white transition">Back to Store</Link>
                    <Link to="/admin" className="block text-center text-xs text-gray-600 hover:text-gray-400 mt-2">Log Out</Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                {/* Header */}
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Admin Portal</h2>
                        <p className="text-sm text-gray-500">Manage your store efficiently</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
                            <img src="https://ui-avatars.com/api/?name=Admin+User&background=random" alt="Admin" />
                        </div>
                        <div>
                            <p className="text-sm font-bold">Admin User</p>
                            <p className="text-xs text-gray-500">Super Admin</p>
                        </div>
                    </div>
                </header>
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;

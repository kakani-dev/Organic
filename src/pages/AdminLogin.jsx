import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        // Simulate admin login
        if (email === 'admin@organicfarm.com' && password === 'admin') {
            navigate('/admin/dashboard');
        } else {
            alert('Invalid Admin Credentials. Try admin@organicfarm.com / admin');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl border-t-8 border-primary">
                <div className="text-center">
                    <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-800 mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h2 className="mt-2 text-3xl font-serif font-bold text-gray-900">
                        Admin Portal
                    </h2>
                    <p className="mt-2 text-sm text-gray-500">
                        Secure Access for Organic Farm Staff
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div className="mb-4">
                            <label htmlFor="email-address" className="sr-only">
                                Email address
                            </label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-gray-800 focus:border-gray-800 focus:z-10 sm:text-sm"
                                placeholder="Admin Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="appearance-none rounded-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-gray-800 focus:border-gray-800 focus:z-10 sm:text-sm"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold uppercase tracking-widest rounded-md text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition shadow-md"
                        >
                            Access Dashboard
                        </button>
                    </div>
                </form>
                <div className="text-center text-xs text-gray-400 mt-4">
                    Restricted Area. Authorized Personnel Only.
                </div>
            </div>

            {/* Admin Credentials Box */}
            <div className="mt-8 bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-sm max-w-md w-full text-center">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Demo Admin Access</p>
                <div className="space-y-1 text-sm text-gray-300">
                    <p><span className="font-bold text-white">Email:</span> admin@organicfarm.com</p>
                    <p><span className="font-bold text-white">Password:</span> admin</p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;

import React from 'react';
import Navbar from './Navbar';
import Cart from './Cart';
import { Link } from 'react-router-dom';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col font-sans text-primary-brown">
            <Cart />
            <Navbar />
            <main className="flex-grow pt-[104px] bg-[#FEFEFE]"> {/* Adjusted pt to account for Navbar height */}
                {children}
            </main>

            {/* Vaaradhi Footer - Primary Orange Background */}
            <footer className="bg-primary-orange text-white py-16 font-sans">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-10 border-b border-white/20 pb-12 mb-8">
                        {/* Column 1: Brand */}
                        <div className="space-y-4">
                            <h3 className="font-serif text-2xl font-bold">Organic Farm</h3>
                            <p className="text-white/80 text-sm leading-relaxed">
                                Bringing back the goodness of traditional farming. We source directly from nature to ensure every spoon is full of health.
                            </p>
                            <div className="flex gap-4 pt-2">
                                {/* Social Icons */}
                                {['instagram', 'facebook', 'youtube', 'twitter'].map(social => (
                                    <a key={social} href="#" className="opacity-70 hover:opacity-100 transition transform hover:scale-110">
                                        <span className="sr-only capitalize">{social}</span>
                                        {/* Simple Circle Placeholder for Icon */}
                                        <div className="w-8 h-8 rounded-full border border-white/50 flex items-center justify-center">
                                            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" /></svg>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Column 2: Quick Links */}
                        <div>
                            <h4 className="font-bold text-lg mb-6 tracking-wide">Quick Links</h4>
                            <ul className="space-y-3 text-sm text-white/80">
                                <li><Link to="/" className="hover:text-white hover:underline transition">Home</Link></li>
                                <li><Link to="/shop" className="hover:text-white hover:underline transition">All Products</Link></li>
                                <li><Link to="/shop" className="hover:text-white hover:underline transition">Ghee & Oils</Link></li>
                                <li><Link to="/shop" className="hover:text-white hover:underline transition">Honey & Dry Fruits</Link></li>
                                <li><Link to="/shop" className="hover:text-white hover:underline transition">Bulk Orders</Link></li>
                            </ul>
                        </div>

                        {/* Column 3: Customer Care */}
                        <div>
                            <h4 className="font-bold text-lg mb-6 tracking-wide">Customer Care</h4>
                            <ul className="space-y-3 text-sm text-white/80">
                                <li><a href="#" className="hover:text-white hover:underline transition">Track Order</a></li>
                                <li><a href="#" className="hover:text-white hover:underline transition">Shipping Policy</a></li>
                                <li><a href="#" className="hover:text-white hover:underline transition">Terms & Conditions</a></li>
                                <li><a href="#" className="hover:text-white hover:underline transition">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-white hover:underline transition">Refund Policy</a></li>
                            </ul>
                        </div>

                        {/* Column 4: Contact */}
                        <div>
                            <h4 className="font-bold text-lg mb-6 tracking-wide">Contact Us</h4>
                            <ul className="space-y-4 text-sm text-white/80">
                                <li className="flex gap-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    <span>Organic Farms, H.No: 1-23/A, Green Valley, Hyderabad, India</span>
                                </li>
                                <li className="flex gap-3 items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                    <span>+91 91234 56789</span>
                                </li>
                                <li className="flex gap-3 items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                    <span>support@organicfarms.com</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-center text-sm text-white/60">
                        <p>&copy; 2026 Organic Farm. All rights reserved.</p>
                        <div className="mt-4 md:mt-0">
                            India | English
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;

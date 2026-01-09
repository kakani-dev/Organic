import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const { cartCount, toggleCart } = useCart();

    return (
        <nav className="fixed top-0 left-0 w-full bg-white shadow-sm z-50 font-sans text-sm tracking-wide">
            {/* Top Utility Bar (Optional, can be removed if strictly following clean Vaaradhi look, but good for contact info) */}
            <div className="bg-primary text-white text-xs py-1 text-center font-bold tracking-widest uppercase">
                Free Shipping on Orders Above ₹999
            </div>

            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                {/* Left: Logo */}
                <Link to="/" className="flex items-center gap-2">
                    {/* Replicating a simple, bold text logo or icon similar to Vaaradhi */}
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-serif text-2xl font-bold text-primary-brown leading-none">Organic</span>
                        <span className="text-xxs tracking-[0.3em] text-primary uppercase font-bold">Farm</span>
                    </div>
                </Link>

                {/* Center: Navigation Links (Hidden on mobile) */}
                <div className="hidden md:flex gap-8 items-center font-bold text-gray-700">
                    <Link to="/" className="hover:text-primary transition uppercase text-xs">Home</Link>
                    <Link to="/shop" className="hover:text-primary transition uppercase text-xs">Collections</Link>
                    <Link to="/shop" className="hover:text-primary transition uppercase text-xs">Shop All</Link>
                    <Link to="#" className="hover:text-primary transition uppercase text-xs">Our Story</Link>
                </div>

                {/* Right: Icons */}
                <div className="flex gap-5 items-center text-gray-700">
                    <button className="hover:text-primary transition">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </button>
                    <Link to="/login" className="hover:text-primary transition">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </Link>
                    <button onClick={toggleCart} className="relative hover:text-primary transition">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                                {cartCount}
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

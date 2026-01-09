import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';

const Checkout = () => {
    const { cartItems, cartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: '',
        city: '',
        zip: '',
        card: ''
    });
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsProcessing(true);
        // Simulate API call
        setTimeout(() => {
            setIsProcessing(false);
            setIsSuccess(true);
            clearCart();
        }, 2000);
    };

    if (isSuccess) {
        return (
            <div className="container mx-auto px-4 py-20 text-center animate-in fade-in duration-500">
                <div className="bg-white p-12 rounded-2xl shadow-lg max-w-2xl mx-auto border border-green-50">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Order Placed Successfully!</h2>
                    <p className="text-gray-600 mb-8">Dhanyavaad! Your fresh organic order is on its way.</p>
                    <button onClick={() => navigate('/')} className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-opacity-90 transition transform hover:scale-105">
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
                <Link to="/shop" className="text-primary underline hover:text-accent">Go to Shop</Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold text-center mb-12 text-primary">Secure Checkout</h1>
            <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
                {/* Form */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm">1</span>
                        Shipping Information
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 mb-2 font-medium">Full Name</label>
                            <input type="text" name="name" required className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition" placeholder="Rajesh Kumar" onChange={handleChange} />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-2 font-medium">Email</label>
                            <input type="email" name="email" required className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition" placeholder="rajesh@example.com" onChange={handleChange} />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-2 font-medium">Address</label>
                            <input type="text" name="address" required className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition" placeholder="Flat 402, Green Apartments" onChange={handleChange} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700 mb-2 font-medium">City</label>
                                <input type="text" name="city" required className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition" placeholder="Mumbai" onChange={handleChange} />
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-2 font-medium">PIN Code</label>
                                <input type="text" name="zip" required className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition" placeholder="400001" onChange={handleChange} />
                            </div>
                        </div>
                        <div className="pt-6">
                            <button type="submit" disabled={isProcessing} className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-lg hover:bg-opacity-90 transition transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                                {isProcessing ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </>
                                ) : `Pay ₹${cartTotal.toFixed(2)}`}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Order Summary */}
                <div className="bg-secondary/30 p-8 rounded-2xl h-fit">
                    <h2 className="text-xl font-bold mb-6 text-primary">Order Summary</h2>
                    <div className="space-y-4 mb-6">
                        {cartItems.map(item => (
                            <div key={item.id} className="flex justify-between items-center border-b border-gray-200 pb-2 border-dashed last:border-0">
                                <span className="text-gray-600">{item.name} <span className="text-xs bg-white px-2 py-1 rounded text-primary border ml-2">x{item.quantity}</span></span>
                                <span className="font-bold text-gray-800">₹{(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between items-center text-xl font-bold text-primary pt-4 border-t border-gray-300">
                        <span>Total</span>
                        <span>₹{cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="mt-8 text-sm text-gray-500 flex items-start gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <p>By placing this order, you agree to our Terms of Service and Privacy Policy. All transactions are secure and encrypted.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;

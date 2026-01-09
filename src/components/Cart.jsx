import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const Cart = () => {
    const { cartItems, isCartOpen, toggleCart, removeFromCart, updateQuantity, cartTotal } = useCart();

    if (!isCartOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex justify-end">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={toggleCart}></div>

            {/* Cart Sidebar */}
            <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col p-6 overflow-y-auto transform transition-transform duration-300">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-primary">Your Cart</h2>
                    <button onClick={toggleCart} className="text-gray-500 hover:text-red-500 p-2 hover:bg-gray-100 rounded-full transition">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {cartItems.length === 0 ? (
                    <div className="flex-grow flex flex-col items-center justify-center text-center opacity-50 space-y-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <p className="text-xl">Your cart is empty.</p>
                        <button onClick={toggleCart} className="text-primary font-bold hover:underline">Start Shopping</button>
                    </div>
                ) : (
                    <div className="flex-grow space-y-6">
                        {cartItems.map(item => (
                            <div key={item.id} className="flex gap-4 border-b border-gray-100 pb-4">
                                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg shadow-sm" />
                                <div className="flex-grow">
                                    <h3 className="font-bold text-gray-800">{item.name}</h3>
                                    <p className="text-sm text-gray-500 mb-2">₹{item.price}</p>
                                    <div className="flex items-center gap-2">
                                        <button
                                            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200"
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        >-</button>
                                        <span className="font-medium w-6 text-center">{item.quantity}</span>
                                        <button
                                            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200"
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        >+</button>
                                    </div>
                                </div>
                                <div className="flex flex-col justify-between items-end">
                                    <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600 transition">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                    <span className="font-bold text-gray-800">₹{(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {cartItems.length > 0 && (
                    <div className="pt-6 border-t border-gray-100 mt-4">
                        <div className="flex justify-between items-center mb-4 text-xl font-bold text-gray-800">
                            <span>Total:</span>
                            <span>₹{cartTotal.toFixed(2)}</span>
                        </div>
                        <Link to="/checkout" onClick={toggleCart} className="block w-full text-center bg-primary text-white py-4 rounded-xl font-bold shadow-lg hover:bg-opacity-90 transition transform active:scale-95">
                            Proceed to Checkout
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;

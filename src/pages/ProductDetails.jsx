import React from 'react';
import { useParams } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { products } = useProducts();
    const { addToCart } = useCart();

    const product = products.find(p => p.id === parseInt(id));

    if (!product) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h2 className="text-2xl font-bold mb-4">Product not found</h2>
                <button onClick={() => navigate('/shop')} className="text-primary underline">Return to Shop</button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <button onClick={() => navigate(-1)} className="mb-8 text-gray-500 hover:text-primary flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back
            </button>

            <div className="grid md:grid-cols-2 gap-12 items-start">
                <div className="bg-gray-100 rounded-3xl overflow-hidden shadow-sm">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover max-h-[600px]" />
                </div>

                <div className="space-y-6">
                    <div>
                        <span className="text-accent font-bold tracking-wider uppercase text-sm">{product.category}</span>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2">{product.name}</h1>
                    </div>

                    <div className="text-3xl font-bold text-primary">₹{product.price}</div>

                    <p className="text-gray-600 text-lg leading-relaxed">{product.description}</p>

                    <div className="pt-6 border-t border-gray-100">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-primary">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-800">100% Organic Certified</h4>
                                <p className="text-sm text-gray-500">Verified by Jaivik Bharat.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-accent">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-800">Fast Delivery</h4>
                                <p className="text-sm text-gray-500">Delivered within 24 hours.</p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8">
                        <button
                            onClick={() => addToCart(product)}
                            className="w-full md:w-auto bg-primary text-white px-10 py-4 rounded-full text-lg font-bold shadow-lg hover:bg-opacity-90 transition transform hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;

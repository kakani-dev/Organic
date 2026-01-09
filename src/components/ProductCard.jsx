import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();

    return (
        <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition overflow-hidden group border border-gray-100 flex flex-col">
            <Link to={`/product/${product.id}`} className="block relative h-64 overflow-hidden bg-gray-100 cursor-pointer">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700 ease-in-out"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary shadow-sm uppercase tracking-wide">
                    {product.category}
                </div>
            </Link>
            <div className="p-6 flex flex-col flex-grow">
                <Link to={`/product/${product.id}`} className="hover:text-primary transition">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{product.name}</h3>
                </Link>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2 h-10">{product.description}</p>
                <div className="flex justify-between items-center mt-auto">
                    <span className="text-xl font-bold text-primary">₹{product.price}</span>
                    <button
                        onClick={() => addToCart(product)}
                        className="bg-primary hover:bg-dark text-white p-3 rounded-full shadow-md transition transform active:scale-95 group-hover:bg-accent"
                        aria-label="Add to cart"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;

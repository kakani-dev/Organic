import React, { createContext, useContext, useState, useEffect } from 'react';
import { products as initialProducts } from '../data/products';

const ProductContext = createContext();

export const useProducts = () => {
    return useContext(ProductContext);
};

export const ProductProvider = ({ children }) => {
    // Initialize state with products from data file, or potentially localStorage if we want persistence across reloads
    const [products, setProducts] = useState(() => {
        const savedProducts = localStorage.getItem('organic_products');
        return savedProducts ? JSON.parse(savedProducts) : initialProducts;
    });

    useEffect(() => {
        localStorage.setItem('organic_products', JSON.stringify(products));
    }, [products]);

    const addProduct = (newProduct) => {
        setProducts(prevProducts => [...prevProducts, { ...newProduct, id: Date.now() }]); // Simple ID generation
    };

    const deleteProduct = (id) => {
        setProducts(prevProducts => prevProducts.filter(product => product.id !== id));
    };

    const updateProduct = (id, updatedProduct) => {
        setProducts(prevProducts => prevProducts.map(product => product.id === id ? { ...product, ...updatedProduct } : product));
    };

    const value = {
        products,
        addProduct,
        deleteProduct,
        updateProduct
    };

    return (
        <ProductContext.Provider value={value}>
            {children}
        </ProductContext.Provider>
    );
};

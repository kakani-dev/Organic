import React, { useState } from 'react';
import { useProducts } from '../context/ProductContext';
import AdminLayout from '../components/AdminLayout';

const AdminProducts = () => {
    const { products, addProduct, deleteProduct } = useProducts();
    const [isAdding, setIsAdding] = useState(false);

    // New Product State
    const [newProduct, setNewProduct] = useState({
        name: '',
        category: '',
        price: '',
        image: 'https://images.unsplash.com/photo-1615485925694-a67994c840fd?auto=format&fit=crop&q=80&w=800', // Default placeholder
        description: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        addProduct({
            ...newProduct,
            price: Number(newProduct.price)
        });
        setIsAdding(false);
        setNewProduct({ name: '', category: '', price: '', image: 'https://images.unsplash.com/photo-1615485925694-a67994c840fd?auto=format&fit=crop&q=80&w=800', description: '' });
    };

    return (
        <AdminLayout>
            {/* Product Management Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-gray-800">All Products</h3>
                    <button
                        onClick={() => setIsAdding(!isAdding)}
                        className="bg-primary hover:bg-orange-700 text-white text-xs font-bold uppercase px-4 py-2 rounded shadow transition"
                    >
                        {isAdding ? 'Cancel' : '+ Add Product'}
                    </button>
                </div>

                {/* Add Product Form */}
                {isAdding && (
                    <div className="p-6 bg-gray-50 border-b border-gray-200">
                        <h4 className="font-bold text-sm mb-4 uppercase text-gray-500">Add New Product</h4>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input name="name" placeholder="Product Name" value={newProduct.name} onChange={handleInputChange} required className="p-2 border rounded" />
                            <input name="category" placeholder="Category" value={newProduct.category} onChange={handleInputChange} required className="p-2 border rounded" />
                            <input name="price" type="number" placeholder="Price (₹)" value={newProduct.price} onChange={handleInputChange} required className="p-2 border rounded" />
                            <input name="image" placeholder="Image URL" value={newProduct.image} onChange={handleInputChange} required className="p-2 border rounded" />
                            <textarea name="description" placeholder="Description" value={newProduct.description} onChange={handleInputChange} required className="md:col-span-2 p-2 border rounded h-20" />
                            <button type="submit" className="md:col-span-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded">Save Product</button>
                        </form>
                    </div>
                )}

                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                            <th className="px-6 py-3 font-medium">Product</th>
                            <th className="px-6 py-3 font-medium">Category</th>
                            <th className="px-6 py-3 font-medium">Price</th>
                            <th className="px-6 py-3 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {products.map(product => (
                            <tr key={product.id} className="hover:bg-gray-50 transition">
                                <td className="px-6 py-4 text-sm font-bold text-gray-900 flex items-center gap-3">
                                    <img src={product.image} alt={product.name} className="w-8 h-8 rounded-full object-cover shadow-sm" />
                                    <div>
                                        <div>{product.name}</div>
                                        <div className="text-xs text-gray-400 font-normal">ID: {product.id}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">{product.category}</td>
                                <td className="px-6 py-4 text-sm text-gray-900">₹{product.price}</td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => deleteProduct(product.id)}
                                        className="text-red-500 hover:text-red-700 font-bold text-xs uppercase tracking-wider bg-red-50 hover:bg-red-100 px-3 py-1 rounded transition"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
};

export default AdminProducts;

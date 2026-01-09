
import React from 'react';
import { useProducts } from '../context/ProductContext';
import AdminLayout from '../components/AdminLayout';
import {
    DollarSign, ShoppingBag, Package, Truck,
    ArrowUpRight, TrendingUp, Users, Clock,
    MoreHorizontal, ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
    const { products } = useProducts();

    // Mock Data for Custom Chart
    const data = [4000, 3000, 5000, 2780, 1890, 2390, 3490, 4200, 5100, 6200, 7400, 8600];
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const maxVal = Math.max(...data);

    // Generate SVG Points
    const points = data.map((val, index) => {
        const x = (index / (data.length - 1)) * 100;
        const y = 100 - (val / maxVal) * 100;
        return `${x},${y}`;
    }).join(' ');

    const areaPoints = `0,100 ${points} 100,100`;

    // Mock Recent Orders
    const recentOrders = [
        { id: '#ORD-7829', customer: 'Raju Kumar', product: 'Wild Forest Honey', amount: 1250, status: 'Delivered' },
        { id: '#ORD-7830', customer: 'Priya Reddy', product: 'A2 Gir Cow Ghee', amount: 3450, status: 'Processing' },
        { id: '#ORD-7831', customer: 'Anita Singh', product: 'Turmeric Powder', amount: 450, status: 'Shipped' },
        { id: '#ORD-7832', customer: 'Vikram Mehta', product: 'Mustard Oil', amount: 890, status: 'Cancelled' },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Delivered': return 'bg-green-100 text-green-700';
            case 'Processing': return 'bg-blue-100 text-blue-700';
            case 'Shipped': return 'bg-orange-100 text-orange-700';
            case 'Cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <AdminLayout>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-green-50 rounded-lg text-green-600">
                            <DollarSign size={24} />
                        </div>
                        <span className="flex items-center text-green-500 text-xs font-bold bg-green-50 px-2 py-1 rounded-full">
                            <TrendingUp size={12} className="mr-1" /> +12.5%
                        </span>
                    </div>
                    <div className="text-gray-500 text-sm font-medium mb-1">Total Revenue</div>
                    <div className="text-2xl font-bold text-gray-800">₹1,24,500</div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                            <ShoppingBag size={24} />
                        </div>
                        <span className="flex items-center text-green-500 text-xs font-bold bg-green-50 px-2 py-1 rounded-full">
                            <TrendingUp size={12} className="mr-1" /> +5.2%
                        </span>
                    </div>
                    <div className="text-gray-500 text-sm font-medium mb-1">Total Orders</div>
                    <div className="text-2xl font-bold text-gray-800">342</div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-purple-50 rounded-lg text-purple-600">
                            <Users size={24} />
                        </div>
                        <span className="flex items-center text-green-500 text-xs font-bold bg-green-50 px-2 py-1 rounded-full">
                            <TrendingUp size={12} className="mr-1" /> +8.1%
                        </span>
                    </div>
                    <div className="text-gray-500 text-sm font-medium mb-1">Total Customers</div>
                    <div className="text-2xl font-bold text-gray-800">1,205</div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-orange-50 rounded-lg text-orange-600">
                            <Package size={24} />
                        </div>
                        <span className="text-xs font-bold bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
                            Active
                        </span>
                    </div>
                    <div className="text-gray-500 text-sm font-medium mb-1">Products</div>
                    <div className="text-2xl font-bold text-gray-800">{products.length}</div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column (Chart & Orders) */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Sales Overview Chart (Recharts) */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-end mb-6">
                            <div>
                                <h3 className="font-bold text-gray-800 text-lg">Sales Overview</h3>
                                <p className="text-xs text-gray-500 mt-1">Monthly sales performance for 2024</p>
                            </div>
                            <div className="text-right">
                                <span className="block text-2xl font-bold text-primary">₹54,050</span>
                                <span className="text-xs text-gray-400">This Month</span>
                            </div>
                        </div>

                        <div className="h-72 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart
                                    data={[
                                        { name: 'Jan', sales: 4000 },
                                        { name: 'Feb', sales: 3000 },
                                        { name: 'Mar', sales: 5000 },
                                        { name: 'Apr', sales: 2780 },
                                        { name: 'May', sales: 1890 },
                                        { name: 'Jun', sales: 2390 },
                                        { name: 'Jul', sales: 3490 },
                                        { name: 'Aug', sales: 4200 },
                                        { name: 'Sep', sales: 5100 },
                                        { name: 'Oct', sales: 6200 },
                                        { name: 'Nov', sales: 7400 },
                                        { name: 'Dec', sales: 8600 },
                                    ]}
                                    margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
                                >
                                    <defs>
                                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#E67E22" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#E67E22" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                    <XAxis
                                        dataKey="name"
                                        tick={{ fontSize: 12, fill: '#9CA3AF' }}
                                        axisLine={false}
                                        tickLine={false}
                                        dy={10}
                                    />
                                    <YAxis
                                        tick={{ fontSize: 12, fill: '#9CA3AF' }}
                                        axisLine={false}
                                        tickLine={false}
                                        tickFormatter={(value) => `₹${value}`}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                        itemStyle={{ color: '#E67E22', fontWeight: 'bold' }}
                                        formatter={(value) => [`₹${value}`, 'Sales']}
                                        cursor={{ stroke: '#E67E22', strokeWidth: 1, strokeDasharray: '4 4' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="sales"
                                        stroke="#E67E22"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorSales)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Recent Orders Widget */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="font-bold text-gray-800">Recent Orders</h3>
                            <Link to="/admin/orders" className="text-primary text-xs font-bold flex items-center hover:text-orange-700 transition">
                                View All <ArrowRight size={14} className="ml-1" />
                            </Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                                    <tr>
                                        <th className="px-6 py-3 font-medium">Order ID</th>
                                        <th className="px-6 py-3 font-medium">Customer</th>
                                        <th className="px-6 py-3 font-medium">Product</th>
                                        <th className="px-6 py-3 font-medium">Amount</th>
                                        <th className="px-6 py-3 font-medium">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {recentOrders.map(order => (
                                        <tr key={order.id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4 text-xs font-bold text-gray-900">{order.id}</td>
                                            <td className="px-6 py-4 text-xs text-gray-600">{order.customer}</td>
                                            <td className="px-6 py-4 text-xs text-gray-500">{order.product}</td>
                                            <td className="px-6 py-4 text-xs font-bold text-gray-900">₹{order.amount}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${getStatusColor(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>

                {/* Right Column (Widgets) */}
                <div className="space-y-8">

                    {/* Top Selling Products */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-gray-800 mb-6">Top Selling Products</h3>
                        <div className="space-y-6">
                            {products.slice(0, 4).map((product, index) => (
                                <div key={product.id} className="flex items-center gap-4">
                                    <div className="relative w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-bold text-gray-900 truncate">{product.name}</h4>
                                        <p className="text-xs text-gray-500">{product.category}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-bold text-gray-900">₹{product.price}</div>
                                        <div className="text-xs text-green-500">124 sold</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-6 py-2 text-sm text-gray-500 font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                            View All Products
                        </button>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-primary p-6 rounded-xl shadow-lg text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="font-bold text-xl mb-2">Quick Actions</h3>
                            <p className="text-orange-100 text-sm mb-6">Manage your store efficiently with these shortcuts.</p>

                            <div className="space-y-3">
                                <Link to="/admin/products" className="block w-full py-2 px-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg text-sm font-bold transition flex items-center">
                                    <Package size={16} className="mr-2" /> Add New Product
                                </Link>
                                <Link to="/admin/orders" className="block w-full py-2 px-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg text-sm font-bold transition flex items-center">
                                    <Truck size={16} className="mr-2" /> Process Orders
                                </Link>
                                <Link to="/admin/customers" className="block w-full py-2 px-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg text-sm font-bold transition flex items-center">
                                    <Users size={16} className="mr-2" /> View Customers
                                </Link>
                            </div>
                        </div>

                        {/* Decorative Background Circles */}
                        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 bg-black/10 rounded-full blur-2xl"></div>
                    </div>

                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;

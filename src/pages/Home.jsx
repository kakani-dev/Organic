import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../context/ProductContext';

const Home = () => {
    const { products } = useProducts();

    // Get featured products (e.g., first 4)
    const featuredProducts = products.slice(0, 4);

    // Categories for the circular slider
    const categories = [
        { name: "Honey", img: "/categories/honey.png" },
        { name: "Ghee", img: "/categories/ghee.png" },
        { name: "Oils", img: "/categories/oils.png" },
        { name: "Pickles", img: "/categories/pickles.png" },
        { name: "Spices", img: "/categories/spices.png" },
        { name: "Sweets", img: "/categories/sweets.png" },
    ];

    return (
        <div className="bg-[#FEFEFE]">
            {/* Hero Section */}
            <section className="relative h-[600px] flex items-center font-sans">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&q=80&w=2000"
                        alt="Farm Fresh Honey"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/10"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10 text-center md:text-left">
                    <div className="max-w-xl text-white">
                        <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-sm uppercase tracking-widest mb-4 inline-block">100% Natural</span>
                        <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 leading-tight drop-shadow-md">
                            Just as Nature Made It.
                        </h1>
                        <p className="text-lg md:text-xl mb-8 font-light text-white/90 leading-relaxed">
                            Discover the purity of Wild Forest Honey and Traditional Bilona Ghee. From our farms to your table.
                        </p>
                        <Link to="/shop" className="bg-primary hover:bg-orange-600 text-white px-10 py-4 text-sm font-bold uppercase tracking-widest transition-all shadow-lg inline-block">
                            Shop Now
                        </Link>
                    </div>
                </div>
            </section>

            {/* Circular Categories Section */}
            <section className="py-12 border-b border-gray-100">
                <div className="container mx-auto px-4">
                    <h3 className="text-center font-serif text-2xl font-bold text-gray-800 mb-10">Shop By Category</h3>
                    <div className="flex flex-wrap justify-center gap-8 md:gap-16">
                        {categories.map((cat, idx) => (
                            <Link to="/shop" key={idx} className="group flex flex-col items-center gap-3">
                                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-transparent group-hover:border-primary transition p-1">
                                    <img src={cat.img} alt={cat.name} className="w-full h-full object-cover rounded-full transform group-hover:scale-110 transition duration-500" />
                                </div>
                                <span className="font-bold text-gray-700 uppercase text-xs tracking-wider group-hover:text-primary transition">{cat.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-20 bg-soft-cream/30">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <span className="text-primary font-bold tracking-widest uppercase text-xs mb-2 block">Our Best Sellers</span>
                        <h2 className="text-4xl font-serif font-bold text-primary-brown">Farm Fresh Favorites</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {products.slice(0, 4).map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <Link to="/shop" className="border-2 border-primary-brown text-primary-brown hover:bg-primary-brown hover:text-white px-8 py-3 text-sm font-bold uppercase tracking-widest transition-all inline-block">
                            View All Products
                        </Link>
                    </div>
                </div>
            </section>

            {/* "Watch & Buy" / Video Story Section */}
            <section className="py-20 bg-primary-brown text-white relative overflow-hidden">
                <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <span className="text-primary font-bold tracking-widest uppercase text-xs mb-4 block">Our Story</span>
                        <h2 className="text-4xl font-serif font-bold mb-6">Traditional Bilona Ghee</h2>
                        <p className="text-white/70 leading-relaxed mb-6">
                            We follow the ancient Vedic process of making ghee. It starts with culturing A2 milk into curd, then hand-churning it to separate butter, and finally slow-boiling it to perfection.
                        </p>
                        <ul className="space-y-4 mb-8">
                            <li className="flex items-center gap-3"><span className="text-primary text-xl">✓</span> Free Grazing Cows</li>
                            <li className="flex items-center gap-3"><span className="text-primary text-xl">✓</span> Hand Churned Butter</li>
                            <li className="flex items-center gap-3"><span className="text-primary text-xl">✓</span> Zero Preservatives</li>
                        </ul>
                        <Link to="/shop" className="bg-primary hover:bg-white hover:text-primary text-white px-8 py-3 text-sm font-bold uppercase tracking-widest transition-all inline-block">
                            Try It Now
                        </Link>
                    </div>
                    <div className="relative rounded-xl overflow-hidden shadow-2xl border-4 border-white/10 aspect-video">
                        <img src="https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover" alt="Ghee Making Process" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group cursor-pointer hover:bg-black/30 transition">
                            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white">
                                <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;

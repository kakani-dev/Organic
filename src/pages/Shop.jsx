import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';

const Shop = () => {
    const { products } = useProducts();
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-16 mt-8">
                <span className="text-accent font-bold tracking-wider uppercase text-sm">Farm to Home</span>
                <h1 className="text-4xl md:text-5xl font-bold text-primary mt-2 mb-6">Our Harvest</h1>
                <p className="text-gray-600 max-w-2xl mx-auto text-lg font-light">Browse our hand-picked selection of premium authentic Indian products, grown with love and care.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
};

export default Shop;

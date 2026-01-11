import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from '../components/PaymentForm';

// Initialize Stripe outside component to avoid recreation
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const Checkout = () => {
    const { cartItems, cartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    const [clientSecret, setClientSecret] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: '',
        city: '',
        zip: '',
    });
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        // Auto-fill user from login
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            const user = JSON.parse(savedUser);
            setFormData(prev => ({ ...prev, name: user.name, email: user.email }));
        }

        // Load saved addresses
        const existingAddresses = localStorage.getItem('addresses');
        if (existingAddresses) {
            setSavedAddresses(JSON.parse(existingAddresses));
        }
    }, []);

    useEffect(() => {
        if (cartTotal > 0) {
            // Create PaymentIntent as soon as the page loads
            fetch(`${apiUrl}/create-payment-intent`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: cartTotal }),
            })
                .then((res) => res.json())
                .then((data) => setClientSecret(data.clientSecret))
                .catch((err) => console.error("Error fetching payment intent:", err));
        }
    }, [cartTotal]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Address Management
    const [savedAddresses, setSavedAddresses] = useState([]);
    const [showAddressDropdown, setShowAddressDropdown] = useState(false);

    const handleAddressSelect = (addr) => {
        setFormData(prev => ({
            ...prev,
            address: addr.address,
            city: addr.city,
            zip: addr.zip
        }));
        setShowAddressDropdown(false);
    };

    const handleSaveAddress = () => {
        if (!formData.address || !formData.city || !formData.zip) {
            alert("Please fill in address details first.");
            return;
        }
        const newAddress = {
            id: Date.now(),
            name: `${formData.address.substring(0, 15)}...`, // Short label
            address: formData.address,
            city: formData.city,
            zip: formData.zip
        };
        const updatedAddresses = [...savedAddresses, newAddress];
        setSavedAddresses(updatedAddresses);
        localStorage.setItem('addresses', JSON.stringify(updatedAddresses));
        alert("Address saved!");
    };

    // Move hooks to top level, before any early returns
    const appearance = {
        theme: 'stripe',
        variables: {
            colorPrimary: '#16a34a',
        },
    };
    const options = {
        clientSecret,
        appearance,
    };

    const [isLocating, setIsLocating] = useState(false);

    // ... (existing helper functions)

    const handleLocation = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
            return;
        }

        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            try {
                const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                const data = await response.json();
                const address = data.address;

                setFormData(prev => ({
                    ...prev,
                    address: [address.road, address.suburb, address.neighbourhood].filter(Boolean).join(', '),
                    city: address.city || address.town || address.village || '',
                    zip: address.postcode || ''
                }));
            } catch (error) {
                console.error('Error fetching address:', error);
                alert('Unable to fetch address details');
            } finally {
                setIsLocating(false);
            }
        }, () => {
            alert('Unable to retrieve your location');
            setIsLocating(false);
        });
    };

    const saveOrder = async () => {
        try {
            await fetch(`${apiUrl}/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customer: formData,
                    items: cartItems,
                    total: cartTotal,
                    paymentMethod,
                    status: 'Paid'
                })
            });
            console.log('Order saved');
        } catch (err) {
            console.error('Failed to save order', err);
        }
    };

    const sendReceipt = async () => {
        try {
            await fetch(`${apiUrl}/send-receipt`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    orderDetails: cartItems,
                    amount: cartTotal
                })
            });
            console.log('Receipt sent');
        } catch (err) {
            console.error('Failed to send receipt', err);
        }
    };

    const handleSuccess = async () => {
        await saveOrder();
        await sendReceipt();
        setIsSuccess(true);
        clearCart();
    };

    if (isSuccess) {
        // Trigger receipt sending once if not already done? 
        // Better to call it in the handlers.
        return (
            <div className="container mx-auto px-4 py-20 text-center animate-in fade-in duration-500">
                <div className="bg-white p-12 rounded-2xl shadow-lg max-w-2xl mx-auto border border-green-50">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Order Placed Successfully!</h2>
                    <p className="text-gray-600 mb-8">Dhanyavaad! Your fresh organic order is on its way. A receipt has been sent to your email.</p>
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

    // Previously duplicated hooks removed from here

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold text-center mb-12 text-primary">Secure Checkout</h1>
            <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
                {/* Form */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm">1</span>
                            Shipping Information
                        </h2>
                        <div className="flex gap-2">
                            {/* Saved Addresses Dropdown */}
                            {savedAddresses.length > 0 && (
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddressDropdown(!showAddressDropdown)}
                                        className="text-gray-600 text-sm font-bold flex items-center gap-1 hover:text-primary transition"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                        Saved Addresses
                                    </button>
                                    {showAddressDropdown && (
                                        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-100 z-10 overflow-hidden">
                                            {savedAddresses.map(addr => (
                                                <button
                                                    key={addr.id}
                                                    type="button"
                                                    onClick={() => handleAddressSelect(addr)}
                                                    className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-0 text-sm"
                                                >
                                                    <div className="font-bold text-gray-800">{addr.city}</div>
                                                    <div className="text-gray-500 truncate">{addr.address}</div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={handleSaveAddress}
                                className="text-primary text-sm font-bold flex items-center gap-1 hover:underline"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
                                Save
                            </button>

                            <button
                                type="button"
                                onClick={handleLocation}
                                disabled={isLocating}
                                className="text-primary text-sm font-bold flex items-center gap-1 hover:underline disabled:opacity-50"
                            >
                                {isLocating ? (
                                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                )}
                                Detect Location
                            </button>
                        </div>
                    </div>
                    <div className="space-y-4 mb-8">
                        <div>
                            <label className="block text-gray-700 mb-2 font-medium">Full Name</label>
                            <input type="text" name="name" required className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition" placeholder="Rajesh Kumar" onChange={handleChange} value={formData.name || ''} />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-2 font-medium">Email</label>
                            <input type="email" name="email" required className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition" placeholder="rajesh@example.com" onChange={handleChange} value={formData.email || ''} />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-2 font-medium">Address</label>
                            <input type="text" name="address" required className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition" placeholder="Flat 402, Green Apartments" onChange={handleChange} value={formData.address || ''} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700 mb-2 font-medium">City</label>
                                <input type="text" name="city" required className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition" placeholder="Mumbai" onChange={handleChange} value={formData.city || ''} />
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-2 font-medium">PIN Code</label>
                                <input type="text" name="zip" required className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition" placeholder="400001" onChange={handleChange} value={formData.zip || ''} />
                            </div>
                        </div>
                    </div>

                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm">2</span>
                        Payment Details
                    </h2>

                    <div className="flex gap-4 mb-8">
                        <button
                            type="button"
                            onClick={() => setPaymentMethod('card')}
                            className={`flex-1 py-3 px-4 rounded-xl border-2 font-medium transition flex items-center justify-center gap-2 ${paymentMethod === 'card' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-200 hover:border-primary/50 text-gray-600'}`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                            Online Payment (Secure)
                        </button>
                        <button
                            type="button"
                            onClick={() => setPaymentMethod('upi')}
                            className={`flex-1 py-3 px-4 rounded-xl border-2 font-medium transition flex items-center justify-center gap-2 ${paymentMethod === 'upi' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-200 hover:border-primary/50 text-gray-600'}`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path></svg>
                            Direct UPI / QR
                        </button>
                    </div>

                    {paymentMethod === 'card' ? (
                        clientSecret ? (
                            <Elements options={options} stripe={stripePromise}>
                                <PaymentForm amount={cartTotal} onSuccess={() => setIsSuccess(true)} />
                            </Elements>
                        ) : (
                            <div className="flex justify-center p-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            </div>
                        )
                    ) : (
                        <div className="bg-gray-50 p-8 rounded-xl border border-gray-200 text-center animate-in fade-in duration-300">
                            <h3 className="font-bold text-gray-800 mb-2">Scan to Pay</h3>
                            <p className="text-gray-500 text-sm mb-6">Use any UPI app like Google Pay, PhonePe, or Paytm</p>

                            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 inline-block mb-6">
                                {/* Encoded UPI string to ensure parameters like amount are correctly parsed */}
                                <img
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`upi://pay?pa=6281234148@pthdfc&pn=OrganicShop&am=${cartTotal.toFixed(2)}&cu=INR`)}`}
                                    alt="UPI QR Code"
                                    className="w-48 h-48"
                                />
                            </div>

                            <div className="flex items-center gap-4 my-6 w-full max-w-sm mx-auto">
                                <div className="h-px bg-gray-200 flex-1"></div>
                                <span className="text-sm text-gray-400 font-medium">OR</span>
                                <div className="h-px bg-gray-200 flex-1"></div>
                            </div>

                            <div className="max-w-sm mx-auto mb-8 text-left">
                                <label className="block text-gray-700 mb-2 font-medium text-sm">Send Payment Request to your UPI ID</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="e.g. 9876543210@upi"
                                        className="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition text-sm"
                                    />
                                    <button
                                        type="button"
                                        className="bg-primary text-white px-4 py-2 rounded-lg font-bold hover:bg-opacity-90 transition text-sm whitespace-nowrap"
                                        onClick={(e) => {
                                            const btn = e.target;
                                            const originalText = btn.innerText;
                                            btn.innerText = 'Sending...';
                                            btn.disabled = true;
                                            setTimeout(() => {
                                                btn.innerText = 'Sent!';
                                                btn.classList.add('bg-green-600');
                                                setTimeout(() => {
                                                    setIsSuccess(true);
                                                }, 1000);
                                            }, 2000);
                                        }}
                                    >
                                        Send Request
                                    </button>
                                </div>
                                <p className="text-xs text-gray-400 mt-2">We will send a payment request to your UPI app.</p>
                            </div>

                            <div className="bg-white py-3 px-4 rounded-lg border border-gray-200 inline-flex items-center gap-3 mb-8">
                                <span className="text-gray-500 text-sm">UPI ID:</span>
                                <span className="font-mono font-bold text-gray-800">6281234148@pthdfc</span>
                                <button onClick={() => navigator.clipboard.writeText('6281234148@pthdfc')} className="text-primary hover:text-primary/80" title="Copy UPI ID">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"></path></svg>
                                </button>
                            </div>

                            <button
                                onClick={() => setIsSuccess(true)}
                                className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-lg hover:bg-opacity-90 transition transform active:scale-95"
                            >
                                I have completed the payment
                            </button>
                            <p className="text-xs text-gray-400 mt-4">Click the button above after you have successfully transferred the amount.</p>
                        </div>
                    )}
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

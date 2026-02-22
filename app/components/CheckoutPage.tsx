'use client';

import React, { useState, useRef, useContext } from 'react';
import { CreditCard, ArrowLeft } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import type { PageName } from '../types';
import Header from './Header';
import Footer from './Footer';

interface CheckoutPageProps {
  setCurrentPage: (page: PageName) => void;
  onNavigateToSignup?: () => void;
}

const CheckoutPage = ({ setCurrentPage, onNavigateToSignup }: CheckoutPageProps): JSX.Element => {
  const { 
    cartItems, 
    calculateTotal,
    calculateOriginalTotal,
    calculateDiscount,
    calculateGST,
    calculateFinalTotal,
    placeOrder
  } = React.useContext(CartContext);
  
  // Function to calculate GST-inclusive price
  const calculateGSTInclusivePrice = (price, category) => {
    // Get GST rate based on price and category
    let gstRate = 0.18; // Default 18%
    if (category === 'Clothing') {
      gstRate = price <= 2500 ? 0.05 : 0.18;
    }
    
    // Calculate GST-inclusive price
    return Math.round(price * (1 + gstRate));
  };
  
  // Function to calculate GST-inclusive total for cart
  const calculateGSTInclusiveTotal = () => {
    return cartItems.reduce((total, item) => {
      const inclusivePrice = calculateGSTInclusivePrice(item.price, item.category);
      return total + (inclusivePrice * item.quantity);
    }, 0);
  };
  
  // Function to calculate GST-inclusive original total
  const calculateGSTInclusiveOriginalTotal = () => {
    return cartItems.reduce((total, item) => {
      const inclusiveOriginalPrice = calculateGSTInclusivePrice(item.originalPrice, item.category);
      return total + (inclusiveOriginalPrice * item.quantity);
    }, 0);
  };
  
  // Function to calculate GST-inclusive discount
  const calculateGSTInclusiveDiscount = () => {
    return calculateGSTInclusiveOriginalTotal() - calculateGSTInclusiveTotal();
  };
  
  const [deliveryDetails, setDeliveryDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });
  
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const companyDropdownRef = useRef(null);
  
  // User's available credits (mock data - in a real app, this would come from user context or API)
  const [userCredits] = useState(50); // Example: 50 credits = ₹5000
  
  // Calculate total credits needed for order
  const calculateTotalCredits = () => {
    return Math.ceil(calculateGSTInclusiveTotal() / 100); // 1 Credit = ₹100
  };
  
  // Check if user has enough credits to pay with credits
  const canPayWithCredits = userCredits >= calculateTotalCredits();
  
  // Function to calculate GST rate based on product price and category
  const getGSTRate = (price, category) => {
    // For clothing items
    if (category === 'Clothing') {
      // Clothes up to ₹2,500 per piece → 5% GST
      if (price <= 2500) {
        return 0.05; // 5%
      }
      // Clothes above ₹2,500 per piece → 18% GST
      else {
        return 0.18; // 18%
      }
    }
    // For accessories and other items
    else {
      // For accessories like watches and handbags, using 18% GST
      // This can be adjusted based on specific GST rules for accessories
      return 0.18; // 18%
    }
  };
  
  // Calculate GST breakdown by rate
  const calculateGSTBreakdown = () => {
    const gst5 = cartItems.reduce(
      (total, item) => {
        const gstRate = getGSTRate(item.price, item.category);
        return gstRate === 0.05 ? total + Math.round(item.price * item.quantity * gstRate) : total;
      },
      0
    );
    
    const gst18 = cartItems.reduce(
      (total, item) => {
        const gstRate = getGSTRate(item.price, item.category);
        return gstRate === 0.18 ? total + Math.round(item.price * item.quantity * gstRate) : total;
      },
      0
    );
    
    return { gst5, gst18 };
  };
  
  const { gst5, gst18 } = calculateGSTBreakdown();
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDeliveryDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };
  
  const handleCompletePurchase = () => {
    // Validate form
    if (!deliveryDetails.firstName || !deliveryDetails.lastName || 
        !deliveryDetails.email || !deliveryDetails.phone || 
        !deliveryDetails.address || !deliveryDetails.city || 
        !deliveryDetails.state || !deliveryDetails.zipCode) {
      alert('Please fill in all delivery details');
      return;
    }
    
    // Place order
    const newOrder = placeOrder(deliveryDetails, paymentMethod);
    
    // Redirect to order summary
    setCurrentPage('orderSummary');
  };
  
  return (
    <div className="min-h-screen bg-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Assistant:wght@200;300;400;500;600;700;800&display=swap');
        
        * {
          font-family: 'Assistant', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
        }
      `}</style>
      
      {/* Main Header - unchanged but without menu and cart icons */}
      <Header 
        setCurrentPage={setCurrentPage} 
        setShowAuth={() => {}} 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isCompanyDropdownOpen={isCompanyDropdownOpen}
        setIsCompanyDropdownOpen={setIsCompanyDropdownOpen}
        companyDropdownRef={companyDropdownRef}
        showMenuIcon={false}
        showCartIcon={false}
      />
      
      {/* New Dedicated Checkout Secondary Header */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-8xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800 mb-1">Checkout</h2>
            <button 
              onClick={() => setCurrentPage('cart')}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors font-semibold"
            >
              <ArrowLeft size={18} />
              Back to Cart
            </button>
          </div>
        </div>
      </div>
      
      <div className="max-w-8xl mx-auto px-4 py-8">
  <div className="grid md:grid-cols-3 gap-8">
    {/* Cart Summary */}
    <div className="md:col-span-2">
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Cart Summary</h2>
        
        <div className="space-y-4 mb-6">
          {cartItems.map((item) => {
            const inclusivePrice = calculateGSTInclusivePrice(item.price, item.category);
            // Updated credit calculation: price divided by 10 instead of 100
            const itemCredits = (inclusivePrice / 10).toFixed(2);
            
            return (
              <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="flex gap-4 pb-4 border-b">
                <img 
                  src={item.images?.[0] || '/api/placeholder/400/500'} 
                  alt={item.name} 
                  className="w-16 h-20 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{item.name}</h3>
                  <div className="flex flex-wrap gap-2 mb-2">
                   <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-800 mt-2">
                   Size: {item.selectedSize}
                   </span>
                   <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-800 mt-2">
                      Color: {item.selectedColor}
                      </span>
                       <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-800 mt-2">
                      Qty: {item.quantity}
                    </span>
                    </div>
                  <div className="flex items-center mb-4">
                    <span className="font-bold">₹{inclusivePrice * item.quantity}</span>
                    <span className="inline-flex items-center px-3 py-1 rounded text-xs font-medium bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 text-white ml-1 shadow-lg">
                     {itemCredits * item.quantity} Credits
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="space-y-2 mb-6">
          <div className="flex justify-between">
            <span className="text-gray-600">Total MRP (Inclusive of all taxes)</span>
            <span className="font-semibold">₹{calculateGSTInclusiveTotal()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Discount</span>
            <span className="font-semibold text-green-600">-₹{calculateGSTInclusiveDiscount()}</span>
          </div>
          <div className="flex justify-between text-lg font-bold pt-2 border-t">
            <div className="flex items-baseline">
              <span>Total</span>
              {/* Updated total credits calculation <span className="text-sm text-gray-500 ml-1">({(calculateGSTInclusiveTotal() / 10).toFixed(2)} Credits)</span> */}  
            </div>
            <div className="flex items-baseline">
              <span>₹{calculateGSTInclusiveTotal()}</span>
            </div>
          </div>
        </div>
        
        <button 
          onClick={handleCompletePurchase}
          className="w-full mt-2 py-3 bg-slate-800 text-white text-sm font-bold rounded hover:bg-slate-700 transition-colors"
        >
          Complete Purchase
        </button>
      </div>
      
      {/* Delivery Details Form */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Delivery Details</h2>
        
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input 
              type="text" 
              name="firstName"
              value={deliveryDetails.firstName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input 
              type="text" 
              name="lastName"
              value={deliveryDetails.lastName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input 
            type="email" 
            name="email"
            value={deliveryDetails.email}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <input 
            type="tel" 
            name="phone"
            value={deliveryDetails.phone}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <textarea 
            name="address"
            value={deliveryDetails.address}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input 
              type="text" 
              name="city"
              value={deliveryDetails.city}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
            <input 
              type="text" 
              name="state"
              value={deliveryDetails.state}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
            <input 
              type="text" 
              name="zipCode"
              value={deliveryDetails.zipCode}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
    
    {/* Payment Section */}
    <div>
      <div className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Payment Method</h2>
        
        <div className="space-y-3 mb-6">
          <button 
            onClick={() => handlePaymentMethodChange('card')}
            className={`w-full flex items-center gap-3 p-3 border rounded-md ${paymentMethod === 'card' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
          >
            <CreditCard size={20} />
            <span className="font-medium">Card Payment</span>
          </button>
          
          <button 
            onClick={() => handlePaymentMethodChange('upi')}
            className={`w-full flex items-center gap-3 p-3 border rounded-md ${paymentMethod === 'upi' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
          >
            <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">U</div>
            <span className="font-medium">UPI</span>
          </button>
          
          <button 
            onClick={() => handlePaymentMethodChange('wallet')}
            className={`w-full flex items-center gap-3 p-3 border rounded-md ${paymentMethod === 'wallet' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
          >
            <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold">W</div>
            <span className="font-medium">Platform Wallet</span>
          </button>
          
          <button 
            onClick={() => handlePaymentMethodChange('credits')}
            className={`w-full flex items-center gap-3 p-3 border rounded-md ${paymentMethod === 'credits' ? 'border-blue-500 bg-blue-50' : canPayWithCredits ? 'border-gray-300' : 'border-gray-200 opacity-50 cursor-not-allowed'}`}
            disabled={!canPayWithCredits}
          >
            <div className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">C</div>
            <div className="flex-1 text-left">
              <span className="font-medium">Credits</span>
              {!canPayWithCredits && (
                <p className="text-xs text-red-500">Insufficient credits</p>
              )}
            </div>
          </button>
        </div>
        
        {paymentMethod === 'card' && (
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
              <input 
                type="text" 
                placeholder="1234 5678 9012 3456"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                <input 
                  type="text" 
                  placeholder="MM/YY"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                <input 
                  type="text" 
                  placeholder="123"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}
        
        {paymentMethod === 'upi' && (
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">UPI ID</label>
              <input 
                type="text" 
                placeholder="yourname@upi"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <button className="flex-1 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors font-semibold">
                Google Pay
              </button>
              <button className="flex-1 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors font-semibold">
                PhonePe
              </button>
              <button className="flex-1 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors font-semibold">
                Paytm
              </button>
            </div>
          </div>
        )}
        
        {paymentMethod === 'wallet' && (
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Wallet Type</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Income Wallet</option>
                <option>E-Wallet</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Available Balance</label>
              <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-green-800 font-semibold">₹5,000</p>
              </div>
            </div>
          </div>
        )}
        
        {paymentMethod === 'credits' && (
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Credits Information</label>
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-md">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700">Available Credits:</span>
                  <span className="font-semibold text-purple-800">{userCredits}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700">Credits Required:</span>
                  {/* Updated credits calculation */}
                  <span className="font-semibold text-purple-800">{(calculateGSTInclusiveTotal() / 10).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Credits Remaining:</span>
                  {/* Updated credits calculation */}
                  <span className="font-semibold text-purple-800">{(userCredits - (calculateGSTInclusiveTotal() / 10)).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex gap-3">
          <button 
            onClick={() => setCurrentPage('cart')}
            className="flex-1 mt-2 py-3 bg-slate-800 text-white text-sm font-bold rounded hover:bg-slate-700 transition-colors"
          >
            Continue Shopping
          </button>
          <button 
            onClick={handleCompletePurchase}
            className="flex-1 mt-2 py-3 bg-slate-800 text-white text-sm font-bold rounded hover:bg-slate-700 transition-colors"
          >
            Pay Now
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
      
      <Footer />
    </div>
  );
};

// Order Summary Page Component

export default CheckoutPage;

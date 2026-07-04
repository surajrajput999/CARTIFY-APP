import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/cartContext';
import { Trash2, Plus, Minus } from 'lucide-react';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity } = useCart();

  // 🛠️ FIX: Safely calculate total amount (Handling missing quantities or string prices)
  const totalAmount = cart.reduce((total, item) => {
    const itemPrice = Number(item.price) || 0;
    const itemQuantity = Number(item.quantity) || 1; // Agar quantity missing hai, toh 1 maan lo
    return total + (itemPrice * itemQuantity);
  }, 0);

  // Empty cart state
  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto p-4 md:p-6 mt-4 min-h-[60vh] flex flex-col items-center justify-center">
        <img src="https://cdn-icons-png.flaticon.com/512/11329/11329060.png" alt="Empty Cart" className="w-48 h-48 mb-6 opacity-50" />
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Your Cart is Empty</h1>
        <p className="text-gray-500 mb-6">Looks like you haven't added anything yet.</p>
        <Link to="/" className="bg-teal-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-teal-700 transition-colors">
          Start Shopping
        </Link>
      </div>
    );
  }

  // Populated cart state
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 mt-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Shopping Cart ({cart.length} items)</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Side: Cart Items List */}
        <div className="lg:w-2/3 space-y-4">
          {cart.map((item) => (
            <div key={item._id || item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center gap-4">
              <img src={item.image} alt={item.title} className="w-24 h-24 object-cover rounded-md border" />
              
              <div className="flex-1 text-center sm:text-left">
                <h3 className="font-semibold text-gray-800 text-lg">{item.title}</h3>
                <p className="text-teal-600 font-bold text-xl mt-1">₹{Number(item.price).toFixed(2)}</p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg border">
                <button onClick={() => updateQuantity(item._id || item.id, 'decrease')} className="p-1 hover:bg-white rounded shadow-sm text-gray-600">
                  <Minus size={16} />
                </button>
                <span className="font-semibold w-6 text-center">{item.quantity || 1}</span>
                <button onClick={() => updateQuantity(item._id || item.id, 'increase')} className="p-1 hover:bg-white rounded shadow-sm text-gray-600">
                  <Plus size={16} />
                </button>
              </div>

              {/* Delete Button */}
              <button 
                onClick={() => removeFromCart(item._id || item.id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-2"
              >
                <Trash2 size={24} />
              </button>
            </div>
          ))}
        </div>

        {/* Right Side: Order Summary (Bill) */}
        <div className="lg:w-1/3">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
            
            <div className="space-y-3 text-gray-600 border-b pb-4 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-800">₹{totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-500 font-medium">Free</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center mb-6">
              <span className="text-lg font-bold text-gray-800">Total</span>
              <span className="text-2xl font-bold text-teal-600">₹{totalAmount.toFixed(2)}</span>
            </div>
            
            {/* 🚀 FIX: Connect to Checkout Page */}
            <Link to="/checkout" className="w-full flex justify-center bg-gray-900 text-white py-3 rounded-lg font-bold hover:bg-teal-600 transition-colors shadow-md">
              Proceed to Checkout
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CartPage;
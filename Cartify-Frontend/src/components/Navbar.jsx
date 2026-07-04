import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, LogOut } from 'lucide-react'; // Added LogOut icon
import { useCart } from '../context/cartContext';
import { useAuth } from '../context/authContext'; // 👈 Import the Auth Context

const Navbar = () => {
  const { cart } = useCart();
  const { user, logout } = useAuth(); // 👈 Retrieve user data and logout function
  const [keyword, setKeyword] = useState('');
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const navigate = useNavigate();

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/?search=${keyword}`);
    } else {
      navigate('/');
    }
  };

  // Handle user logout
  const handleLogout = () => {
    logout();
    navigate('/'); // Redirect to the home page after logging out
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-4">
          
          {/* Left: Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center cursor-pointer">
            <span className="text-3xl font-extrabold text-teal-600 tracking-tight">Cartify.</span>
          </Link>

          {/* 🔍 Middle: Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl relative mx-4">
            <input 
              type="text" 
              placeholder="Search for products, brands and more..." 
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full pl-4 pr-12 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 bg-gray-50 text-gray-800"
            />
            <button type="submit" className="absolute right-0 top-0 h-full px-4 text-teal-600 hover:bg-teal-100 rounded-r-lg transition-colors">
              <Search size={20} />
            </button>
          </form>

          {/* Right: User Profile/Login & Cart */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            
            {/* Mobile Search Toggle Button */}
            <button 
              type="button"
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              className="md:hidden text-gray-600 hover:text-teal-600 p-1.5 rounded-lg hover:bg-gray-50 transition-colors"
              title="Search"
            >
              <Search size={20} />
            </button>
            
            {/* 👤 Conditional Rendering based on Authentication Status */}
            {user ? (
              <div className="flex items-center space-x-4">
                {/* Profile Link (We will build this page next) */}
                <Link to="/profile" className="text-teal-700 hover:text-teal-800 flex items-center gap-1.5 font-bold transition-colors">
                  <User size={20} />
                  {/* Extract and display the first name of the user */}
                  <span className="hidden sm:inline">Hi, {user.name.split(' ')[0]}</span> 
                </Link>
                
                {/* Logout Button */}
                <button 
                  onClick={handleLogout} 
                  className="text-red-500 hover:text-red-700 flex items-center gap-1.5 font-medium transition-colors"
                  title="Logout"
                >
                  <LogOut size={20} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              /* Default Login Button */
              <Link to="/login" className="text-gray-600 hover:text-teal-600 flex items-center gap-1.5 font-medium transition-colors">
                <User size={20} />
                <span className="hidden sm:inline">Login</span>
              </Link>
            )}
            
            {/* Cart Icon */}
            <Link to="/cart" className="text-gray-600 hover:text-teal-600 flex items-center gap-1.5 font-medium relative transition-colors">
              <ShoppingCart size={20} />
              <span className="hidden sm:inline">Cart</span>
              {cart && cart.length > 0 && (
                <span className="absolute -top-2 -right-3 sm:-right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-sm">
                  {cart.length}
                </span>
              )}
            </Link>
          </div>
          
        </div>
      </div>
      
      {/* Mobile Search Input Panel */}
      {showMobileSearch && (
        <div className="md:hidden bg-gray-50 border-t border-gray-100 p-3 shadow-inner animate-fade-in-up">
          <form onSubmit={(e) => { handleSearch(e); setShowMobileSearch(false); }} className="relative">
            <input 
              type="text" 
              placeholder="Search for products, brands..." 
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full pl-4 pr-12 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 bg-white text-gray-800 text-sm"
              autoFocus
            />
            <button type="submit" className="absolute right-0 top-0 h-full px-4 text-teal-600 hover:bg-teal-50 rounded-r-xl transition-colors">
              <Search size={18} />
            </button>
          </form>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';

import HeroBanner from '../components/HeroBanner';
import ProductCard from '../components/ProductCard';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || ''; 

  useEffect(() => {
    // URL ko clean kar diya gaya hai
    api.get('/api/products')
      .then((response) => setProducts(response.data))
      .catch((error) => console.error("Data lane mein error:", error));
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="max-w-7xl mx-auto p-4 md:p-6 mt-4">
      <HeroBanner />
      
      <div className="mt-12 mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-center">
        <div className="flex flex-wrap gap-3 justify-center">
          {['all', 'electronics', 'clothing', 'footwear', 'accessories', 'furniture', 'beauty'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium capitalize transition-colors ${
                selectedCategory === cat 
                  ? 'bg-teal-600 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div id="products" className="mb-6 flex justify-between items-end scroll-mt-24">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {searchQuery ? `Search Results for "${searchQuery}"` : 'Trending Products ⚡'}
          </h2>
          <div className="w-20 h-1 bg-teal-500 rounded mt-2"></div>
        </div>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-400 mb-2">Sorry, no results found! 🕵️‍♂️</h3>
          <p className="text-gray-500">
            We couldn't find any matches for <span className="font-semibold text-gray-700">"{searchQuery}"</span>.
          </p>
          <p className="text-gray-500 mt-1">Try checking your spelling or using more general terms.</p>
        </div>
      )}
    </main>
  );
};

export default HomePage;
import CheckoutPage from './pages/CheckoutPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';
import ProductDetailsPage from './pages/ProductDetailsPage'; // Naya page import kiya

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 font-sans pb-10">
        
        <Navbar />
        <Toaster position="bottom-right" reverseOrder={false} />
        
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          {/* Naya Route jisme :id ek dynamic value hai */}
          <Route path="/product/:id" element={<ProductDetailsPage />} /> 
        </Routes>
        
      </div>
    </Router>
  );
}

export default App;
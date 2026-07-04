import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google';

// 👇 Aapke purane contexts (path check kar lijiyega agar alag ho toh)
import { AuthProvider } from './context/authContext';
import { CartProvider } from './context/cartContext'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Yahan apni Google Cloud wali asali Client ID zaroor daalein */}
    <GoogleOAuthProvider clientId="62349504845-2btfd57hrb7vd4muvb4d71kfpmo2uohj.apps.googleusercontent.com"> 
      <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>,
)
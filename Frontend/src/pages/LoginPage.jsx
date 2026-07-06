import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import React, { useState, useRef } from 'react';
import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowRight, ShieldCheck, Loader2, ArrowLeft, Lock, User as UserIcon } from 'lucide-react';
import api from '../api/axios';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  // 🎛️ Master States
  const [loginMethod, setLoginMethod] = useState('otp'); 
  const [isRegistering, setIsRegistering] = useState(false); 
  const [isForgotPassword, setIsForgotPassword] = useState(false); 
  const [forgotStep, setForgotStep] = useState(1);

  // 📝 Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState(''); 
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [step, setStep] = useState(1); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const inputRefs = useRef([]);

  // ==========================================
  // 📱 OTP LOGIC (Helper functions)
  // ==========================================
  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    if (value !== '' && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // ==========================================
  // 🔄 FORGOT PASSWORD LOGIC
  // ==========================================
  const handleSendResetOtp = async (e) => {
    e.preventDefault();
    setError(''); setSuccessMsg(''); setLoading(true);
    try {
      await api.post('/api/auth/forgot-password', { email });
      setSuccessMsg('Reset OTP sent to your email! 📩');
      setForgotStep(2); 
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length < 6) return setError('Please enter all 6 digits.');
    if (newPassword.length < 6) return setError('Password must be at least 6 characters.');
    
    setError(''); setLoading(true);
    try {
      await api.post('/api/auth/reset-password', { email, otp: otpValue, newPassword });
      setSuccessMsg('Password reset successful! 🎉 Please login.');
      
      setIsForgotPassword(false);
      setForgotStep(1);
      setOtp(['', '', '', '', '', '']);
      setPassword('');
      setNewPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP or expired.');
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // 📱 LOGIN / SIGNUP LOGIC
  // ==========================================
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError(''); setSuccessMsg(''); setLoading(true);
    try {
      await api.post('/api/auth/send-otp', { email });
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length < 6) return setError('Please enter all 6 digits.');
    setError(''); setLoading(true);
    try {
      const response = await api.post('/api/auth/verify-otp', { email, otp: otpValue });
      login(response.data.user, response.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordAuth = async (e) => {
    e.preventDefault();
    setError(''); setSuccessMsg(''); setLoading(true);
    try {
      if (isRegistering) {
        await api.post('/api/auth/register', { name, email, password });
        setSuccessMsg('Account created successfully! Please log in.');
        setIsRegistering(false); 
        setPassword('');
      } else {
        const response = await api.post('/api/auth/login', { email, password });
        login(response.data.user, response.data.token);
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (mode) => {
    setLoginMethod(mode); setError(''); setSuccessMsg(''); setIsForgotPassword(false); setStep(1); setForgotStep(1);
  };

  // ==========================================
  // 🎨 UI RENDER
  // ==========================================
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
        
        {/* 🎛️ Toggle Buttons */}
        {!isForgotPassword && step === 1 && (
          <div className="flex bg-gray-100 p-1 rounded-xl mb-8">
            <button
              onClick={() => switchMode('otp')}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${loginMethod === 'otp' ? 'bg-white text-teal-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Login with OTP
            </button>
            <button
              onClick={() => switchMode('password')}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${loginMethod === 'password' ? 'bg-white text-teal-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Email & Password
            </button>
          </div>
        )}

        {/* 🔴 Error & Success Messages */}
        {error && <div className="mb-6 p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm font-medium animate-fade-in-up">{error}</div>}
        {successMsg && <div className="mb-6 p-3 bg-green-50 border border-green-100 text-green-600 rounded-lg text-sm font-medium animate-fade-in-up">{successMsg}</div>}

        {/* ========================================= */}
        {/* 🔄 VIEW 3: FORGOT PASSWORD FLOW */}
        {/* ========================================= */}
        {isForgotPassword && (
          <div className="animate-fade-in-up">
            <button onClick={() => { setIsForgotPassword(false); setForgotStep(1); setError(''); setSuccessMsg(''); }} className="flex items-center text-sm font-bold text-teal-600 hover:text-teal-700 mb-6 transition-colors">
              <ArrowLeft size={16} className="mr-1" /> Back to Login
            </button>
            
            {forgotStep === 1 ? (
              <form onSubmit={handleSendResetOtp} className="space-y-6">
                <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Reset Password</h2>
                <p className="text-gray-500 mb-6">Enter your email and we'll send you an OTP to reset your password.</p>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute inset-y-0 left-3 top-4 h-5 w-5 text-gray-400" />
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="block w-full pl-10 pr-3 py-4 border border-gray-200 rounded-xl focus:ring-teal-500 focus:border-teal-500 font-medium bg-gray-50" placeholder="name@example.com" />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-teal-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-teal-700 transition-all shadow-md">
                  {loading ? <Loader2 className="animate-spin" size={24} /> : 'Send Reset OTP'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-6">
                <div>
                  <h2 className="text-xl font-extrabold text-gray-900 mb-2">Verify & Reset</h2>
                  <p className="text-gray-500 text-sm mb-4">OTP sent to <span className="font-bold text-gray-800">{email}</span></p>
                </div>
                <div className="flex justify-between gap-1 sm:gap-2">
                  {otp.map((digit, index) => (
                    <input key={index} ref={(el) => (inputRefs.current[index] = el)} type="text" inputMode="numeric" maxLength={1} value={digit} onChange={(e) => handleOtpChange(index, e.target.value)} onKeyDown={(e) => handleKeyDown(index, e)} className="w-10 h-12 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-extrabold text-gray-900 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-0 bg-gray-50" />
                  ))}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 mt-4">New Password</label>
                  <div className="relative">
                    <Lock className="absolute inset-y-0 left-3 top-4 h-5 w-5 text-gray-400" />
                    <input type="password" required minLength="6" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="block w-full pl-10 pr-3 py-4 border border-gray-200 rounded-xl focus:ring-teal-500 focus:border-teal-500 font-medium bg-gray-50" placeholder="Enter new password" />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-teal-600 transition-all shadow-md mt-2">
                  {loading ? <Loader2 className="animate-spin" size={24} /> : 'Save New Password'}
                </button>
              </form>
            )}
          </div>
        )}

        {/* ========================================= */}
        {/* 📱 VIEW 1: OTP LOGIN METHOD */}
        {/* ========================================= */}
        {!isForgotPassword && loginMethod === 'otp' && (
          <div>
            {step === 1 ? (
              <form onSubmit={handleSendOtp} className="space-y-6 animate-fade-in-up">
                <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Instant Login</h2>
                <p className="text-gray-500 mb-6">Enter your email to receive a 6-digit secure code.</p>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute inset-y-0 left-3 top-4 h-5 w-5 text-gray-400" />
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="block w-full pl-10 pr-3 py-4 border border-gray-200 rounded-xl focus:ring-teal-500 focus:border-teal-500 font-medium bg-gray-50" placeholder="e.g. name@example.com" />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-teal-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-teal-700 transition-all shadow-md">
                  {loading ? <Loader2 className="animate-spin" size={24} /> : 'Get OTP'} {!loading && <ArrowRight size={20} />}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-8 animate-fade-in-up">
                <button type="button" onClick={() => setStep(1)} className="flex items-center text-sm font-bold text-teal-600 hover:text-teal-700 mb-4">
                  <ArrowLeft size={16} className="mr-1" /> Change Email
                </button>
                <div>
                  <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Enter OTP</h2>
                  <p className="text-gray-500 mb-6">Sent to <span className="font-bold text-gray-800">{email}</span></p>
                </div>
                <div className="flex justify-between gap-1 sm:gap-2">
                  {otp.map((digit, index) => (
                    <input key={index} ref={(el) => (inputRefs.current[index] = el)} type="text" inputMode="numeric" maxLength={1} value={digit} onChange={(e) => handleOtpChange(index, e.target.value)} onKeyDown={(e) => handleKeyDown(index, e)} className="w-10 h-12 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-extrabold text-gray-900 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-0 bg-gray-50" />
                  ))}
                </div>
                <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-teal-600 transition-all shadow-md">
                  {loading ? <Loader2 className="animate-spin" size={24} /> : 'Verify & Login'} {!loading && <ShieldCheck size={20} />}
                </button>
              </form>
            )}
          </div>
        )}

        {/* ========================================= */}
        {/* 🗝️ VIEW 2: PASSWORD LOGIN / SIGNUP METHOD */}
        {/* ========================================= */}
        {!isForgotPassword && loginMethod === 'password' && (
          <form onSubmit={handlePasswordAuth} className="space-y-5 animate-fade-in-up">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
              {isRegistering ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-gray-500 mb-6">
              {isRegistering ? 'Join us for a premium shopping experience.' : 'Enter your credentials to access your account.'}
            </p>

            {isRegistering && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute inset-y-0 left-3 top-4 h-5 w-5 text-gray-400" />
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="block w-full pl-10 pr-3 py-4 border border-gray-200 rounded-xl focus:ring-teal-500 focus:border-teal-500 font-medium bg-gray-50" placeholder="John Doe" />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute inset-y-0 left-3 top-4 h-5 w-5 text-gray-400" />
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="block w-full pl-10 pr-3 py-4 border border-gray-200 rounded-xl focus:ring-teal-500 focus:border-teal-500 font-medium bg-gray-50" placeholder="name@example.com" />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-bold text-gray-700">Password</label>
                {!isRegistering && (
                  <button type="button" onClick={() => { setIsForgotPassword(true); setError(''); setSuccessMsg(''); }} className="text-sm font-bold text-teal-600 hover:text-teal-700">
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute inset-y-0 left-3 top-4 h-5 w-5 text-gray-400" />
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} minLength="6" className="block w-full pl-10 pr-3 py-4 border border-gray-200 rounded-xl focus:ring-teal-500 focus:border-teal-500 font-medium bg-gray-50" placeholder="Min. 6 characters" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full flex items-center justify-center bg-gray-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-teal-600 transition-all shadow-md mt-4">
              {loading ? <Loader2 className="animate-spin" size={24} /> : (isRegistering ? 'Sign Up' : 'Login')}
            </button>

            <div className="text-center mt-6">
              <button type="button" onClick={() => { setIsRegistering(!isRegistering); setError(''); setSuccessMsg(''); }} className="text-sm font-bold text-teal-600 hover:text-teal-700">
                {isRegistering ? 'Already have an account? Login' : "Don't have an account? Sign up"}
              </button>
            </div>
          </form>
        )}

        {/* ========================================= */}
        {/* 🌐 GOOGLE LOGIN BUTTON (NEW ADDITION) */}
        {/* ========================================= */}
        {!isForgotPassword && (
          <div className="mt-8 flex flex-col items-center border-t border-gray-200 pt-6 animate-fade-in-up">
            <p className="text-sm text-gray-500 mb-4 font-medium">Or continue with</p>
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                try {
                  const decoded = jwtDecode(credentialResponse.credential);
                  
                  const response = await api.post('/api/auth/google', {
                    name: decoded.name,
                    email: decoded.email
                  });

                  login(response.data.user, response.data.token);
                  
                  navigate('/'); // Home par redirect
                } catch (err) {
                  console.error("Google Login Error:", err);
                  setError('Google login failed. Please try again.');
                }
              }}
              onError={() => {
                console.log('Google Login Failed');
                setError('Google login was not completed.');
              }}
              useOneTap
              shape="pill"
              theme="outline"
            />
          </div>
        )}

      </div>
    </div>
  );
};

export default LoginPage;
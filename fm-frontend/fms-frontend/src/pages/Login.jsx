import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginUser } from '../api/apiService';

function Login({ setIsAuthenticated }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const { data } = await loginUser({ email, password });
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('token', data.token); // Save JWT token
            localStorage.setItem('userName', data.name);
            if (setIsAuthenticated) setIsAuthenticated(true);
            toast.success("लॉगिन सफल रहा (Login successful)! Welcome " + data.name);
            navigate('/dashboard');
        } catch (error) {
            console.error("Login failed", error);
            const msg = error.response?.data?.message || "Invalid credentials";
            toast.error(msg);
        }
    };

    return (
        <div className="min-h-[75vh] flex items-center justify-center bg-stone-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
                {/* Image Section */}
                <div className="md:w-1/2 bg-[#183d31] relative hidden md:block">
                    <img src="/slider/new_slider_3.png" alt="Farm" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50 border-r border-[#183d31]" />
                    <div className="absolute inset-0 flex items-center justify-center p-6 text-center flex-col z-10">
                        <h2 className="text-2xl font-black text-white mb-2">वापसी पर स्वागत है!</h2>
                        <p className="text-sm text-emerald-100 font-medium">अपने स्मार्ट फार्म डैशबोर्ड तक पहुंचने के लिए लॉगिन करें।</p>
                    </div>
                </div>

                <div className="w-full md:w-1/2 p-6 flex flex-col justify-center">
                    <div className="text-center md:text-left mb-5">
                        <h2 className="text-2xl font-extrabold text-[#1a3b32]">लॉगिन (Login)</h2>
                        <p className="text-stone-500 text-sm mt-1 font-medium">कृपया अपने खाते के विवरण दर्ज करें।</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-stone-700 mb-1">ईमेल (Email)</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-2 text-sm rounded-lg border border-stone-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition bg-stone-50"
                                placeholder="अपना ईमेल दर्ज करें"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-stone-700 mb-1">पासवर्ड (Password)</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-3 py-2 text-sm rounded-lg border border-stone-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition bg-stone-50"
                                placeholder="अपना पासवर्ड दर्ज करें"
                            />
                        </div>

                        <div className="flex items-center justify-between text-xs py-1">
                            <label className="flex items-center text-stone-600 font-medium cursor-pointer">
                                <input type="checkbox" className="mr-2 rounded text-emerald-600 focus:ring-emerald-500" />
                                मुझे याद रखें
                            </label>
                            <a href="#" className="font-bold text-emerald-600 hover:text-emerald-500">
                                पासवर्ड भूल गए?
                            </a>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[#f08632] hover:bg-[#d97529] text-white text-sm font-bold py-2.5 rounded-lg shadow-[0_4px_14px_0_rgba(240,134,50,0.39)] hover:shadow-[0_6px_20px_rgba(240,134,50,0.23)] hover:-translate-y-0.5 transition duration-200 mt-2"
                        >
                            लॉगिन करें (Login)
                        </button>
                    </form>

                    <p className="mt-5 text-center text-xs text-stone-600 font-medium">
                        खाता नहीं है?{' '}
                        <Link to="/signup" className="font-bold text-emerald-600 hover:text-emerald-500">
                            साइन अप करें (Sign up here)
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { signupUser } from '../api/apiService';

function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            await signupUser({ name, email, password });
            toast.success("खाता सफलतापूर्वक बन गया (Account created successfully)!");
            navigate('/login');
        } catch (error) {
            console.error("Signup failed", error);
            const msg = error.response?.data?.message || "Error creating account";
            toast.error(msg);
        }
    };

    return (
        <div className="min-h-[75vh] flex items-center justify-center bg-stone-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row-reverse">
                {/* Image Section */}
                <div className="md:w-1/2 bg-[#1a3b32] relative hidden md:block">
                    <img src="/slider/new_slider_4.png" alt="Farm" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50 border-l border-[#1a3b32]" />
                    <div className="absolute inset-0 flex items-center justify-center p-6 text-center flex-col z-10">
                        <h2 className="text-2xl font-black text-white mb-2">हमसे जुड़ें!</h2>
                        <p className="text-sm text-emerald-100 font-medium">अपने कृषि व्यवसाय को आधुनिक और सरल बनाएं।</p>
                    </div>
                </div>

                <div className="w-full md:w-1/2 p-6 flex flex-col justify-center">
                    <div className="text-center md:text-left mb-5">
                        <h2 className="text-2xl font-extrabold text-[#1a3b32]">साइन अप (Signup)</h2>
                        <p className="text-stone-500 text-sm mt-1 font-medium">अपना नया खाता बनाने के लिए विवरण दर्ज करें।</p>
                    </div>

                    <form onSubmit={handleSignup} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-stone-700 mb-1">पूरा नाम (Full Name)</label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-3 py-2 text-sm rounded-lg border border-stone-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition bg-stone-50"
                                placeholder="अपना नाम दर्ज करें"
                            />
                        </div>

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

                        <button
                            type="submit"
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold py-2.5 rounded-lg shadow-[0_4px_14px_0_rgba(5,150,105,0.39)] hover:shadow-[0_6px_20px_rgba(5,150,105,0.23)] hover:-translate-y-0.5 transition duration-200 mt-3"
                        >
                            खाता बनाएं (Create Account)
                        </button>
                    </form>

                    <p className="mt-5 text-center text-xs text-stone-600 font-medium">
                        पहले से खाता है?{' '}
                        <Link to="/login" className="font-bold text-[#f08632] hover:text-[#d97529]">
                            लॉगिन करें (Login here)
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Signup;

// src/App.jsx - Updated with Modern UI, Home Page, Footer & Hindi support

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './pages/Home.jsx';
import Dashboard from './pages/Dashboard.jsx';
import LivestockManagement from './pages/LivestockManagement.jsx';
import FinanceTracker from './pages/FinanceTracker.jsx';
import DLModelStudio from './pages/DLModelStudio.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';

function NavLinks({ isMobile, closeMenu, isAuthenticated }) {
    const location = useLocation();

    const allNavItems = [
        { path: '/', label: 'मुख्य पृष्ठ' },
        { path: '/dashboard', label: 'डैशबोर्ड' },
        { path: '/livestock', label: 'पशुधन प्रबंधन' },
        { path: '/finance', label: 'वित्त प्रबंधन' },
        { path: '/dl-studio', label: 'नस्ल पहचान 🤖' }
    ];

    const navItems = isAuthenticated ? allNavItems : allNavItems.filter(item => item.path === '/');

    return (
        <ul className={`${isMobile ? 'flex flex-col space-y-2 p-4' : 'flex items-center space-x-1 md:space-x-2'}`}>
            {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                    <li key={item.path} className={isMobile ? 'border-b border-stone-100 pb-2 last:border-0' : ''}>
                        <Link
                            to={item.path}
                            onClick={isMobile ? closeMenu : undefined}
                            className={`text-sm md:text-sm font-bold px-2 py-1.5 md:px-3 md:py-1.5 rounded-lg transition duration-200 flex items-center whitespace-nowrap w-full ${isActive
                                ? 'text-emerald-700 bg-emerald-50 pointer-events-none'
                                : 'text-stone-600 hover:text-emerald-700 hover:bg-stone-50'
                                }`}
                        >
                            {item.label}
                        </Link>
                    </li>
                );
            })}
        </ul>
    );
}

function Footer() {
    return (
        <footer className="bg-stone-900 border-t-4 border-emerald-600 text-stone-300 mt-auto py-3">
            <div className="container mx-auto px-4 flex flex-col items-center text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <img src="/new_logo.png" alt="Farm Logo" className="h-8 w-auto object-contain bg-white rounded-lg p-1 shadow-md" />
                    <span className="text-lg font-extrabold text-white tracking-wide">स्मार्ट फार्म</span>
                </div>
                <p className="mb-1 text-stone-400 font-medium tracking-wide text-xs">कृषि और पशुपालन को तकनीकी रूप से सशक्त बनाना।</p>
                <div className="w-8 h-1 bg-emerald-500 mx-auto my-2 rounded-full"></div>
                <p className="text-xs text-stone-500">© {new Date().getFullYear()} स्मार्ट फार्म. सर्वाधिकार सुरक्षित।</p>
            </div>
        </footer>
    );
}

function MainApp() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('isAuthenticated') === 'true');
    const navigate = useNavigate();

    const closeMenu = () => setIsMobileMenuOpen(false);

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        setIsAuthenticated(false);
        navigate('/');
    };

    return (
        <div className="min-h-screen flex flex-col bg-stone-50 text-stone-800 selection:bg-emerald-200 font-sans">
            {/* Navigation Bar */}
            <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-stone-200 w-full h-[60px] md:h-[70px] flex items-center">
                <div className="container mx-auto px-4 md:px-8 flex items-center justify-between relative w-full">
                    <Link to="/" onClick={closeMenu} className="flex items-center space-x-2 md:space-x-3 group shrink-0">
                        <img src="/new_logo.png" alt="Farm Logo" className="h-10 md:h-12 w-auto object-contain group-hover:scale-105 transition duration-300 drop-shadow-sm rounded-lg" />
                        <span className="text-xl md:text-2xl font-black text-[#1a3b32] tracking-tight whitespace-nowrap hidden sm:block drop-shadow-sm">
                            स्मार्ट फार्म
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden lg:flex items-center">
                        <NavLinks isMobile={false} isAuthenticated={isAuthenticated} />
                        {!isAuthenticated ? (
                            <>
                                <Link to="/login" className="ml-4 text-emerald-700 hover:text-emerald-800 text-sm font-bold px-4 py-2 hover:bg-emerald-50 rounded-lg transition duration-200 shrink-0">
                                    लॉगिन (Login)
                                </Link>
                                <Link to="/signup" className="ml-2 bg-stone-900 hover:bg-stone-800 text-white text-sm font-bold px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition duration-200 shrink-0">
                                    साइन अप (Signup)
                                </Link>
                            </>
                        ) : (
                            <button onClick={handleLogout} className="ml-4 bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition duration-200 shrink-0 cursor-pointer">
                                लॉगआउट (Logout)
                            </button>
                        )}
                    </div>

                    {/* Mobile Toggle Button */}
                    <button
                        className="lg:hidden p-2 text-stone-600 hover:text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-md"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle Menu"
                    >
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isMobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu Dropdown */}
                <div className={`lg:hidden absolute top-full left-0 w-full bg-white shadow-xl border-t border-stone-100 transition-all duration-300 ease-in-out z-40 origin-top transform ${isMobileMenuOpen ? 'scale-y-100 opacity-100 visible' : 'scale-y-0 opacity-0 invisible'}`}>
                    <div className="py-2">
                        <NavLinks isMobile={true} closeMenu={closeMenu} isAuthenticated={isAuthenticated} />
                        <div className="p-4 pt-2 flex flex-col gap-3">
                            {!isAuthenticated ? (
                                <>
                                    <Link to="/login" onClick={closeMenu} className="block w-full text-center border-2 border-emerald-600 text-emerald-700 font-bold px-6 py-2.5 rounded-lg hover:bg-emerald-50 transition duration-200">
                                        लॉगिन (Login)
                                    </Link>
                                    <Link to="/signup" onClick={closeMenu} className="block w-full text-center bg-stone-900 hover:bg-stone-800 text-white font-bold px-6 py-2.5 rounded-lg shadow-md transition duration-200">
                                        साइन अप (Signup)
                                    </Link>
                                </>
                            ) : (
                                <button onClick={() => { handleLogout(); closeMenu(); }} className="block w-full text-center bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2.5 rounded-lg shadow-md transition duration-200 cursor-pointer">
                                    लॉगआउट (Logout)
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content Area */}
            <main className="animate-fade-in flex-grow w-full overflow-hidden">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/*" element={
                        isAuthenticated ? (
                            <div className="container mx-auto p-4 md:p-8">
                                <Routes>
                                    <Route path="/dashboard" element={<Dashboard />} />
                                    <Route path="/livestock" element={<LivestockManagement />} />
                                    <Route path="/finance" element={<FinanceTracker />} />
                                    <Route path="/dl-studio" element={<DLModelStudio />} />
                                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                                </Routes>
                            </div>
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    } />
                </Routes>
            </main>

            <Footer />
            <ToastContainer position="bottom-right" autoClose={3000} theme="colored" />
        </div>
    );
}

function App() {
    return (
        <Router>
            <MainApp />
        </Router>
    );
}

export default App;
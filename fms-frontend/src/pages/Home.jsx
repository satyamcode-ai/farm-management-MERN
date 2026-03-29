// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Home() {
    const heroImages = [
        '/slider/new_slider_1.png',
        '/slider/new_slider_2.png',
        '/slider/new_slider_3.png',
        '/slider/new_slider_4.png',
    ];

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [heroImages.length]);

    return (
        <div className="w-full font-sans pb-12">
            {/* --- Hero Section --- */}
            <section className="relative w-full bg-[#183d31] overflow-hidden min-h-[85vh] flex items-center">

                {/* Image Slider background (Right side) */}
                <div className="absolute inset-y-0 right-0 w-full md:w-3/5 lg:w-2/3 xl:w-[60%] z-0 h-full">
                    {/* Blending gradients */}
                    <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-[#183d31] via-[#183d31]/80 to-transparent z-10 hidden md:block"></div>
                    <div className="absolute inset-0 bg-[#183d31]/40 mix-blend-multiply z-10"></div>

                    {heroImages.map((imgSrc, index) => (
                        <div
                            key={index}
                            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out h-full ${index === currentImageIndex ? 'opacity-100 z-0' : 'opacity-0 z-0'
                                }`}
                        >
                            <img
                                src={imgSrc}
                                alt={`Farm slide ${index + 1}`}
                                className="w-full h-full object-cover object-center"
                            />
                        </div>
                    ))}
                </div>

                {/* Hero Content (Left side) */}
                <div className="relative z-20 container mx-auto px-4 md:px-8 flex flex-col items-start pt-20 pb-20 md:py-0 w-full">
                    <div className="max-w-2xl bg-[#183d31]/80 md:bg-transparent p-6 md:p-0 rounded-2xl backdrop-blur-sm md:backdrop-blur-none border border-emerald-800/50 md:border-none">
                        <p className="text-emerald-400 font-bold tracking-widest uppercase mb-4 flex items-center gap-3 text-sm md:text-base">
                            <span className="w-8 h-[2px] bg-emerald-400"></span>
                            सर्वश्रेष्ठ कृषि मंच (Best Agro Platform)
                        </p>
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-[1.1] tracking-tight">
                            स्मार्ट तकनीक से <br /> कृषि में <span className="text-emerald-400">विकास</span> लाएं
                        </h1>
                        <p className="text-base md:text-xl text-stone-300 mb-10 font-medium leading-relaxed max-w-xl">
                            आधुनिक तकनीक के साथ खेती और पशुपालन को और भी आसान, लाभदायक और सुरक्षित बनाएं। अपने खेत को डिजिटल बनाएं।
                        </p>
                        <Link to={localStorage.getItem('isAuthenticated') === 'true' ? "/dashboard" : "/login"} className="bg-[#f08632] hover:bg-[#d97529] text-white font-bold text-lg px-8 py-4 rounded-xl shadow-[0_8px_30px_rgb(240,134,50,0.3)] transition-all hover:shadow-[0_8px_30px_rgb(240,134,50,0.5)] hover:-translate-y-1 duration-300 flex items-center w-fit gap-2">
                            शुरुआत करें (Get Started)
                            <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                        </Link>
                    </div>
                </div>
            </section>

            {/* --- Experience & About Section --- */}
            <section className="py-24 bg-white overflow-hidden">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        {/* Left: Images */}
                        <div className="relative h-[400px] md:h-[600px] w-full flex items-center justify-center">
                            <div className="absolute top-0 right-4 md:right-10 w-3/4 h-[80%] rounded-3xl overflow-hidden shadow-2xl">
                                <img src={heroImages[1]} alt="Farmer smiling" className="w-full h-full object-cover" />
                            </div>
                            <div className="absolute bottom-0 left-0 w-3/5 h-[50%] rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
                                <img src={heroImages[2]} alt="Cattle farm" className="w-full h-full object-cover" />
                            </div>
                            {/* Floating badge */}
                            <div className="absolute top-1/2 left-0 md:-left-4 -translate-y-1/2 bg-white p-3 md:p-4 rounded-2xl shadow-xl flex items-center gap-3 md:gap-4 border border-stone-100 flex-col md:flex-row text-center md:text-left z-10 w-32 md:w-auto">
                                <div className="bg-emerald-100 text-emerald-600 w-12 h-12 rounded-full flex items-center justify-center text-xl shrink-0">
                                    📞
                                </div>
                                <div>
                                    <p className="text-[10px] md:text-xs text-stone-500 font-bold uppercase tracking-wider mb-0.5">संपर्क करें (Get in touch)</p>
                                    <p className="text-sm md:text-lg font-black text-stone-800 whitespace-nowrap">+91 98765 43210</p>
                                </div>
                            </div>
                        </div>

                        {/* Right: Text Content */}
                        <div className="space-y-6 relative">
                            {/* Watermark text */}
                            <div className="absolute -top-12 -left-4 text-6xl md:text-9xl font-black text-stone-50 opacity-60 z-0 select-none pointer-events-none tracking-tighter">
                                AGRICULTURE
                            </div>

                            <div className="relative z-10">
                                <p className="text-emerald-600 font-extrabold tracking-wider uppercase mb-3 text-sm">
                                    25 वर्षों का अनुभव (25 Year Experience)
                                </p>
                                <h2 className="text-4xl md:text-5xl font-black text-[#1a3b32] leading-tight mb-6">
                                    स्वस्थ रहें और केवल <br className="hidden md:block" />ताजा कृषि उत्पाद <span className="text-emerald-500">खाएं</span>
                                </h2>
                                <p className="text-stone-600 text-lg leading-relaxed mb-6 font-medium">
                                    हमारा 'स्मार्ट फार्म' प्लेटफ़ॉर्म आपको आपके खेत और पशुओं के प्रबंधन के लिए एक संपूर्ण डिजिटल समाधान प्रदान करता है। आपको केवल अपनी जानकारी दर्ज करनी है और हम बाकी काम संभाल लेंगे।
                                </p>

                                <ul className="space-y-4 mb-8">
                                    <li className="flex items-center gap-3 text-stone-700 font-bold">
                                        <span className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 text-sm">✓</span>
                                        यदि आप एक उन्नत कृषि मंच की तलाश में हैं
                                    </li>
                                    <li className="flex items-center gap-3 text-stone-700 font-bold">
                                        <span className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 text-sm">✓</span>
                                        इंटरनेट पर इसे अपना पहला कृषि उपकरण बनाना
                                    </li>
                                    <li className="flex items-center gap-3 text-stone-700 font-bold">
                                        <span className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 text-sm">✓</span>
                                        24/7 ग्राहक सहायता और तकनीकी सेवा
                                    </li>
                                </ul>

                                <Link to="/about" className="bg-[#1a3b32] hover:bg-stone-900 text-white font-bold px-8 py-3.5 rounded-xl shadow-[0_4px_15px_rgb(26,59,50,0.4)] transition duration-200 flex items-center w-fit gap-2">
                                    अधिक जानें (Discover More)
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path></svg>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- Services Section --- */}
            <section className="relative py-24 bg-stone-50">
                <div className="absolute top-0 left-0 right-0 h-1/2 bg-[#183d31]"></div>

                <div className="container mx-auto px-4 md:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <p className="text-emerald-400 font-bold tracking-widest uppercase mb-3 text-sm">
                            स्मार्ट फार्म सेवाएँ (Smart Farm Services)
                        </p>
                        <h2 className="text-4xl md:text-5xl font-black text-white flex flex-col gap-4">
                            <span>हम अधिक उन्नत</span>
                            <span>कृषि तकनीकी प्रदान करते हैं</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Service Card 1 */}
                        <div className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition duration-300 group flex flex-col">
                            <div className="h-60 overflow-hidden relative p-5 bg-white">
                                <img src={heroImages[2]} alt="Livestock" className="w-full h-full object-cover rounded-xl" />
                            </div>
                            <div className="p-8 pt-4 flex-grow flex flex-col">
                                <h3 className="text-2xl font-black text-[#1a3b32] mb-3">पशुधन प्रबंधन</h3>
                                <p className="text-stone-500 font-medium mb-6 leading-relaxed flex-grow">
                                    अपने सभी पशुओं का रिकॉर्ड रखें, उनका स्वास्थ्य ट्रैक करें और टीकाकरण का ध्यान रखें।
                                </p>
                                <Link to="/livestock" className="text-emerald-600 font-bold hover:text-emerald-700 flex items-center gap-1 w-fit px-4 py-2 border-2 border-emerald-100 rounded-lg group-hover:bg-emerald-50 transition">
                                    एक्सप्लोर करें (Explore More) <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"></path></svg>
                                </Link>
                            </div>
                        </div>

                        {/* Service Card 2 */}
                        <div className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition duration-300 group flex flex-col">
                            <div className="h-60 overflow-hidden relative p-5 bg-white">
                                <img src={heroImages[1]} alt="Finance" className="w-full h-full object-cover rounded-xl object-top" />
                            </div>
                            <div className="p-8 pt-4 flex-grow flex flex-col">
                                <h3 className="text-2xl font-black text-[#1a3b32] mb-3">वित्तीय रिकार्ड</h3>
                                <p className="text-stone-500 font-medium mb-6 leading-relaxed flex-grow">
                                    अपनी आय और व्यय (खर्च) को आसानी से दर्ज करें और अपनी कमाई का सटीक हिसाब रखें।
                                </p>
                                <Link to="/finance" className="text-emerald-600 font-bold hover:text-emerald-700 flex items-center gap-1 w-fit px-4 py-2 border-2 border-emerald-100 rounded-lg group-hover:bg-emerald-50 transition">
                                    एक्सप्लोर करें (Explore More) <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"></path></svg>
                                </Link>
                            </div>
                        </div>

                        {/* Service Card 3 */}
                        <div className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition duration-300 group flex flex-col">
                            <div className="h-60 overflow-hidden relative p-5 bg-white">
                                <img src={heroImages[0]} alt="AI Studio" className="w-full h-full object-cover rounded-xl" />
                            </div>
                            <div className="p-8 pt-4 flex-grow flex flex-col">
                                <h3 className="text-2xl font-black text-[#1a3b32] mb-3">एआई समाधान</h3>
                                <p className="text-stone-500 font-medium mb-6 leading-relaxed flex-grow">
                                    सिर्फ एक फोटो अपलोड करके अपने पशुओं की सटीक नस्ल पहचानें। नवीनतम तकनीक।
                                </p>
                                <Link to="/dl-studio" className="text-emerald-600 font-bold hover:text-emerald-700 flex items-center gap-1 w-fit px-4 py-2 border-2 border-emerald-100 rounded-lg group-hover:bg-emerald-50 transition">
                                    एक्सप्लोर करें (Explore More) <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"></path></svg>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Home;

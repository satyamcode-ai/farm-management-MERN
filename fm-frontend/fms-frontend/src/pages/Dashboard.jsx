// src/pages/Dashboard.jsx

import React from 'react';
import useFetchData from '../hooks/useFetchData';
import { fetchDashboardSummary } from '../api/apiService';

function Dashboard() {
    const { data: summary, loading, error } = useFetchData(fetchDashboardSummary, {});

    if (loading) return <div className="flex justify-center items-center h-64"><p className="text-xl font-semibold text-emerald-600 animate-pulse">स्मार्ट फार्म डैशबोर्ड लोड हो रहा है...</p></div>;

    if (error) return (
        <div className="text-center p-6 bg-rose-50 border-l-4 border-rose-500 text-rose-800 rounded-r-lg shadow-sm">
            <p className="font-bold">त्रुटि (Error)</p>
            <p>डैशबोर्ड डेटा लोड करने में विफल। कृपया सुनिश्चित करें कि बैकएंड सर्वर (http://localhost:8080) चल रहा है।</p>
        </div>
    );

    const {
        totalHerdCount,
        healthOverview = {},
        quickProfitLoss
    } = summary;

    const totalPendingTasks = (healthOverview.Sick || 0) + (healthOverview.VaccinationDue || 0);

    return (
        <div className="space-y-8">
            <header className="mb-6">
                <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-800 to-emerald-500 pb-2 flex items-center gap-3">
                    <span>📊</span> खेत का अवलोकन
                </h1>
                <p className="text-sm text-stone-500 font-medium">आपके फार्म की वर्तमान स्थिति का सारांश</p>
            </header>

            {/* Dashboard Cards Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                {/* 1. Total Cattle Card */}
                <div className="bg-white p-5 rounded-2xl shadow-md border border-stone-100 hover:shadow-lg hover:-translate-y-1 transition duration-300 relative overflow-hidden group flex flex-col justify-between min-h-[12rem]">
                    <div className="absolute top-0 right-[-10px] p-4 opacity-5 group-hover:scale-110 transition duration-300 pointer-events-none">
                        <span className="text-9xl">🐄</span>
                    </div>
                    <div className="relative z-10 w-full">
                        <h3 className="text-xs font-bold text-emerald-800 uppercase tracking-widest bg-emerald-50 inline-block px-2 py-1 rounded-md border border-emerald-100 shadow-sm">कुल पशु संख्या</h3>
                        <div className="flex items-center justify-between mt-4">
                            <p className="text-5xl font-black text-stone-800 tracking-tighter drop-shadow-sm">{totalHerdCount || 0}</p>
                            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center shadow-inner">
                                <span className="text-xl">📋</span>
                            </div>
                        </div>
                    </div>
                    <p className="text-sm font-medium text-stone-500 mt-4 relative z-10 flex items-center gap-2 border-t pt-3">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                        फार्म में पंजीकृत सभी पशु
                    </p>
                </div>

                {/* 2. Profit/Loss Card */}
                <div className="bg-white p-5 rounded-2xl shadow-md border border-stone-100 hover:shadow-lg hover:-translate-y-1 transition duration-300 relative overflow-hidden group flex flex-col justify-between min-h-[12rem]">
                    <div className="absolute top-0 right-[-10px] p-4 opacity-5 group-hover:scale-110 transition duration-300 pointer-events-none">
                        <span className="text-9xl">₹</span>
                    </div>
                    <div className="relative z-10 w-full">
                        <h3 className={`text-xs font-bold uppercase tracking-widest inline-block px-2 py-1 rounded-md border shadow-sm flex items-center gap-2 w-max ${quickProfitLoss >= 0 ? 'bg-emerald-50 text-emerald-800 border-emerald-100' : 'bg-rose-50 text-rose-800 border-rose-100'}`}>
                            कुल लाभ/हानि (P/L)
                        </h3>
                        <div className="flex flex-col mt-4">
                            <p className={`text-4xl md:text-3xl lg:text-4xl font-black tracking-tighter drop-shadow-sm break-words ${quickProfitLoss >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                ₹{quickProfitLoss ? quickProfitLoss.toFixed(2) : '0.00'}
                            </p>
                        </div>
                    </div>
                    <p className="text-sm font-medium text-stone-500 mt-4 relative z-10 flex items-center gap-2 border-t pt-3">
                        <span className={`w-2 h-2 rounded-full inline-block ${quickProfitLoss >= 0 ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                        आय और व्यय के आधार पर
                    </p>
                </div>

                {/* 3. Pending Health Tasks Card */}
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-5 rounded-2xl shadow-md border border-amber-200 hover:shadow-lg hover:-translate-y-1 transition duration-300 relative overflow-hidden group flex flex-col justify-between min-h-[12rem]">
                    <div className="absolute top-0 right-[-10px] p-4 opacity-10 group-hover:scale-110 transition duration-300 pointer-events-none">
                        <span className="text-9xl">🩺</span>
                    </div>
                    <div className="relative z-10 w-full">
                        <h3 className="text-xs font-bold text-amber-900 uppercase tracking-widest bg-white/70 backdrop-blur-sm inline-block px-2 py-1 rounded-md border border-amber-200 shadow-sm">लंबित स्वास्थ्य कार्य</h3>
                        <div className="flex items-center justify-between mt-4">
                            <p className="text-5xl font-black text-amber-900 tracking-tighter drop-shadow-sm">{totalPendingTasks}</p>
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                                <span className="text-xl">⚠️</span>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 relative z-10 border-t border-amber-200/50 pt-3">
                        <div className="flex gap-2 text-xs font-bold w-full">
                            <span className="bg-rose-100 text-rose-800 px-3 py-1.5 rounded-lg flex-1 text-center shadow-sm flex items-center justify-center gap-1 border border-rose-200">
                                <span>🤒</span> {healthOverview.Sick || 0} बीमार
                            </span>
                            <span className="bg-amber-100 text-amber-800 px-3 py-1.5 rounded-lg flex-1 text-center shadow-sm flex items-center justify-center gap-1 border border-amber-300">
                                <span>💉</span> {healthOverview.VaccinationDue || 0} टीके बाकी
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Detailed Health Overview */}
            <div className="mt-8 p-6 bg-white rounded-2xl shadow-md border border-stone-100">
                <div className="flex items-center mb-4">
                    <div className="bg-rose-100 p-2 rounded-lg mr-3 shadow-sm">
                        <span className="text-xl block leading-none">❤️</span>
                    </div>
                    <h2 className="text-xl font-extrabold text-stone-800">विस्तृत स्वास्थ्य अवलोकन</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-5 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100/50 shadow-sm relative overflow-hidden">
                        <div className="absolute right-[-20px] bottom-[-20px] opacity-10 blur-[2px]">
                            <span className="text-8xl">🌿</span>
                        </div>
                        <div className="relative z-10">
                            <p className="text-emerald-900 font-bold mb-0.5 text-base">स्वस्थ पशु</p>
                            <p className="text-xs font-medium text-emerald-600">पूरी तरह से स्वस्थ</p>
                        </div>
                        <span className="text-4xl font-black text-emerald-600 drop-shadow-sm relative z-10">{healthOverview.Healthy || 0}</span>
                    </div>
                    <div className="flex items-center justify-between p-5 bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl border border-rose-100/50 shadow-sm relative overflow-hidden">
                        <div className="absolute right-[-20px] bottom-[-20px] opacity-10 blur-[2px]">
                            <span className="text-8xl">🏥</span>
                        </div>
                        <div className="relative z-10">
                            <p className="text-rose-900 font-bold mb-0.5 text-base">बीमार पशु</p>
                            <p className="text-xs font-medium text-rose-600">चिकित्सा ध्यान चाहिए</p>
                        </div>
                        <span className="text-4xl font-black text-rose-600 drop-shadow-sm relative z-10">{healthOverview.Sick || 0}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
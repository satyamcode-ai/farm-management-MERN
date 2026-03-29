// src/pages/FinanceTracker.jsx - Hindi Translation & Modern UI

import React, { useState } from 'react';
import { toast } from 'react-toastify';
import useFetchData from '../hooks/useFetchData';
import { fetchFinancialRecords, createFinancialRecord, deleteFinancialRecord } from '../api/apiService';

function FinanceTracker() {
    const { data: records, loading, error, refreshData } = useFetchData(fetchFinancialRecords, []);

    const [newRecord, setNewRecord] = useState({
        type: 'EXPENSE',
        description: '',
        amount: '',
        date: new Date().toISOString().substring(0, 10)
    });

    const handleChange = (e) => {
        setNewRecord({ ...newRecord, [e.target.name]: e.target.value });
    };

    const handleCreateRecord = async (e) => {
        e.preventDefault();
        try {
            await createFinancialRecord({
                ...newRecord,
                amount: parseFloat(newRecord.amount)
            });
            setNewRecord({ type: 'EXPENSE', description: '', amount: '', date: new Date().toISOString().substring(0, 10) });
            refreshData();
            toast.success("वित्तीय रिकॉर्ड सफलतापूर्वक जोड़ा गया (Record added successfully)!");
        } catch (err) {
            console.error("Error creating record:", err);
            toast.error("वित्तीय रिकॉर्ड जोड़ने में विफल (Failed to add record).");
        }
    };

    const handleDeleteRecord = async (id) => {
        try {
            await deleteFinancialRecord(id);
            refreshData();
            toast.success("लेनदेन हटा दिया गया (Record deleted).");
        } catch (err) {
            console.error("Error deleting record:", err);
            toast.error("लेनदेन हटाने में विफल (Failed to delete record).");
        }
    };

    const totalIncome = records.filter(r => r.type === 'INCOME').reduce((sum, r) => sum + r.amount, 0);
    const totalExpense = records.filter(r => r.type === 'EXPENSE').reduce((sum, r) => sum + r.amount, 0);
    const netBalance = totalIncome - totalExpense;

    return (
        <div className="space-y-8">
            <header className="mb-6">
                <h1 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-800 to-emerald-500 pb-1 flex items-center gap-2">
                    <span className="text-3xl">💰</span> वित्त प्रबंधन
                </h1>
                <p className="text-sm text-stone-500 font-medium mt-1">आय और व्यय का रिकॉर्ड रखें</p>
            </header>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-5 rounded-2xl shadow-md border border-stone-100 flex items-center gap-4 relative overflow-hidden group">
                    <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition duration-300">
                        <span className="text-8xl text-emerald-500">📈</span>
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-xs font-bold text-stone-500 uppercase tracking-widest">कुल आय</h3>
                        <p className="text-2xl font-black text-emerald-600 tracking-tight mt-1">₹{totalIncome.toFixed(2)}</p>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-md border border-stone-100 flex items-center gap-4 relative overflow-hidden group">
                    <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition duration-300">
                        <span className="text-8xl text-rose-500">📉</span>
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-xs font-bold text-stone-500 uppercase tracking-widest">कुल खर्च</h3>
                        <p className="text-2xl font-black text-rose-600 tracking-tight mt-1">₹{totalExpense.toFixed(2)}</p>
                    </div>
                </div>

                <div className={`bg-white p-5 rounded-2xl shadow-md border flex items-center gap-4 relative overflow-hidden group ${netBalance >= 0 ? 'border-emerald-200' : 'border-rose-200'}`}>
                    <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition duration-300">
                        <span className="text-8xl">⚖️</span>
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-xs font-bold text-stone-500 uppercase tracking-widest">शुद्ध शेष (Net Balance)</h3>
                        <p className={`text-2xl font-black tracking-tight mt-1 ${netBalance >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                            ₹{netBalance.toFixed(2)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content: Form and History */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* 1. Log New Transaction Form */}
                <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-lg border border-stone-100 h-fit">
                    <h3 className="text-xl font-bold mb-5 text-stone-800 flex items-center gap-2 border-b border-stone-100 pb-3">
                        <span className="bg-amber-100 p-2 rounded-lg text-lg">📝</span> लेनदेन दर्ज करें
                    </h3>

                    <form onSubmit={handleCreateRecord} className="flex flex-col gap-5">
                        <div>
                            <label className="block text-sm font-semibold text-stone-700 mb-1">प्रकार (Type)</label>
                            <select
                                name="type"
                                value={newRecord.type}
                                onChange={handleChange}
                                className="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition bg-stone-50"
                            >
                                <option value="EXPENSE">खर्च (Expense)</option>
                                <option value="INCOME">आय (Income)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-stone-700 mb-1">तिथि (Date)</label>
                            <input
                                type="date"
                                name="date"
                                value={newRecord.date}
                                onChange={handleChange}
                                className="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition bg-stone-50"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-stone-700 mb-1">विवरण (Description)</label>
                            <input
                                type="text"
                                name="description"
                                placeholder="विवरण (उदा., दूध बेचना, चारा खरीदना)"
                                value={newRecord.description}
                                onChange={handleChange}
                                className="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition bg-stone-50"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-stone-700 mb-1">रकम (Amount ₹)</label>
                            <input
                                type="number"
                                name="amount"
                                placeholder="रकम दर्ज करें"
                                value={newRecord.amount}
                                onChange={handleChange}
                                className="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition bg-stone-50 text-xl font-medium text-stone-800"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="bg-stone-800 hover:bg-stone-900 text-amber-400 font-bold tracking-wide py-2.5 rounded-xl transition duration-200 mt-4 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                        >
                            <span><svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg></span> रिकॉर्ड जोड़ें
                        </button>
                    </form>
                </div>

                {/* 2. Transaction History */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-lg border border-stone-100 flex flex-col h-[600px]">
                    <h3 className="text-xl font-bold mb-5 text-stone-800 flex items-center gap-2 border-b border-stone-100 pb-3">
                        <span className="bg-stone-100 p-2 rounded-lg text-lg">📜</span> लेनदेन का इतिहास
                    </h3>

                    {loading && <p className="text-center text-emerald-600 font-semibold animate-pulse py-8">रिकॉर्ड लोड हो रहे हैं...</p>}

                    <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                        {records.length === 0 && !loading && (
                            <div className="text-center py-12 text-stone-500">
                                कोई वित्तीय रिकॉर्ड नहीं मिला। पहले कुछ लेनदेन दर्ज करें।
                            </div>
                        )}

                        {/* Reverse the list to show newest transactions first */}
                        {records.slice().reverse().map(record => {
                            const rId = record.id || record._id;
                            return (
                                <div
                                    key={rId}
                                    className="flex flex-col sm:flex-row justify-between sm:items-center p-4 rounded-xl border border-stone-100 hover:border-stone-200 bg-stone-50/50 hover:bg-stone-50 transition duration-150 gap-4"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${record.type === 'INCOME' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                                            <span className="text-lg font-bold">{record.type === 'INCOME' ? '↓' : '↑'}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-stone-800 text-lg">{record.description}</span>
                                            <span className="text-sm text-stone-500 font-medium">{record.date}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between sm:justify-end gap-3 w-full sm:w-auto mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-0 border-stone-200">
                                        <div className="flex items-center gap-4">
                                            <span className={`px-3 py-1 text-xs rounded-full font-bold tracking-wider ${record.type === 'INCOME' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-rose-100 text-rose-800 border border-rose-200'}`}>
                                                {record.type === 'INCOME' ? 'आय' : 'खर्च'}
                                            </span>
                                            <span className={`text-xl font-black ${record.type === 'INCOME' ? 'text-emerald-600' : 'text-rose-600'} w-24 text-right`}>
                                                {record.type === 'INCOME' ? '+' : '-'} ₹{record.amount.toFixed(2)}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteRecord(rId)}
                                            className="bg-white hover:bg-rose-50 text-rose-500 hover:text-rose-700 border border-stone-200 hover:border-rose-200 p-2 rounded-lg transition duration-200 shadow-sm self-end sm:self-auto ml-0 sm:ml-2"
                                            title="हटाएं (Delete)"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FinanceTracker;
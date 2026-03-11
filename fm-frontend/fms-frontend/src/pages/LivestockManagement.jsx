// src/pages/LivestockManagement.jsx - FINAL REVISED VERSION (Hindi UI)

import React, { useState } from 'react';
import { toast } from 'react-toastify';
import useFetchData from '../hooks/useFetchData';
import { fetchCattle, createCattle, analyzeBreed, deleteCattle } from '../api/apiService';

function LivestockManagement() {
    const { data: cattleList, loading, error, refreshData } = useFetchData(fetchCattle, []);

    const initialFormState = {
        tagNumber: '',
        name: '',
        healthStatus: 'Healthy',
        birthDate: '',
        sireTagNumber: '',
        damTagNumber: '',
        breedingDate: '',
        lactationPeriod: 0,
    };

    const [newCattle, setNewCattle] = useState(initialFormState);
    const [selectedFile, setSelectedFile] = useState(null);
    const [dlStatus, setDlStatus] = useState({});
    const [formErrors, setFormErrors] = useState({});

    const validateForm = () => {
        let errors = {};
        if (!newCattle.tagNumber) errors.tagNumber = "टैग नंबर आवश्यक है (Tag Number is required).";
        if (!newCattle.birthDate) errors.birthDate = "जन्म तिथि आवश्यक है (Birth Date is required).";
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChange = (e) => {
        setNewCattle({ ...newCattle, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleCreateCattle = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.warn("कृपया सबमिट करने से पहले आवश्यक फ़ील्ड भरें (Please fix the required fields before submitting).");
            return;
        }

        try {
            const dataToSubmit = {
                ...newCattle,
                lactationPeriod: parseInt(newCattle.lactationPeriod) || 0,
            };

            await createCattle(dataToSubmit);
            setNewCattle(initialFormState);
            setSelectedFile(null);
            setFormErrors({});
            refreshData();
            toast.success("पशु सफलतापूर्वक जोड़ दिया गया (Cattle added successfully)!");

        } catch (err) {
            console.error("Error creating cattle:", err);
            toast.error("पशु जोड़ने में विफल (Failed to add cattle). Check backend status.");
        }
    };

    const handleDeleteCattle = async (id) => {
        try {
            await deleteCattle(id);
            refreshData();
            toast.success("पशु प्रोफ़ाइल हटा दी गई है (Cattle profile deleted).");
        } catch (err) {
            console.error("Error deleting cattle:", err);
            toast.error("पशु हटाने में विफल (Failed to delete cattle).");
        }
    };

    const handleAnalyzeBreed = async (cattleId) => {
        if (!selectedFile) {
            toast.info("कृपया विश्लेषण चलाने से पहले फ़ाइल पिकर का उपयोग करके इस जानवर के लिए छवि फ़ाइल चुनें। (Please select the image file)");
            return;
        }

        setDlStatus(prev => ({ ...prev, [cattleId]: 'जाँच हो रही है (Analyzing)...' }));

        const formData = new FormData();
        formData.append('imageFile', selectedFile);

        try {
            await analyzeBreed(cattleId, formData);
            refreshData();
            setDlStatus(prev => ({ ...prev, [cattleId]: 'पूर्ण (Complete)!' }));
            toast.success("नस्ल पहचान सफल रही (AI Analysis complete)!");
        } catch (err) {
            setDlStatus(prev => ({ ...prev, [cattleId]: 'विफल (Failed)' }));
            console.error("DL Analysis failed:", err);
            toast.error("AI विश्लेषण विफल रहा। कृपया चित्र जांचें। (AI Analysis failed.)");
        }
    };

    return (
        <div className="space-y-8">
            <header className="mb-6">
                <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-800 to-emerald-500 pb-2 flex items-center gap-3">
                    <span>🐄</span> पशुधन प्रबंधन
                </h1>
                <p className="text-sm text-stone-500 font-medium mt-1">अपने फार्म के जानवरों का रिकॉर्ड रखें</p>
            </header>

            {/* ADD NEW CATTLE FORM */}
            <div className="bg-white p-6 rounded-2xl shadow-md border border-stone-100">
                <h3 className="text-xl font-bold mb-5 text-stone-800 flex items-center gap-2">
                    <span className="text-emerald-600 border-b-2 border-emerald-600 pb-1">नया पशु पंजीकृत करें</span>
                </h3>

                <form onSubmit={handleCreateCattle} className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* --- Column 1: Core ID & Name --- */}
                    <div className="space-y-5">
                        <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 h-full">
                            <h4 className="text-emerald-700 font-semibold mb-4 text-lg">बुनियादी जानकारी</h4>

                            <label className="block text-sm font-semibold text-stone-700 mb-1">टैग नंबर (Unique ID) <span className="text-rose-500">*</span></label>
                            <input type="text" name="tagNumber" placeholder="उदा., US00123" value={newCattle.tagNumber} onChange={handleChange} className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition bg-white ${formErrors.tagNumber ? 'border-rose-500' : 'border-stone-300'}`} required />
                            {formErrors.tagNumber && <p className="text-rose-500 text-xs mt-1">{formErrors.tagNumber}</p>}

                            <div className="mt-4">
                                <label className="block text-sm font-semibold text-stone-700 mb-1">नाम</label>
                                <input type="text" name="name" placeholder="नाम (उदा., गौरी)" value={newCattle.name} onChange={handleChange} className="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition bg-white" />
                            </div>

                            <div className="mt-4">
                                <label className="block text-sm font-semibold text-stone-700 mb-1">फोटो (AI नस्ल पहचान के लिए) <span className="text-rose-500">*</span></label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="w-full text-sm text-stone-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 transition cursor-pointer"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* --- Column 2: Genealogy & Birth --- */}
                    <div className="space-y-5">
                        <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 h-full">
                            <h4 className="text-emerald-700 font-semibold mb-4 text-lg">जन्म और वंशावली</h4>

                            <label className="block text-sm font-semibold text-stone-700 mb-1">जन्म तिथि <span className="text-rose-500">*</span></label>
                            <input type="date" name="birthDate" value={newCattle.birthDate} onChange={handleChange} className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition bg-white ${formErrors.birthDate ? 'border-rose-500' : 'border-stone-300'}`} required />
                            {formErrors.birthDate && <p className="text-rose-500 text-xs mt-1">{formErrors.birthDate}</p>}

                            <div className="mt-4">
                                <label className="block text-sm font-semibold text-stone-700 mb-1">पिता (Sire) का टैग</label>
                                <input type="text" name="sireTagNumber" placeholder="पिता का टैग" value={newCattle.sireTagNumber} onChange={handleChange} className="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition bg-white" />
                            </div>

                            <div className="mt-4">
                                <label className="block text-sm font-semibold text-stone-700 mb-1">माता (Dam) का टैग</label>
                                <input type="text" name="damTagNumber" placeholder="माता का टैग" value={newCattle.damTagNumber} onChange={handleChange} className="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition bg-white" />
                            </div>
                        </div>
                    </div>

                    {/* --- Column 3: Lifecycle & Submit --- */}
                    <div className="space-y-5">
                        <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 h-full flex flex-col justify-between">
                            <div>
                                <h4 className="text-emerald-700 font-semibold mb-4 text-lg">स्थिति और प्रजनन</h4>

                                <label className="block text-sm font-semibold text-stone-700 mb-1">अंतिम प्रजनन तिथि (Breeding Date)</label>
                                <input type="date" name="breedingDate" value={newCattle.breedingDate} onChange={handleChange} className="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition bg-white" />

                                <div className="mt-4 flex gap-4">
                                    <div className="w-1/2">
                                        <label className="block text-sm font-semibold text-stone-700 mb-1">दुग्ध काल (Lactation)</label>
                                        <input type="number" name="lactationPeriod" min="0" value={newCattle.lactationPeriod} onChange={handleChange} className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition bg-white ${formErrors.lactationPeriod ? 'border-rose-500' : 'border-stone-300'}`} />
                                    </div>
                                    <div className="w-1/2">
                                        <label className="block text-sm font-semibold text-stone-700 mb-1">स्वास्थ्य स्थिति</label>
                                        <select name="healthStatus" value={newCattle.healthStatus} onChange={handleChange} className="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition bg-white">
                                            <option value="Healthy">स्वस्थ</option>
                                            <option value="Sick">बीमार</option>
                                            <option value="Vaccination Due">टीकाकरण बाकी</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl shadow-[0_4px_14px_0_rgba(5,150,105,0.39)] hover:shadow-[0_6px_20px_rgba(5,150,105,0.23)] hover:-translate-y-0.5 transition duration-200 mt-6 md:mt-0 flex justify-center items-center gap-2">
                                <span><svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg></span> नया पशु जोड़ें
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {loading && (
                <div className="flex justify-center p-8">
                    <p className="text-xl font-semibold text-emerald-600 animate-pulse">पशु सूची लोड हो रही है...</p>
                </div>
            )}

            {/* CATTLE LIST */}
            {!loading && cattleList.length === 0 && (
                <div className="text-center p-12 bg-white rounded-2xl shadow-sm border border-stone-100">
                    <p className="text-stone-500 text-lg">कोई पशु नहीं मिला। कृपया ऊपर दिए गए फॉर्म से नया पशु जोड़ें।</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {cattleList.map((cattle) => {
                    const cId = cattle.id || cattle._id;
                    return (
                        <div key={cId} className="bg-white rounded-2xl shadow-sm border hover:border-emerald-200 transition duration-300 overflow-hidden flex flex-col">
                            {/* Card Header */}
                            <div className="p-4 border-b border-stone-100 flex justify-between items-start bg-stone-50/50">
                                <div>
                                    <h4 className="text-xl font-extrabold text-stone-800">{cattle.name || 'बिना नाम'}</h4>
                                    <p className="text-sm font-medium text-emerald-600 font-mono mt-1 flex items-center gap-1">
                                        <span>🏷️</span> {cattle.tagNumber}
                                    </p>
                                </div>
                                <span className={`px-3 py-1 text-sm font-bold rounded-full border shadow-sm ${cattle.healthStatus === 'Healthy' || cattle.healthStatus === 'स्वस्थ'
                                    ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                                    : cattle.healthStatus === 'Sick' || cattle.healthStatus === 'बीमार'
                                        ? 'bg-rose-100 text-rose-800 border-rose-200'
                                        : 'bg-amber-100 text-amber-800 border-amber-200'
                                    }`}>
                                    {cattle.healthStatus === 'Healthy' ? 'स्वस्थ' : cattle.healthStatus === 'Sick' ? 'बीमार' : cattle.healthStatus === 'Vaccination Due' ? 'टीकाकरण बाकी' : cattle.healthStatus}
                                </span>
                            </div>

                            {/* Card Body */}
                            <div className="p-4 flex-grow">
                                <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm mb-4">
                                    <div className="bg-stone-50 p-2 rounded-lg border border-stone-100">
                                        <p className="text-stone-500 text-xs font-semibold uppercase">जन्म तिथि</p>
                                        <p className="font-bold text-stone-800">{cattle.birthDate || 'N/A'}</p>
                                    </div>
                                    <div className="bg-stone-50 p-2 rounded-lg border border-stone-100">
                                        <p className="text-stone-500 text-xs font-semibold uppercase">दुग्ध काल (Lactation)</p>
                                        <p className="font-bold text-stone-800">{cattle.lactationPeriod || 0}</p>
                                    </div>
                                    <div className="col-span-2 bg-stone-50 p-2 rounded-lg border border-stone-100 flex justify-between">
                                        <div>
                                            <p className="text-stone-500 text-xs font-semibold uppercase mb-1">माता-पिता</p>
                                            <p className="text-stone-800"><span className="text-stone-500">M:</span> {cattle.damTagNumber || '-'} <span className="mx-2 text-stone-300">|</span> <span className="text-stone-500">F:</span> {cattle.sireTagNumber || '-'}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-stone-500 text-xs font-semibold uppercase mb-1">प्रजनन (Breeding)</p>
                                            <p className="text-stone-800 font-medium">{cattle.breedingDate || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* AI Result Section */}
                                <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 relative overflow-hidden">
                                    <div className="absolute top-1 right-1 opacity-20 text-4xl">🧬</div>
                                    <div className="relative z-10 flex flex-col justify-between h-full space-y-2">
                                        <div className="flex justify-between items-center border-b border-indigo-100/50 pb-2">
                                            <p className="text-sm font-bold text-indigo-900">AI नस्ल पहचान</p>
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500 bg-white px-2 py-0.5 rounded-full border border-indigo-100 shadow-sm">
                                                {dlStatus[cId] || 'जाँच बाकी'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <p className="text-xs text-indigo-500 font-medium mb-0.5">नस्ल (Breed)</p>
                                                <p className="font-black text-indigo-800 text-lg leading-none">{cattle.breed || '—'}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-indigo-500 font-medium mb-0.5">सटीकता</p>
                                                <p className="font-bold text-indigo-700">{cattle.confidenceScore ? (cattle.confidenceScore * 100).toFixed(1) + '%' : '—'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Card Footer Actions */}
                            <div className="p-4 border-t border-stone-100 bg-stone-50 flex gap-3">
                                <button
                                    onClick={() => handleAnalyzeBreed(cId)}
                                    disabled={dlStatus[cId] === 'जाँच हो रही है (Analyzing)...'}
                                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold py-2.5 rounded-lg transition duration-200 shadow-sm flex justify-center items-center gap-2 hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    <span>🤖</span> नस्ल पहचानें
                                </button>
                                <button
                                    onClick={() => handleDeleteCattle(cId)}
                                    className="bg-white hover:bg-rose-50 text-rose-600 border border-stone-200 hover:border-rose-200 text-sm font-bold py-2.5 px-4 rounded-lg transition duration-200 shadow-sm flex items-center justify-center"
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
    );
}

export default LivestockManagement;
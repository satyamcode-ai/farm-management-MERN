// src/pages/DLModelStudio.jsx - Hindi Translation & Modern UI

import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { runStudioAnalysis } from '../api/apiService';

function DLModelStudio() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
        setResult(null); // Clear previous results
        setError(null);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            toast.warn("कृपया पहले एक छवि फ़ाइल चुनें (Please select an image file first).");
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            // Create FormData object to send the file
            const formData = new FormData();
            formData.append('imageFile', selectedFile);

            const response = await runStudioAnalysis(formData);
            setResult(response.data);
            toast.success("विश्लेषण सफलतापूर्वक पूरा हुआ (Analysis complete)!");
        } catch (err) {
            console.error("Analysis Failed:", err);
            setError("विश्लेषण विफल रहा। कृपया चित्र प्रकार और नेटवर्क कनेक्शन की जाँच करें (Analysis failed).");
            toast.error("विश्लेषण विफल रहा (Analysis failed).");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <header className="mb-6">
                <h1 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-800 to-emerald-500 pb-1 flex items-center">
                    एआई मॉडल स्टूडियो
                </h1>
                <p className="text-sm text-stone-500 font-medium mt-1">ResNet मॉडल का उपयोग करके मवेशियों की नस्ल पहचानें (Cattle Breed Recognition)</p>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* File Uploader and Preview (Left Column) */}
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-stone-100 flex flex-col h-fit">
                    <h3 className="text-xl font-bold mb-5 text-stone-800 flex items-center gap-2 border-b border-stone-100 pb-3">
                        1. छवि अपलोड करें
                    </h3>

                    <div className="flex flex-col gap-4">
                        <div className="relative border-2 border-dashed border-stone-300 rounded-xl p-5 text-center hover:bg-stone-50 transition duration-200">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="space-y-2 pointer-events-none">
                                <p className="text-stone-600 font-medium text-sm">चित्र चुनने के लिए क्लिक करें या यहाँ खींचें</p>
                                <p className="text-xs text-stone-400">PNG, JPG, JPEG (Max. 5MB)</p>
                            </div>
                        </div>

                        {selectedFile && (
                            <div className="bg-emerald-50 text-emerald-800 p-3 rounded-lg flex items-center justify-between border border-emerald-100">
                                <span className="text-sm font-medium truncate">{selectedFile.name}</span>
                                <span className="text-xs font-bold px-2 py-1 bg-emerald-200 rounded-md">
                                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                </span>
                            </div>
                        )}

                        <button
                            onClick={handleUpload}
                            disabled={!selectedFile || loading}
                            className={`w-full font-bold tracking-wide py-3 rounded-xl transition duration-200 mt-2 flex items-center justify-center gap-2 shadow-md ${!selectedFile || loading
                                ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                                : 'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white hover:shadow-lg'
                                }`}
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    विश्लेषण हो रहा है (Analyzing)...
                                </>
                            ) : (
                                <>एआई विश्लेषण चलाएं (Run AI Analysis)</>
                            )}
                        </button>
                    </div>

                    {/* Image Preview */}
                    {selectedFile && (
                        <div className="mt-6 border border-stone-200 rounded-xl overflow-hidden shadow-inner bg-stone-50">
                            <h4 className="p-2.5 bg-stone-100 text-sm font-bold text-stone-600 border-b border-stone-200 uppercase tracking-wider">छवि पूर्वावलोकन (Preview)</h4>
                            <div className="p-3 flex justify-center">
                                <img
                                    src={URL.createObjectURL(selectedFile)}
                                    alt="Cattle Preview"
                                    className="max-w-full max-h-80 object-contain rounded-lg shadow-sm"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Results Display (Right Column) */}
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-stone-100 xl:border-l-4 xl:border-l-indigo-500 flex flex-col">
                    <h3 className="text-xl font-bold mb-5 text-stone-800 flex items-center gap-2 border-b border-stone-100 pb-3">
                        2. विश्लेषण के परिणाम
                    </h3>

                    {error && (
                        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl mb-6 flex items-start gap-3">
                            <div>
                                <h4 className="font-bold">त्रुटि (Error)</h4>
                                <p className="text-sm mt-1">{error}</p>
                            </div>
                        </div>
                    )}

                    <div className="flex-1 flex flex-col justify-center">
                        {result ? (
                            <div className="space-y-6">
                                <div className="p-5 bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl shadow-sm relative overflow-hidden group">
                                    <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition duration-300">
                                        <span className="text-8xl text-indigo-500">🐄</span>
                                    </div>
                                    <div className="relative z-10 text-center">
                                        <p className="text-sm font-bold text-indigo-800 uppercase tracking-widest mb-1.5">पहचानी गई नस्ल (Detected Breed)</p>
                                        <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-600">{result.breed}</p>
                                    </div>
                                </div>

                                <div className="p-5 bg-stone-50 border border-stone-200 rounded-2xl shadow-sm text-center">
                                    <p className="text-sm font-bold text-stone-700 uppercase tracking-widest mb-2">विश्वास स्कोर (Confidence)</p>
                                    <div className="flex items-center justify-center gap-4">
                                        <div className="w-full bg-stone-200 rounded-full h-3 max-w-xs overflow-hidden">
                                            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-4 rounded-full" style={{ width: `${(result.confidence * 100).toFixed(0)}%` }}></div>
                                        </div>
                                        <span className="text-2xl font-black text-stone-800">{(result.confidence * 100).toFixed(2)}%</span>
                                    </div>
                                </div>

                                <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start gap-3 mt-auto">
                                    <span className="text-amber-500 text-xl">💡</span>
                                    <p className="text-sm text-amber-800 font-medium">
                                        नोट: यह एक सीधा मॉडल आउटपुट है और किसी भी मवेशी प्रोफ़ाइल को अपडेट नहीं करता है।
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-16 px-6 border-2 border-dashed border-stone-200 rounded-2xl bg-stone-50">
                                <p className="text-stone-500 text-lg font-medium">
                                    परिणाम देखने के लिए एक छवि चुनें और <br /> <strong className="text-stone-700">"एआई विश्लेषण चलाएं"</strong> पर क्लिक करें।
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DLModelStudio;
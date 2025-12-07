import React, { useState, useEffect } from 'react';
import { generateSolution } from '../services/geminiService';
import { SubjectOption } from '../types';
import { db } from '../firebase';

const subjects: SubjectOption[] = [
    { id: 'math', label: 'Math', emoji: '🔢', promptContext: "As a math expert, provide step-by-step solutions." },
    { id: 'physics', label: 'Physics', emoji: '⚛️', promptContext: "As a physics expert, explain principles and solve." },
    { id: 'history', label: 'History', emoji: '📜', promptContext: "As a historian, provide concise, factual answers." },
    { id: 'geography', label: 'Geography', emoji: '🌍', promptContext: "As a geographer, be precise with locations." },
    { id: 'english', label: 'English', emoji: '⚜️', promptContext: "As an English expert, explain grammar/literature." },
    { id: 'bengali', label: 'Bengali', emoji: '🌼', promptContext: "Provide the answer entirely in Bengali." },
];

const SolverScreen: React.FC = () => {
    const [selectedSubject, setSelectedSubject] = useState<SubjectOption>(subjects[0]);
    const [question, setQuestion] = useState('');
    const [detailLevel, setDetailLevel] = useState('medium');
    const [image, setImage] = useState<{ base64: string; mimeType: string } | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const [notice, setNotice] = useState<string | null>(null);

    // Fetch notice from Firestore
    useEffect(() => {
        const unsubscribe = db.collection('settings').doc('notice').onSnapshot(doc => {
            if (doc.exists && doc.data()?.text) {
                setNotice(doc.data()?.text);
            }
        });
        return () => unsubscribe();
    }, []);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 4 * 1024 * 1024) {
            alert("File too large (>4MB)");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const resultStr = reader.result as string;
            // Extract base64 and mime
            const base64 = resultStr.split(',')[1];
            setImage({ base64, mimeType: file.type });
        };
        reader.readAsDataURL(file);
    };

    const handleSolve = async () => {
        if (!question && !image) return;
        setLoading(true);
        setResult(null);

        try {
            const prompt = `
                Subject: ${selectedSubject.label}
                Context: ${selectedSubject.promptContext}
                Detail Level: ${detailLevel}
                Date: ${new Date().toLocaleString()}
                Question: ${question}
                ${image ? "An image is attached for analysis." : ""}
            `;

            const response = await generateSolution(prompt, image?.base64, image?.mimeType);
            setResult(response);
        } catch (err) {
            setResult("Sorry, I encountered an error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const speakResult = () => {
        if (!result) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(result);
        utterance.lang = selectedSubject.id === 'bengali' ? 'bn-BD' : 'en-US';
        window.speechSynthesis.speak(utterance);
    };

    const copyResult = () => {
        if (result) navigator.clipboard.writeText(result);
    };

    return (
        <div className="pb-24 px-4 pt-6 max-w-2xl mx-auto min-h-screen">
            <header className="text-center mb-8">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-400 animate-pulse-glow">
                    CreatorGpt
                </h1>
                <p className="text-slate-400 text-sm mt-1">Your AI Question Solver</p>
            </header>

            {/* Ad/Notice Area */}
            <div className="mb-6 p-4 rounded-2xl bg-glass backdrop-blur-md border border-glassBorder min-h-[60px] flex items-center justify-center">
                {notice ? (
                    <p className="text-yellow-200 font-semibold text-center animate-pulse">{notice}</p>
                ) : (
                    <p className="text-slate-500 italic text-sm">Advertisement Area</p>
                )}
            </div>

            {/* Subject Grid */}
            <div className="grid grid-cols-3 gap-3 mb-6">
                {subjects.map(sub => (
                    <button
                        key={sub.id}
                        onClick={() => setSelectedSubject(sub)}
                        className={`p-3 rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center gap-1 ${
                            selectedSubject.id === sub.id
                                ? 'bg-teal-500/20 border-teal-500 shadow-[0_0_15px_rgba(20,184,166,0.3)]'
                                : 'bg-glass border-glassBorder hover:bg-slate-800'
                        }`}
                    >
                        <span className="text-2xl">{sub.emoji}</span>
                        <span className="text-xs font-medium text-slate-300">{sub.label}</span>
                    </button>
                ))}
            </div>

            {/* Input Section */}
            <div className="space-y-4">
                <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder={`Type your ${selectedSubject.label} question here...`}
                    className="w-full h-32 p-4 bg-slate-900/60 border border-slate-700 rounded-2xl text-white focus:outline-none focus:border-teal-500 transition-colors resize-none"
                />

                <div className={`relative border-2 border-dashed rounded-2xl p-6 transition-all ${
                    image ? 'border-green-500 bg-green-500/10' : 'border-slate-600 hover:border-teal-500 hover:bg-teal-500/5'
                }`}>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center justify-center text-center">
                        {image ? (
                            <>
                                <img src={`data:${image.mimeType};base64,${image.base64}`} alt="Preview" className="h-20 object-contain mb-2 rounded" />
                                <span className="text-green-400 text-sm font-bold">Image Uploaded</span>
                                <button 
                                    onClick={(e) => { e.preventDefault(); setImage(null); }}
                                    className="mt-2 text-xs bg-red-500/80 text-white px-2 py-1 rounded z-10 hover:bg-red-600"
                                >
                                    Remove
                                </button>
                            </>
                        ) : (
                            <>
                                <i className="fa-solid fa-camera text-3xl text-slate-500 mb-2"></i>
                                <span className="text-slate-400 text-sm">Tap to upload image</span>
                            </>
                        )}
                    </div>
                </div>

                <select
                    value={detailLevel}
                    onChange={(e) => setDetailLevel(e.target.value)}
                    className="w-full p-4 bg-slate-900/60 border border-slate-700 rounded-2xl text-slate-300 focus:outline-none focus:border-teal-500"
                >
                    <option value="short">Short Answer</option>
                    <option value="medium">Medium Details</option>
                    <option value="detailed">Full Details</option>
                </select>

                <button
                    onClick={handleSolve}
                    disabled={loading || (!question && !image)}
                    className="w-full py-4 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white font-bold rounded-full shadow-[0_5px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_0_25px_rgba(20,184,166,0.5)] transform hover:-translate-y-1 transition-all disabled:opacity-50 disabled:transform-none"
                >
                    {loading ? (
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Analyzing...</span>
                        </div>
                    ) : (
                        <span>🚀 Solve Question</span>
                    )}
                </button>
            </div>

            {/* Result Section */}
            {result && (
                <div className="mt-8 bg-glass backdrop-blur-xl border border-glassBorder rounded-3xl p-6 border-l-4 border-l-teal-500 animate-[fadeIn_0.5s_ease-out]">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center text-slate-900 font-bold">
                                <i className="fa-solid fa-check"></i>
                            </div>
                            <h3 className="text-lg font-bold text-white">Solution</h3>
                        </div>
                        <div className="flex gap-4">
                            <button onClick={speakResult} className="text-teal-400 hover:text-white transition-colors">
                                <i className="fa-solid fa-volume-high text-xl"></i>
                            </button>
                            <button onClick={copyResult} className="text-teal-400 hover:text-white transition-colors">
                                <i className="fa-regular fa-copy text-xl"></i>
                            </button>
                        </div>
                    </div>
                    <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {result}
                    </div>
                </div>
            )}
            
            {/* Bottom Ad Placeholder */}
            <div className="mt-8 p-4 rounded-2xl bg-glass backdrop-blur-md border border-glassBorder min-h-[80px] flex items-center justify-center">
                 <p className="text-slate-500 italic text-sm">Advertisement Area</p>
            </div>
        </div>
    );
};

export default SolverScreen;
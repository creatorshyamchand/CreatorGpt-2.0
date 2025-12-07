import React, { useState } from 'react';
import { auth } from '../firebase';

const AuthScreen: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (isLogin) {
                await auth.signInWithEmailAndPassword(email, password);
            } else {
                await auth.createUserWithEmailAndPassword(email, password);
            }
        } catch (err: any) {
            let msg = "An error occurred.";
            if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
                msg = "Invalid email or password.";
            } else if (err.code === 'auth/email-already-in-use') {
                msg = "Email already registered.";
            } else if (err.code === 'auth/weak-password') {
                msg = "Password too weak (min 6 chars).";
            }
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-glass backdrop-blur-xl border border-glassBorder rounded-3xl p-8 shadow-2xl animate-[fadeIn_0.5s_ease-out]">
                <div className="flex justify-center mb-6">
                    <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-teal-400 to-purple-500 animate-pulse-glow">
                        <img 
                            src="https://i.ibb.co/9mRt8cBy/IMG-20250616-054954-581-removebg-preview.png" 
                            alt="Logo" 
                            className="w-full h-full rounded-full object-cover border-2 border-slate-900"
                        />
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-center text-white mb-8">
                    {isLogin ? 'Welcome Back!' : 'Join CreatorGpt'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-5 py-4 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all"
                            required
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-5 py-4 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all"
                            required
                        />
                    </div>

                    {error && (
                        <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white font-bold rounded-full shadow-lg transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <i className="fa-solid fa-circle-notch fa-spin"></i>
                        ) : (
                            isLogin ? 'Login' : 'Sign Up'
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-slate-400 text-sm">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                        <button
                            onClick={() => { setIsLogin(!isLogin); setError(null); }}
                            className="ml-2 text-teal-400 font-semibold hover:text-teal-300 hover:underline"
                        >
                            {isLogin ? 'Sign Up' : 'Login'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthScreen;
import React, { useState } from 'react';
import { db } from '../firebase';
import firebase from 'firebase/compat/app';

const ContactScreen: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email || !message) return;

        setLoading(true);
        setStatus(null);

        try {
            await db.collection('contactMessages').add({
                name,
                email,
                message,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
            setStatus({ type: 'success', msg: "Message sent successfully!" });
            setName('');
            setEmail('');
            setMessage('');
        } catch (error) {
            setStatus({ type: 'error', msg: "Failed to send message. Try again." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pb-24 px-4 pt-8 max-w-lg mx-auto min-h-screen flex flex-col justify-center">
            <header className="text-center mb-8">
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">
                    Contact Us
                </h1>
                <p className="text-slate-400 text-sm mt-2">Questions? Suggestions? We'd love to hear from you.</p>
            </header>

            <form onSubmit={handleSubmit} className="bg-glass backdrop-blur-xl border border-glassBorder rounded-3xl p-8 shadow-2xl space-y-5">
                <div>
                    <input
                        type="text"
                        placeholder="Your Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-5 py-4 bg-slate-900/60 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                    />
                </div>
                <div>
                    <input
                        type="email"
                        placeholder="Your Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-5 py-4 bg-slate-900/60 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                    />
                </div>
                <div>
                    <textarea
                        placeholder="Your Message"
                        rows={5}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full px-5 py-4 bg-slate-900/60 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all resize-none"
                    />
                </div>

                {status && (
                    <div className={`text-center text-sm font-medium p-2 rounded ${status.type === 'success' ? 'text-teal-400 bg-teal-500/10' : 'text-red-400 bg-red-500/10'}`}>
                        {status.msg}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white font-bold rounded-full shadow-lg transform hover:-translate-y-1 transition-all disabled:opacity-50"
                >
                    {loading ? "Sending..." : "Send Message"}
                </button>
            </form>
        </div>
    );
};

export default ContactScreen;
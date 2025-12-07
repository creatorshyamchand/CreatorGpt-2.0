import React from 'react';

const SplashScreen: React.FC = () => {
    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black">
            <div className="relative">
                {/* Pulsing Rings */}
                <div className="absolute inset-0 rounded-full border-4 border-teal-500/30 animate-ping"></div>
                <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20 animate-pulse delay-75"></div>
                
                {/* Logo Image */}
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-800 shadow-[0_0_50px_rgba(20,184,166,0.5)] z-10 relative bg-black">
                    <img 
                        src="https://i.ibb.co/9mRt8cBy/IMG-20250616-054954-581-removebg-preview.png" 
                        alt="CreatorGPT" 
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>

            <h1 className="mt-8 text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-cyan-400 to-purple-500 animate-pulse">
                CreatorGpt
            </h1>
            <p className="mt-2 text-slate-400 text-sm tracking-widest uppercase">Checking Credentials...</p>
            
            <div className="mt-8 flex space-x-2">
                <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce delay-200"></div>
            </div>
        </div>
    );
};

export default SplashScreen;
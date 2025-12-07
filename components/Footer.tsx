import React from 'react';
import { ViewState } from '../types';

interface FooterProps {
    currentView: ViewState;
    onChangeView: (view: ViewState) => void;
    onLogout: () => void;
}

const Footer: React.FC<FooterProps> = ({ currentView, onChangeView, onLogout }) => {
    const navItems = [
        { id: 'solver', label: 'Home', icon: 'fa-house' },
        { id: 'about', label: 'About', icon: 'fa-circle-info' },
        { id: 'contact', label: 'Contact', icon: 'fa-envelope' },
    ];

    return (
        <footer className="fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-xl border-t border-slate-700 z-50 pb-safe">
            <div className="flex justify-around items-center max-w-lg mx-auto h-[70px] px-2">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onChangeView(item.id as ViewState)}
                        className={`flex flex-col items-center justify-center flex-1 py-2 transition-all duration-300 ${
                            currentView === item.id 
                            ? 'text-teal-400 scale-110' 
                            : 'text-slate-400 hover:text-white'
                        }`}
                    >
                        <i className={`fa-solid ${item.icon} text-xl mb-1`}></i>
                        <span className="text-xs font-medium">{item.label}</span>
                    </button>
                ))}
                
                <button
                    onClick={onLogout}
                    className="flex flex-col items-center justify-center flex-1 py-2 text-red-400/70 hover:text-red-400 transition-all duration-300"
                >
                    <i className="fa-solid fa-arrow-right-from-bracket text-xl mb-1"></i>
                    <span className="text-xs font-medium">Logout</span>
                </button>
            </div>
        </footer>
    );
};

export default Footer;
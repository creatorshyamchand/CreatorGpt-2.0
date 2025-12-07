import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import { auth } from './firebase';
import { ViewState } from './types';
import SplashScreen from './components/SplashScreen';
import AuthScreen from './components/AuthScreen';
import SolverScreen from './components/SolverScreen';
import AboutScreen from './components/AboutScreen';
import ContactScreen from './components/ContactScreen';
import Footer from './components/Footer';

const App: React.FC = () => {
    const [view, setView] = useState<ViewState>('splash');
    const [user, setUser] = useState<firebase.User | null>(null);

    useEffect(() => {
        // Wait for Splash animation
        const splashTimer = setTimeout(() => {
            const unsubscribe = auth.onAuthStateChanged((currentUser) => {
                setUser(currentUser);
                if (currentUser) {
                    setView('solver');
                } else {
                    setView('auth');
                }
            });
            return () => unsubscribe();
        }, 3000); // 3 seconds splash

        return () => clearTimeout(splashTimer);
    }, []);

    const handleLogout = async () => {
        await auth.signOut();
        setView('auth');
    };

    if (view === 'splash') {
        return <SplashScreen />;
    }

    if (view === 'auth') {
        return <AuthScreen />;
    }

    return (
        <div className="min-h-screen relative overflow-hidden bg-slate-900 text-white">
            {/* Main Content Area */}
            <main className="w-full">
                {view === 'solver' && <SolverScreen />}
                {view === 'about' && <AboutScreen />}
                {view === 'contact' && <ContactScreen />}
            </main>

            {/* Footer Navigation */}
            <Footer 
                currentView={view} 
                onChangeView={setView} 
                onLogout={handleLogout} 
            />
        </div>
    );
};

export default App;
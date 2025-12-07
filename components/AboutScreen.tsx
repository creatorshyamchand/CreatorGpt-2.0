import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import firebase from 'firebase/compat/app';

interface Person {
    id: string;
    name: string;
    role?: string;
    image: string;
    bio?: string;
    socials: {
        youtube?: string;
        instagram?: string;
        facebook?: string;
        linkedin?: string;
    };
    phone?: string;
}

const team: Person[] = [
    {
        id: 'shyamchand',
        name: 'creator_Shyamchand',
        role: 'Creator & Developer',
        image: 'https://i.ibb.co/TzBnXSF/1752411802894.jpg',
        bio: 'Hello! I\'m Shyamchand Das, the creator behind CreatorGpt. Passionate about AI, web dev, and content creation.',
        socials: {
            youtube: 'https://youtube.com/@CREATORSHYAMCHAND',
            instagram: 'https://www.instagram.com/creator_shyamchand/',
            linkedin: 'https://www.linkedin.com/in/shyam-chand-mahato-557342287/'
        }
    },
    {
        id: 'rajat',
        name: 'Smile__Killar__Rajat',
        image: 'https://i.ibb.co/qMdkW2p8/smile-killar-rajat-20250725-0001.jpg',
        socials: { youtube: '#', instagram: '#', facebook: '#' },
        phone: '+91 9933136600'
    },
    {
        id: 'supriyo',
        name: 'IT\'Z SUPRIYO',
        image: 'https://i.ibb.co/KxJBvpsN/5fb9f5a1bbfe427571a448b63a0859e8.jpg',
        socials: { youtube: '#', instagram: '#', facebook: '#' },
        phone: '+91 8167686713'
    },
    {
        id: 'suresh',
        name: 'IT\'S SURESH',
        image: 'https://i.ibb.co/PG0SYRy5/itz-suresh-0m-20250727-0001.jpg',
        socials: { youtube: '#', instagram: '#', facebook: '#' },
        phone: '+01 234 567 892'
    }
];

const LikeButton: React.FC<{ personId: string }> = ({ personId }) => {
    const [count, setCount] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [loading, setLoading] = useState(false);
    const uid = auth.currentUser?.uid;

    useEffect(() => {
        if (!uid) return;
        
        // Listen to total likes
        const likeUnsub = db.collection('likes').doc(personId).onSnapshot(doc => {
            setCount(doc.exists ? doc.data()?.count || 0 : 0);
        });

        // Check if user liked
        const userLikeRef = db.collection('userLikes').doc(`${uid}_${personId}`);
        userLikeRef.get().then(doc => {
            setIsLiked(doc.exists);
        });

        return () => likeUnsub();
    }, [personId, uid]);

    const handleToggle = async () => {
        if (!uid || loading) return;
        setLoading(true);

        const likeRef = db.collection('likes').doc(personId);
        const userLikeRef = db.collection('userLikes').doc(`${uid}_${personId}`);

        try {
            await db.runTransaction(async (t) => {
                const likeDoc = await t.get(likeRef);
                const currentCount = likeDoc.exists ? likeDoc.data()?.count || 0 : 0;
                
                if (isLiked) {
                    t.delete(userLikeRef);
                    t.set(likeRef, { count: Math.max(0, currentCount - 1) }, { merge: true });
                } else {
                    t.set(userLikeRef, { userId: uid, personId, timestamp: firebase.firestore.FieldValue.serverTimestamp() });
                    t.set(likeRef, { count: currentCount + 1 }, { merge: true });
                }
            });
            setIsLiked(!isLiked);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const formatCount = (n: number) => {
        if (n < 1000) return n;
        return (n / 1000).toFixed(1) + 'k';
    };

    return (
        <button 
            onClick={handleToggle}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
                isLiked 
                ? 'bg-pink-500/20 border-pink-500 text-pink-500' 
                : 'bg-slate-800 border-slate-600 text-slate-400 hover:text-white'
            }`}
        >
            <i className={`${isLiked ? 'fa-solid' : 'fa-regular'} fa-heart ${loading ? 'animate-pulse' : ''}`}></i>
            <span className="font-bold">{formatCount(count)}</span>
        </button>
    );
};

const AboutScreen: React.FC = () => {
    return (
        <div className="pb-24 px-4 pt-8 max-w-2xl mx-auto min-h-screen">
             <header className="text-center mb-10">
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">
                    About Us
                </h1>
            </header>

            {/* Creator Main Card */}
            <div className="bg-glass backdrop-blur-xl border border-glassBorder rounded-3xl p-8 mb-12 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 to-purple-500"></div>
                
                <div className="flex flex-col items-center">
                    <div className="w-40 h-40 rounded-full p-1 bg-gradient-to-tr from-teal-400 to-cyan-500 shadow-[0_0_30px_rgba(20,184,166,0.4)] mb-6 animate-pulse-glow">
                        <img src={team[0].image} alt="Creator" className="w-full h-full rounded-full object-cover border-4 border-slate-900" />
                    </div>
                    
                    <h2 className="text-2xl font-bold text-white mb-2">{team[0].name}</h2>
                    <p className="text-teal-400 text-sm font-semibold mb-4">{team[0].role}</p>
                    <p className="text-slate-300 text-center text-sm leading-relaxed mb-6">
                        {team[0].bio}
                    </p>

                    <div className="flex gap-4 mb-6">
                         <a href={team[0].socials.youtube} target="_blank" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all transform hover:-translate-y-1"><i className="fa-brands fa-youtube text-lg"></i></a>
                         <a href={team[0].socials.instagram} target="_blank" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-pink-500 hover:bg-pink-500 hover:text-white transition-all transform hover:-translate-y-1"><i className="fa-brands fa-instagram text-lg"></i></a>
                         <a href={team[0].socials.linkedin} target="_blank" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-blue-500 hover:bg-blue-600 hover:text-white transition-all transform hover:-translate-y-1"><i className="fa-brands fa-linkedin-in text-lg"></i></a>
                    </div>
                    
                    <a href="https://creatorshyamchand.netlify.app" target="_blank" className="px-6 py-2 rounded-full border border-teal-500 text-teal-400 hover:bg-teal-500 hover:text-white transition-all text-sm font-medium mb-4">
                        Visit Portfolio
                    </a>

                    <LikeButton personId="shyamchand" />
                </div>
            </div>

            <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-600 to-transparent mb-10"></div>

            <h3 className="text-2xl font-bold text-center text-white mb-8">Meet The Team</h3>

            <div className="space-y-6">
                {team.slice(1).map(helper => (
                    <div key={helper.id} className="bg-slate-900/40 border border-slate-700/50 rounded-2xl p-6 flex flex-col items-center hover:border-teal-500/50 transition-all">
                        <img src={helper.image} alt={helper.name} className="w-24 h-24 rounded-full border-2 border-teal-500 mb-4 object-cover" />
                        <h4 className="text-xl font-bold text-white mb-3">{helper.name}</h4>
                        
                        <div className="flex gap-3 mb-4">
                             {helper.socials.youtube && <a href={helper.socials.youtube} className="text-slate-400 hover:text-red-500"><i className="fa-brands fa-youtube"></i></a>}
                             {helper.socials.instagram && <a href={helper.socials.instagram} className="text-slate-400 hover:text-pink-500"><i className="fa-brands fa-instagram"></i></a>}
                             {helper.socials.facebook && <a href={helper.socials.facebook} className="text-slate-400 hover:text-blue-500"><i className="fa-brands fa-facebook-f"></i></a>}
                        </div>
                        
                        {helper.phone && <p className="text-slate-400 text-sm mb-4"><i className="fa-solid fa-phone mr-2"></i>{helper.phone}</p>}
                        
                        <LikeButton personId={helper.id} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AboutScreen;
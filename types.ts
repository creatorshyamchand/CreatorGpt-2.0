export interface UserProfile {
    uid: string;
    email: string | null;
    displayName?: string;
}

export type ViewState = 'splash' | 'auth' | 'solver' | 'about' | 'contact';

export interface SubjectOption {
    id: string;
    label: string;
    emoji: string;
    promptContext: string;
}

export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
    image?: string;
}

export interface LikeData {
    count: number;
    isLiked: boolean;
}
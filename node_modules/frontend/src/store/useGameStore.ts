import { create } from 'zustand';

export type GamePhase = 'LOGIN' | 'WAITING' | 'VOTING_TEAM' | 'VOTING_DIGIMER' | 'TRIVIA' | 'TRANSITION' | 'WATERING' | 'FINAL';

interface SessionState {
    phase: GamePhase;
    currentQuestion: number;
    timer: number;
    treeStage: number;
    totalWater: number;
}

interface UserState {
    id: string;
    name: string;
    division: string;
    collectedWater: number;
    contributedWater: number;
    votes: {
        team: string | null;
        digimer: string | null;
    };
}

interface GameStore {
    // Session State
    phase: GamePhase;
    currentQuestion: number;
    timer: number;
    treeStage: number;
    totalWater: number;

    // User State
    user: {
        id: string;
        name: string;
        division: string;
    } | null;
    collectedWater: number;
    contributedWater: number;
    voteTeam: string | null;
    voteDigi: string | null;

    // Actions
    setSessionState: (state: Partial<SessionState>) => void;
    setUser: (user: GameStore['user']) => void;
    setUserState: (state: Partial<{ collectedWater: number; contributedWater: number; voteTeam: string; voteDigi: string }>) => void;
    reset: () => void;
}

const initialState = {
    phase: 'LOGIN' as GamePhase,
    currentQuestion: 0,
    timer: 0,
    treeStage: 0,
    totalWater: 0,
    user: null,
    collectedWater: 0,
    contributedWater: 0,
    voteTeam: null,
    voteDigi: null,
};

export const useGameStore = create<GameStore>((set) => ({
    ...initialState,

    setSessionState: (state) => set((s) => ({ ...s, ...state })),

    setUser: (user) => set({ user }),

    setUserState: (state) => set((s) => ({ ...s, ...state })),

    reset: () => set(initialState),
}));

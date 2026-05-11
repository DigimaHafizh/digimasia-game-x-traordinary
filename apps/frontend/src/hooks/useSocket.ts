import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useGameStore } from '@/store/useGameStore';
import { getBackendUrl } from '@/lib/config';

export const useSocket = () => {
    const socketRef = useRef<Socket | null>(null);
    const { user, setSessionState, setUserState } = useGameStore();

    const BACKEND_URL = getBackendUrl();

    useEffect(() => {
        // Connect to socket
        const socket = io(BACKEND_URL);
        socketRef.current = socket;

        socket.on('connect', () => {
            console.log('Connected to WebSocket');
            if (user) {
                socket.emit('join', { id: user.id, name: user.name });
            }
        });

        socket.on('session_state', (state) => {
            console.log('Received session state update:', state);
            setSessionState(state);
        });

        socket.on('user_state', (state) => {
            setUserState(state);
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from WebSocket');
        });

        return () => {
            socket.disconnect();
        };
    }, [user]);

    const emitVote = (candidateId: string, category: string) => {
        socketRef.current?.emit('vote', { candidateId, category });
    };

    const emitAnswer = (questionIndex: number, optionIndex: number) => {
        socketRef.current?.emit('answer', { questionIndex, optionIndex });
    };

    const emitWaterTap = () => {
        socketRef.current?.emit('water_tap', {});
    };

    return {
        emitVote,
        emitAnswer,
        emitWaterTap,
        socket: socketRef.current,
    };
};

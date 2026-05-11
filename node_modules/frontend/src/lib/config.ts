export const getBackendUrl = () => {
    // Production: use env variable
    if (process.env.NEXT_PUBLIC_BACKEND_URL) {
        return process.env.NEXT_PUBLIC_BACKEND_URL;
    }

    // Development: auto-detect from browser
    if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        return `http://${hostname}:3001`;
    }

    return 'http://localhost:3001';
};

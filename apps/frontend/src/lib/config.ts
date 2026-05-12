export const getBackendUrl = () => {
    if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;

        // If accessed via localhost, always use local backend port
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return `http://${hostname}:3001`;
        }

        // Production/Tunnel: use env variable if exists
        if (process.env.NEXT_PUBLIC_BACKEND_URL) {
            const url = process.env.NEXT_PUBLIC_BACKEND_URL;
            // Ensure protocol is present, otherwise browsers treat it as relative path
            if (url.startsWith('http')) return url;
            return `https://${url}`;
        }

        // Auto-detect other hostnames (like LAN IP)
        return `http://${hostname}:3001`;
    }

    return process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
};

import { NextResponse } from 'next/server';
import os from 'os';

export async function GET() {
    const interfaces = os.networkInterfaces();
    let localIp = 'localhost';

    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]!) {
            // Abaikan loopback dan pastikan itu IPv4
            if (iface.family === 'IPv4' && !iface.internal) {
                // Biasanya memprioritaskan IP yang umum seperti Wi-Fi (seringkali nama interface mengandung 'Wi-Fi' atau 'en')
                if (!localIp || localIp === 'localhost') {
                    localIp = iface.address;
                } else if (name.toLowerCase().includes('wi-fi') || name.toLowerCase().includes('wlan')) {
                    localIp = iface.address;
                }
            }
        }
    }

    return NextResponse.json({ ip: localIp });
}

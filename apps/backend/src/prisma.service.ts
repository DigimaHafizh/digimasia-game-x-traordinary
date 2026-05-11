import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaLibSQL } from '@prisma/adapter-libsql';
import { createClient } from '@libsql/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    private readonly logger = new Logger(PrismaService.name);

    constructor() {
        // Jika ada TURSO env vars, gunakan Turso adapter
        if (process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN) {
            const libsql = createClient({
                url: process.env.TURSO_DATABASE_URL,
                authToken: process.env.TURSO_AUTH_TOKEN,
            });
            const adapter = new PrismaLibSQL(libsql);
            super({ adapter } as any);
            console.log('✅ Prisma connected via Turso (Cloud)');
        } else {
            // Fallback ke SQLite lokal untuk development
            super();
            console.log('✅ Prisma connected via SQLite (Local)');
        }
    }

    async onModuleInit() {
        await this.$connect();
    }
}

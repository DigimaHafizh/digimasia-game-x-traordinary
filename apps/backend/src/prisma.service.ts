import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaLibSQL } from '@prisma/adapter-libsql';
import { createClient } from '@libsql/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    private readonly logger = new Logger(PrismaService.name);

    constructor() {
        // Cek cloud credentials
        const url = process.env.TURSO_DATABASE_URL;
        const authToken = process.env.TURSO_AUTH_TOKEN;

        let adapter: any = undefined;

        if (url && authToken) {
            const libsql = createClient({ url, authToken });
            adapter = new PrismaLibSQL(libsql);
        }

        // Panggil super dengan adapter jika ada
        super(adapter ? { adapter } as any : undefined);

        if (adapter) {
            console.log('✅ Prisma connected via Turso (Cloud)');
        } else {
            console.log('✅ Prisma connected via SQLite (Local)');
        }
    }

    async onModuleInit() {
        await this.$connect();
    }
}

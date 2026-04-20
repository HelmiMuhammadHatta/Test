import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    // 1. Buat koneksi pool menggunakan driver pg standar
    const connectionString = process.env.DATABASE_URL || "postgresql://postgres:20@localhost:5432/ini?schema=public";
    const pool = new Pool({ connectionString });
    
    // 2. Bungkus dengan Prisma Adapter
    const adapter = new PrismaPg(pool);
    
    // 3. Suntikkan adapter ke constructor Prisma 7
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
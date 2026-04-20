import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Membuat PrismaService tersedia di seluruh aplikasi tanpa import berulang
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // WAJIB ada ini agar bisa dipakai module lain
})
export class PrismaModule {}
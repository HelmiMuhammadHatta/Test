import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { PrismaModule } from '../prisma/prisma.module'; 
import { JwtModule } from '@nestjs/jwt'; // 👈 Tambahkan ini

@Module({
  imports: [
    PrismaModule,
    // Daftarkan JwtModule agar JwtService bisa dipakai di Controller
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'super-secret-key-sementara',
    }),
  ],
  controllers: [ProfileController], // 👈 WAJIB ADA DI SINI
  providers: [ProfileService],
})
export class ProfileModule {}
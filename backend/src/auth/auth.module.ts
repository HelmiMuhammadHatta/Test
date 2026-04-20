import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt'; // 👈 1. Import JwtModule
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from '../prisma/prisma.module'; 
import { PassportModule } from '@nestjs/passport'; // 👈 Tambah ini
import { JwtStrategy } from './jwt.strategy';      // 👈 Tambah ini

@Module({
  imports: [
    PrismaModule,
    PassportModule, // 👈 Daftarkan ini
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'super-secret-key-sementara',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy], // 👈 Tambahkan JwtStrategy ke providers
  exports: [AuthService],
})
export class AuthModule {}
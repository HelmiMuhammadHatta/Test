import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async login(dto: any) {
    // Mencari user berdasarkan username ATAU email
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: dto.username }, 
          { username: dto.username }
        ]
      },
    });

    if (!user) throw new UnauthorizedException('Akun tidak ditemukan');

    if (user.password !== dto.password) {
      throw new UnauthorizedException('Password salah');
    }

    const payload = { 
      sub: user.id, 
      username: user.username,
      email: user.email 
    };
    
    return {
      message: "Login berhasil",
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async register(dto: any) {
    try {
      const newUser = await this.prisma.user.create({
        data: {
          username: dto.username,
          email: dto.email,
          password: dto.password,
        },
      });
      const { password, ...userWithoutPassword } = newUser;
      return { message: "Registrasi berhasil", user: userWithoutPassword };
    } catch (error) {
      throw new UnauthorizedException('Username atau Email sudah terdaftar.');
    }
  }
}
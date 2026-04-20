import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: number) {
    return this.prisma.profile.findUnique({
      where: { userId },
      include: { user: true },
    });
  }

  async createOrUpdate(userId: number, data: any) {
    try {
      // 1. Pisahkan data. username & email dibuang dari profileData agar Prisma tidak error 400
      const { username, email, ...profileData } = data;

      // 2. Update tabel User (Username & Email)
      await this.prisma.user.update({
        where: { id: userId },
        data: { 
          username: username, 
          email: email 
        }
      });

      // 3. Update atau Buat data Profile (Hanya data yang ada di model Profile)
      return await this.prisma.profile.upsert({
        where: { userId },
        update: {
          birthday: profileData.birthday ? new Date(profileData.birthday) : undefined,
          zodiac: profileData.zodiac,
          horoscope: profileData.horoscope
        },
        create: {
          userId,
          birthday: profileData.birthday ? new Date(profileData.birthday) : new Date(),
          zodiac: profileData.zodiac,
          horoscope: profileData.horoscope
        },
        include: { user: true }
      });
    } catch (error: any) {
      throw new BadRequestException('Gagal Sinkronisasi: ' + error.message);
    }
  }
}
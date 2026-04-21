import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: number) {
    // 👇 PASTIKAN CARI BERDASARKAN ID YANG LOGIN (Dinamis)
    return this.prisma.profile.findUnique({
      where: { userId: Number(userId) },
      include: { user: true }, // Ambil data Username & Email asli
    });
  }

  async createOrUpdate(userId: number, data: any) {
    try {
      // 1. Destructuring data: Pisahkan data User dan Profile
      const { username, email, birthday, zodiac, horoscope, interests } = data;

      // 2. Update tabel User (Username & Email)
      await this.prisma.user.update({
        where: { id: Number(userId) },
        data: { 
          username: username, 
          email: email 
        }
      });

      // 3. Update atau Buat data Profile (Interests ditangani sebagai Array)
      return await this.prisma.profile.upsert({
        where: { userId: Number(userId) },
        update: { 
          birthday: new Date(birthday), 
          zodiac, 
          horoscope,
          interests: interests || [] // Handle interests array
        },
        create: { 
          userId: Number(userId), 
          birthday: new Date(birthday), 
          zodiac, 
          horoscope,
          interests: interests || []
        },
        include: { user: true } // Kembalikan data lengkap
      });
    } catch (error: any) {
      throw new BadRequestException('Sync failed: ' + error.message);
    }
  }
}
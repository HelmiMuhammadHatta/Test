import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProfileModule } from './profile/profile.module'; // 👈 1. Import file-nya

@Module({
  // 👇 2. Masukkan ProfileModule ke dalam array imports 👇
  imports: [AuthModule, PrismaModule, ProfileModule], 
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
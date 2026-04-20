import { Controller, Get, Post, Body, Request, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { AuthGuard } from '@nestjs/passport'; // 👈 Import Guard

@Controller('api')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(AuthGuard('jwt')) // 👈 Satpam otomatis
  @Post('createProfile')
  async create(@Body() createDto: any, @Request() req) {
    // Data user sekarang otomatis ada di req.user berkat JwtStrategy
    const userId = Number(req.user.userId); 
    return await this.profileService.createOrUpdate(userId, createDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('getProfile')
  async getProfile(@Request() req) {
    const userId = Number(req.user.userId);
    return await this.profileService.getProfile(userId);
  }
}
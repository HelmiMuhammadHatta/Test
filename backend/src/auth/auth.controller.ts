import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('api') // 👈 PASTIKAN INI 'api' (sesuai yang dipanggil frontend)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register') // 👈 Jadi alamatnya: localhost:3001/api/register
  async register(@Body() registerDto: any) {
    return this.authService.register(registerDto);
  }

  @Post('login') // 👈 Jadi alamatnya: localhost:3001/api/login
  async login(@Body() loginDto: any) {
    return this.authService.login(loginDto);
  }
}
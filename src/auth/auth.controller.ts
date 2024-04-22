import { Body, Controller, Post } from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth-payload.dto';

@Controller('auth')
export class AuthController {
  @Post('login')
  login(@Body() authPayloadDto: AuthPayloadDto) {}
}

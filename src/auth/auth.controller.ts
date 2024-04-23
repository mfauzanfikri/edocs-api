import {
  Body,
  ConflictException,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards/local.guard';
import { Request } from 'express';
import { JwtAuthGuard } from './guards/jwt.guard';
import { AuthPayloadDto } from './dto/auth-payload.dto';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('login')
  @UseGuards(LocalGuard)
  async login(@Req() req: Request) {
    return { data: req.user };
  }

  @Post('register')
  async register(@Body() authPayloadDto: AuthPayloadDto) {
    const findUser = await this.usersService.findByUsername(
      authPayloadDto.username,
    );

    if (findUser) {
      throw new ConflictException('user already exists');
    }

    const registerUser = await this.authService.registerUser(authPayloadDto);

    if (!registerUser) {
      throw new InternalServerErrorException('internal server error');
    }

    return {
      data: {
        id: registerUser.id,
        username: registerUser.username,
      },
    };
  }

  @Get('status')
  @UseGuards(JwtAuthGuard)
  status(@Req() req: Request) {
    return { data: req.user };
  }
}

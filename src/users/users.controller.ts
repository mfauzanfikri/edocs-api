import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  NotFoundException,
  ConflictException,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const createdUser = await this.userService.create(createUserDto);

      return {
        data: createdUser,
      };
    } catch (error) {
      throw new ConflictException('user already exists');
    }
  }

  @Get()
  async findAll() {
    const users = await this.userService.findAll();
    return {
      data: users,
    };
  }

  @Get(':id')
  async find(@Param('id') id: string) {
    const user = await this.userService.findById(+id);

    if (!user) {
      throw new NotFoundException('user not found');
    }

    return {
      data: {
        id: user.id,
        username: user.username,
      },
    };
  }
}

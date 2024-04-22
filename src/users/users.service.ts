import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma.service';
import bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  create(createUserDto: CreateUserDto) {
    const { username, password } = createUserDto;

    const hashedPassword = bcrypt.hashSync(password);

    return this.prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });
  }

  findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        username: true,
      },
    });
  }

  findById(id: number) {
    return this.prisma.user.findFirst({
      where: {
        id,
      },
    });
  }

  findByUsername(username: string) {
    return this.prisma.user.findFirst({
      where: {
        username,
      },
    });
  }
}

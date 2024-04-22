import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth-payload.dto';
import { UsersService } from '../users/users.service';
import bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(AuthPayloadDto: AuthPayloadDto) {
    const { username, password } = AuthPayloadDto;

    const findUser = await this.usersService.findByUsername(username);

    if (!findUser || findUser.username !== username) {
      return null;
    }

    if (!bcrypt.compareSync(password, findUser.password)) {
      throw new UnauthorizedException();
    }

    return findUser;
  }
}

import { Injectable } from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth-payload.dto';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

function verifyUser(
  user: { username: string; password: string },
  userInDb: { username: string; password: string },
) {
  if (user.username !== userInDb.username) {
    return false;
  }

  if (!bcrypt.compareSync(user.password, userInDb.password)) {
    return false;
  }

  return true;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(user: AuthPayloadDto) {
    const findUser = await this.usersService.findByUsername(user.username);

    if (!findUser) {
      return null;
    }

    const userInDb = {
      username: findUser.username,
      password: findUser.password,
    };

    if (!verifyUser(user, userInDb)) {
      return null;
    }

    return findUser;
  }

  async registerUser(user: AuthPayloadDto) {
    const { username, password } = user;
    const hashedPassword = bcrypt.hashSync(password);

    try {
      const createUser = await this.usersService.create({
        username,
        password: hashedPassword,
      });

      return createUser;
    } catch (error) {
      return null;
    }
  }

  generateAccessToken(payload: { username: string; sub: string }) {
    return this.jwtService.sign(payload);
  }

  verifyAccessToken(accessToken: string) {
    return this.jwtService.verify(accessToken);
  }
}

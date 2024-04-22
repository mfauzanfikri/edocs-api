import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DocumentModule } from './document/document.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [AuthModule, UsersModule, DocumentModule],
})
export class AppModule {}
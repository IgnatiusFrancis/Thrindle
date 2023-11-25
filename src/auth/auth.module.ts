import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtAuthService } from 'src/utils/token.generators';
import { PrismaService } from 'src/utils/prisma';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtAuthService, PrismaService],
})
export class AuthModule {}

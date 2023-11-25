import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { PrismaService } from '../utils/prisma';
import { JwtAuthService } from '../utils/token.generators';

@Module({
  controllers: [WalletController],
  providers: [WalletService, PrismaService, JwtAuthService],
})
export class WalletModule {}

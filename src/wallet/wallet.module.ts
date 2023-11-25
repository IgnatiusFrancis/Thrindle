import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { PrismaService } from 'src/utils/prisma';
import { JwtAuthService } from 'src/utils/token.generators';

@Module({
  controllers: [WalletController],
  providers: [WalletService, PrismaService, JwtAuthService],
})
export class WalletModule {}

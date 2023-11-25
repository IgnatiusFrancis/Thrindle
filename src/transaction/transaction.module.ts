import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { PrismaService } from '../utils/prisma';
import { JwtAuthService } from '../utils/token.generators';

@Module({
  controllers: [TransactionController],
  providers: [TransactionService, PrismaService, JwtAuthService],
})
export class TransactionModule {}

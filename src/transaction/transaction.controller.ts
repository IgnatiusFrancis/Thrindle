import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { JwtGuard } from '../utils/guards/jwtAuth.guard';
import { CurrentUser } from '../utils/decorators';
import { User } from '@prisma/client';
import { TransferDto } from './dto/transaction.dto';

@Controller('transfer')
@UseGuards(JwtGuard)
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @Post(':walletId')
  async transfer(
    @CurrentUser() user: User,
    @Param('walletId') senderWalletId: string,
    @Body() transferDto: TransferDto,
  ) {
    return await this.transactionService.transfer(
      user.id,
      senderWalletId,
      transferDto,
    );
  }

  @Get('transactions')
  async getApprovedTransactions(@CurrentUser() user: User) {
    return await this.transactionService.getAllTransactions(user.id);
  }
  @Get(':txnId')
  async getAllTransaction(
    @CurrentUser() user: User,
    @Param('txnId') txnId: string,
  ) {
    return await this.transactionService.getTransaction(txnId, user.id);
  }
}

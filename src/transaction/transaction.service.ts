import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { v4 as uuidv4 } from 'uuid';

import { PrismaService } from 'src/utils/prisma';
import { TransferDto } from './dto/transaction.dto';
import { Status } from './interface/enum';

@Injectable()
export class TransactionService {
  constructor(private prismaService: PrismaService) {}

  async transfer(id: string, senderWalletId: string, transferDto: TransferDto) {
    try {
      const { recieverWalletId, amount } = transferDto;
      const senderWallet = await this.prismaService.wallet.findFirst({
        where: {
          id: senderWalletId,
          userId: id,
        },
      });
      if (!senderWallet)
        throw new HttpException(`wallet does not exist`, HttpStatus.NOT_FOUND);

      const recieverWallet = await this.prismaService.wallet.findUnique({
        where: {
          id: recieverWalletId,
        },
      });
      if (!recieverWallet)
        return new HttpException(`wallet does not exist`, HttpStatus.NOT_FOUND);
      if (senderWallet.currency !== recieverWallet.currency)
        throw new HttpException(
          'reciever wallet should accept same currency',
          HttpStatus.CONFLICT,
        );

      if (amount > senderWallet.balance)
        throw new HttpException(
          'Insufficient balance to make the transaction',
          HttpStatus.CONFLICT,
        );

      const senderBalance = senderWallet.balance - amount;

      await this.prismaService.wallet.update({
        where: {
          id: senderWalletId,
          userId: id,
        },
        data: {
          balance: senderBalance,
        },
      });

      const recieverBalance = recieverWallet.balance + amount;

      await this.prismaService.wallet.update({
        where: {
          id: recieverWalletId,
        },
        data: {
          balance: recieverBalance,
        },
      });

      const approvedTransaction = await this.prismaService.transaction.create({
        data: {
          id: uuidv4(),
          senderWalletId,
          recieverWalletId,
          amount,
          userId: id,
        },
      });

      return { approvedTransaction, myWalletBallance: senderBalance };
    } catch (error) {
      throw new HttpException(
        `${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getTransaction(txnId: string, id: string) {
    try {
      const transaction = await this.prismaService.transaction.findUnique({
        where: {
          id: txnId,
          userId: id,
        },
      });
      if (!transaction)
        throw new HttpException('Transaction not found', HttpStatus.NOT_FOUND);
      return transaction;
    } catch (error) {
      throw new HttpException(
        `${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllTransactions(id: string) {
    try {
      const transactions = await this.prismaService.transaction.findMany({
        where: {
          userId: id,
          status: Status.APPROVED,
        },
      });
      return transactions;
    } catch (error) {
      throw new HttpException(
        `${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

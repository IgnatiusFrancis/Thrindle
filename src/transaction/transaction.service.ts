import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';

import { v4 as uuidv4 } from 'uuid';

import { PrismaService } from '../utils/prisma';
import {
  CreatePaymentDto,
  CreateTransferRecipientDto,
  TransferDto,
} from './dto/transaction.dto';
import { Status } from './interface/enum';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TransactionService {
  constructor(
    private prismaService: PrismaService,
    private readonly configservice: ConfigService,
  ) {}

  async walletToWallet(
    id: string,
    senderWalletId: string,
    transferDto: TransferDto,
  ) {
    try {
      const { recieverWalletId, amount } = transferDto;

      const senderWallet = await this.prismaService.wallet.findFirst({
        where: {
          id: senderWalletId,
          userId: id,
        },
      });

      if (!senderWallet)
        throw new HttpException(
          `Sender's wallet does not exist`,
          HttpStatus.NOT_FOUND,
        );

      const recieverWallet = await this.prismaService.wallet.findUnique({
        where: {
          id: recieverWalletId,
        },
      });
      if (!recieverWallet)
        return new HttpException(
          `Receiver's wallet does not exist`,
          HttpStatus.NOT_FOUND,
        );
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

      const recieverBalance = Math.floor(recieverWallet.balance + amount);

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
      console.log(error.message);
      throw new HttpException(
        `${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async walletToOthers(
    id: string,
    senderWalletId: string,
    createTransferRecipientDto: CreateTransferRecipientDto,
  ) {
    try {
      const { amount } = createTransferRecipientDto;

      const senderWallet = await this.prismaService.wallet.findFirst({
        where: {
          id: senderWalletId,
          userId: id,
        },
      });

      if (!senderWallet)
        throw new HttpException(
          `Sender's wallet does not exist`,
          HttpStatus.NOT_FOUND,
        );

      if (amount > senderWallet.balance)
        throw new HttpException(
          'Insufficient balance to make the transaction',
          HttpStatus.CONFLICT,
        );

      const paymentRecipientData = {
        name: createTransferRecipientDto.name,
        type: createTransferRecipientDto.type,
        currency: createTransferRecipientDto.currency,
        bank_code: createTransferRecipientDto.bank_code,
        account_number: createTransferRecipientDto.account_number,
      };

      const response: AxiosResponse = await axios.post(
        'https://api.paystack.co/transferrecipient',
        paymentRecipientData,
        {
          headers: {
            Authorization: `Bearer ${this.configservice.get('TEST_SECRET')}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const paymentData = {
        source: createTransferRecipientDto.source,
        reason: createTransferRecipientDto.reason,
        amount: createTransferRecipientDto.amount,
        recipient: response.data.data.recipient_code,
      };

      const res: AxiosResponse = await axios.post(
        'https://api.paystack.co/transfer',
        paymentData,
        {
          headers: {
            Authorization: `Bearer ${this.configservice.get('TEST_SECRET')}`,
            'Content-Type': 'application/json',
          },
        },
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

      return { ...res.data, myWalletBallance: senderBalance };
    } catch (error) {
      console.log(error.message);
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

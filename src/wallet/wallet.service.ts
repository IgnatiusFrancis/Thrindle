import { Injectable } from '@nestjs/common';

import { v4 as uuidv4 } from 'uuid';
import { HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../utils/prisma';
import { CreateWalletDto, FundWalletDto } from './dto/create-wallet.dto';
import { PaystackConfigService } from '../paystack/PaystackConfigService';
@Injectable()
export class WalletService {
  constructor(
    private prismaService: PrismaService,
    private payStackService: PaystackConfigService,
  ) {}

  async createWallet(id: string, walletDto: CreateWalletDto) {
    try {
      const currency = walletDto.currency;
      const wallets = await this.prismaService.wallet.findMany({
        where: { userId: id },
      });

      const isExist = wallets.find((wallet) => wallet.name === walletDto.name);
      if (isExist) {
        throw new HttpException(
          `Wallet with ${walletDto.name} already exists`,
          HttpStatus.BAD_REQUEST,
        );
      }

      const wallet = await this.prismaService.wallet.create({
        data: {
          id: uuidv4(),
          name: walletDto.name,
          currency,
          userId: id,
        },
      });
      return wallet;
    } catch (error) {
      console.log(error.message);
      throw new HttpException(
        `${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async fundWallet(id: string, walletId: string, fundWalletDto: FundWalletDto) {
    try {
      const { currency } = fundWalletDto;

      const wallet = await this.prismaService.wallet.findFirst({
        where: {
          id: walletId,
          userId: id,
        },
      });
      if (!wallet)
        throw new HttpException('Wallet not found', HttpStatus.NOT_FOUND);
      if (wallet.currency !== currency)
        throw new HttpException(
          'Invalid wallet Currency',
          HttpStatus.BAD_REQUEST,
        );

      const paymentData = await this.payStackService.initiatePayment(
        id,
        walletId,
        fundWalletDto,
      );
      // if(!paymentData) return new HttpException("Currency not supported by paystack",HttpStatus.NOT_FOUND)

      return paymentData;
    } catch (error) {
      throw error;
    }
  }

  async fundWalletVerification(trxref: string) {
    try {
      const verify = await this.payStackService.verifyPayment(trxref);

      if (verify.status === 'success') {
        const { id, walletId, amount } = verify.metadata;
        const wallet = await this.prismaService.wallet.findFirst({
          where: {
            id: walletId,
            userId: id,
          },
        });

        const existingBalance = wallet.balance;
        const balance = existingBalance + Number(amount);

        const fundedWallet = await this.prismaService.wallet.update({
          where: {
            id: walletId,
            userId: id,
          },
          data: {
            balance,
          },
        });

        const existingPayment =
          await this.prismaService.paymentDetails.findFirst({
            where: {
              paystackId: verify.id,
            },
          });

        if (existingPayment)
          throw new HttpException(
            'Payment has already been verified',
            HttpStatus.CONFLICT,
          );

        const paymentDetails = await this.prismaService.paymentDetails.create({
          data: {
            id: uuidv4(),
            WalletBallance: balance,
            amount: Number(amount),
            userId: id,
            currency: fundedWallet.currency,
            walletId,
            paystackId: verify.id,
          },
        });

        return { fundedWallet, paymentDetails };
      } else {
        return { status: verify.status };
      }
    } catch (error) {
      throw new HttpException(
        `${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getWallet(id: string, walletId: string) {
    try {
      const wallet = await this.prismaService.wallet.findFirst({
        where: {
          id: walletId,
          userId: id,
        },
      });
      if (!wallet) {
        throw new HttpException('Wallet not found', HttpStatus.NOT_FOUND);
      } else {
        return wallet;
      }
    } catch (error) {
      throw new HttpException(
        `${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getWallets(id: string) {
    try {
      const wallets = await this.prismaService.wallet.findMany({
        where: {
          userId: id,
        },
      });
      return wallets;
    } catch (error) {
      return new HttpException(
        `${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

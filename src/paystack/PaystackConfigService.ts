import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FundWalletDto } from '../wallet/dto/create-wallet.dto';

const Paystack = require('paystack');

@Injectable()
export class PaystackConfigService {
  private readonly paystack = Paystack;

  constructor(private configService: ConfigService) {
    this.paystack = Paystack(this.configService.get<string>('TEST_SECRET'));
  }

  async initiatePayment(
    id: String,
    walletId: string,
    fundWalletDto: FundWalletDto,
  ) {
    try {
      const baseUrl = 'https://checkout.paystack.com';
      const { currency, amount, email } = fundWalletDto;
      const response = await this.paystack.transaction.initialize({
        amount: amount * 100,
        email,
        currency,
        redirect_url: `${baseUrl}\wallet\callback`,
        metadata: {
          id,
          walletId,
          amount,
        },
      });

      return response;
    } catch (error) {
      return new HttpException(
        `${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async verifyPayment(reference: string) {
    try {
      const response = await this.paystack.transaction.verify(reference);
      return response.data;
    } catch (error) {
      return new HttpException(
        `${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

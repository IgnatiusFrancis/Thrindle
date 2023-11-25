import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  CreateCustomerDto,
  CreatePaymentDto,
  CreateTransferDto,
  CreateTransferRecipientDto,
} from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PaystackConfigService } from 'src/paystack/PaystackConfigService';
import { InjectPaystack } from 'nestjs-paystack';
import axios, { AxiosResponse } from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaymentService {
  constructor(
    private readonly configservice: ConfigService,
    @InjectPaystack() private readonly paystackClient,
  ) {}

  async initiateTransaction(createPaymentDto: CreatePaymentDto): Promise<any> {
    try {
      const response = await this.paystackClient.transaction.initialize({
        amount: createPaymentDto.amount,
        email: createPaymentDto.email,
      });
      console.log(response.data);

      return response;
    } catch (error) {
      // Handle errors
      throw new Error(`Error initiating transaction: ${error.message}`);
    }
  }

  async verifyTransaction(reference: string): Promise<any> {
    try {
      const response = await this.paystackClient.transaction.verify(reference);

      return response;
    } catch (error) {
      // Handle errors
      throw new HttpException(
        `Error initiating transaction: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getTransactions(): Promise<any> {
    try {
      const response = await this.paystackClient.transaction.list();

      return response;
    } catch (error) {
      // Handle errors
      throw new Error(`Error initiating transaction: ${error.message}`);
    }
  }

  async getTotalTransactions(): Promise<any> {
    try {
      const response = await this.paystackClient.transaction.totals();

      return response;
    } catch (error) {
      // Handle errors
      throw new Error(`Error initiating transaction: ${error.message}`);
    }
  }

  async createCustomer(createCustomerDto: CreateCustomerDto): Promise<any> {
    try {
      const response = await this.paystackClient.customer.create({
        amount: createCustomerDto.name,
        email: createCustomerDto.email,
        password: createCustomerDto.password,
      });
      console.log(response.data);

      return response;
    } catch (error) {
      // Handle errors
      throw new Error(`Error initiating transaction: ${error.message}`);
    }
  }

  async chargeCustomer(createPaymentDto: CreatePaymentDto): Promise<any> {
    try {
      const response = await this.paystackClient.transaction.charge({
        amount: createPaymentDto.email,
        email: createPaymentDto.email,
        authorization_code: createPaymentDto.authorization_code,
      });
      console.log(response.data);

      return response;
    } catch (error) {
      // Handle errors
      throw new Error(`Error initiating transaction: ${error.message}`);
    }
  }

  async transaction(createTransferDto: CreateTransferDto): Promise<string> {
    try {
      // const secretKey = process.env.PAYSTACK_SECRET_KEY;
      const paymentData = {
        source: createTransferDto.source,
        reason: createTransferDto.reason,
        amount: createTransferDto.amount,
        recipient: createTransferDto.recipient,
      };

      // console.log(paymentData.recipient);

      const response: AxiosResponse = await axios.post(
        'https://api.paystack.co/transfer',
        paymentData,
        {
          headers: {
            Authorization: `Bearer ${this.configservice.get('TEST_SECRET')}`,
            'Content-Type': 'application/json',
          },
        },
      );

      // Return a string, or adapt the response as need
      return response.data;
    } catch (error) {
      // Handle errors
      console.error('Failed to initiate transfer:', error);
      throw new Error('Failed to initiate transfer');
    }
  }

  async transactionRecipient(
    createTransferRecipientDto: CreateTransferRecipientDto,
  ): Promise<string> {
    try {
      // const secretKey = process.env.PAYSTACK_SECRET_KEY;
      const paymentData = {
        name: createTransferRecipientDto.name,
        type: createTransferRecipientDto.type,
        currency: createTransferRecipientDto.currency,
        bank_code: createTransferRecipientDto.bank_code,
        account_number: createTransferRecipientDto.account_number,
      };

      // console.log(paymentData.recipient);

      const response: AxiosResponse = await axios.post(
        'https://api.paystack.co/transferrecipient',
        paymentData,
        {
          headers: {
            Authorization: `Bearer ${this.configservice.get('TEST_SECRET')}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return response.data;

      // Return a string, or adapt the response as need
      // return 'Transfer initiated successfully';
    } catch (error) {
      // Handle errors
      console.error('Failed to initiate transfer:', error);
      throw new Error('Failed to initiate transfer');
    }
  }

  create(createPaymentDto: CreatePaymentDto) {
    return 'This action adds a new payment';
  }

  findAll() {
    return `This action returns all payment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    return `This action updates a #${id} payment`;
  }

  remove(id: number) {
    return `This action removes a #${id} payment`;
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import {
  CreateCustomerDto,
  CreatePaymentDto,
  CreateTransferDto,
  CreateTransferRecipientDto,
} from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('initiate')
  initiateTransaction(
    @Body() createPaymentDto: CreatePaymentDto,
  ): Promise<any> {
    return this.paymentService.initiateTransaction(createPaymentDto);
  }

  @Post('transfer')
  transaction(@Body() createTransferDto: CreateTransferDto): Promise<any> {
    return this.paymentService.transaction(createTransferDto);
  }

  @Post('transfer-recipient')
  transactionRecipient(
    @Body() createTransferRecipientDto: CreateTransferRecipientDto,
  ): Promise<any> {
    return this.paymentService.transactionRecipient(createTransferRecipientDto);
  }

  @Post('customer')
  createCustomer(@Body() createPaymentDto: CreateCustomerDto): Promise<any> {
    return this.paymentService.createCustomer(createPaymentDto);
  }

  @Get('verify/:reference')
  verifyTransaction(@Param('reference') reference: string): Promise<any> {
    return this.paymentService.verifyTransaction(reference);
  }

  @Get('charge')
  chargeCustomer(@Body() createPaymentDto: CreatePaymentDto): Promise<any> {
    return this.paymentService.chargeCustomer(createPaymentDto);
  }

  @Get('transactions')
  getTransactions(): Promise<any> {
    return this.paymentService.getTransactions();
  }

  @Get('total')
  getTotalTransactions(): Promise<any> {
    return this.paymentService.getTotalTransactions();
  }

  @Get()
  findAll() {
    return this.paymentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentService.update(+id, updatePaymentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentService.remove(+id);
  }
}

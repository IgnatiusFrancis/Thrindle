import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PaystackModule } from 'nestjs-paystack';

@Module({
  imports: [
    PaystackModule.forRoot({
      apiKey: 'sk_test_89846232b2dad0ca204bcc8ec651e6f08211d939',
    }),
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}

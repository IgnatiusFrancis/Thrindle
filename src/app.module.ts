import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './utils';
import { PaystackConfigService } from './paystack/PaystackConfigService';
import { PaystackConfigModule } from './paystack/PaystackConfigModule';
import { PaystackModule } from 'nestjs-paystack';
import { AuthModule } from './auth/auth.module';
import { WalletModule } from './wallet/wallet.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { UserInterceptor } from './utils/interceptors/user.interceptor';
import { AllExceptionsFilter } from './utils/filters/httpExceptionFilter';
import { JwtAuthService } from './utils/token.generators';
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [
    ConfigModule,
    PaystackConfigModule,
    AuthModule,
    WalletModule,
    TransactionModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtAuthService,
    {
      provide: APP_INTERCEPTOR,
      useClass: UserInterceptor,
    },
    {
      provide: 'APP_FILTER',
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}

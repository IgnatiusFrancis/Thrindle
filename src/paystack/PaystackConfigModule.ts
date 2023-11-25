// PaystackConfigModule.ts
import { Global, Module } from '@nestjs/common';
import { PaystackConfigService } from './PaystackConfigService';

@Global()
@Module({
  exports: [PaystackConfigService],
  providers: [PaystackConfigService],
})
export class PaystackConfigModule {}

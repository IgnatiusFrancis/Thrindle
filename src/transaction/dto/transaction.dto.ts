import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
  IsEmail,
} from 'class-validator';

export class TransferDto {
  @IsString()
  @IsNotEmpty()
  recieverWalletId: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;
}

export class CreateTransferRecipientDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsString()
  currency: string;

  @IsNotEmpty()
  @IsString()
  bank_code: string;

  @IsNotEmpty()
  @IsString()
  account_number: string;

  @IsOptional()
  @IsString()
  source?: string;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsString()
  recipient?: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;
}

export class CreatePaymentDto {
  // @IsNotEmpty()
  @IsOptional()
  @IsString()
  amount?: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  authorization_code?: string;
}

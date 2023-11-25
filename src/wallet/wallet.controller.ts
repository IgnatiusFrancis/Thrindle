import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { JwtGuard } from '../utils/guards/jwtAuth.guard';
import { CurrentUser } from '../utils/decorators';
import { User } from '@prisma/client';
import { CreateWalletDto, FundWalletDto } from './dto/create-wallet.dto';

@Controller('wallet')
export class WalletController {
  constructor(private walletService: WalletService) {}

  @UseGuards(JwtGuard)
  @Get()
  async getWallets(@CurrentUser() user: User) {
    return await this.walletService.getWallets(user.id);
  }

  @Get('/verify/:reference')
  async fundVerification(@Param('reference') trxref: string) {
    return await this.walletService.fundWalletVerification(trxref);
  }

  @UseGuards(JwtGuard)
  @Post('/create')
  async createWallet(
    @CurrentUser() user: User,
    @Body() walletDto: CreateWalletDto,
  ) {
    return await this.walletService.createWallet(user.id, walletDto);
  }

  @UseGuards(JwtGuard)
  @Patch(':walletId')
  async fundWallet(
    @CurrentUser() user: User,
    @Param('walletId') walletId: string,
    @Body() fundWalletDto: FundWalletDto,
  ) {
    return await this.walletService.fundWallet(
      user.id,
      walletId,
      fundWalletDto,
    );
  }
  @UseGuards(JwtGuard)
  @Get(':walletId')
  async getWallet(
    @CurrentUser() user: User,
    @Param('walletId') walletId: string,
  ) {
    return await this.walletService.getWallet(user.id, walletId);
  }
}

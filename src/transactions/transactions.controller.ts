import { Controller, Post, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TransferDto } from './dto/transfer.dto';
import { DepositWithdrawDto } from './dto/deposit-withdraw.dto';

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post('deposit')
  deposit(@Request() req, @Body() dto: DepositWithdrawDto) {
    return this.transactionsService.deposit(req.user.userId, dto);
  }

  @Post('withdraw')
  withdraw(@Request() req, @Body() dto: DepositWithdrawDto) {
    return this.transactionsService.withdraw(req.user.userId, dto);
  }

  @Post('transfer')
  transfer(@Request() req, @Body() dto: TransferDto) {
    return this.transactionsService.transfer(req.user.userId, dto);
  }

  @Get()
  findAll(@Request() req) {
    return this.transactionsService.findAll(req.user.userId);
  }
}

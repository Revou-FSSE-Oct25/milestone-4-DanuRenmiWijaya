import { IsNotEmpty, IsString, IsDecimal } from 'class-validator';

export class DepositWithdrawDto {
  @IsString() @IsNotEmpty()
  accountId!: string;

  @IsDecimal() @IsNotEmpty()
  amount!: string;
}

import { IsNotEmpty, IsString, IsDecimal, Min } from 'class-validator';

export class TransferDto {
  @IsString() @IsNotEmpty()
  senderAccountId!: string;

  @IsString() @IsNotEmpty()
  receiverAccountNumber!: string;

  @IsDecimal() @IsNotEmpty()
  amount!: string;
}

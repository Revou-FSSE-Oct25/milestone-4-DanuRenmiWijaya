import { IsNotEmpty, IsString, IsDecimal } from 'class-validator';

export class CreateAccountDto {
  @IsString()
  @IsNotEmpty()
  accountNumber!: string;

  @IsDecimal()
  initialBalance!: string;
}

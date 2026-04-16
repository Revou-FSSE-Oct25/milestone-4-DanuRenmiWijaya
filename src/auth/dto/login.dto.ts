import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'user@bank.com' })
  @IsEmail({}, { message: 'Format email tidak valid' })
  @IsNotEmpty({ message: 'Email tidak boleh kosong' })
  email!: string;

  @ApiProperty({ example: 'password123' })
  @IsNotEmpty({ message: 'Password tidak boleh kosong' })
  @MinLength(6, { message: 'Password minimal 6 karakter' })
  password!: string;
}

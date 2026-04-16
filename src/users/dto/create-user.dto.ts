import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Format email tidak valid' })
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Password minimal 6 karakter' })
  password!: string; // Properti ini yang dicari oleh AuthService

  @IsString()
  @IsNotEmpty()
  name!: string;
}

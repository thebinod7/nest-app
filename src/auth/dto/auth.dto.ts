import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class SignupDto {
  @IsString()
  @IsNotEmpty()
  authAddress: string;

  @IsString()
  authType: string;

  @IsOptional()
  @IsNumber()
  roleId: number;

  @IsOptional()
  firstName: string;

  @IsOptional()
  lastName: string;
}

export class OtpDto {
  @IsString()
  @IsNotEmpty()
  authAddress: string;
}

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  authAddress: string;

  @IsString()
  @IsNotEmpty()
  otp: string;
}

export class WalletLoginDto {
  @IsString()
  @IsNotEmpty()
  signature: string;

  @IsString()
  @IsNotEmpty()
  message: string;
}

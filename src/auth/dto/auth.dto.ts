import { IsNotEmpty,  IsNumber,  IsOptional,  IsString } from 'class-validator';

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

  @IsString()
  @IsNotEmpty()
  firstName?: string;

  @IsString()
  @IsNotEmpty()
  lastName?: string;

  @IsOptional()
  @IsNumber()
  roleId?: number;

}


export class LoginDto {
  @IsString()
  @IsNotEmpty()
  authAddress: string;

  @IsNumber()
  @IsNotEmpty()
  otp: number;

}


export class WalletLoginDto {
  @IsString()
  @IsNotEmpty()
  signature: string;

  @IsString()
  @IsNotEmpty()
  message: string;
}

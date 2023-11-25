import { IsNotEmpty,  IsNumber,  IsOptional,  IsString } from 'class-validator';

export class AuthDto {
  @IsString()
  @IsNotEmpty()
  authAddress: string;

  @IsString()
  @IsNotEmpty()
  authType: string;

  @IsNotEmpty()
  roleId: number;
}

export class OtpDto {
  @IsString()
  @IsNotEmpty()
  authAddress: string;

  @IsString()
  @IsNotEmpty()
  authType: string;

  @IsString()
  firstName?: string;

  @IsString()
  lastName?: string;

  @IsNumber()
  roleId?: number;

}


export class LoginDto {
  @IsString()
  @IsNotEmpty()
  authAddress: string;

  @IsNumber()
  @IsNotEmpty()
  otp?: number;

}


export class WalletDto {
  @IsString()
  @IsNotEmpty()
  signature: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsNumber()
  @IsOptional()
  roleId?: number;

}

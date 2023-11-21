import { IsNotEmpty, IsString } from 'class-validator';

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

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  authAddress: string;

  @IsString()
  @IsNotEmpty()
  authType: string;
}

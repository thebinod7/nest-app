import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRole {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  isSystem?: boolean;

}

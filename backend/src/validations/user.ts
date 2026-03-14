import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { Optional } from '@nestjs/common';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Optional()
  @ValidateIf((_, value) => value !== null && value !== undefined)
  name?: string;

  @IsEmail({ require_tld: false })
  @Transform(({ value }) => value?.toLowerCase())
  email!: string;

  @IsNotEmpty()
  @MinLength(8)
  password!: string;
}

export class UserDto {
  id!: number;
  name?: string;
  email!: string;
}

import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  IsStrongPassword,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { registerApi } from 'src/helpers';
import { Transform, TransformFnParams } from 'class-transformer';

export class RegisterDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: registerApi.NAME.DESCRIPTION,
    example: registerApi.NAME.EXAMPLE,
    format: registerApi.NAME.FORMAT,
    required: true,
  })
  @Transform(({ value }: TransformFnParams) =>
    value ? (value as string).trim() : value,
  )
  @MaxLength(80)
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) =>
    (value as string).toLowerCase().trim(),
  )
  @ApiProperty({
    description: registerApi.EMAIL.DESCRIPTION,
    example: registerApi.EMAIL.EXAMPLE,
    format: registerApi.EMAIL.FORMAT,
    required: true,
  })
  @MaxLength(80)
  email: string;

  @IsString()
  @IsNotEmpty()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  @MaxLength(15)
  @ApiProperty({
    description: registerApi.PASSWORD.DESCRIPTION,
    example: registerApi.PASSWORD.EXAMPLE,
    format: registerApi.PASSWORD.FORMAT,
    required: true,
  })
  password: string;
}

export class RegisterViewModel {
  @ApiProperty()
  status: boolean;

  @ApiProperty()
  message: string;
}

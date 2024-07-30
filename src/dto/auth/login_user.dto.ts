import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { loginAPI } from 'src/helpers';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) =>
    (value as string).toLowerCase().trim(),
  )
  @ApiProperty({
    description: loginAPI.EMAIL.DESCRIPTION,
    example: loginAPI.EMAIL.EXAMPLE,
    format: loginAPI.EMAIL.FORMAT,
    required: true,
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: loginAPI.PASSWORD.DESCRIPTION,
    example: loginAPI.PASSWORD.EXAMPLE,
    format: loginAPI.PASSWORD.FORMAT,
    required: true,
  })
  password: string;
}

export class LoginDataModel {
  @ApiProperty()
  token: string;

  @ApiProperty()
  user_id: number;

  @ApiProperty()
  email: string;
}

export class LoginViewModel {
  @ApiProperty()
  status: boolean;

  @ApiProperty()
  message: string;

  @ApiProperty({ type: LoginDataModel })
  data: LoginDataModel;
}

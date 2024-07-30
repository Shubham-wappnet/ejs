import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';
import { registerApi } from 'src/helpers';

export class ForgotPasswordDTO {
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
}

export class ForgotPasswordData {
  @ApiProperty()
  token: string;
}

export class ForgotPasswordViewModel {
  @ApiProperty()
  status: boolean;

  @ApiProperty()
  message: string;

  @ApiProperty({ type: ForgotPasswordData })
  data: ForgotPasswordData;
}

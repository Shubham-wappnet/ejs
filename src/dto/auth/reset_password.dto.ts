import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';
import { registerApi } from 'src/helpers';

export class ResetPasswordDTO {
  @IsString()
  @IsNotEmpty()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  @ApiProperty({
    description: registerApi.PASSWORD.DESCRIPTION,
    example: registerApi.PASSWORD.EXAMPLE,
    format: registerApi.PASSWORD.FORMAT,
    required: true,
  })
  password: string;
}

export class ResetPasswordViewModel {
  @ApiProperty()
  status: boolean;

  @ApiProperty()
  message: string;
}

import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Render,
  Res,
  UsePipes,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Public } from 'src/decorators/public.decorator';
import {
  forgotPasswordApi,
  loginAPI,
  registerApi,
  resetPasswordApi,
} from 'src/helpers';
import {
  LoginDto,
  LoginViewModel,
  RegisterDTO,
  RegisterViewModel,
  ResetPasswordDTO,
  ResetPasswordViewModel,
} from 'src/dto/auth';
import { RegisterValidationPipe } from 'src/pipes';
import {
  ForgotPasswordDTO,
  ForgotPasswordViewModel,
} from 'src/dto/auth/forgot_password.dto';

@Public()
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('register')
  @Render('register')
  getRegisterPage() {
    return {};
  }

  @Post('register')
  @UsePipes(new RegisterValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: registerApi.SUMMARY })
  @ApiCreatedResponse({
    type: RegisterViewModel,
    description: registerApi.OK_RESPONSE_DESCRIPTION,
  })
  @ApiBadRequestResponse({
    type: RegisterViewModel,
    description: registerApi.BAD_REQUEST_RESPONSE_DESCRIPTION,
  })
  async register(
    @Body() payload: RegisterDTO,
    @Res() res: Response,
  ): Promise<any> {
    const result = await this.authService.registerUser(payload);
    if (result) {
      return res.redirect(
        `/auth/success?name=${encodeURIComponent(payload.name)}`,
      );
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: 'Registration failed.',
      });
    }
  }

  @Get('success')
  @Render('success')
  getSuccessPage(@Query('name') name: string) {
    return { name };
  }

  @Get('login')
  @Render('login')
  getLoginPage() {
    return {};
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: loginAPI.SUMMARY })
  @ApiOkResponse({
    description: loginAPI.OK_RESPONSE_DESCRIPTION,
    type: LoginViewModel,
  })
  @ApiUnauthorizedResponse({
    description: loginAPI.UNAUTHORIZED_RESPONSE_DESCRIPTION,
    type: LoginViewModel,
  })
  @ApiBadRequestResponse({
    description: loginAPI.BAD_REQUEST_RESPONSE_DESCRIPTION,
    type: LoginViewModel,
  })
  async login(@Body() payload: LoginDto, @Res() res: Response) {
    const result = await this.authService.loginUser(payload);
    if (result) {
      return res.redirect('/auth/welcome');
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: 'Login failed.',
      });
    }
  }

  @Get('welcome')
  @Render('welcome')
  getWelcomePage() {
    return {};
  }

  @Get('forgot-password')
  @Render('forgot_password')
  getForgotPassword() {
    return {};
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: forgotPasswordApi.SUMMARY })
  @ApiOkResponse({
    description: forgotPasswordApi.OK_RESPONSE_DESCRIPTION,
    type: ForgotPasswordViewModel,
  })
  @ApiBadRequestResponse({
    description: forgotPasswordApi.BAD_REQUEST_RESPONSE_DESCRIPTION,
    type: ForgotPasswordViewModel,
  })
  async forgotPassword(
    @Body() payload: ForgotPasswordDTO,
  ): Promise<ForgotPasswordViewModel> {
    const result = await this.authService.forgotPassword(payload);
    return result;
  }

  @Get('reset-password')
  @Render('reset_password')
  getResetPassword() {
    return {};
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: forgotPasswordApi.TOKEN.NAME,
    format: forgotPasswordApi.TOKEN.FORMAT,
    description: forgotPasswordApi.TOKEN.DESCRIPTION,
    required: true,
  })
  @ApiOperation({ summary: resetPasswordApi.SUMMARY })
  @ApiOkResponse({
    description: resetPasswordApi.OK_RESPONSE_DESCRIPTION,
    type: ResetPasswordViewModel,
  })
  @ApiBadRequestResponse({
    description: resetPasswordApi.BAD_REQUEST_RESPONSE_DESCRIPTION,
    type: RegisterViewModel,
  })
  async resetPassword(
    @Param('token') token: string,
    @Body() payload: ResetPasswordDTO,
  ): Promise<ResetPasswordViewModel> {
    const result = await this.authService.resetPassword(token, payload);
    return result;
  }

  // @Get('destination')
  // @Render('destination')
  // getDestinationPage() {
  //   return {};
  // }

  // @Post('destination')
  // @HttpCode(HttpStatus.OK)
  // async getDestination(@Res() res: Response) {
  //   const result = await this.authService.findDestination();
  //   if (result) {
  //     return res.redirect('/auth/destination');
  //   } else {
  //     return res.status(HttpStatus.BAD_REQUEST).json({
  //       error: 'Destination failed.',
  //     });
  //   }
  // }
}

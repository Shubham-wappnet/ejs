import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  LoginDto,
  LoginViewModel,
  RegisterDTO,
  RegisterViewModel,
  ResetPasswordDTO,
  ResetPasswordViewModel,
} from 'src/dto/auth';
import { User } from 'src/entities';
import { BCRYPT_ROUNDS, TokenTime } from 'src/helpers';
import { DeepPartial, Repository } from 'typeorm';
import { hashSync, compareSync } from 'bcrypt';
import { Itoken } from 'src/interfaces/token';
import { JwtService, JwtVerifyOptions, TokenExpiredError } from '@nestjs/jwt';
import {
  ForgotPasswordDTO,
  ForgotPasswordViewModel,
} from 'src/dto/auth/forgot_password.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}
  public async registerUser(payload: RegisterDTO): Promise<RegisterViewModel> {
    const existUser = await this.findUserByEmail(payload.email);
    if (existUser) {
      throw new BadRequestException({
        status: false,
        message: 'User already registered with this email',
      });
    }
    const hashPassword = (password: string): string => {
      return hashSync(password, BCRYPT_ROUNDS);
    };
    const obj: DeepPartial<User> = {
      name: payload.name,
      email: payload.email,
      password: hashPassword(payload.password),
    };
    const user = await this.createUser(obj);
    console.log(user);

    return {
      status: true,
      message: 'User register successfully',
    };
  }

  public async loginUser(payload: LoginDto): Promise<LoginViewModel> {
    const user = await this.findUserByEmail(payload.email);
    if (!user) {
      throw new BadRequestException({
        status: false,
        message: 'Account not found',
      });
    }

    const comparePassword = (password: string, hash: string): boolean => {
      return compareSync(password, hash);
    };
    const isPasswordMatch = comparePassword(payload.password, user.password);
    if (!isPasswordMatch) {
      throw new BadRequestException({
        status: false,
        message: 'Invalid credentials',
      });
    }
    const token = await this.signToken(
      {
        sub: user.id,
        email: user.email,
      },
      TokenTime['5M'],
    );
    return {
      status: true,
      message: 'User logged in successfully',
      data: {
        token,
        user_id: user.id,
        email: user.email,
      },
    };
  }

  public async forgotPassword(
    payload: ForgotPasswordDTO,
  ): Promise<ForgotPasswordViewModel> {
    const user = await this.findUserByEmail(payload.email);
    if (!user) {
      throw new BadRequestException({
        status: false,
        message: 'Account not found',
      });
    }
    await this.updateUser(user);
    const token = await this.signToken(
      {
        sub: user.id,
        email: user.email,
      },
      TokenTime['5M'],
    );
    return {
      status: true,
      message: 'Forgot password request sent successfully',
      data: {
        token,
      },
    };
  }

  // public async resetPassword(
  //   token: string,
  //   payload: ResetPasswordDTO,
  // ): Promise<ResetPasswordViewModel> {
  //   const data = await this.verifyToken(token, {});
  //   if (!data) {
  //     throw new BadRequestException({
  //       status: false,
  //       message: 'Invalid Token',
  //     });
  //   }
  //   const user = await this.findUserByEmail(data.email);
  //   if (!user) {
  //     throw new BadRequestException({
  //       status: false,
  //       message: 'Account not found',
  //     });
  //   }
  //   const hashPassword = (password: string): string => {
  //     return hashSync(password, BCRYPT_ROUNDS);
  //   };
  //   user.password = hashPassword(payload.password);
  //   await this.updateUser(user);

  //   return {
  //     status: true,
  //     message: 'Password reset successfully',
  //   };
  // }

  private async findUserByEmail(email: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({ where: { email } });
      return user;
    } catch (error) {
      throw new Error(error);
    }
  }

  private async createUser(payload: DeepPartial<User>): Promise<User> {
    try {
      const newUser = this.userRepository.create(payload);
      await this.userRepository.save(newUser);
      return newUser;
    } catch (error) {
      throw new Error(error);
    }
  }

  private async updateUser(payload: User) {
    try {
      const user = await this.userRepository.save(payload);
      return user;
    } catch (error) {
      throw new Error(error);
    }
  }

  private async signToken(payload: Itoken, expiresIn: string): Promise<string> {
    return await this.jwtService.signAsync(payload, { expiresIn });
  }

  private async verifyToken(
    token: string,
    options: JwtVerifyOptions,
  ): Promise<Itoken> {
    try {
      return await this.jwtService.verifyAsync<Itoken>(token, options);
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('Token expired');
      } else {
        console.error('Token verification error:', error.message, {
          token,
          options,
          stack: error.stack,
        });
        throw new BadRequestException('Invalid Token');
      }
    }
  }
}

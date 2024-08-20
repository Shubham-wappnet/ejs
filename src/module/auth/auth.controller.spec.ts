import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe } from 'node:test';
import { RegisterDTO } from 'src/dto/auth';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            registerUser: jest.fn(),
          },
        },
      ],
    }).compile();
    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should throw a validation error if the input data is invalid', async () => {
    const invalidRegisterDto = {
      name: '',
      email: 'invalid-email',
      password: 'short',
    } as unknown as RegisterDTO;
    try {
      await authController.register(invalidRegisterDto);
    } catch (error) {
      expect(error.response.message).toContain('Validation failed');
    }
  });

  it('should throw a BadRequestException if user is already registered', async () => {
    const registerDto: RegisterDTO = {
      name: 'John Doe',
      email: 'john@gmail.com',
      password: 'Password123',
    };

    jest.spyOn(authService, 'registerUser').mockRejectedValue(
      new HttpException(
        {
          status: false,
          message: 'User already registered with this email',
        },
        HttpStatus.BAD_REQUEST,
      ),
    );
    try {
      await authController.register(registerDto);
    } catch (error) {
      expect(error.response.message).toBe(
        'User already registered with this email',
      );
    }
  });
});

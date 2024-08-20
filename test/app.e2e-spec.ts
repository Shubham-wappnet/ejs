import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { RegisterDTO } from 'src/dto/auth';
import { AuthService } from 'src/module/auth/auth.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('/auth/register (POST) with invalid data', async () => {
    const invalidRegisterDto = {
      name: '',
      email: 'invalid-email',
      password: 'short',
    } as RegisterDTO;

    return request(app.getHttpServer())
      .post('/auth/register')
      .send(invalidRegisterDto)
      .expect(HttpStatus.BAD_REQUEST)
      .expect((response) => {
        expect(response.body.message).toContain('Validation failed');
      });
  });

  it('/auth/register (POST) user already registered', async () => {
    const registerDto: RegisterDTO = {
      name: 'John Doe',
      email: 'john@gmail.com',
      password: 'Password123',
    };

    // Mock response
    const authService = app.get<AuthService>(AuthService);
    jest.spyOn(authService, 'registerUser').mockRejectedValue(
      new HttpException(
        {
          status: false,
          message: 'User already registered with this email',
        },
        HttpStatus.BAD_REQUEST,
      ),
    );

    return request(app.getHttpServer())
      .post('/register')
      .send(registerDto)
      .expect(HttpStatus.BAD_REQUEST)
      .expect((response) => {
        expect(response.body.message).toBe(
          'User already registered with this email',
        );
      });
  });
});

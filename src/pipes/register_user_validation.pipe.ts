import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { RegisterDTO } from 'src/dto/auth';

@Injectable()
export class RegisterValidationPipe implements PipeTransform {
  async transform(payload: any) {
    const object = plainToInstance(RegisterDTO, payload);
    const validationErrors = await validate(object, {
      forbidUnknownValues: true,
      stopAtFirstError: true,
    });

    if (validationErrors.length > 0) {
      const formattedErrors = validationErrors.map((error) => {
        for (const property in error.constraints) {
          return `${error.constraints[property]}`;
        }
      });
      throw new BadRequestException(formattedErrors);
    }

    return object;
  }
}

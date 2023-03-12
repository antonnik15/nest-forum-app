import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { BadRequestException } from '@nestjs/common';

@ValidatorConstraint({ name: 'Trim' })
export class TrimValidator implements ValidatorConstraintInterface {
  validate(value: string): boolean {
    try {
      const result = value.trim();
      return result.length > 0;
    } catch (err) {
      console.log(err);
      throw new BadRequestException();
    }
  }
  defaultMessage(): string {
    return "This field can't be empty";
  }
}

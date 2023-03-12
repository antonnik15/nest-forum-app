import { registerDecorator, ValidationOptions } from 'class-validator';
import { BlogExistValidator } from '../../validators/blog-exist.validator';

export function BlogExist(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'BlogExists',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: BlogExistValidator,
    });
  };
}

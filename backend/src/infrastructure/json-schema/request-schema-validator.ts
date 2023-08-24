import { ObjectSchema } from 'joi';
import { InvalidJsonSchemaError } from '../error/invalid-json-schema-error';

export class RequestSchemaValidator {
  static validate<T extends {}>(
    input: object,
    validationSchema: ObjectSchema<T>
  ): T {
    const validationResult = validationSchema.validate(input);
    if (validationResult.error !== undefined) {
      throw new InvalidJsonSchemaError(validationResult.error.message);
    }

    return validationResult.value;
  }
}

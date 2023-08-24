import joi from 'joi';
import { RequestSchemaValidator } from '../../../../src/infrastructure/json-schema/request-schema-validator'
import { InvalidJsonSchemaError } from '../../../../src/infrastructure/error/invalid-json-schema-error';

describe('RequestSchemaValidator unit test', () => {
  test('Should throw error when invalid input', () => {
    const input = {};
    const validationSchema = joi.object({
      name: joi.string().required()
    })

    expect(() => {
      RequestSchemaValidator.validate(input, validationSchema)
    }).toThrow(InvalidJsonSchemaError)
  });

  test('Should return object when valid input', () => {
    const input = {
      name: 'valid-schema'
    };
    const validationSchema = joi.object({
      name: joi.string().required()
    })

    const result = RequestSchemaValidator.validate(input, validationSchema)

    const expectedResult = { name: 'valid-schema' }
    expect(result).toEqual(expectedResult)
  });
})
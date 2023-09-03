import { FastifyRequest } from 'fastify';
import { RequestSchemaValidator } from '../../../json-schema/request-schema-validator';
import joi from 'joi';

type CompleteOrderRequestParams = {
    orderId: string;
};

export class CompleteOrderDto {
    private readonly validationSchema: joi.ObjectSchema<CompleteOrderRequestParams> =
        joi.object({
            orderId: joi.string().required(),
        });

    readonly requestParams;

    constructor(request: FastifyRequest) {
        this.requestParams = RequestSchemaValidator.validate(
            request.params as object,
            this.validationSchema
        );
    }
}
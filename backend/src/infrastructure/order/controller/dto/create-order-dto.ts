import { FastifyRequest } from 'fastify';
import { RequestSchemaValidator } from '../../../json-schema/request-schema-validator';
import joi from 'joi';

type CreateOrderItemsRequestBody = {
    productId: string;
    quantity: number;
};

type CreateOrderRequestBody = {
    data: {
        attributes: {
            items: CreateOrderItemsRequestBody[];
        };
    };
};

export class CreateOrderDto {
    private readonly validationSchema: joi.ObjectSchema<CreateOrderRequestBody> =
        joi.object({
            data: joi.object({
                attributes: joi
                    .object({
                        items: joi.array().items(joi.object({
                            productId: joi.string().required(),
                            quantity: joi.number().required()
                        })).required()
                    })
                    .required(),
            }),
        });

    readonly requestBody;

    constructor(request: FastifyRequest) {
        this.requestBody = RequestSchemaValidator.validate(
            request.body as object,
            this.validationSchema
        );
    }
}
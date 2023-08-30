import { FastifyReply, FastifyRequest } from 'fastify';

import AddSellerRoleCommandHandler from '../../../../../src/application/user/command/add-seller-role/add-seller-role-command-handler';
import AddSellerRoleController from '../../../../../src/infrastructure/user/controller/add-seller-role-controller';

describe('AddSellerRoleController unit test', () => {
  const stubs: {
    request: Partial<FastifyRequest>
    reply: Partial<FastifyReply>
    addSellerRoleCommandHandler: Partial<AddSellerRoleCommandHandler>
  } = {
    request: {
      body: jest.fn()
    },
    reply: {
      send: jest.fn().mockImplementation(() => {
        return stubs.reply
      }),
      status: jest.fn().mockImplementation(() => {
        return stubs.reply
      })
    },
    addSellerRoleCommandHandler: {
      execute: jest.fn()
    }
  }
  const controller = new AddSellerRoleController(stubs.addSellerRoleCommandHandler as AddSellerRoleCommandHandler)

  test.each([
    { // missing customerId
    }
  ])('Should throw Error when missing request parameter value %j', async (requestParams) => {
    // Given
    stubs.request.params = requestParams

    // When
    const result = controller.handle(stubs.request as FastifyRequest, stubs.reply as FastifyReply)

    // Then
    void expect(result).rejects.toThrow(Error)
  })

  test.each([
    // invalid customerId
    {
      customerId: 1234,
    },
    {
      customerId: false,
    },
    {
      customerId: null
    }
  ])('Should throw Error when invalid request parameter value %j', async (requestBody) => {
    // Given
    stubs.request.params = requestBody

    // When
    const result = controller.handle(stubs.request as FastifyRequest, stubs.reply as FastifyReply)

    // Then
    void expect(result).rejects.toThrow(Error)
  })

  test('Should call addSellerRoleCommandHandler.execute times with arguments', async () => {
    // Given
    stubs.request.params = { customerId: '12345' }

    // When
    await controller.handle(stubs.request as FastifyRequest, stubs.reply as FastifyReply)

    // Then
    const expected = {
      id: '12345'
    }
    expect(stubs.addSellerRoleCommandHandler.execute).toHaveBeenCalledTimes(1)
    expect(stubs.addSellerRoleCommandHandler.execute).toHaveBeenCalledWith(expect.objectContaining(expected))
  })

  test('Should call reply.status times with arguments', async () => {
    // Given
    stubs.request.params = { customerId: '12345' }

    // When
    await controller.handle(stubs.request as FastifyRequest, stubs.reply as FastifyReply)

    // Then
    const expected = 201
    expect(stubs.reply.status).toHaveBeenCalledTimes(1)
    expect(stubs.reply.status).toHaveBeenCalledWith(expected)
  })

  test('Should call reply.send times with arguments', async () => {
    // Given
    stubs.request.params = { customerId: '12345' }

    // When
    await controller.handle(stubs.request as FastifyRequest, stubs.reply as FastifyReply)

    // Then
    expect(stubs.reply.send).toHaveBeenCalledTimes(1)
    expect(stubs.reply.send).toHaveBeenCalledWith()
  })
})

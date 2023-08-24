import { EnhancedSpy, describe, expect, it, vi } from 'vitest'
import { VueWrapper, flushPromises, mount } from '@vue/test-utils'
import Status from '../../src/views/Status.vue'
import { ApiClient } from '../../src/clients/api-client'

describe('Status unit test', () => {
  vi.mock('../../src/clients/api-client', () => {
    const apiClient = vi.fn();
    apiClient.prototype.get = vi.fn();

    return {
      ApiClient: apiClient
    }
  })

  const apiClient = new ApiClient();

  function getAppWrapper(): VueWrapper {
    return mount(Status)
  }

  it('should display default status text', () => {
    const methodStub = apiClient.get as EnhancedSpy
    methodStub.mockResolvedValueOnce({
      statusCode: 200,
      body: {
        status: 'ok'
      }
    })
    const wrapper = getAppWrapper()

    const text = wrapper.find('h4').text()

    const msg = 'Status: loading'
    expect(text).toEqual(msg)
  })

  it('should display status text from server', async () => {
    const methodStub = apiClient.get as EnhancedSpy
    methodStub.mockResolvedValueOnce({
      statusCode: 200,
      body: {
        status: 'ok'
      }
    })
    const wrapper = getAppWrapper()

    await flushPromises()

    const text = wrapper.find('h4').text()
    const msg = 'Status: ok'
    expect(text).toEqual(msg)
  })
})
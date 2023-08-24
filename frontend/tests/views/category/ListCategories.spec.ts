import { EnhancedSpy, describe, expect, it, vi } from 'vitest'
import { VueWrapper, flushPromises, mount } from '@vue/test-utils'
import ListCategories from '../../../src/views/category/ListCategories.vue'
import { ApiClientCategoryRepository } from '../../../src/repositories/api-client-category-repository'
import router from '../../../src/router/router'

describe('ListCategories unit test', () => {
  vi.mock('../../../src/repositories/api-client-category-repository', () => {
    const apiClientCategoryRepository = vi.fn();
    apiClientCategoryRepository.prototype.findAll = vi.fn();

    return {
      ApiClientCategoryRepository: apiClientCategoryRepository
    }
  })

  const categoryRepository = new ApiClientCategoryRepository();

  function getAppWrapper(): VueWrapper {
    return mount(ListCategories, {
      global: {
        plugins: [router]
      }
    })
  }

  it('should call categoryRepository.findAll with arguments when mounted', async () => {
    const methodStub = categoryRepository.findAll as EnhancedSpy
    methodStub.mockResolvedValueOnce([])
    getAppWrapper()

    await flushPromises()

    expect(methodStub).toHaveBeenCalledOnce()
    expect(methodStub).toHaveBeenCalledWith()
  })

  it('should render categories list', async () => {
    const methodStub = categoryRepository.findAll as EnhancedSpy
    methodStub.mockResolvedValueOnce([
      {
        id: '12345',
        name: 'category-1'
      },
      {
        id: '54321',
        name: 'category-2'
      }
    ])
    const wrapper = getAppWrapper()

    await flushPromises()

    const rows = wrapper.find('table').find('tbody').findAll('tr');
    const text1 = 'category-1'
    const text2 = 'category-2'
    expect(rows[0].findAll('td')[0].text()).toEqual(text1)
    expect(rows[1].findAll('td')[0].text()).toEqual(text2)
  })
})
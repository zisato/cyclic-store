import { EnhancedSpy, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import CreateCategory from '../../src/views/CreateCategory.vue'
import { ApiClientCategoryRepository } from '../../src/repositories/api-client-category-repository'

describe('CreateCategory unit test', () => {
  vi.mock('vue-router', () => {
    const useRouterStub = vi.fn().mockImplementation(() => {
      return {
        push: vi.fn()
      }
    })

    return {
      useRouter: useRouterStub
    }
  })
  vi.mock('../../src/repositories/api-client-category-repository', () => {
    const categoryRepository = vi.fn();
    categoryRepository.prototype.create = vi.fn();

    return {
      ApiClientCategoryRepository: categoryRepository
    }
  })

  const categoryRepository = new ApiClientCategoryRepository();

  it('should display header text', () => {
    const wrapper = mount(CreateCategory)

    const text = wrapper.find('h4').text()

    const msg = 'Create category'
    expect(text).toEqual(msg)
  })

  it('should call categoryRepository.create with arguments when submit', () => {
    const methodStub = categoryRepository.create as EnhancedSpy
    const wrapper = mount(CreateCategory)

    wrapper.find('input[name="category[name]"]').setValue('create category')
    wrapper.find('form').trigger('submit')

    const expectedArguments = {
      id: expect.anything(),
      name: 'create category'
    }
    expect(methodStub).toHaveBeenCalledOnce()
    expect(methodStub).toHaveBeenCalledWith(expectedArguments)
  })
})
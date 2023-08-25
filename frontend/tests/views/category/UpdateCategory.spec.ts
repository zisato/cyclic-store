import { EnhancedSpy, describe, expect, it, vi } from 'vitest'
import { VueWrapper, flushPromises, mount } from '@vue/test-utils'
import UpdateCategory from '../../../src/views/category/UpdateCategory.vue'
import { ApiClientCategoryRepository } from '../../../src/repositories/api-client-category-repository'
import { Router, createRouter, createWebHistory } from 'vue-router'
import routes from '../../../src/routes/routes'

describe('UpdateCategory unit test', () => {
  vi.mock('../../../src/repositories/api-client-category-repository', () => {
    const categoryRepository = vi.fn();
    categoryRepository.prototype.findById = vi.fn();
    categoryRepository.prototype.update = vi.fn();

    return {
      ApiClientCategoryRepository: categoryRepository
    }
  })

  let router: Router;
  beforeEach(async () => {
    router = createRouter({
      history: createWebHistory(),
      routes,
    })

    router.push('/')
    await router.isReady()
  });

  function getAppWrapper(): VueWrapper {
    return mount(UpdateCategory, {
      global: {
        plugins: [router],
      }
    })
  }

  const categoryRepository = new ApiClientCategoryRepository();

  it('should display header text', () => {
    const category = {
      id: '12345',
      name: 'category-name'
    }
    const methodStub = categoryRepository.findById as EnhancedSpy
    methodStub.mockResolvedValueOnce(category)
    const wrapper = getAppWrapper()

    const text = wrapper.find('h4').text()

    const msg = 'Update category'
    expect(text).toEqual(msg)
  })

  it('should call categoryRepository.update with arguments when submit', async () => {
    router.currentRoute.value.params.categoryId = '12345'
    const category = {
      id: '12345',
      name: 'category-name'
    }
    const findByIdStub = categoryRepository.findById as EnhancedSpy
    findByIdStub.mockResolvedValueOnce(category)
    const methodStub = categoryRepository.update as EnhancedSpy
    const wrapper = getAppWrapper()

    await flushPromises()
    wrapper.find('input[name="category[name]"]').setValue('new category name')
    wrapper.find('form').trigger('submit')

    const expectedArguments = {
      id: '12345',
      name: 'new category name'
    }
    expect(methodStub).toHaveBeenCalledOnce()
    expect(methodStub).toHaveBeenCalledWith(expectedArguments)
  })
})
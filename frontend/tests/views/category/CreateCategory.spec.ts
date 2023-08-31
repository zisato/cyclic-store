import { EnhancedSpy, describe, expect, it, vi } from 'vitest'
import { Router, createRouter, createWebHistory } from 'vue-router'
import { VueWrapper, mount } from '@vue/test-utils'

import { ApiClientCategoryRepository } from '../../../src/repositories/ApiClientCategoryRepository'
import CreateCategory from '../../../src/views/category/CreateCategory.vue'
import routes from '../../../src/routes/routes'

describe('CreateCategory unit test', () => {
  vi.mock('../../../src/repositories/api-client-category-repository', () => {
    const categoryRepository = vi.fn();
    categoryRepository.prototype.create = vi.fn();

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
    return mount(CreateCategory, {
      global: {
        plugins: [router],
      }
    })
  }

  const categoryRepository = new ApiClientCategoryRepository();

  it('should display header text', () => {
    const wrapper = getAppWrapper()

    const text = wrapper.find('h4').text()

    const msg = 'Create category'
    expect(text).toEqual(msg)
  })

  it('should call categoryRepository.create with arguments when submit', () => {
    const methodStub = categoryRepository.create as EnhancedSpy
    const wrapper = getAppWrapper()

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
import { Pinia, setActivePinia } from 'pinia'
import { Router, createRouter, createWebHistory } from 'vue-router'
import { VueWrapper, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import Navbar from '../../src/components/Navbar.vue'
import { createTestingPinia } from '@pinia/testing'
import routes from '../../src/routes/routes'
import { useUserStore } from '../../src/store/UserStore'

describe('Navbar unit test', () => {
    vi.mock('../../src/repositories/ApiClientStoreRepository', () => {
        const apiClientStoreRepository = vi.fn();
        apiClientStoreRepository.prototype.create = vi.fn();

        return {
            ApiClientStoreRepository: apiClientStoreRepository
        }
    })

    let router: Router;
    let pinia: Pinia;

    function getAppWrapper(): VueWrapper {
        return mount(Navbar, {
            global: {
                plugins: [
                    router,
                ],
            },
        })
    }

    beforeEach(async () => {
        router = createRouter({
            history: createWebHistory(),
            routes,
        })

        router.push('/')
        await router.isReady()

        pinia = createTestingPinia({
            fakeApp: true,
        })
        setActivePinia(pinia)
    });

    it('when not logged should display home and status', () => {
        const userStore = useUserStore()
        userStore.user = null
        const wrapper = getAppWrapper()

        const items = wrapper.findAll('li.nav-item')

        expect(items.at(0)?.attributes('style')).toEqual('display: none;')
        expect(items.at(1)?.attributes('style')).toEqual(undefined)
        expect(items.at(2)?.attributes('style')).toEqual(undefined)
        expect(items.at(3)?.attributes('style')).toEqual('display: none;')
    })

    it('when logged should display logout and my store dropdown', () => {
        const userStore = useUserStore()
        userStore.user = { id: '', roles: [], storeId: '' }
        const wrapper = getAppWrapper()

        const items = wrapper.findAll('li.nav-item')

        expect(items.at(0)?.attributes('style')).toEqual(undefined)
        expect(items.at(3)?.attributes('style')).toEqual(undefined)
    })

    it('when logged and seller role should display list products in dropdown', () => {
        const userStore = useUserStore()
        userStore.user = { id: '', roles: ['seller'], storeId: '' }
        const wrapper = getAppWrapper()

        const dropdown = wrapper.findAll('li.nav-item').at(3)

        expect(dropdown?.findAll('ul>li').at(0)?.attributes('style')).toEqual('display: none;')
        expect(dropdown?.findAll('ul>li').at(1)?.attributes('style')).toEqual(undefined)
    })

    it('when logged and not seller role should display create store in dropdown', () => {
        const userStore = useUserStore()
        userStore.user = { id: '', roles: ['customer'], storeId: '' }
        const wrapper = getAppWrapper()

        const dropdown = wrapper.findAll('li.nav-item').at(3)

        console.log(dropdown?.findAll('ul>li'));
        expect(dropdown?.findAll('ul>li').at(0)?.attributes('style')).toEqual(undefined)
        expect(dropdown?.findAll('ul>li').at(1)?.attributes('style')).toEqual('display: none;')
    })
})
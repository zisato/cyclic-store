import { Pinia, setActivePinia } from 'pinia'
import { Router, createRouter, createWebHistory } from 'vue-router'
import { VueWrapper, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import Login from '../../src/components/Login.vue'
import { createTestingPinia } from '@pinia/testing'
import routes from '../../src/routes/routes'
import { useUserStore } from '../../src/store/UserStore'

describe('Login unit test', () => {
    let router: Router;
    let pinia: Pinia;

    function getAppWrapper(): VueWrapper {
        return mount(Login, {
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

    it('should display text', () => {
        const wrapper = getAppWrapper()

        const text = wrapper.find('a').text()

        const msg = 'LogIn'
        expect(text).toEqual(msg)
    })

    it('should call userStore.fetchByToken with arguments', async () => {
        // from https://github.com/vuejs/pinia/discussions/1250#discussioncomment-6691903
        const userStore = useUserStore()
        const fetchByTokenStub = vi.spyOn(userStore, 'fetchByToken')
        const wrapper = getAppWrapper()

        await wrapper.find('a').trigger('click')

        expect(fetchByTokenStub).toHaveBeenCalledTimes(1)
        expect(fetchByTokenStub).toHaveBeenLastCalledWith('mock-credential')
    })
})
import { mount } from '@vue/test-utils'
import Home from '../../src/views/Home.vue'

describe('Home unit test', () => {
  it('should display header text', () => {
    const wrapper = mount(Home)

    const text = wrapper.find('h4').text()

    const msg = 'Hellow World'
    expect(text).toEqual(msg)
  })
})
import {watchEffect} from "core/effect";
import {vi} from "vitest";
import {ref} from "reactivity/ref";

describe('watchEffect', () => {
    // 测试最简单的effect
    test('simple watchEffect', () => {
        const spy = vi.fn()
        const effectFN = watchEffect(() => {
            spy()
        })

        expect(spy).toHaveBeenCalledTimes(1)
        effectFN()
        expect(spy).toHaveBeenCalledTimes(2)
    })
    // 测试懒执行
    it('lazily call', () => {
        const spy = vi.fn()
        const effectFN = watchEffect(() => {
            spy()
        }, {
            isLazy: true
        })

        expect(spy).toHaveBeenCalledTimes(0)
        effectFN()
        expect(spy).toHaveBeenCalledTimes(1)
    })
    // 测试嵌套
    test('nested watchEffect', () => {
        const observed1 = ref('foo')
        const observed2 = ref('bar')

        const spy1 = vi.fn()
        const spy2 = vi.fn()

        watchEffect(() => {
            observed1.value
            spy1()
            watchEffect(() => {
                observed2.value
                spy2()
            })
        })

        expect(spy1).toHaveBeenCalledTimes(1)
        expect(spy2).toHaveBeenCalledTimes(1)

        observed1.value = 'bar'
        expect(spy1).toHaveBeenCalledTimes(2)
        expect(spy2).toHaveBeenCalledTimes(2)

        observed2.value = 'foo'
        expect(spy1).toHaveBeenCalledTimes(2)
        expect(spy2).toHaveBeenCalledTimes(4)
    })
})
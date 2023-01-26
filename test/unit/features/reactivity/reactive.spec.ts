import {reactive} from "reactivity/reactive";
import {watchEffect} from "core/effect";
import {vi} from "vitest";

describe('reactivity/reactive', () => {
    //　测试对象的响应式
    test('Object', () => {
        const originObj = {foo: 1}
        const observed = reactive(originObj)
        // get操作
        expect(observed.foo).toBe(1)
        expect('foo' in observed).toBe(true)
        expect(Object.keys(observed)).toContainEqual('foo')
    })
    // 测试嵌套对象的响应式代理
    test('nested object', () => {
        const originObj = {
            foo: 1,
            ary: ['bar']
        }
        const observed = reactive(originObj)
        expect(observed.foo).toBe(1)
        expect(observed.ary).toEqual(['bar'])
        expect(observed.ary[0]).toBe('bar')
    })
    // 测试同一个对象得到的代理对象应相等
    test('observing the same value multiple times should return same object', () => {
        const originObj = {foo: 1}
        const observed = reactive(originObj)
        const observed2 = reactive(originObj)
        expect(observed).toBe(observed2)
    })
    // 测试原始值的变化是否反射到代理对象
    test('origin value change should reflect in observed value', () => {
        const originalObj: any = { foo: 1 }
        const observed = reactive(originalObj)
        // set 操作
        originalObj.bar = 1
        expect(originalObj.bar).toBe(1)
        expect(observed.bar).toBe(1)
    })
    // 测试代理对象值改变是否影响到原始对象
    test('observed value change should reflect in origin value', () => {
        const originalObj: any = { foo: 1 }
        const observed = reactive(originalObj)
        // set 操作
        observed.bar = 1
        expect(originalObj.bar).toBe(1)
        expect(observed.bar).toBe(1)
    })
    // 测试观察-订阅者模式的响应能力
    test('call registered function when observed value change detected', () => {
        const originalObj = { foo: 1 }
        const observed = reactive(originalObj)

        const spy = vi.fn()

        watchEffect(() => {
            observed.foo
            spy()
        })

        expect(spy).toHaveBeenCalledTimes(1)

        observed.foo = 2
        expect(spy).toHaveBeenCalledTimes(2)

        observed.foo = 2
        expect(spy).toHaveBeenCalledTimes(2)

        observed.foo = NaN
        expect(spy).toHaveBeenCalledTimes(3)

        observed.foo = NaN
        expect(spy).toHaveBeenCalledTimes(3)
    })
    // 测试对数组的响应式代理
    test('call registered function when array observed value change detected', () => {
        const originalObj = []
        const observed = reactive(originalObj)

        const spy = vi.fn()

        watchEffect(() => {
            observed.toString()
            spy()
        })

        expect(spy).toHaveBeenCalledTimes(1)

        observed.push('a')
        expect(spy).toHaveBeenCalledTimes(2)

        observed[2] = 'b'
        expect(spy).toHaveBeenCalledTimes(3)
    })
    // 测试删除属性
    it('delete observed value', () => {
        const originalObj = {foo: 1}
        const observed = reactive(originalObj)

        const spy = vi.fn()

        watchEffect(() => {
            observed.foo
            spy()
        })

        expect(spy).toHaveBeenCalledTimes(1)

        delete observed.foo
        expect(spy).toHaveBeenCalledTimes(2)
    })

})
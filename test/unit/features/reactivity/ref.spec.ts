import {proxyRefs, ref, toRefs} from "reactivity/ref";
import {reactive} from "reactivity/reactive";
import {watchEffect} from "core/effect";
import {vi} from "vitest";

describe('reactivity/ref', () => {
    //　测试对象的响应式
    test('Object', () => {
        const originObj = {foo: 1}
        const observed = ref(originObj)
        // get操作
        expect(observed.value.foo).toBe(1)
        expect('foo' in observed.value).toBe(true)
        expect(Object.keys(observed.value)).toContainEqual('foo')
    })
    // 测试代理字符串值
    test('String', () => {
        const originObj = 'foo'
        const observed = ref(originObj)
        expect(observed.value).toBe(originObj)
    })
    // 测试数组响应能力
    test('reactivity of array ref', () => {
        const originObj = []
        const observed = ref(originObj)
        const spy = vi.fn()

        watchEffect(() => {
            observed.value.toString()
            spy()
        })

        expect(spy).toHaveBeenCalledTimes(1)
        observed.value.push('foo')
        expect(spy).toHaveBeenCalledTimes(2)
        expect(originObj.length).toBe(1)
    })
    // 测试复制响应式对象时保留其响应式能力
    test('reserve reactivity when copying by toRefs', () => {
        const originObj = reactive({
            foo: 1
        })
        const observed: any = {...toRefs(originObj)}
        expect(observed.foo.value).toBe(1)
        expect(observed.foo._is_Ref_).toBe(true)

        // 测试响应能力
        const spy = vi.fn()
        watchEffect(() => {
            observed.foo.value
            spy()
        })

        expect(spy).toHaveBeenCalledTimes(1)
        observed.foo.value = 2
        expect(spy).toHaveBeenCalledTimes(2)
    })
    // 测试代理对象自动脱ref
    test('automatically off ref', () => {
        const data = ref(1)
        const proxy = proxyRefs({
            foo: data
        })

        expect(proxy.foo).toBe(1)

        // 测试响应能力
        const spy = vi.fn()
        watchEffect(() => {
            proxy.foo
            spy()
        })

        expect(spy).toHaveBeenCalledTimes(1)
        proxy.foo = 2
        expect(spy).toHaveBeenCalledTimes(2)
    })
    // 测试嵌套对象的响应式
    test('nested object', () => {
        const a = ref(1)
        let count: number = 0
        const obj = reactive({
            b: {
                c: a
            }
        })

        watchEffect(() => {
            count = obj.b.c.value
        })

        expect(count).toBe(1)
        a.value ++
        expect(count).toBe(2)
    })
})
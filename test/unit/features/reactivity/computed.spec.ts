import {computed} from "reactivity/computed";
import {ref} from "reactivity/ref";
import {watchEffect} from "core/effect";
import {vi} from "vitest";

describe('reactivity/computed', () => {
    // 测试简单的字符串拼接
    it('computes simple string', () => {
        const data = 'foo'
        const cValue = computed(() => {
            return data + 'bar'
        })
        expect(cValue.value).toBe('foobar')
    })
    // 测试与响应式对象组合的计算属性
    it ('computes with reactive value', () => {
        const data = ref('foo')
        const cValue = computed(() => {
            return data.value + 'bar'
        })

        expect(cValue.value).toBe('foobar')
        data.value = 'bar'
        expect(cValue.value).toBe('bar'.repeat(2))
    })
    // 测试响应能力
    it('should trigger watchEffect', () => {
        const data = ref(1)
        let count: number = 0
        const cValue = computed(() => {
            return data.value
        })

        watchEffect(() => {
            count = cValue.value
        })

        expect(count).toBe(1)
        data.value ++
        expect(count).toBe(2)
    })
    // 测试自定义getter
    it ('computes by getter', () => {
        const data = ref(1)
        let count: number = 0

        const getter = vi.fn(() => {
            return data.value
        })
        const cValue = computed(getter)

        watchEffect(() => {
            count = cValue.value
        })

        expect(getter).toHaveBeenCalledTimes(1)
        expect(count).toBe(1)

        data.value ++
        expect(getter).toHaveBeenCalledTimes(2)
        expect(count).toBe(2)
    })
    // 测试数据懒更新
    it ('should not update if its new value equals the old value', () => {
        const data = ref(1)
        let count: number = 0

        const getter = vi.fn(() => {
            return data.value
        })
        const cValue = computed(getter)

        watchEffect(() => {
            count = cValue.value
        })

        expect(getter).toHaveBeenCalledTimes(1)
        expect(count).toBe(1)

        data.value = 1
        expect(getter).toHaveBeenCalledTimes(1)
        expect(count).toBe(1)
    })
})
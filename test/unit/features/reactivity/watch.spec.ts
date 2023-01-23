import {reactive} from "reactivity/reactive";
import {watch} from "reactivity/watch";
import {ref} from "reactivity/ref";

describe('reactivity/watch', () => {
    // 测试侦听普通的响应式值
    test ('watch simple reactive value', () => {
        let count: number = 0
        const data = reactive({
            foo: 1
        })

        watch(data, (newValue) => {
            count = newValue.foo
        })

        expect(count).toBe(0)
        data.foo ++
        expect(count).toBe(2)
    })
    // 测试侦听getter
    test ('watch by custom getter', () => {
        let count: number = 0
        const data = reactive({
            foo: 1
        })

        watch(() => data.foo, (newValue) => {
            count = newValue
        })

        expect(count).toBe(0)
        data.foo ++
        expect(count).toBe(2)
    })
    // watch自动脱ref
    test ('automatically off ref when being watched', () => {
        let count: number
        const data = ref(0)

        watch(data, (newValue) => {
            count = newValue
        })

        expect(count).toBe(0)
        data.value ++
        expect(count).toBe(1)
    })
})
import {ref} from "reactivity/ref";
import {createApp} from "DdBind";
import {DdBindVm} from "types/ddbind";
import {initDom} from "../../helper";

describe('directive on', () => {
    afterEach(() => {
        initDom()
    })
    // 测试click事件
    test('on click', () => {
        const app: DdBindVm = createApp({
            template: `<button @click="change">click</button>`,
            setup() {
                return {
                    change() {
                        this.count++
                    },
                    count: ref(0)
                }
            }
        })
        app.mount()

        expect(app.count).toBe(0)
        document.querySelector('button').click()
        expect(app.count).toBe(1)
    })
    // 测试其他事件
    test('on focus', () => {
        const app: DdBindVm = createApp({
            template: `<input @focus="change" />`,
            setup() {
                return {
                    change() {
                        this.count++
                    },
                    count: ref(0)
                }
            }
        })
        app.mount()

        expect(app.count).toBe(0)
        document.querySelector('input').focus()
        expect(app.count).toBe(1)
    })
})
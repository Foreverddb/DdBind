import {DdBindVm} from "types/ddbind";
import {createApp, ref} from "DdBind";
import {initDom} from "../../helper";

describe('directive d-bind', () => {
    afterEach(() => {
        initDom()
    })
    // 测试绑定普通属性
    it('bind normal attr', () => {
        const app: DdBindVm = createApp({
            template: '<div :test="foo">hello world</div>',
            setup() {
                return {
                    foo: ref('bar')
                }
            }
        })
        app.mount()

        expect(document.querySelector('div').getAttribute('test')).toBe('bar')
    })
    // 测试绑定样式属性
    it('bind style attr', () => {
        const app: DdBindVm = createApp({
            template: `<div :style="[{color: 'red'}]">hello world</div>`,
        })
        app.mount()

        expect(document.querySelector('div').style.color).toBe('red')
    })
    // 测试绑定class属性
    it('bind class attr', () => {
        const app: DdBindVm = createApp({
            template: `<div :class="['test', 'test2']">hello world</div>`,
        })
        app.mount()

        expect(document.querySelector('div').className).toBe('test test2')
    })
})
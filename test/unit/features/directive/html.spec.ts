import {DdBindVm} from "types/ddbind";
import {createApp, ref} from "DdBind";
import {initDom} from "../../helper";

describe('directive html', () => {
    afterEach(() => {
        initDom()
    })
    // 测试变量绑定
    test('bind html', () => {
        const app: DdBindVm = createApp({
            template: `<div d-html="foo"></div>`,
            setup() {
                return {
                    foo: ref('<h1>hello world</h1>')
                }
            }
        })
        app.mount()

        expect(document.body.innerHTML).toBe('<div><h1>hello world</h1></div>')
    })
    // 测试字符串绑定
    test('bind html text', () => {
        const app: DdBindVm = createApp({
            template: `<div d-html="'<h1>hello world</h1>'"></div>`
        })
        app.mount()

        expect(document.body.innerHTML).toBe('<div><h1>hello world</h1></div>')
    })
})
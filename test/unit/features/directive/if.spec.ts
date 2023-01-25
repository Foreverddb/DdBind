import {initDom} from "../../helper";
import {DdBindVm} from "types/ddbind";
import {createApp} from "DdBind";

describe('directive if', () => {
    afterEach(() => {
        initDom()
    })
    // 测试if为false
    test('if not', () => {
        const app: DdBindVm = createApp({
            template: `<div d-if="false">hello world</div>`,
        })
        app.mount()

        expect(document.body.innerHTML).toBe('')
    })
    // 测试if为true
    test('if', () => {
        const app: DdBindVm = createApp({
            template: `<div d-if="true">hello world</div>`,
        })
        app.mount()

        expect(document.body.innerHTML).toBe('<div>hello world</div>')
    })
})
import {DdBindVm} from "types/ddbind";
import {createApp, ref} from "DdBind";
import {initDom} from "../../helper";

describe('directive show', () => {
    afterEach(() => {
        initDom()
    })
    // 测试show指令为false
    it('not show', () => {
        const app: DdBindVm = createApp({
            template: `<div d-show="false">hello world</div>`,
        })
        app.mount()

        expect(document.querySelector('div').style.display).toBe('none')
    })
    // 测试show指令为true
    it('show', () => {
        const app: DdBindVm = createApp({
            template: `<div d-show="isShow">hello world</div>`,
            setup() {
                return {
                    isShow: ref(true)
                }
            }
        })
        app.mount()

        expect(document.querySelector('div').style.display).toBe('')
    })
})
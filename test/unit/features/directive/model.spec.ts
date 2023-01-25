import {DdBindVm} from "types/ddbind";
import {createApp, ref} from "DdBind";

describe('directive model', () => {
    test('model', () => {
        const app: DdBindVm = createApp({
            template: `<input d-model="foo" />`,
            setup() {
                return {
                    foo: ref('bar')
                }
            }
        })
        app.mount()

        expect(app.foo).toBe('bar')
        expect(document.querySelector('input').value).toBe('bar')
        // 测试双向绑定
        // 触发input事件
        document.querySelector('input').value = 'foo'
        const event = document.createEvent('HTMLEvents')
        event.initEvent('input', true, true)
        document.querySelector('input').dispatchEvent(event)

        expect(app.foo).toBe('foo')
        expect(document.querySelector('input').value).toBe('foo')

        app.foo = 'text'
        expect(app.foo).toBe('text')
        expect(document.querySelector('input').value).toBe('text')
    })
})
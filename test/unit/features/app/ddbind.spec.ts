import {DdBindVm} from "types/ddbind";
import {createApp, ref} from "DdBind";
import {vi} from "vitest";
import {initDom} from "../../helper";

describe('module/ddbind', () => {
    afterEach(() => {
        initDom()
    })
    // 测试创建简单应用
    it('create simple app', () => {
        const app: DdBindVm = createApp({
            template: '<div>hello world</div>',
            setup() {
                return {
                    foo: ref('bar')
                }
            }
        })
        app.mount()

        expect(document.body.innerHTML).toBe('<div>hello world</div>')
        expect(app.$el).toBe(document.body)
        expect(app.foo).toBe('bar')
    })
    // 测试创建一个属性完备的应用
    it('create complete app', () => {
        const spy = vi.fn()
        const app: DdBindVm = createApp({
            template: '<div>hello world</div>',
            data() {
                return {
                    bar: 'foo'
                }
            },
            computed: {
                compute() {
                    return this.bar + this.foo
                }
            },
            methods: {
                fn: spy
            },
            watch: {
                foo: spy
            },
            setup() {
                return {
                    foo: ref('bar')
                }
            }
        })
        app.mount()

        expect(document.body.innerHTML).toBe('<div>hello world</div>')
        expect(app.$el).toBe(document.body)

        expect(app.foo).toBe('bar')
        expect(app.bar).toBe('foo')
        expect(app.compute.value).toBe('foobar')

        app.fn()
        expect(spy).toHaveBeenCalledTimes(1)
        app.foo = 'foo'
        expect(spy).toHaveBeenCalledTimes(2)
    })
    // 测试挂载到某个特定元素
    it('mount on specific element', () => {
        document.body.innerHTML = '<div id="app"></div>'
        const app: DdBindVm = createApp({
            template: '<div>hello world</div>',
            setup() {
                return {
                    foo: ref('bar')
                }
            }
        })
        app.mount('#app')

        expect(document.querySelector('#app').innerHTML).toBe('<div>hello world</div>')
        expect(app.$el).toBe(document.querySelector('#app'))
        expect(app.foo).toBe('bar')

    })
    // 测试插值
    it('mount with interpolation', () => {
        document.body.innerHTML = '<div id="app"></div>'
        const app: DdBindVm = createApp({
            template: '<div>{{ foo }}</div>',
            setup() {
                return {
                    foo: ref('bar')
                }
            }
        })
        app.mount('#app')

        expect(app.foo).toBe('bar')
        expect(document.querySelector('#app').innerHTML).toBe('<div>bar</div>')
        expect(app.$el).toBe(document.querySelector('#app'))

    })
})
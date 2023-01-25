import {initDom} from "../../helper";
import {createRenderer} from "renderer/index";
import {VNode} from "types/renderer";

describe('renderer', () => {
    afterEach(() => {
        initDom()
    })
    // 测试简单的渲染
    test('simple render', () => {
        const vnode = {
            type: 'h1',
            children: 'hello world',
            if: true
        } as VNode

        const renderer = createRenderer()
        renderer.render(vnode, document.body)

        expect(document.body.innerHTML).toBe('<h1>hello world</h1>')
    })
    // 测试渲染为空
    test('null render', () => {
        const vnode = {
            type: 'h1',
            children: 'hello world',
            if: true
        } as VNode

        const renderer = createRenderer()
        renderer.render(vnode, document.body)

        expect(document.body.innerHTML).toBe('<h1>hello world</h1>')
        renderer.render(null, document.body)
        expect(document.body.innerHTML).toBe('')
    })
    // 测试渲染更新
    test('update render', () => {
        const vnode1 = {
            type: 'h1',
            children: 'hello world',
            if: true
        } as VNode
        const vnode2 = {
            type: 'div',
            children: 'bye world',
            if: true
        } as VNode

        const renderer = createRenderer()

        renderer.render(vnode1, document.body)
        expect(document.body.innerHTML).toBe('<h1>hello world</h1>')
        renderer.render(vnode2, document.body)
        expect(document.body.innerHTML).toBe('<div>bye world</div>')
    })
})
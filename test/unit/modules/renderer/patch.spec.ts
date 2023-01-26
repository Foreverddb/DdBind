import {patch} from "renderer/patch";
import {VNode} from "types/renderer";
import {CommentVnodeSymbol, TextVnodeSymbol} from "renderer/vnode";
import {initDom} from "../../helper";

describe('patch', () => {
    afterEach(() => {
        initDom()
    })
    // 测试简单的渲染
    it('patch simple vnode', () => {
        const vnode = {
            type: 'h1',
            children: 'hello world',
            if: true
        } as VNode
        const container = document.body
        patch(null, vnode, container)

        expect(container.innerHTML).toBe('<h1>hello world</h1>')
    })
    // 测试嵌套虚拟dom的渲染
    it('patch nested vnode', () => {
        const vnode = {
            type: 'div',
            children: [{
                type: 'h1',
                children: 'hello world',
                if: true
            }],
            if: true
        } as VNode
        const container = document.body

        patch(null, vnode, container)

        expect(container.innerHTML).toBe('<div><h1>hello world</h1></div>')
    })
    // 测试更新dom
    it('update vnode', () => {
        const vnode = {
            type: 'h1',
            children: 'hello world',
            if: true
        } as VNode
        const container = document.body

        patch(null, vnode, container)
        expect(container.innerHTML).toBe('<h1>hello world</h1>')

        const vnode2 = {
            type: 'h1',
            children: 'bye world',
            if: true
        } as VNode
        patch(vnode, vnode2, container)
        expect(container.innerHTML).toBe('<h1>bye world</h1>')

        patch(vnode, null, container)
        expect(container.innerHTML).toBe('')
    })
    // 测试不同type的vnode更新
    it('update vnode with different type', () => {
        const vnode = {
            type: 'h1',
            children: 'hello world',
            if: true
        } as VNode
        const container = document.body

        patch(null, vnode, container)
        expect(container.innerHTML).toBe('<h1>hello world</h1>')

        const vnode2 = {
            type: 'div',
            children: [
                {
                    type: 'h1',
                    children: 'hello world',
                    if: true
                }
            ],
            if: true
        } as VNode
        patch(vnode, vnode2, container)
        expect(container.innerHTML).toBe('<div><h1>hello world</h1></div>')
    })
    // 测试注释节点的更新
    it('update comment node', () => {
        const vnode = {
            type: 'h1',
            children: 'hello world',
            if: true
        } as VNode
        const container = document.body

        patch(null, vnode, container)
        expect(container.innerHTML).toBe('<h1>hello world</h1>')

        const vnode2 = {
            type: 'div',
            children: [
                {
                    type: 'h1',
                    children: 'hello world',
                    if: true
                }
            ],
            if: true
        } as VNode
        patch(vnode, vnode2, container)
        expect(container.innerHTML).toBe('<div><h1>hello world</h1></div>')
    })
    // 测试复杂嵌套渲染
    it('update nested vnode', () => {
        const vnode = {
            type: CommentVnodeSymbol,
            children: 'comment',
            if: true
        } as VNode
        const container = document.body

        patch(null, vnode, container)
        expect(container.innerHTML).toBe('<!--comment-->')

        const vnode2 = {
            type: CommentVnodeSymbol,
            children: 'new comment',
            if: true
        } as VNode
        patch(vnode, vnode2, container)
        expect(container.innerHTML).toBe('<!--new comment-->')
    })
    // 测试文本节点的更新
    it('update text vnode', () => {
        const vnode = {
            type: TextVnodeSymbol,
            children: 'text',
            if: true
        } as VNode
        const container = document.body

        patch(null, vnode, container)
        expect(container.innerHTML).toBe('text')

        const vnode2 = {
            type: TextVnodeSymbol,
            children: 'new text',
            if: true
        } as VNode
        patch(vnode, vnode2, container)
        expect(container.innerHTML).toBe('new text')
    })
    // 测试复杂嵌套渲染
    it('update nested vnode with different child type', () => {
        const vnode = {
            type: 'div',
            children: [
                {
                    type: 'h1',
                    children: 'hello world',
                    if: true
                }
            ],
            if: true
        } as VNode
        const container = document.body

        patch(null, vnode, container)
        expect(container.innerHTML).toBe('<div><h1>hello world</h1></div>')

        const vnode2 = {
            type: 'div',
            children: 'text',
            if: true
        } as VNode
        patch(vnode, vnode2, container)
        expect(container.innerHTML).toBe('<div>text</div>')
    })
    // 测试复杂嵌套渲染
    it('update nested vnode', () => {
        const vnode = {
            type: 'div',
            children: [
                {
                    type: 'h1',
                    children: 'hello world',
                    if: true
                },
                {
                    type: TextVnodeSymbol,
                    children: 'text',
                    if: true
                }
            ],
            if: true
        } as VNode
        const container = document.body

        patch(null, vnode, container)
        expect(container.innerHTML).toBe('<div><h1>hello world</h1>text</div>')

        const vnode2 = {
            type: 'div',
            children: [
                {
                    type: 'h1',
                    children: 'bye world',
                    if: true
                },
                {
                    type: CommentVnodeSymbol,
                    children: 'comment',
                    if: true
                }
            ],
            if: true
        } as VNode
        patch(vnode, vnode2, container)
        expect(container.innerHTML).toBe('<div><h1>bye world</h1><!--comment--></div>')
    })
    // 测试新旧子节点数不同
    it('update nested vnode with different number of children(old < new)', () => {
        const vnode = {
            type: 'div',
            children: [
                {
                    type: 'h1',
                    children: 'hello world',
                    if: true
                },
                {
                    type: TextVnodeSymbol,
                    children: 'text',
                    if: true
                }
            ],
            if: true
        } as VNode
        const container = document.body

        patch(null, vnode, container)
        expect(container.innerHTML).toBe('<div><h1>hello world</h1>text</div>')

        const vnode2 = {
            type: 'div',
            children: [
                {
                    type: 'h1',
                    children: 'bye world',
                    if: true
                },
                {
                    type: CommentVnodeSymbol,
                    children: 'comment',
                    if: true
                },
                {
                    type: 'div',
                    children: 'div',
                    if: true
                }
            ],
            if: true
        } as VNode
        patch(vnode, vnode2, container)
        expect(container.innerHTML).toBe('<div><h1>bye world</h1><!--comment--><div>div</div></div>')
    })
    // 测试新旧子节点数不同
    it('update nested vnode with different number of children(old > new)', () => {
        const vnode = {
            type: 'div',
            children: [
                {
                    type: 'h1',
                    children: 'hello world',
                    if: true
                }, {
                    type: TextVnodeSymbol,
                    children: 'text',
                    if: true
                }
            ],
            if: true
        } as VNode
        const container = document.body

        patch(null, vnode, container)
        expect(container.innerHTML).toBe('<div><h1>hello world</h1>text</div>')

        const vnode2 = {
            type: 'div',
            children: [
                {
                    type: 'h1',
                    children: 'bye world',
                    if: true
                }
            ],
            if: true
        } as VNode
        patch(vnode, vnode2, container)
        expect(container.innerHTML).toBe('<div><h1>bye world</h1></div>')
    })
    // 测试if指令导致的不渲染
    it('should not render if the vnode\'s property of if is false', () => {
        const vnode = {
            type: 'h1',
            children: 'hello world',
            if: false
        } as VNode
        const container = document.body

        patch(null, vnode, container)
        expect(container.innerHTML).toBe('')
    })
    // 测试props的渲染
    it('patch props', () => {
        const vnode = {
            type: 'h1',
            children: 'hello world',
            props: {
                style: 'color: red',
                _style_: {
                    fontSize: '20px'
                },
                class: 'test',
                _class_: ['test2']
            },
            if: true
        } as VNode
        const container = document.body

        patch(null, vnode, container)
        expect(container.innerHTML).toBe('<h1 style="color: red; font-size: 20px;" class="test test2">hello world</h1>')
    })
    // 测试新子节点为null
    it('new vnode\'s children is null and old vnode\'s children is array', () => {
        const vnode = {
            type: 'div',
            children: [
                {
                    type: 'h1',
                    children: 'hello world',
                    if: true
                }
            ],
            if: true
        } as VNode
        const container = document.body

        patch(null, vnode, container)
        expect(container.innerHTML).toBe('<div><h1>hello world</h1></div>')

        const vnode2 = {
            type: 'div',
            children: null,
            if: true
        } as VNode
        patch(vnode, vnode2, container)
        expect(container.innerHTML).toBe('<div></div>')
    })
    // 测试新子节点为null
    it('new vnode\'s children is null and old vnode\'s children is string', () => {
        const vnode = {
            type: 'div',
            children: 'hello world',
            if: true
        } as VNode
        const container = document.body

        patch(null, vnode, container)
        expect(container.innerHTML).toBe('<div>hello world</div>')

        const vnode2 = {
            type: 'div',
            children: null,
            if: true
        } as VNode
        patch(vnode, vnode2, container)
        expect(container.innerHTML).toBe('<div></div>')
    })
    // 测试新旧子节点类型不同
    it('update nested vnode with different type of children', () => {
        const vnode = {
            type: 'div',
            children: 'hello world',
            if: true
        } as VNode
        const container = document.body

        patch(null, vnode, container)
        expect(container.innerHTML).toBe('<div>hello world</div>')

        const vnode2 = {
            type: 'div',
            children: [
                {
                    type: 'h1',
                    children: 'hello world',
                    if: true
                }
            ],
            if: true
        } as VNode
        patch(vnode, vnode2, container)
        expect(container.innerHTML).toBe('<div><h1>hello world</h1></div>')
    })
})
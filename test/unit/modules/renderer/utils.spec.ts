import {createTextVnode, createVnode, stringVal} from "renderer/utils";
import {VNode} from "types/renderer";
import {vi} from "vitest";
import {TextVnodeSymbol} from "renderer/vnode";
import {reactive} from "reactivity/reactive";

describe('utils', () => {
    // 测试_h函数
    it('create simple vnode', () => {
        const vnode = createVnode('h1', {}, 'hello world')
        expect(vnode.if).toBe(true)
        expect(vnode.type).toBe('h1')
        expect(vnode.children).toBe('hello world')
    })
    // 测试创建嵌套vnode
    it('create nested vnode', () => {
        const vnode = createVnode('div', {}, [
            createVnode('h1', {}, 'hello world')
        ])
        expect(vnode.if).toBe(true)
        expect(vnode.type).toBe('div')
        expect((vnode.children[0] as VNode).if).toBe(true)
        expect((vnode.children[0] as VNode).type).toBe('h1')
        expect((vnode.children[0] as VNode).children).toBe('hello world')
    })
    // 测试创建vnode的props
    it('create vnode with props', () => {
        const spy = vi.fn()
        const vnode = createVnode('h1', {
            attrs: {
                _if_: false,
                _show_: false
            },
            on: {
                click: spy
            }
        }, 'hello world')
        expect(vnode.if).toBe(false)
        expect(vnode.props['_style_']['display']).toBe('none')
        expect(vnode.props['onClick']).toBe(spy)
    })
    // 测试_v函数创建文本node
    it('create text node', () => {
        const vnode = createTextVnode('hello world')
        expect(vnode.if).toBe(true)
        expect(vnode.type).toBe(TextVnodeSymbol)
        expect(vnode.children).toBe('hello world')
    })
    // 测试_s函数转换字符串
    it('convert val to string', () => {
        const originData1: any = reactive({
            foo: 1
        })
        const str1 = stringVal(originData1)
        const originData2: number = 100
        const str2 = stringVal(originData2)

        expect(str1).toBe('{"foo":1}')
        expect(str2).toBe('100')
    })
})
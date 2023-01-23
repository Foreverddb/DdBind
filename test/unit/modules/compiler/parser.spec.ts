import {parse} from "compiler/parser";
import {ExpressionNode, PropNode, TemplateAST} from "types/compiler";

describe('parser', () => {
    // 测试单个元素解析
    it('simple element', () => {
        const ast: TemplateAST = parse('<h1>hello world</h1>')
        expect(ast.type).toBe('Root')
        expect(ast.children[0].type).toBe('Element')
        expect(ast.children[0].tag).toBe('h1')
        expect(ast.children[0].children[0].type).toBe('Text')
        expect(ast.children[0].children[0].content).toBe('hello world')
    })
    // 测试文本插值解析
    it('interpolation in element', () => {
        const ast = parse('<h1>{{msg}}</h1>')
        expect(ast.type).toBe('Root')
        expect(ast.children[0].type).toBe('Element')
        expect(ast.children[0].tag).toBe('h1')
        expect(ast.children[0].children).toContainEqual({
            type: 'Interpolation',
            content: {
                content: 'msg',
                type: 'Expression'
            } as ExpressionNode
        } as TemplateAST)
    })
    // 测试自闭合标签解析
    it('self-closing element', () => {
        const ast = parse('<hr>')
        expect(ast.children[0].type).toBe('Element')
        expect(ast.children[0].tag).toBe('hr')
        expect(ast.children[0].children.length).toBe(0)
    })
    // 测试标签属性解析
    it('HTML attrs', () => {
        const ast = parse('<h1 class="test">hello world</h1>')
        expect(ast.children[0].type).toBe('Element')
        expect(ast.children[0].tag).toBe('h1')
        expect(ast.children[0].props).toContainEqual({
            type: 'Attribute',
            name: 'class',
            value: 'test'
        } as PropNode)
    })
    // 测试指令解析
    it('directive attr', () => {
        const ast = parse(`<h1 :class="['test']">hello world</h1>`)
        expect(ast.children[0].type).toBe('Element')
        expect(ast.children[0].tag).toBe('h1')
        expect(ast.children[0].props).toContainEqual({
            exp: {
                content: "['test']",
                type: "Expression",
            } as ExpressionNode,
            name: "_class_",
            type: "ReactiveProp",
        } as PropNode)
    })
    // 测试HTML引用字符串解析
    it('HTML referred string', () => {
        const ast = parse(`<h1>&lt</h1>`)
        expect(ast.children[0].type).toBe('Element')
        expect(ast.children[0].tag).toBe('h1')
        expect(ast.children[0].children).toContainEqual({
            type: 'Text',
            content: '<'
        } as TemplateAST)
    })
})
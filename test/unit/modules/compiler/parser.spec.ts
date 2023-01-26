import {parse} from "compiler/parser";

describe('parser', () => {
    // 测试单个元素解析
    it('parse simple element', () => {
        const ast = parse('<h1>hello world</h1>')
        expect(ast.type).toBe('Root')
        expect(ast.children[0].type).toBe('Element')
        expect(ast.children[0].tag).toBe('h1')
        expect(ast.children[0].children[0].type).toBe('Text')
        expect(ast.children[0].children[0].content).toBe('hello world')
    })
    // 测试文本插值解析
    it('parse interpolation in element', () => {
        const ast = parse('<h1>{{msg}}</h1>')
        expect(ast.type).toBe('Root')
        expect(ast.children[0].type).toBe('Element')
        expect(ast.children[0].tag).toBe('h1')
        expect(ast.children[0].children).toContainEqual({
            type: 'Interpolation',
            content: {
                content: 'msg',
                type: 'Expression'
            }
        })
    })
    // 测试自闭合标签解析
    it('parse self-closing element', () => {
        const ast = parse('<hr>')
        expect(ast.children[0].type).toBe('Element')
        expect(ast.children[0].tag).toBe('hr')
        expect(ast.children[0].children.length).toBe(0)
    })
    // 测试标签属性解析
    it('parse HTML attrs', () => {
        const ast = parse('<h1 class="test">hello world</h1>')
        expect(ast.children[0].type).toBe('Element')
        expect(ast.children[0].tag).toBe('h1')
        expect(ast.children[0].props).toContainEqual({
            type: 'Attribute',
            name: 'class',
            value: 'test'
        })
    })
    // 测试无引号标签属性解析
    it('parse HTML attrs without quote', () => {
        const ast = parse('<h1 class=test>hello world</h1>')
        expect(ast.children[0].type).toBe('Element')
        expect(ast.children[0].tag).toBe('h1')
        expect(ast.children[0].props).toContainEqual({
            type: 'Attribute',
            name: 'class',
            value: 'test'
        })
    })
    // 测试指令解析
    it('parse directive attr', () => {
        const ast = parse(`<h1 :class="['test']">hello world</h1>`)
        expect(ast.children[0].type).toBe('Element')
        expect(ast.children[0].tag).toBe('h1')
        expect(ast.children[0].props).toContainEqual({
            exp: {
                content: "['test']",
                type: "Expression",
            },
            name: "_class_",
            type: "ReactiveProp",
        })
    })
    // 测试HTML引用字符串解析
    it('parse HTML referred string', () => {
        const ast = parse(`<h1>&lt</h1>`)
        expect(ast.children[0].type).toBe('Element')
        expect(ast.children[0].tag).toBe('h1')
        expect(ast.children[0].children).toContainEqual({
            type: 'Text',
            content: '<'
        })
    })
    // 测试HTML数组引用字符串解析
    it('parse HTML digital type referred string', () => {
        const ast1 = parse(`<h1>&#60</h1>`)

        expect(ast1.children[0].children).toContainEqual({
            type: 'Text',
            content: '<'
        })

        const ast2 = parse(`<h1>&#x80</h1>`)
        expect(ast2.children[0].children).toContainEqual({
            type: 'Text',
            content: '€'
        })

        const ast3 = parse(`<h1>&#0</h1>`)
        expect(ast3.children[0].children).toContainEqual({
            type: 'Text',
            content: String.fromCodePoint(0xfffd)
        })
    })
    // 测试注释的解析
    it('parse comment node', () => {
        const ast = parse('<!--hello world-->')
        expect(ast.type).toBe('Root')
        expect(ast.children[0].type).toBe('Comment')
        expect(ast.children[0].content).toBe('hello world')
    })
})
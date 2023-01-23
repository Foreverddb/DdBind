import {TemplateAST} from "types/compiler";
import {parse} from "compiler/parser";
import {transform} from "compiler/transformer";
import {generate} from "compiler/generator";

const generateCode = (str: string): string => {
    const template: TemplateAST = parse(str)
    const ast: any = transform(template)
    return generate(ast)
}

describe('generator', () => {
    // 测试简单的元素代码生成结果
    it ('simple element code', () => {
        const code = generateCode(`<h1>hello world</h1>`)
        expect(code).toBe(`with(this) {return _h('h1', {}, [_v('hello world')])}`)
    })
    // 测试绑定事件生成code
    it ('event code', () => {
        const code = generateCode(`<h1 @click="func">hello world</h1>`)
        expect(code).toBe(`with(this) {return _h('h1', {'directives': {}, 'on': {'click': ((typeof (func) === 'function') ? (func) : () => { (func) })}, 'attrs': {}}, [_v('hello world')])}`)
    })
    // 测试嵌套元素代码生成
    it ('nesting element code', () => {
        const code = generateCode(`<div><h1>text</h1></div>`)
        expect(code).toBe(`with(this) {return _h('div', {}, [_h('h1', {}, [_v('text')])])}`)
    })
    // 测试model指令代码生成
    it ('d-model directive code', () => {
        const code = generateCode(`<input d-model="foo"/>`)
        expect(code).toBe(`with(this) {return _h('input', {'directives': {'d-model': (foo)}, 'on': {'input': (($event) => { if ($event.target.composing) return;  (foo) = $event.target.value })}, 'attrs': {'value': ((foo))}}, [])}`)
    })
    // 测试if指令代码生成
    it ('d-if directive code', () => {
        const code = generateCode(`<h1 d-if="foo">hello world</h1>`)
        expect(code).toBe(`with(this) {return _h('h1', {'directives': {'d-if': (foo)}, 'on': {}, 'attrs': {'_if_': (foo)}}, [_v('hello world')])}`)
    })
    // 测试show指令代码生成
    it ('d-show directive code', () => {
        const code = generateCode(`<h1 d-show="foo">hello world</h1>`)
        expect(code).toBe(`with(this) {return _h('h1', {'directives': {'d-show': (foo)}, 'on': {}, 'attrs': {'_show_': (foo)}}, [_v('hello world')])}`)
    })
    // 测试bind指令代码生成
    it ('d-bind directive code', () => {
        const code = generateCode(`<h1 d-bind:style="[fontSize: '30px']">hello world</h1>`)
        const syntacticSugarCode = generateCode(`<h1 :style="[fontSize: '30px']">hello world</h1>`)
        const res = `with(this) {return _h('h1', {'directives': {}, 'on': {}, 'attrs': {'_style_': ([fontSize: '30px'])}}, [_v('hello world')])}`
        expect(syntacticSugarCode).toBe(res)
        expect(code).toBe(res)
    })
    // 测试on指令代码生成
    it ('d-on directive code', () => {
        const code = generateCode(`<button d-on:click="func">hello world</button>`)
        const syntacticSugarCode = generateCode(`<button @click="func">hello world</button>`)
        const res = `with(this) {return _h('button', {'directives': {}, 'on': {'click': ((typeof (func) === 'function') ? (func) : () => { (func) })}, 'attrs': {}}, [_v('hello world')])}`
        expect(syntacticSugarCode).toBe(res)
        expect(code).toBe(res)
    })
    // 测试html指令代码生成
    it ('d-html directive code', () => {
        const code = generateCode(`<div d-html="'<h1>hello world</h1>'"></div>`)
        expect(code).toBe(`with(this) {return _h('div', {'directives': {'d-html': ('<h1>hello world</h1>')}, 'on': {}, 'attrs': {'innerHTML': ''<h1>hello world</h1>''}}, [])}`)
    })
})
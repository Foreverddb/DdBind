import {DdBind} from "DdBind";
import {parse} from "compiler/parser";
import {iCompiler, JavascriptNode, TemplateAST} from "types/compiler";
import {transform} from "compiler/transformer";
import {generate} from "compiler/generator";
import {error} from "utils/debug";
import {createTextVnode, createVnode, stringVal} from "renderer/utils";

export class Compiler implements iCompiler{
    $el: HTMLElement
    $vm: DdBind

    constructor(el: HTMLElement, vm: DdBind) {
        this.$el = el
        this.$vm = vm

        // 初始化绑定渲染函数
        this.$vm._h = createVnode
        this.$vm._v = createTextVnode
        this.$vm._s = stringVal

        if (this.$el) {
            this.compileElement(this.$el)
        }
    }

    /**
     * 编译目标元素
     * @param el 目标HTML
     */
    private compileElement(el: HTMLElement) {
        const source = this.$vm.$template || el.innerHTML

        const templateAST: TemplateAST = parse(source) // 编译HTML模版为模版AST

        const jsAST: JavascriptNode = transform(templateAST) // 将模版AST转换为jsAST

        const code: string = generate(jsAST) // 根据jsAST生成渲染函数代码

        this.$vm.$render = createFunction(code, this.$vm)
    }
}

function createFunction(code: string, vm: any): Function {
    try {
        return new Function(code).bind(vm)
    } catch (e: any) {
        error('create function error.', e)
    }
}
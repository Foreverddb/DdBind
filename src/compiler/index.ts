import {DdBind} from "DdBind";
import {parse} from "compiler/parser";
import {FunctionDeclNode, JavascriptNode, TemplateAST} from "types/compiler";
import {transform} from "compiler/transformer";
import {generate} from "compiler/generator";

export class Compiler {
    $el: HTMLElement
    $vm: DdBind
    constructor(el: HTMLElement, vm: DdBind) {
        this.$el = el
        this.$vm = vm

        if (this.$el) {
            this.compileElement(this.$el)
        }
    }

    private compileElement(el: HTMLElement) {
        const source = el.outerHTML

        const templateAST: TemplateAST = parse(source)
        console.log(templateAST)

        const jsAST: JavascriptNode = transform(templateAST)
        console.log(jsAST)

        const code: string = generate(jsAST)
        console.log(code)
    }

    private compile() {

    }
}
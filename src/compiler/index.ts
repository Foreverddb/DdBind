import {DdBind} from "DdBind";
import {parse} from "compiler/parser";
import {TemplateAst} from "types/compiler";

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
        const source = el.innerHTML
        const templateAst: TemplateAst = parse(source)
        console.log(templateAst)
    }

    private compile() {

    }
}
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
        // const source = el.innerHTML
        const source = `<h1 @click="test()">
            testtt &lt;&#60;
            <div>ttttrt</div>
        </h1>
        <div d-model="ddd">ddd</div>
        <div id="fuck"></div>`
        const templateAst: TemplateAst = parse(source)
        console.log(templateAst)
    }

    private compile() {

    }
}
import {DdBindOptions} from "types/ddbind";
import {Compiler} from "compiler/index";
import {VNode} from "types/renderer";

export class DdBind {
    $el: HTMLElement

    $options: DdBindOptions

    $compile: Compiler

    $vnode: VNode

    [propName: string]: any;

    constructor(options: DdBindOptions) {
        this.$options = options
    }

    /**
     * 将app挂载到指定dom上
     * @param el dom或selector
     */
    mount(el?: string | HTMLElement) {
        let container: HTMLElement
        if (typeof el === 'string') {
            container = document.querySelector(el)
        } else {
            container = el || document.body
        }

        this.$el = container
        this.$compile = new Compiler(container, this) // 创建对应编译器

    }
}
import {Compiler} from "compiler/index";
import {Renderer, VNode} from "types/renderer";

export interface DdBindOptions {

    template?: string
    setup: () => object

    onMounted: () => any

    data: () => object

    methods: {
        [propName: string]: Function
    }

    computed: {
        [propName: string]: Function
    }

    watch: {
        [propName: string]: Function
    }
}

export interface DdBindVm {
    $template: string

    $el: HTMLElement

    $options: DdBindOptions

    $compile: Compiler

    $data: object

    $render: Function

    $renderer: Renderer

    $vnode: VNode

    _h: Function
    _v: Function
    _s: Function

    [propName: string]: any;
}


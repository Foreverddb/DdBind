import {DdBindOptions} from "types/ddbind";
import {Compiler} from "compiler/index";
import {Renderer, VNode} from "types/renderer";
import {effect} from "core/effect";
import {createRenderer} from "renderer/index";

export class DdBind {
    $el: HTMLElement

    $options: DdBindOptions

    $compile: Compiler

    $render: Function

    $renderer: Renderer

    $vnode: VNode

    _h: Function
    _v: Function
    _s: Function

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

        this.$renderer = createRenderer() // 创建渲染器
        Object.assign(this, this.$options.setup()) // 将setup返回值绑定到vm对象上

        // 注册响应式数据，当数据改变时重新渲染
        effect(() => {
            this.$vnode = this.$render() // 挂载并渲染vnode
            this.$renderer.render(this.$vnode, this.$el)
        })

    }
}
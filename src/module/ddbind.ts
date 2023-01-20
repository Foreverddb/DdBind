import {DdBindOptions} from "types/ddbind";
import {Compiler} from "compiler/index";
import {Container, Renderer, VNode} from "types/renderer";
import {effect} from "core/effect";
import {createRenderer} from "renderer/index";
import {proxyRefs, ref, toRefs} from "reactivity/ref";
import {computed} from "reactivity/computed";
import {watch} from "reactivity/watch";

export class DdBind {
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

    constructor(options: DdBindOptions) {
        this.$options = options
    }

    /**
     * 将app挂载到指定dom上
     * @param el dom或selector
     */
    mount(el?: string | HTMLElement) {
        let container: Container
        if (typeof el === 'string') {
            container = document.querySelector(el)
        } else {
            container = el || document.body
        }

        this.$el = container

        this.$compile = new Compiler(container, this) // 创建对应编译器

        this.$renderer = createRenderer() // 创建渲染器
        container.innerHTML = '' // 清空container原有的HTML结构

        this._bind()

        // 注册响应式数据，当数据改变时重新渲染
        effect(() => {
            this.$vnode = this.$render() // 挂载并渲染vnode
            this.$renderer.render(this.$vnode, this.$el)
        })

        // 绑定完成即触发onMounted钩子
        this.$options.onMounted && this.$options.onMounted.bind(this)()
    }

    /**
     * 将vm对象与option数据进行绑定
     */
    private _bind() {
        const setups: object = this.$options.setup.bind(this)() // 为setup绑定当前执行环境

        const methods: object = this.$options.methods
        this.$data = this.$options.data()

        Object.assign(setups, this.$data)

        // 将setup返回值处理为data或methods
        for (const setupsKey in setups) {
            if (setups[setupsKey] instanceof Function) {
                methods[setupsKey] = setups[setupsKey]
            } else {
                this.$data[setupsKey] = setups[setupsKey] // 合并setup与data块的属性
            }
        }

        // 绑定计算属性
        const computedList: object = this.$options.computed
        for (const key in computedList) {
            if (!key.startsWith('$') && !key.startsWith('_')) {
                Object.defineProperty(this, key, {
                    value: computed((computedList[key] as Function).bind(this)),
                    writable: false
                })
            }
        }

        // 绑定方法
        for (const key in methods) {
            if (!key.startsWith('$') && !key.startsWith('_')) {
                Object.defineProperty(this, key, {
                    value: (methods[key] as Function).bind(this),
                    writable: false
                })
            }
        }

        // 绑定响应式数据
        for (const key in this.$data) {
            if (!this.$data[key]._is_Ref_) {
                this.$data[key] = ref(this.$data[key])
            }
        }
        Object.assign(this, this.$data)

        // 绑定侦听属性
        const watchesFn: object = this.$options.watch
        for (const key in watchesFn) {
            if (!key.startsWith('$') && !key.startsWith('_'))
                watch(this[key], watchesFn[key])
        }
    }
}
import {Container, Invoker, Renderer, VNode} from "types/renderer";

/**
 * 创建一个渲染器
 */
export function createRenderer(): Renderer {
    /**
     * 判断某个属性是否需要通过setAttribute方式设置
     * @param el 目标dom
     * @param key 目标属性名
     * @param value 属性值
      */
    function shouldSetAsDomProps(el: Container, key: string, value: any ): boolean {
        if (key === 'form' && el.tagName === 'INPUT') return false
        return key in el
    }

    /**
     * 通过vnode为真实dom设置props
     * @param el 需要设置的dom
     * @param key 要设置的属性名
     * @param oldValue 旧属性值
     * @param newValue 新属性值
     */
    function patchProps(el: Container, key: string, oldValue: any, newValue: any) {
        // 以on开头的属性视为事件
        if (/^on/.test(key)) {
            const eventName = key.slice(2).toLowerCase()
            const invokers = el._invokers || (el._invokers = {})
            let invoker: Invoker = invokers[eventName] // 事件处理函数装饰器

            if (newValue) {
                if (!invoker) {
                    // 原来无事件处理函数则注册新的
                    invoker = el._invokers[eventName] = (event: Event) => {
                        // 处理存在多个事件处理函数的情况
                        if (Array.isArray(invoker.value)) {
                            invoker.value.forEach(fn => fn(event))
                        } else {
                            invoker.value(event)
                        }
                    }
                    invoker.value = newValue
                    el.addEventListener(eventName, invoker)
                } else {
                    // 若有事件处理函数则可直接更新
                    invoker.value = newValue
                }
            } else if (invoker) {
                // 若新值无事件处理函数则清除原事件
                el.removeEventListener(eventName, invoker)
            }
        } else if (key === 'class') {
            // 针对class属性进行处理
            el.className = newValue || ''
        } else if (key === 'style') {
            // 针对style属性进行处理
            if (Array.isArray(newValue)) {
                for (const style in newValue) {
                    Object.assign(el.style, newValue[style])
                }
            } else {
                Object.assign(el.style, newValue)
            }
        } else if (shouldSetAsDomProps(el, key, newValue)) {
            const type = typeof el[key]
            if (type === 'boolean' && newValue === '') { // 针对HTML attr中boolean型的属性进行处理
                el[key] = true
            } else {
                el[key] = newValue
            }
        } else {
            // 不存在于DOM properties的属于用此方法设置
            el.setAttribute(key, newValue)
        }
    }

    /**
     * 将vnode挂载到真实dom
     * @param vnode 需要挂载的vnode
     * @param container 挂载容器
     */
    function mountElement(vnode: VNode, container: Container) {
        const el: Container = vnode.el = document.createElement(vnode.type)
        // 将每个child挂载到真实dom
        if (typeof vnode.children === 'string') {
            el.textContent = vnode.children
        } else if (Array.isArray(vnode.children)) {
            vnode.children.forEach(child => {
                patch(null, child, el)
            })
        }
        // 为dom挂载attr
        if (vnode.props) {
            for (const key in vnode.props) {
                patchProps(el, key, null, vnode.props[key])
            }
        }
        container.insertBefore(el, null)
    }

    /**
     * 卸载vnode
     * @param vnode 需要卸载的vnode
     */
    function unmountElement(vnode: VNode) {
        const parent = vnode.el.parentNode
        if (parent) {
            parent.removeChild(vnode.el)
        }
    }

    /**
     * 完成vnode的挂载更新
     * @param oldVNode 原vnode
     * @param newVNode 需要挂载更新的vnode
     * @param container 渲染容器
     */
    function patch(oldVNode: VNode, newVNode: VNode, container: Container): void {
        // 若新旧vnode类型不同，则卸载并重新挂载
        if (oldVNode && oldVNode.type === newVNode.type) {
            unmountElement(oldVNode)
            oldVNode = null
        }
        const vnodeType = typeof newVNode.type

        if (vnodeType === 'string') { // vnode为普通标签
            if (!oldVNode) {
                mountElement(newVNode, container) // 挂载vnode
            } else {
                // 更新
            }
        } else if (vnodeType === 'object') { // TODO vnode为组件

        } else {}
    }

    /**
     * 渲染vnode到真实dom
     * @param vnode 虚拟dom
     * @param container 渲染容器
     */
    function render(vnode: VNode, container: Container) {
        if (vnode) {
            patch(container._vnode, vnode, container) // 挂载或更新vnode
        } else {
            if (container._vnode) {
                unmountElement(container._vnode) // 卸载原有vnode
            }
        }
        container._vnode = vnode
    }

    return {
        render
    }
}
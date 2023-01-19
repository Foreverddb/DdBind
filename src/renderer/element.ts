import {Container, Invoker, VNode} from "types/renderer";
import {CommentVnodeSymbol, TextVnodeSymbol} from "renderer/vnode";
import {error} from "utils/debug";

/**
 * 判断某个属性是否需要通过setAttribute方式设置
 * @param el 目标dom
 * @param key 目标属性名
 * @param value 属性值
 */
export function shouldSetAsDomProps(el: Container, key: string, value: any): boolean {
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
export function patchProps(el: Container, key: string, oldValue: any, newValue: any) {
    // 以on开头的属性视为事件
    if (/^on/.test(key)) {
        const eventName = key.slice(2).toLowerCase()
        const invokers = el._invokers || (el._invokers = {})
        let invoker: Invoker = invokers[eventName] // 事件处理函数装饰器

        if (newValue) {
            if (!invoker) {
                // 原来无事件处理函数则注册新的
                invoker = el._invokers[eventName] = (event: Event) => {
                    // 若事件触发事件早于绑定时间则不处理此事件
                    if (event.timeStamp < invoker.attachTime) return
                    // 处理存在多个事件处理函数的情况
                    if (Array.isArray(invoker.value)) {
                        invoker.value.forEach(fn => fn(event))
                    } else {
                        invoker.value(event)
                    }
                }
                invoker.value = newValue
                invoker.attachTime = performance.now() // 记录此事件的绑定时间
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
export function mountElement(vnode: VNode, container: Container) {
    const el: Container = vnode.el = document.createElement(vnode.type as string)
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
export function unmountElement(vnode: VNode) {
    const parent = vnode.el.parentNode
    if (parent) {
        parent.removeChild(vnode.el)
    }
}

/**
 * 更新某节点的子节点
 * @param oldVNode 旧vnode
 * @param newVNode 新vnode
 * @param container
 */
export function updateElementChild(oldVNode: VNode, newVNode: VNode, container: Container) {
    if (typeof newVNode.children === 'string') { // 新vnode的children为字符串的情况
        if (Array.isArray(oldVNode.children)) {
            oldVNode.children.forEach(child => {
                unmountElement(child)
            })
        }
        container.textContent = newVNode.children
    } else if (Array.isArray(newVNode.children)) { // 新vnode的children类型为一组组件的情况
        if (Array.isArray(oldVNode.children)) {
            // 卸载后更新全部子节点
            oldVNode.children.forEach(child => {
                unmountElement(child)
            })
            newVNode.children.forEach(child => {
                patch(null, child, container)
            })
        } else {
            container.textContent = ''
            newVNode.children.forEach(child => {
                patch(null, child, container)
            })
        }
    } else { // 若新子节点不存在则挨个卸载
        if (Array.isArray(oldVNode.children)) {
            oldVNode.children.forEach(child => {
                unmountElement(child)
            })
        } else if (typeof oldVNode.children === 'string') {
            container.textContent = ''
        }
    }
}

/**
 * 更新修补vnode并重新挂载
 * @param oldVNode
 * @param newVNode
 */
export function updateElement(oldVNode: VNode, newVNode: VNode) {
    const el = newVNode.el = oldVNode.el
    const oldProps = oldVNode.props
    const newProps = newVNode.props

    // 更新props
    for (const key in newProps) {
        if (newProps[key] !== oldProps[key]) {
            patchProps(el as Container, key, oldProps[key], newProps[key])
        }
    }

    // 清除新vnode中不存在的老prop
    for (const key in oldProps) {
        if (!(key in newProps)) {
            patchProps(el as Container, key, oldProps[key], null)
        }
    }

    // 更新子节点
    updateElementChild(oldVNode, newVNode, el as Container)
}

/**
 * 完成vnode的挂载更新
 * @param oldVNode 原vnode
 * @param newVNode 需要挂载更新的vnode
 * @param container 渲染容器
 */
export function patch(oldVNode: VNode, newVNode: VNode, container: Container): void {
    // 若新旧vnode类型不同，则卸载并重新挂载
    if (oldVNode && oldVNode.type !== newVNode.type) {
        unmountElement(oldVNode)
        oldVNode = null
    }

    const vnodeType = typeof newVNode.type

    if (vnodeType === 'string') { // vnode为普通标签
        if (!oldVNode) {
            mountElement(newVNode, container) // 挂载vnode
        } else {
            updateElement(oldVNode, newVNode) // 更新vnode
        }
    } else if (vnodeType === 'object') { // TODO vnode为组件

    } else if (vnodeType === 'symbol'){ // 标准普通标签以外的标签
        if (newVNode.type === TextVnodeSymbol) { // 文本节点
            if (__DEV__ && typeof newVNode.children !== 'string') {
                error(`text node requires children being type of "string", received type ${typeof newVNode.children}`, newVNode)
            }
            if (!oldVNode) {
                const el = newVNode.el = document.createTextNode(newVNode.children as string)
                container.insertBefore(el, null)
            } else { // 若原节点存在则更新
                const el = newVNode.el = oldVNode.el
                if (newVNode.children !== oldVNode.children) {
                    el.nodeValue = newVNode.children as string
                }
            }
        } else if (newVNode.type === CommentVnodeSymbol){
            if (__DEV__ && typeof newVNode.children !== 'string') {
                error(`comment node requires children being type of "string", received type ${typeof newVNode.children}`, newVNode)
            }
            if (!oldVNode) {
                const el = newVNode.el = document.createComment(newVNode.children as string)
                container.insertBefore(el, null)
            } else { // 若原节点存在则更新
                const el = newVNode.el = oldVNode.el
                if (newVNode.children !== oldVNode.children) {
                    el.nodeValue = newVNode.children as string
                }
            }
        }
    }
}
import {Container, VNode} from "types/renderer";
import {CommentVnodeSymbol, TextVnodeSymbol} from "renderer/vnode";
import {error} from "utils/debug";
import {patchProps} from "renderer/props-heleper";

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
        if (!oldVNode || !oldVNode.el) {
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
        } else if (newVNode.type === CommentVnodeSymbol){ // 注释节点
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

/**
 * 将vnode挂载到真实dom
 * @param vnode 需要挂载的vnode
 * @param container 挂载容器
 */
export function mountElement(vnode: VNode, container: Container) {
    if (vnode.if) {
        const el: Container = vnode.el = document.createElement(vnode.type as string)
        // 将每个child挂载到真实dom
        if (typeof vnode.children === 'string') {
            el.textContent = vnode.children
        } else if (Array.isArray(vnode.children)) {
            vnode.children.forEach(child => {
                patch(null, child, el)
            })
        } else {
            patch(null, vnode.children, el)
        }
        // 为dom挂载attr
        if (vnode.props) {
            for (const key in vnode.props) {
                patchProps(el, key, null, vnode.props[key])
            }
        }

        container.insertBefore(el, null)
    } else if (vnode.el) {
        unmountElement(vnode)
    }
}

/**
 * 卸载vnode
 * @param vnode 需要卸载的vnode
 */
export function unmountElement(vnode: VNode) {
    const parent = vnode.el.parentNode
    if (parent) {
        parent.removeChild(vnode.el)
        vnode.el = undefined
    }
}

/**
 * 更新某节点的子节点
 * @param oldVNode 旧vnode
 * @param newVNode 新vnode
 * @param container
 */
export function updateElementChild(oldVNode: VNode, newVNode: VNode, container: Container) {
    if (newVNode.if) {
        if (typeof newVNode.children === 'string') { // 新vnode的children为字符串的情况
            if (Array.isArray(oldVNode.children)) {
                oldVNode.children.forEach(child => {
                    unmountElement(child)
                })
            }
            container.textContent = newVNode.children
        } else if (Array.isArray(newVNode.children)) { // 新vnode的children类型为一组组件的情况
            if (Array.isArray(oldVNode.children)) {
                // 当新老节点children都是一组节点时需要进行Diff操作
                // 在尽可能减少DOM操作的情况下更新节点内容

                const oldChildren: VNode[] = oldVNode.children
                const newChildren: VNode[] = newVNode.children

                const oldLen: number = oldChildren.length
                const newLen: number = newChildren.length

                const commonLen: number = Math.min(oldLen, newLen)

                for (let i = 0; i < commonLen; i++) {
                    patch(oldChildren[i], newChildren[i], container)
                }

                // 若新子节点数大于旧子节点，说明有新的元素需要挂载
                // 否则说明需要卸载旧节点
                if (newLen > oldLen) {
                    for (let i = commonLen; i < newLen; i++) {
                        patch(null, newChildren[i], container)
                    }
                } else if (oldLen > newLen) {
                    for (let i = commonLen; i < oldLen; i++) {
                        unmountElement(oldChildren[i])
                    }
                }
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
    } else {
        unmountElement(oldVNode)
    }
}

/**
 * 更新修补vnode并重新挂载
 * @param oldVNode
 * @param newVNode
 */
export function updateElement(oldVNode: VNode, newVNode: VNode) {
    if (newVNode.if) {
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
    } else {
        unmountElement(oldVNode)
    }
}
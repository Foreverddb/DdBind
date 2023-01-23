import {Container, Invoker, VNode} from "types/renderer";
import {CommentVnodeSymbol, TextVnodeSymbol} from "renderer/vnode";
import {error} from "utils/debug";
import {mountElement, unmountElement, updateElement} from "renderer/element-render";

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
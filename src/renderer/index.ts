import {Container, Renderer, VNode} from "types/renderer";
import {patch, unmountElement} from "renderer/element";

export {createVnode, createTextVnode, stringVal} from './utils'

/**
 * 创建一个渲染器
 */
export function createRenderer(): Renderer {

    /**
     * 渲染vnode到真实dom
     * @param vnode 虚拟dom
     * @param container 渲染容器dom
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
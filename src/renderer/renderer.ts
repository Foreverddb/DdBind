import {Container, Renderer, VNode} from "types/renderer";

/**
 * 创建一个渲染器
 */
export function createRenderer(): Renderer {
    // 判断某个属性是否需要通过setAttribute方式设置
    function shouldSetAsDomProps(el: HTMLElement, key: string, value: any ): boolean {
        if (key === 'form' && el.tagName === 'INPUT') return false
        return key in el
    }
    function mountElement(vnode: VNode, container: Container) {
        const el: HTMLElement = document.createElement(vnode.type)
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
                const value = vnode.props[key]
                if (shouldSetAsDomProps(el, key, value)) {
                    const type = typeof el[key]
                    if (type === 'boolean' && value === '') {
                        el[key] = true
                    } else {
                        el[key] = value
                    }
                } else {
                    // 不存在于DOM properties的属于用此方法设置
                    el.setAttribute(key, vnode.props[key])
                }
            }
        }
        container.appendChild(el)
    }
    /**
     * 完成vnode的挂载更新
     * @param oldVNode 原vnode
     * @param newVNode 需要挂载更新的vnode
     * @param container 渲染容器
     */
    function patch(oldVNode: VNode, newVNode: VNode, container: Container) {
        if (!oldVNode) {
            mountElement(newVNode, container)// 挂载vnode
        } else {
            // 更新vnode
        }
    }

    /**
     * 渲染vnode到真实dom
     * @param vnode 虚拟dom
     * @param container 渲染容器
     */
    function render(vnode, container: Container) {
        if (vnode) {
            patch(container._vnode, vnode, container) // 挂载或更新vnode
        } else {
            if (container._vnode) {
                container.innerHTML = '' // 卸载原有vnode
            }
        }
        container._vnode = vnode
    }

    return {
        render
    }
}
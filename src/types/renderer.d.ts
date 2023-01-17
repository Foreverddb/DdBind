export type Renderer = {
    render: (vnode, container) => any
}

export type VNode = {
    type: string | VNode,
    children: string | Array<VNode>,
    props?: any,
    el?: HTMLElement
}

export interface Container extends HTMLElement {
    _vnode?: VNode,
    _invokers?: object
}

export interface Invoker extends Function {
    (event: Event): any,
    value?: (event: Event) => any,
    attachTime?: number
}

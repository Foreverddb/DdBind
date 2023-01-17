export type Renderer = {
    render: (vnode, container) => any
}

export interface VNode  {
    type: string | symbol
    children: string | Array<VNode>
    props?: any
    el?: Text | Container
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

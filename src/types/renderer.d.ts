export type Renderer = {
    render: (vnode, container) => any
}

export type VNode = {
    type: string,
    children: string | Array<VNode> | VNode,
    props?: any
}

export interface Container extends HTMLElement {
    _vnode?: VNode
}

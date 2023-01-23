import {Container, VNode} from "types/renderer";

/**
 * vnode的建造者方法实现类
 */
export class VnodeUtil {
    static builder(): VnodeBuilder {
        return new VnodeBuilder()
    }
}

class VnodeImpl implements VNode {
    type: string | symbol
    children: string | Array<VNode>
    props?: any
    el?: Text | Container
    if?: boolean
}

class VnodeBuilder {
    private type: string | VNode | symbol
    private children: string | Array<VNode>
    private props?: any
    private el?: Text | Container
    private if?: boolean = true

    public setType(type: string | VNode | symbol): VnodeBuilder {
        this.type = type
        return this
    }

    public setChildren(children: string | Array<VNode>): VnodeBuilder {
        this.children = children
        return this
    }

    public setProps(props?: any): VnodeBuilder {
        this.props = props
        return this
    }

    public setEl(el?: Text | Container): VnodeBuilder {
        this.el = el
        return this
    }

    public setIf(value: boolean) {
        this.if = value
    }

    public build(): VNode {
        const vnode = new VnodeImpl()
        Object.keys(this).forEach((key) => {
            vnode[key] = this[key]
        })
        return vnode
    }
}
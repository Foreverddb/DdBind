import {Container, VNode} from "types/renderer";

export class VnodeUtil {
    static builder(): VnodeBuilder {
        return new VnodeBuilder()
    }
}
class VnodeImpl implements VNode{
     type: string | symbol
     children: string | Array<VNode>
     props?: any
     el?: Text | Container
}
class VnodeBuilder {
    private type: string | VNode | symbol
    private children: string | Array<VNode>
    private props?: any
    private el?: Text | Container

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

    public setEl(el?: Text | Container): VnodeBuilder{
        this.el = el
        return this
    }

    public build(): VNode {
        const vnode = new VnodeImpl()
        Object.keys(this).forEach((key) => {
            vnode[key] = this[key]
        })
        return vnode
    }
}
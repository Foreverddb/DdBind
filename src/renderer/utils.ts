import {VNode} from "types/renderer";
import {CommentVnodeSymbol, TextVnodeSymbol, VnodeUtil} from "renderer/vnode";

export function createVnode(type: string, props: any, children: string | Array<| VNode>): VNode {
    if (type === 'comment') {
        return VnodeUtil.builder().setType(CommentVnodeSymbol).setChildren(children).build()
    } else {
        const builder = VnodeUtil.builder().setType(type).setChildren(children)
        const propsObject: object = {}
        if (props.attrs) {
            Object.assign(propsObject, props.attrs)
        }
        if (props.on) {
            for (const eventName in props.on) {
                const propKey = 'on' + eventName[0].toUpperCase() + eventName.slice(1, eventName.length) // 构造为以on开头的prop名
                propsObject[propKey] = props.on[eventName]
            }
        }

        // 设置属性值
        builder.setProps(propsObject)
        return builder.build()
    }

}

export function createTextVnode(value: string): VNode {
    return VnodeUtil.builder().setType(TextVnodeSymbol).setChildren(value).build()
}

export function stringVal(value: any): string {
    return value === null
        ? ''
        : typeof value === 'object'
            ? value.toString()
            : String(value)
}
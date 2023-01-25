import {VNode} from "types/renderer";
import {CommentVnodeSymbol, TextVnodeSymbol, VnodeUtil} from "renderer/vnode";

/**
 * 创建一个Vnode节点
 * @param type Vnode类别
 * @param props Vnode的props对象
 * @param children 子节点
 */
export function createVnode(type: string, props: any, children: string | Array<| VNode>): VNode {
    if (type === 'comment') {
        return VnodeUtil.builder().setType(CommentVnodeSymbol).setChildren(children).build()
    } else {
        const builder = VnodeUtil.builder().setType(type).setChildren(children)
        const propsObject: object = {} // 空对象用以暂存prop数据

        // 处理prop数据
        patchProps(props, propsObject)

        // 根据表达式解析并设置vnode的渲染flag
        if (propsObject['_if_'] !== undefined && !propsObject['_if_']) {
            builder.setIf(false)
        } else {
            builder.setIf(true)
        }
        delete propsObject['_if_']

        // 设置属性值
        builder.setProps(propsObject)
        return builder.build()
    }
}

/**
 * 创建一个文本节点
 * @param value 文本内容
 */
export function createTextVnode(value: string): VNode {
    return VnodeUtil.builder().setType(TextVnodeSymbol).setChildren(value).build()
}

/**
 * 将目标内容转化为文本内容
 * @param value 目标值
 */
export function stringVal(value: any): string {
    return value === null
        ? ''
        : typeof value === 'object'
            ? value.toString()
            : String(value)
}

/**
 * 将根据jsAST转换得到的prop对象解析为vnode可以处理的格式
 * @param props 原始props
 * @param target 转换得到的目标对象
 */
function patchProps(props: any, target: object) {
    // attrs的内容可以直接添加
    if (props.attrs) {
        Object.assign(target, props.attrs)
    }
    // 将事件转化为prop名的形式
    if (props.on) {
        for (const eventName in props.on) {
            const propKey = 'on' + eventName[0].toUpperCase() + eventName.slice(1, eventName.length) // 构造为以on开头的prop名
            target[propKey] = props.on[eventName]
        }
    }

    // 解析d-show指令表达式内容并设置display样式
    let showDisplay = target['_show_'] !== undefined && !target['_show_'] ? 'none' : ''
    if (Array.isArray(target['_style_'])) {
        target['_style_'].push({display: showDisplay})
    } else if (target['_style_'] && typeof target['style'] === 'object'){
        target['_style_']['display'] = showDisplay
    } else {
        target['_style_'] = {display: showDisplay}
    }
}
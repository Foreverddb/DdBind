import {PropNode} from "types/compiler";

/**
 * 解析指令属性并返回解析结果作为目标节点对象
 * @param propName 属性名
 * @param propValue 属性值
 */
export function parseDirectives(propName: string, propValue: string): PropNode {
    let prop: PropNode
    if (propName.startsWith('@') || propName.startsWith('d-on:') || propName.startsWith('on')) {
        // 处理绑定事件
        prop = {
            type: 'Event',
            // 事件名
            name: propName.startsWith('@')
                ? propName.slice(1, propName.length)
                : (propName.startsWith('d-on:')
                    ? propName.slice(5, propName.length)
                    : propName.slice(2, propName.length)),
            exp: {
                type: 'Expression',
                content: propValue
            }
        } as PropNode
    } else if (propName.startsWith(':') || propName.startsWith('d-bind:')) {
        const attrName = propName.startsWith(':')
            ? propName.slice(1, propName.length)
            : propName.slice(7, propName.length)
        // 处理绑定属性
        prop = {
            type: 'ReactiveProp',
            name: attrName,
            exp: {
                type: 'Expression',
                content: propValue
            }
        } as PropNode
        // style和class动态属性不应覆盖而应叠加
        if (attrName === 'style' || attrName === 'class') {
            prop.name = `_${attrName}_`
        }
    } else if (propName.startsWith('d-')) {
        // 处理其他指令
        prop = {
            type: 'Directive',
            name: propName,
            exp: {
                type: 'Expression',
                content: propValue
            }
        } as PropNode
    } else {
        // 普通的HTML attr
        prop = {
            type: 'Attribute',
            name: propName,
            value: propValue
        } as PropNode
    }
    return prop
}
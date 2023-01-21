import {
    DirectiveTransformerContext,
    PropNode
} from "types/compiler";
import {codeGuards} from "compiler/generator";

/**
 * 针对directives指令部分转换代码表达式
 * @param directives 指令节点
 * @param context 上下文对象
 */
export function transformEventDirectiveExpression(directives: Array<PropNode>, context: DirectiveTransformerContext) {
    // 过滤节点数组
    directives.filter(x => x.type === 'Directive').forEach((directive: PropNode) => {
        genEventExpression(directive, context)
    })
}

/**
 * 根据指令内容
 * @param directive 目标指令节点
 * @param context 上下文对象
 */
function genEventExpression(directive: PropNode, context: DirectiveTransformerContext) {
    const {createKeyValueObjectNode} = context

    switch (directive.name) {
        case 'd-model':
            // model指令即通过input事件双向绑定ref变量
            context.events.push(
                createKeyValueObjectNode(
                    'input',
                    `($event) => { ${codeGuards[directive.name]} (${directive.exp.content}) = $event.target.value }`,
                    'Expression'
                )
            )
            context.attrs.push(
                createKeyValueObjectNode(
                    'value',
                    `(${directive.exp.content})`,
                    'Expression'
                )
            )
            break
        case 'd-show':
            // show指令即简单通过style来标识是否展示此节点
            context.attrs.push(
                createKeyValueObjectNode(
                    '_show_',
                    `${directive.exp.content}`,
                    'Expression'
                )
            )
            break
        case 'd-if':
            // if指令通过在vnode上做标记来决定是否渲染此节点
            context.attrs.push(
                createKeyValueObjectNode(
                    '_if_',
                    directive.exp.content,
                    'Expression'
                )
            )
            break
    }
}
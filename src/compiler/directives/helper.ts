import {DirectiveTransformerContext, PropNode} from "types/compiler";
import {codeGuards} from "compiler/generator";

/**
 * directive的处理函数列表
 */
export const directiveHandler = {
    modelHandler(directive: PropNode, context: DirectiveTransformerContext) {
        const {createKeyValueObjectNode} = context
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
    },
    showHandler(directive: PropNode, context: DirectiveTransformerContext) {
        const {createKeyValueObjectNode} = context
        // show指令即简单通过style来标识是否展示此节点
        context.attrs.push(
            createKeyValueObjectNode(
                '_show_',
                `${directive.exp.content}`,
                'Expression'
            )
        )
    },
    ifHandler (directive: PropNode, context: DirectiveTransformerContext) {
        const {createKeyValueObjectNode} = context
        // if指令通过在vnode上做标记来决定是否渲染此节点
        context.attrs.push(
            createKeyValueObjectNode(
                '_if_',
                directive.exp.content,
                'Expression'
            )
        )
    },
    htmlHandler (directive: PropNode, context: DirectiveTransformerContext) {
        const {createKeyValueObjectNode} = context
        context.attrs.push(
            createKeyValueObjectNode(
                'innerHTML',
                directive.exp.content,
                'Expression'
            )
        )
    }
}
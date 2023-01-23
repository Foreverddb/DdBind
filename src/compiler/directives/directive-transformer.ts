import {
    DirectiveTransformerContext,
    PropNode
} from "types/compiler";
import {directiveHandler} from "compiler/directives/helper";

/**
 * 针对directives指令部分转换代码表达式
 * @param directives 指令节点
 * @param context 上下文对象
 */
export function transformEventDirectiveExpression(directives: Array<PropNode>, context: DirectiveTransformerContext) {
    // 过滤节点数组
    directives.filter(x => x.type === 'Directive').forEach((directive: PropNode) => {
        genDirectiveExpression(directive, context)
    })
}

/**
 * 根据指令内容生成JsAST
 * @param directive 目标指令节点
 * @param context 上下文对象
 */
function genDirectiveExpression(directive: PropNode, context: DirectiveTransformerContext) {
    // 除去开头的d-
    const directiveName = directive.name.slice(2, directive.name.length)
    // 处理handler并进行转换操作
    directiveHandler[directiveName + 'Handler'](directive, context)
}